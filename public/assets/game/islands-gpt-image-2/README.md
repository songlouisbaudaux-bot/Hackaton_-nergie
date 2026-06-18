# GPT Image 2 Floating Islands

Final integrated island images generated from `public/assets/game/floating-grass-block-natural.png` as the visual base.

These are not sprite composites. Each PNG should read as one cohesive modified floating island:

- same floating grass block silhouette and camera angle as the base;
- integrated buildings and terrain details;
- transparent background;
- no text, UI, logo, or watermark;
- one clear energy building/state per image.

The older `public/assets/game/islands/` folder is a draft/reference composite pack, not the final art pass.

## Generation

Jobs are defined in:

- `jobs-all.jsonl`

Run the final GPT Image 2 edit pass with:

```bash
python3 scripts/run-gpt-image2-island-edits.py --concurrency 4 --force
```

The script uses:

- base image: `public/assets/game/floating-grass-block-natural.png`
- model: `gpt-image-2`
- mode: image edit, not sprite composition
- output root: `public/assets/game/islands-gpt-image-2/`

## Current State

If image generation is unavailable, keep using the draft pack in `public/assets/game/islands/`.
Only replace a draft image here when the new PNG has a transparent background and no visual artifact.
