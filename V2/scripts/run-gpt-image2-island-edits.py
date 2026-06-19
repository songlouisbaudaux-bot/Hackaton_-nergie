#!/usr/bin/env python3
from __future__ import annotations

import argparse
import asyncio
import json
import os
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_JOBS = ROOT / "public" / "assets" / "game" / "islands-gpt-image-2" / "jobs-all.jsonl"
DEFAULT_BASE = ROOT / "public" / "assets" / "game" / "floating-grass-block-natural.png"
DEFAULT_OUT_DIR = ROOT / "public" / "assets" / "game" / "islands-gpt-image-2"
IMAGE_GEN_CLI = Path.home() / ".codex" / "skills" / ".system" / "imagegen" / "scripts" / "image_gen.py"


def read_jobs(path: Path) -> list[dict]:
    jobs: list[dict] = []
    for line_no, line in enumerate(path.read_text().splitlines(), start=1):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        job = json.loads(line)
        if not job.get("out") or not job.get("prompt"):
            raise ValueError(f"Job {line_no} must include out and prompt")
        jobs.append(job)
    return jobs


async def run_one(
    sem: asyncio.Semaphore,
    idx: int,
    total: int,
    job: dict,
    *,
    python_bin: str,
    base_image: Path,
    out_dir: Path,
    force: bool,
) -> tuple[str, bool]:
    out_path = out_dir / job["out"]
    out_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        python_bin,
        str(IMAGE_GEN_CLI),
        "edit",
        "--model",
        "gpt-image-2",
        "--image",
        str(base_image),
        "--prompt",
        job["prompt"],
        "--out",
        str(out_path),
        "--output-format",
        "png",
        "--quality",
        job.get("quality", "high"),
    ]
    if force:
        cmd.append("--force")

    async with sem:
        print(f"[{idx}/{total}] starting {job['out']}", flush=True)
        process = await asyncio.create_subprocess_exec(
            *cmd,
            cwd=str(ROOT),
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=os.environ.copy(),
        )
        stdout, stderr = await process.communicate()
        if stdout:
            sys.stdout.write(stdout.decode(errors="replace"))
        if stderr:
            sys.stderr.write(stderr.decode(errors="replace"))
        ok = process.returncode == 0 and out_path.exists()
        print(f"[{idx}/{total}] {'ok' if ok else 'failed'} {job['out']}", flush=True)
        return job["out"], ok


async def main_async(args: argparse.Namespace) -> int:
    jobs = read_jobs(args.jobs)
    sem = asyncio.Semaphore(args.concurrency)
    tasks = [
        asyncio.create_task(
            run_one(
                sem,
                idx,
                len(jobs),
                job,
                python_bin=args.python,
                base_image=args.base_image,
                out_dir=args.out_dir,
                force=args.force,
            )
        )
        for idx, job in enumerate(jobs, start=1)
    ]
    results = await asyncio.gather(*tasks)
    failed = [name for name, ok in results if not ok]
    if failed:
        print("Failed jobs:")
        for name in failed:
            print(f"- {name}")
        return 1
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate integrated floating-island edits with GPT Image 2.")
    parser.add_argument("--jobs", type=Path, default=DEFAULT_JOBS)
    parser.add_argument("--base-image", type=Path, default=DEFAULT_BASE)
    parser.add_argument("--out-dir", type=Path, default=DEFAULT_OUT_DIR)
    parser.add_argument("--python", default=str(ROOT / ".venv" / "bin" / "python"))
    parser.add_argument("--concurrency", type=int, default=4)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    return asyncio.run(main_async(args))


if __name__ == "__main__":
    raise SystemExit(main())
