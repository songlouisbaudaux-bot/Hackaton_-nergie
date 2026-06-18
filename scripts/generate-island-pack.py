#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "assets" / "game"
OUT_DIR = ASSET_DIR / "islands"
BASE_PATH = ASSET_DIR / "floating-grass-block-natural.png"

CANVAS_SIZE = (1254, 1254)


def load_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def alpha_crop(image: Image.Image) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    return image.crop(bbox) if bbox else image


def apply_alpha(image: Image.Image, opacity: float) -> Image.Image:
    if opacity >= 0.999:
        return image
    out = image.copy()
    alpha = out.getchannel("A").point(lambda value: int(value * opacity))
    out.putalpha(alpha)
    return out


def paste_asset(
    canvas: Image.Image,
    name: str,
    cx: int,
    by: int,
    width: int,
    opacity: float = 1.0,
    shadow: bool = True,
) -> None:
    source = alpha_crop(load_rgba(ASSET_DIR / name))
    ratio = width / source.width
    size = (width, max(1, int(source.height * ratio)))
    sprite = source.resize(size, Image.Resampling.LANCZOS)
    sprite = apply_alpha(sprite, opacity)
    x = int(cx - sprite.width / 2)
    y = int(by - sprite.height)

    if shadow:
        shadow_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(shadow_layer)
        sx = cx
        sy = by - max(8, int(width * 0.08))
        rx = max(18, int(width * 0.33))
        ry = max(8, int(width * 0.10))
        draw.ellipse((sx - rx, sy - ry, sx + rx, sy + ry), fill=(32, 25, 18, 46))
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(6))
        canvas.alpha_composite(shadow_layer)

    canvas.alpha_composite(sprite, (x, y))


def draw_patch(canvas: Image.Image, cx: int, cy: int, rx: int, ry: int, color: tuple[int, int, int, int]) -> None:
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(1.5))
    canvas.alpha_composite(layer)


def draw_path(canvas: Image.Image, points: list[tuple[int, int]], width: int = 24) -> None:
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.line(points, fill=(177, 128, 70, 116), width=width, joint="curve")
    draw.line(points, fill=(230, 183, 105, 70), width=max(2, width // 3), joint="curve")
    canvas.alpha_composite(layer)


def draw_rail(canvas: Image.Image, start: tuple[int, int], end: tuple[int, int]) -> None:
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x1, y1 = start
    x2, y2 = end
    draw.line((x1, y1 - 10, x2, y2 - 10), fill=(63, 54, 46, 170), width=7)
    draw.line((x1, y1 + 10, x2, y2 + 10), fill=(63, 54, 46, 170), width=7)
    for i in range(7):
        t = i / 6
        x = int(x1 + (x2 - x1) * t)
        y = int(y1 + (y2 - y1) * t)
        draw.line((x - 14, y - 18, x + 14, y + 18), fill=(124, 88, 49, 150), width=5)
    canvas.alpha_composite(layer)


def draw_cables(canvas: Image.Image, points: list[tuple[int, int]], color=(72, 96, 122, 150)) -> None:
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.line(points, fill=color, width=5, joint="curve")
    for x, y in points:
        draw.ellipse((x - 10, y - 10, x + 10, y + 10), fill=(184, 206, 224, 160))
    canvas.alpha_composite(layer)


def draw_tiny_building(canvas: Image.Image, cx: int, by: int, color: tuple[int, int, int, int], roof: tuple[int, int, int, int]) -> None:
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle((cx - 42, by - 54, cx + 42, by), radius=10, fill=color)
    draw.polygon([(cx - 54, by - 54), (cx, by - 92), (cx + 54, by - 54)], fill=roof)
    draw.rounded_rectangle((cx - 10, by - 28, cx + 10, by), radius=4, fill=(94, 61, 39, 220))
    layer = layer.filter(ImageFilter.GaussianBlur(0.2))
    canvas.alpha_composite(layer)


def draw_tank(canvas: Image.Image, cx: int, by: int, color=(77, 142, 112, 230), dome=(97, 189, 126, 235)) -> None:
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle((cx - 54, by - 62, cx + 54, by), radius=18, fill=color)
    draw.ellipse((cx - 58, by - 100, cx + 58, by - 28), fill=dome)
    draw.rectangle((cx - 54, by - 64, cx + 54, by - 28), fill=color)
    draw.arc((cx - 96, by - 80, cx + 96, by + 36), start=198, end=342, fill=(72, 96, 90, 180), width=7)
    canvas.alpha_composite(layer)


def draw_control_unit(canvas: Image.Image, cx: int, by: int, accent=(105, 175, 230, 190)) -> None:
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle((cx - 46, by - 50, cx + 46, by), radius=9, fill=(215, 219, 218, 235))
    draw.rounded_rectangle((cx - 28, by - 39, cx + 28, by - 18), radius=6, fill=accent)
    draw.line((cx - 58, by - 10, cx - 94, by + 18), fill=(80, 92, 95, 150), width=5)
    canvas.alpha_composite(layer)


def render(defn: dict[str, Any]) -> None:
    canvas = load_rgba(BASE_PATH)
    for item in defn.get("draw", []):
        kind = item["type"]
        if kind == "patch":
            draw_patch(canvas, item["cx"], item["cy"], item["rx"], item["ry"], tuple(item["color"]))
        elif kind == "path":
            draw_path(canvas, item["points"], item.get("width", 24))
        elif kind == "rail":
            draw_rail(canvas, item["start"], item["end"])
        elif kind == "cable":
            draw_cables(canvas, item["points"], tuple(item.get("color", (72, 96, 122, 150))))
        elif kind == "tiny_building":
            draw_tiny_building(canvas, item["cx"], item["by"], tuple(item["color"]), tuple(item["roof"]))
        elif kind == "tank":
            draw_tank(canvas, item["cx"], item["by"], tuple(item.get("color", (77, 142, 112, 230))), tuple(item.get("dome", (97, 189, 126, 235))))
        elif kind == "control":
            draw_control_unit(canvas, item["cx"], item["by"], tuple(item.get("accent", (105, 175, 230, 190))))

    for item in defn.get("assets", []):
        paste_asset(
            canvas,
            item["file"],
            item["cx"],
            item["by"],
            item["width"],
            item.get("opacity", 1.0),
            item.get("shadow", True),
        )

    out_dir = OUT_DIR / defn["category"]
    out_dir.mkdir(parents=True, exist_ok=True)
    canvas.save(out_dir / defn["file"])


def base_def(file: str, category: str, source: str, state: str, age: str, title: str, description: str, **kwargs: Any) -> dict[str, Any]:
    return {
        "file": file,
        "category": category,
        "source": source,
        "state": state,
        "age": age,
        "title": title,
        "description": description,
        "integration": kwargs.pop("integration", description),
        **kwargs,
    }


DEFS: list[dict[str, Any]] = [
    base_def("island-base-blank.png", "base", "base", "empty", "all", "Ile vierge", "Base naturelle vierge commune.", assets=[]),
    base_def(
        "island-base-forest.png", "base", "biomass", "empty", "prehistoire", "Base foret",
        "Ile vide avec teinte foret pour la biomasse.",
        draw=[{"type": "patch", "cx": 620, "cy": 455, "rx": 360, "ry": 190, "color": (61, 138, 59, 58)}],
        assets=[
            {"file": "bush-cluster.png", "cx": 455, "by": 535, "width": 170},
            {"file": "tree.png", "cx": 770, "by": 540, "width": 150},
            {"file": "logs.png", "cx": 610, "by": 610, "width": 120},
        ],
    ),
    base_def(
        "island-base-pasture.png", "base", "animal", "empty", "neolithique", "Base prairie",
        "Ile vide avec prairie simple pour la force animale.",
        draw=[
            {"type": "patch", "cx": 610, "cy": 455, "rx": 350, "ry": 185, "color": (112, 174, 66, 52)},
            {"type": "path", "points": [(310, 600), (515, 512), (760, 530), (960, 450)], "width": 18},
        ],
        assets=[{"file": "prairie.png", "cx": 640, "by": 590, "width": 260, "opacity": 0.92}],
    ),
    base_def(
        "island-base-river-hill.png", "base", "water-wind", "empty", "moyen-age", "Base riviere colline",
        "Ile vide avec ruisseau et relief pour eau/vent.",
        draw=[{"type": "patch", "cx": 650, "cy": 455, "rx": 350, "ry": 180, "color": (83, 164, 174, 40)}],
        assets=[
            {"file": "river-tile.png", "cx": 565, "by": 575, "width": 360},
            {"file": "hill-tile.png", "cx": 815, "by": 515, "width": 230, "opacity": 0.92},
        ],
    ),
    base_def(
        "island-base-rock.png", "base", "fossil", "empty", "age-industriel", "Base roche",
        "Ile vide plus rocheuse pour le fossile.",
        draw=[
            {"type": "patch", "cx": 615, "cy": 465, "rx": 360, "ry": 185, "color": (65, 63, 59, 80)},
            {"type": "rail", "start": (400, 575), "end": (765, 495)},
        ],
        assets=[{"file": "coal-pile.png", "cx": 820, "by": 580, "width": 170, "opacity": 0.9}],
    ),
    base_def(
        "island-base-tech-platform.png", "base", "atomic", "empty", "age-atomique", "Base plateforme technique",
        "Ile vide avec petite plateforme propre pour l'atome.",
        draw=[{"type": "patch", "cx": 625, "cy": 465, "rx": 340, "ry": 180, "color": (123, 164, 190, 48)}],
        assets=[{"file": "tile-energy-platform-buildable.png", "cx": 625, "by": 650, "width": 390, "opacity": 0.88}],
    ),
]


DEFS += [
    base_def(
        "island-central-01-camp.png", "central", "central", "age", "prehistoire", "Campement",
        "Ile centrale prehistorique avec feu, tente, humains et foret.",
        integration="Etat central affiche en Prehistoire.",
        draw=[{"type": "path", "points": [(395, 600), (555, 535), (680, 545), (835, 495)], "width": 18}],
        assets=[
            {"file": "fire-glow.png", "cx": 605, "by": 604, "width": 370, "opacity": 0.62, "shadow": False},
            {"file": "campfire.png", "cx": 615, "by": 586, "width": 190},
            {"file": "tent.png", "cx": 445, "by": 560, "width": 170},
            {"file": "human.png", "cx": 745, "by": 585, "width": 92},
            {"file": "tree.png", "cx": 875, "by": 512, "width": 145},
            {"file": "bush-cluster.png", "cx": 370, "by": 525, "width": 135},
        ],
    ),
    base_def(
        "island-central-02-village.png", "central", "central", "age", "neolithique", "Village",
        "Ile centrale neolithique avec foyer, champ et premiers stocks.",
        integration="Etat central affiche en Neolithique.",
        draw=[{"type": "path", "points": [(330, 610), (535, 535), (705, 548), (930, 470)], "width": 22}],
        assets=[
            {"file": "stone-hearth.png", "cx": 590, "by": 585, "width": 170},
            {"file": "field.png", "cx": 775, "by": 585, "width": 220},
            {"file": "granary.png", "cx": 445, "by": 560, "width": 135},
            {"file": "ox.png", "cx": 710, "by": 515, "width": 120},
            {"file": "food-cache.png", "cx": 515, "by": 620, "width": 120},
        ],
    ),
    base_def(
        "island-central-03-medieval-town.png", "central", "central", "age", "moyen-age", "Bourg medieval",
        "Ile centrale medievale avec maisons compactes, champ et moulin.",
        integration="Etat central affiche au Moyen Age.",
        draw=[{"type": "path", "points": [(315, 610), (495, 535), (640, 525), (820, 535), (970, 470)], "width": 24}],
        assets=[
            {"file": "windmill.png", "cx": 790, "by": 535, "width": 185},
            {"file": "field.png", "cx": 480, "by": 605, "width": 205},
            {"file": "granary.png", "cx": 610, "by": 545, "width": 115},
            {"file": "water-wheel.png", "cx": 905, "by": 615, "width": 150},
        ],
    ),
    base_def(
        "island-central-04-industrial-town.png", "central", "central", "age", "age-industriel", "Ville industrielle",
        "Ile centrale industrielle avec usine, rails courts et vapeur.",
        integration="Etat central affiche a l'Age industriel.",
        draw=[
            {"type": "patch", "cx": 625, "cy": 470, "rx": 350, "ry": 180, "color": (84, 78, 69, 70)},
            {"type": "rail", "start": (350, 610), "end": (870, 500)},
        ],
        assets=[
            {"file": "small-factory.png", "cx": 610, "by": 570, "width": 210},
            {"file": "steam-engine.png", "cx": 780, "by": 625, "width": 190},
            {"file": "coal-pile.png", "cx": 440, "by": 595, "width": 150},
            {"file": "steam-puff.png", "cx": 675, "by": 395, "width": 120, "opacity": 0.86, "shadow": False},
        ],
    ),
    base_def(
        "island-central-05-modern-grid-city.png", "central", "central", "age", "age-atomique-2026", "Ville reseau 2026",
        "Ile centrale moderne avec reseau, renouvelables et controle.",
        integration="Etat central affiche a l'Age atomique / 2026.",
        draw=[
            {"type": "patch", "cx": 625, "cy": 465, "rx": 350, "ry": 180, "color": (92, 132, 153, 50)},
            {"type": "cable", "points": [(405, 575), (550, 520), (690, 535), (850, 480)]},
            {"type": "control", "cx": 620, "by": 555},
        ],
        assets=[
            {"file": "Panneaux_solaires.png", "cx": 465, "by": 590, "width": 195},
            {"file": "Héoliennes.png", "cx": 835, "by": 540, "width": 185},
            {"file": "Centrale_fission.png", "cx": 630, "by": 620, "width": 200},
        ],
    ),
]


DEFS += [
    base_def(
        "island-biomass-01-built-campfire.png", "biomass", "biomass", "built", "prehistoire", "Feu de camp",
        "Feu de camp simple, bûches et pierres sur l'ile biomasse.",
        integration="Afficher apres achat de Feu de camp.",
        draw=[{"type": "patch", "cx": 615, "cy": 470, "rx": 315, "ry": 165, "color": (72, 139, 55, 52)}],
        assets=[{"file": "fire-glow.png", "cx": 610, "by": 602, "width": 360, "opacity": 0.58, "shadow": False}, {"file": "campfire.png", "cx": 615, "by": 585, "width": 230}, {"file": "logs.png", "cx": 425, "by": 575, "width": 120}],
    ),
    base_def(
        "island-biomass-01-upgraded-ember-keeping.png", "biomass", "biomass", "upgraded", "prehistoire", "Conservation de la braise",
        "Feu stabilise, braises couvertes et reserve de bois.",
        integration="Remplace built apres Conservation de la braise.",
        draw=[{"type": "patch", "cx": 615, "cy": 470, "rx": 315, "ry": 165, "color": (82, 145, 58, 56)}],
        assets=[{"file": "fire-glow.png", "cx": 620, "by": 605, "width": 410, "opacity": 0.5, "shadow": False}, {"file": "stone-hearth.png", "cx": 620, "by": 585, "width": 240}, {"file": "logs.png", "cx": 405, "by": 575, "width": 150}, {"file": "food-cache.png", "cx": 820, "by": 580, "width": 110}],
    ),
    base_def(
        "island-biomass-02-built-stone-hearth.png", "biomass", "biomass", "built", "neolithique", "Foyer en pierre",
        "Foyer en pierre plus stable avec bois organise.",
        integration="Afficher apres achat de Foyer en pierre.",
        assets=[{"file": "stone-hearth.png", "cx": 620, "by": 585, "width": 250}, {"file": "logs.png", "cx": 430, "by": 575, "width": 145}, {"file": "bush-cluster.png", "cx": 830, "by": 545, "width": 150}],
    ),
    base_def(
        "island-biomass-02-upgraded-masonry-hearth.png", "biomass", "biomass", "upgraded", "neolithique", "Foyer maconne",
        "Foyer renforce, sol organise et fumee legere.",
        integration="Remplace built apres Foyer maconne.",
        draw=[{"type": "path", "points": [(390, 595), (610, 535), (835, 545)], "width": 20}],
        assets=[{"file": "stone-hearth.png", "cx": 615, "by": 588, "width": 285}, {"file": "steam-puff.png", "cx": 650, "by": 445, "width": 115, "opacity": 0.72, "shadow": False}, {"file": "logs.png", "cx": 405, "by": 575, "width": 135}, {"file": "granary.png", "cx": 815, "by": 565, "width": 105}],
    ),
    base_def(
        "island-biomass-03-built-charcoal-kiln.png", "biomass", "biomass", "built", "moyen-age", "Four a charbon de bois",
        "Charbonniere medievale avec bois et fumee douce.",
        integration="Afficher apres achat de Four a charbon de bois.",
        draw=[{"type": "patch", "cx": 620, "cy": 470, "rx": 310, "ry": 165, "color": (83, 104, 55, 58)}],
        assets=[{"file": "logs.png", "cx": 500, "by": 590, "width": 175}, {"file": "coal-pile.png", "cx": 680, "by": 590, "width": 190}, {"file": "steam-puff.png", "cx": 645, "by": 445, "width": 125, "opacity": 0.62, "shadow": False}, {"file": "tree.png", "cx": 835, "by": 530, "width": 135}],
    ),
    base_def(
        "island-biomass-03-upgraded-charcoal-craft.png", "biomass", "biomass", "upgraded", "moyen-age", "Charbonnage",
        "Charbonniere mieux maitrisee avec stockage trie.",
        integration="Remplace built apres Charbonnage.",
        draw=[{"type": "path", "points": [(385, 595), (555, 535), (735, 540), (900, 500)], "width": 18}],
        assets=[{"file": "coal-pile.png", "cx": 620, "by": 595, "width": 220}, {"file": "logs.png", "cx": 420, "by": 585, "width": 155}, {"file": "food-cache.png", "cx": 785, "by": 580, "width": 115}, {"file": "steam-puff.png", "cx": 665, "by": 435, "width": 115, "opacity": 0.55, "shadow": False}],
    ),
    base_def(
        "island-biomass-04-built-wood-gasifier.png", "biomass", "biomass", "built", "age-industriel", "Gazogene a bois",
        "Gazogene compact alimente au bois.",
        integration="Afficher apres achat de Gazogene a bois.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 320, "ry": 170, "color": (84, 100, 67, 62)}, {"type": "cable", "points": [(500, 580), (625, 535), (740, 555)], "color": (95, 85, 67, 125)}],
        assets=[{"file": "boiler.png", "cx": 630, "by": 585, "width": 210}, {"file": "logs.png", "cx": 420, "by": 585, "width": 145}, {"file": "steam-puff.png", "cx": 690, "by": 420, "width": 110, "opacity": 0.65, "shadow": False}],
    ),
    base_def(
        "island-biomass-04-upgraded-wood-gas-process.png", "biomass", "biomass", "upgraded", "age-industriel", "Gaz de bois",
        "Gazogene ameliore avec tuyaux et petite unite de controle.",
        integration="Remplace built apres Gaz de bois.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 320, "ry": 170, "color": (82, 102, 74, 62)}, {"type": "control", "cx": 780, "by": 570, "accent": (112, 170, 114, 190)}, {"type": "cable", "points": [(510, 585), (632, 535), (780, 555)], "color": (82, 94, 75, 150)}],
        assets=[{"file": "boiler.png", "cx": 600, "by": 590, "width": 225}, {"file": "logs.png", "cx": 410, "by": 585, "width": 135}, {"file": "steam-puff.png", "cx": 675, "by": 410, "width": 120, "opacity": 0.58, "shadow": False}],
    ),
    base_def(
        "island-biomass-05-built-biogas-digester.png", "biomass", "biomass", "built", "age-atomique-2026", "Digesteur biogaz",
        "Cuve biogaz moderne avec dechets organiques stylises.",
        integration="Afficher apres achat de Digesteur biogaz.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 320, "ry": 170, "color": (79, 136, 93, 55)}, {"type": "tank", "cx": 615, "by": 570}],
        assets=[{"file": "food-cache.png", "cx": 420, "by": 585, "width": 130}, {"file": "Panneaux_solaires.png", "cx": 805, "by": 585, "width": 140}],
    ),
    base_def(
        "island-biomass-05-upgraded-methanization.png", "biomass", "biomass", "upgraded", "age-atomique-2026", "Methanisation",
        "Installation de methanisation a deux cuves raccordees.",
        integration="Remplace built apres Methanisation.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 320, "ry": 170, "color": (74, 136, 105, 58)}, {"type": "tank", "cx": 565, "by": 575}, {"type": "tank", "cx": 705, "by": 565, "color": (69, 133, 116, 230), "dome": (111, 193, 132, 235)}, {"type": "control", "cx": 825, "by": 570, "accent": (100, 196, 142, 190)}, {"type": "cable", "points": [(555, 565), (645, 535), (745, 555), (825, 560)], "color": (68, 101, 84, 150)}],
        assets=[{"file": "food-cache.png", "cx": 405, "by": 590, "width": 120}],
    ),
]


DEFS += [
    base_def(
        "island-animal-02-built-oxen-pasture.png", "animal", "animal", "built", "neolithique", "Boeufs de traction",
        "Prairie avec boeufs et cloture simple.",
        integration="Afficher apres achat de Boeufs de traction.",
        draw=[{"type": "patch", "cx": 620, "cy": 470, "rx": 340, "ry": 175, "color": (115, 169, 64, 50)}, {"type": "path", "points": [(370, 600), (520, 540), (760, 535), (905, 490)], "width": 16}],
        assets=[{"file": "ox.png", "cx": 555, "by": 590, "width": 180}, {"file": "prairie.png", "cx": 760, "by": 585, "width": 210}],
    ),
    base_def(
        "island-animal-02-upgraded-animal-domestication.png", "animal", "animal", "upgraded", "neolithique", "Domestication de traction",
        "Boeufs organises avec joug stylise et abri.",
        integration="Remplace built apres Domestication de traction.",
        draw=[{"type": "patch", "cx": 620, "cy": 470, "rx": 340, "ry": 175, "color": (118, 171, 67, 54)}, {"type": "tiny_building", "cx": 805, "by": 555, "color": (196, 145, 88, 230), "roof": (133, 87, 48, 235)}],
        assets=[{"file": "ox.png", "cx": 555, "by": 590, "width": 190}, {"file": "logs.png", "cx": 438, "by": 575, "width": 100}],
    ),
    base_def(
        "island-animal-03-built-heavy-plough.png", "animal", "animal", "built", "moyen-age", "Charrue lourde",
        "Charrue lourde, sillons courts et animal discret.",
        integration="Afficher apres achat de Charrue lourde.",
        draw=[{"type": "patch", "cx": 625, "cy": 480, "rx": 330, "ry": 170, "color": (145, 110, 61, 52)}, {"type": "path", "points": [(390, 600), (560, 560), (760, 560), (900, 505)], "width": 20}],
        assets=[{"file": "plough.png", "cx": 600, "by": 605, "width": 210}, {"file": "ox.png", "cx": 760, "by": 565, "width": 135}, {"file": "field.png", "cx": 465, "by": 585, "width": 185}],
    ),
    base_def(
        "island-animal-03-upgraded-shoulder-collar.png", "animal", "animal", "upgraded", "moyen-age", "Collier d'epaule",
        "Harnais ameliore, champ plus net et traction efficace.",
        integration="Remplace built apres Collier d'epaule.",
        draw=[{"type": "patch", "cx": 625, "cy": 480, "rx": 330, "ry": 170, "color": (148, 114, 62, 58)}, {"type": "path", "points": [(350, 615), (540, 555), (725, 555), (930, 490)], "width": 20}],
        assets=[{"file": "plough.png", "cx": 570, "by": 610, "width": 230}, {"file": "horse.png", "cx": 765, "by": 565, "width": 150}, {"file": "field.png", "cx": 450, "by": 585, "width": 210}],
    ),
    base_def(
        "island-animal-04-built-horse-relay.png", "animal", "animal", "built", "age-industriel", "Relais de chevaux",
        "Petite ecurie, cheval, chemin et caisses.",
        integration="Afficher apres achat de Relais de chevaux.",
        draw=[{"type": "path", "points": [(330, 615), (520, 545), (720, 535), (940, 465)], "width": 28}, {"type": "tiny_building", "cx": 590, "by": 555, "color": (184, 113, 66, 235), "roof": (91, 59, 45, 240)}],
        assets=[{"file": "horse.png", "cx": 760, "by": 590, "width": 165}, {"file": "food-cache.png", "cx": 430, "by": 590, "width": 115}],
    ),
    base_def(
        "island-animal-04-upgraded-horse-logistics.png", "animal", "animal", "upgraded", "age-industriel", "Haras logistiques",
        "Relais structure avec route plus lisible et plusieurs stocks.",
        integration="Remplace built apres Haras logistiques.",
        draw=[{"type": "path", "points": [(300, 620), (510, 545), (710, 535), (960, 455)], "width": 32}, {"type": "tiny_building", "cx": 560, "by": 555, "color": (184, 113, 66, 235), "roof": (82, 58, 48, 240)}, {"type": "tiny_building", "cx": 685, "by": 540, "color": (200, 138, 83, 225), "roof": (102, 72, 50, 235)}],
        assets=[{"file": "horse.png", "cx": 800, "by": 590, "width": 165}, {"file": "food-cache.png", "cx": 410, "by": 595, "width": 120}],
    ),
    base_def(
        "island-animal-05-built-food-logistics.png", "animal", "animal", "built", "age-atomique-2026", "Logistique alimentaire",
        "Entrepot alimentaire moderne, silo et convoyeur discret.",
        integration="Afficher apres achat de Logistique alimentaire.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 340, "ry": 170, "color": (130, 160, 122, 45)}, {"type": "control", "cx": 715, "by": 555, "accent": (178, 202, 126, 190)}, {"type": "cable", "points": [(480, 595), (610, 540), (720, 550)], "color": (116, 130, 92, 130)}],
        assets=[{"file": "granary.png", "cx": 535, "by": 590, "width": 150}, {"file": "food-cache.png", "cx": 395, "by": 595, "width": 130}, {"file": "small-factory.png", "cx": 840, "by": 580, "width": 150}],
    ),
    base_def(
        "island-animal-05-upgraded-food-chain.png", "animal", "animal", "upgraded", "age-atomique-2026", "Chaine alimentaire",
        "Chaine alimentaire avec convoyeur et stockage froid stylise.",
        integration="Remplace built apres Chaine alimentaire.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 340, "ry": 170, "color": (132, 164, 130, 48)}, {"type": "control", "cx": 760, "by": 555, "accent": (162, 211, 190, 190)}, {"type": "cable", "points": [(390, 595), (540, 545), (705, 545), (850, 575)], "color": (94, 135, 118, 150)}],
        assets=[{"file": "food-cache.png", "cx": 410, "by": 600, "width": 130}, {"file": "granary.png", "cx": 555, "by": 585, "width": 145}, {"file": "small-factory.png", "cx": 850, "by": 585, "width": 160}, {"file": "Panneaux_solaires.png", "cx": 690, "by": 610, "width": 135}],
    ),
]


DEFS += [
    base_def(
        "island-water-wind-03-built-watermill.png", "water-wind", "water-wind", "built", "moyen-age", "Moulin a eau",
        "Ruisseau et roue a eau medievale.",
        integration="Afficher apres achat de Moulin a eau.",
        assets=[{"file": "river-tile.png", "cx": 530, "by": 585, "width": 355}, {"file": "water-wheel.png", "cx": 700, "by": 590, "width": 240}, {"file": "hill-tile.png", "cx": 850, "by": 500, "width": 170}],
    ),
    base_def(
        "island-water-wind-03-upgraded-windmill.png", "water-wind", "water-wind", "upgraded", "moyen-age", "Moulin a vent",
        "Moulin a vent lisible avec ruisseau conserve.",
        integration="Remplace built apres Moulin a vent.",
        assets=[{"file": "river-tile.png", "cx": 500, "by": 590, "width": 300}, {"file": "windmill.png", "cx": 690, "by": 575, "width": 250}, {"file": "hill-tile.png", "cx": 840, "by": 505, "width": 180}],
    ),
    base_def(
        "island-water-wind-04-built-wind-pump.png", "water-wind", "water-wind", "built", "age-industriel", "Pompe a vent",
        "Pompe a vent avec reservoir et tuyau.",
        integration="Afficher apres achat de Pompe a vent.",
        draw=[{"type": "patch", "cx": 620, "cy": 470, "rx": 330, "ry": 170, "color": (93, 157, 171, 40)}, {"type": "control", "cx": 780, "by": 570, "accent": (106, 170, 206, 190)}, {"type": "cable", "points": [(565, 590), (680, 535), (780, 560)], "color": (73, 110, 130, 130)}],
        assets=[{"file": "windmill.png", "cx": 560, "by": 585, "width": 240}, {"file": "river-tile.png", "cx": 780, "by": 605, "width": 210}],
    ),
    base_def(
        "island-water-wind-04-upgraded-mechanical-pumps.png", "water-wind", "water-wind", "upgraded", "age-industriel", "Pompes mecaniques",
        "Pompe mecanique avec moteur compact et conduites.",
        integration="Remplace built apres Pompes mecaniques.",
        draw=[{"type": "patch", "cx": 620, "cy": 470, "rx": 330, "ry": 170, "color": (89, 151, 169, 44)}, {"type": "control", "cx": 805, "by": 570, "accent": (98, 166, 210, 190)}, {"type": "cable", "points": [(495, 600), (610, 540), (805, 560)], "color": (60, 105, 135, 150)}],
        assets=[{"file": "windmill.png", "cx": 535, "by": 585, "width": 235}, {"file": "steam-engine.png", "cx": 680, "by": 610, "width": 150}, {"file": "river-tile.png", "cx": 815, "by": 610, "width": 190}],
    ),
    base_def(
        "island-water-wind-05-built-hydro-wind-grid.png", "water-wind", "water-wind", "built", "age-atomique-2026", "Reseau hydro-eolien",
        "Mini reseau hydro-eolien avec eau, eolienne et cables.",
        integration="Afficher apres achat de Reseau hydro-eolien.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 340, "ry": 175, "color": (82, 157, 180, 48)}, {"type": "cable", "points": [(455, 595), (605, 530), (780, 525), (900, 485)], "color": (76, 114, 146, 160)}],
        assets=[{"file": "river-tile.png", "cx": 490, "by": 600, "width": 270}, {"file": "Héoliennes.png", "cx": 785, "by": 560, "width": 215}, {"file": "water-wheel.png", "cx": 620, "by": 600, "width": 170}],
    ),
    base_def(
        "island-water-wind-05-upgraded-modern-wind-turbines.png", "water-wind", "water-wind", "upgraded", "age-atomique-2026", "Eoliennes modernes",
        "Eoliennes modernes blanches et infrastructure hydro discrete.",
        integration="Remplace built apres Eoliennes modernes.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 340, "ry": 175, "color": (82, 164, 186, 50)}, {"type": "cable", "points": [(395, 595), (570, 535), (735, 535), (920, 470)], "color": (63, 117, 155, 160)}, {"type": "control", "cx": 595, "by": 585, "accent": (99, 188, 214, 190)}],
        assets=[{"file": "Héoliennes.png", "cx": 770, "by": 560, "width": 260}, {"file": "river-tile.png", "cx": 460, "by": 605, "width": 225}, {"file": "Panneaux_solaires.png", "cx": 470, "by": 570, "width": 150}],
    ),
]


DEFS += [
    base_def(
        "island-fossil-03-built-coal-mine.png", "fossil", "fossil", "built", "pre-industriel", "Mine de charbon",
        "Mine de charbon optionnelle prioritaire avec rails et tas de charbon.",
        integration="Variante fossile preparatoire optionnelle.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 340, "ry": 175, "color": (58, 55, 50, 82)}, {"type": "rail", "start": (365, 600), "end": (810, 510)}],
        assets=[{"file": "coal-mine.png", "cx": 610, "by": 585, "width": 280}, {"file": "coal-pile.png", "cx": 840, "by": 600, "width": 170}],
    ),
    base_def(
        "island-fossil-03-upgraded-mechanized-coal.png", "fossil", "fossil", "upgraded", "pre-industriel", "Extraction mecanisee",
        "Mine mecanisee avec rails renforces, wagon et treuil stylise.",
        integration="Variante future pour mecanisation du charbon.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 340, "ry": 175, "color": (54, 53, 50, 88)}, {"type": "rail", "start": (330, 615), "end": (880, 495)}, {"type": "control", "cx": 835, "by": 560, "accent": (185, 146, 82, 170)}],
        assets=[{"file": "coal-mine.png", "cx": 595, "by": 585, "width": 285}, {"file": "coal-pile.png", "cx": 415, "by": 600, "width": 160}, {"file": "steam-engine.png", "cx": 760, "by": 615, "width": 145}],
    ),
    base_def(
        "island-fossil-04-built-steam-engine.png", "fossil", "fossil", "built", "age-industriel", "Machine a vapeur",
        "Machine a vapeur compacte avec charbon et vapeur douce.",
        integration="Afficher apres achat de Machine a vapeur.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 340, "ry": 175, "color": (58, 55, 50, 82)}, {"type": "rail", "start": (365, 600), "end": (760, 515)}],
        assets=[{"file": "steam-engine.png", "cx": 610, "by": 610, "width": 260}, {"file": "boiler.png", "cx": 770, "by": 575, "width": 180}, {"file": "coal-pile.png", "cx": 430, "by": 600, "width": 160}, {"file": "steam-puff.png", "cx": 710, "by": 420, "width": 125, "opacity": 0.7, "shadow": False}],
    ),
    base_def(
        "island-fossil-04-upgraded-high-pressure-steam.png", "fossil", "fossil", "upgraded", "age-industriel", "Vapeur haute pression",
        "Machine vapeur haute pression avec chaudiere robuste et vapeur controlee.",
        integration="Remplace built apres Vapeur haute pression.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 340, "ry": 175, "color": (55, 57, 57, 86)}, {"type": "rail", "start": (335, 615), "end": (865, 500)}, {"type": "control", "cx": 840, "by": 560, "accent": (179, 157, 122, 180)}],
        assets=[{"file": "steam-engine.png", "cx": 585, "by": 615, "width": 285}, {"file": "boiler.png", "cx": 755, "by": 590, "width": 210}, {"file": "coal-pile.png", "cx": 405, "by": 605, "width": 150}, {"file": "steam-puff.png", "cx": 715, "by": 395, "width": 150, "opacity": 0.76, "shadow": False}],
    ),
    base_def(
        "island-fossil-05-built-thermal-turbine.png", "fossil", "fossil", "built", "age-atomique-2026", "Turbine thermique",
        "Centrale thermique compacte avec turbine et conduites.",
        integration="Afficher apres achat de Turbine thermique.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 340, "ry": 175, "color": (68, 72, 76, 70)}, {"type": "cable", "points": [(395, 595), (560, 535), (740, 535), (910, 475)], "color": (91, 98, 105, 160)}],
        assets=[{"file": "small-factory.png", "cx": 615, "by": 590, "width": 245}, {"file": "steam-engine.png", "cx": 790, "by": 620, "width": 160}, {"file": "coal-pile.png", "cx": 420, "by": 600, "width": 145}, {"file": "steam-puff.png", "cx": 705, "by": 410, "width": 100, "opacity": 0.58, "shadow": False}],
    ),
    base_def(
        "island-fossil-05-upgraded-thermal-cycle.png", "fossil", "fossil", "upgraded", "age-atomique-2026", "Cycle thermique",
        "Cycle thermique optimise avec refroidissement compact et moins de fumee.",
        integration="Remplace built apres Cycle thermique.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 340, "ry": 175, "color": (69, 83, 91, 66)}, {"type": "control", "cx": 820, "by": 560, "accent": (101, 159, 204, 180)}, {"type": "cable", "points": [(420, 595), (590, 535), (760, 540), (840, 560)], "color": (84, 122, 151, 160)}],
        assets=[{"file": "small-factory.png", "cx": 585, "by": 595, "width": 245}, {"file": "steam-engine.png", "cx": 750, "by": 620, "width": 150}, {"file": "Panneaux_solaires.png", "cx": 420, "by": 585, "width": 145}, {"file": "steam-puff.png", "cx": 700, "by": 410, "width": 85, "opacity": 0.44, "shadow": False}],
    ),
]


DEFS += [
    base_def(
        "island-atomic-05-built-reactor-core.png", "atomic", "atomic", "built", "age-atomique-2026", "Coeur de reacteur",
        "Laboratoire compact avec coeur de reacteur visible.",
        integration="Afficher apres achat de Coeur de reacteur.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 340, "ry": 175, "color": (104, 139, 170, 50)}, {"type": "control", "cx": 810, "by": 565, "accent": (115, 185, 235, 190)}, {"type": "cable", "points": [(425, 595), (595, 535), (750, 545), (810, 560)], "color": (84, 120, 154, 160)}],
        assets=[{"file": "Centrale_fission.png", "cx": 610, "by": 610, "width": 265}, {"file": "tile-energy-platform-buildable.png", "cx": 600, "by": 635, "width": 420, "opacity": 0.42, "shadow": False}],
    ),
    base_def(
        "island-atomic-05-upgraded-controlled-fission.png", "atomic", "atomic", "upgraded", "age-atomique-2026", "Fission controlee",
        "Centrale de fission propre avec controle et glow bleu doux.",
        integration="Remplace built apres Fission controlee.",
        draw=[{"type": "patch", "cx": 625, "cy": 470, "rx": 340, "ry": 175, "color": (96, 143, 178, 58)}, {"type": "control", "cx": 825, "by": 565, "accent": (109, 203, 245, 200)}, {"type": "cable", "points": [(385, 595), (555, 535), (735, 535), (930, 470)], "color": (73, 124, 170, 170)}],
        assets=[{"file": "Centrale_fission.png", "cx": 605, "by": 610, "width": 300}, {"file": "tile-energy-platform-buildable.png", "cx": 600, "by": 635, "width": 450, "opacity": 0.46, "shadow": False}, {"file": "joule-particle.png", "cx": 610, "by": 435, "width": 90, "opacity": 0.75, "shadow": False}],
    ),
]


def write_manifest() -> None:
    manifest = {
        "project": "Prometheus Protocol",
        "baseImage": "public/assets/game/floating-grass-block-natural.png",
        "outputRoot": "public/assets/game/islands",
        "style": "same floating grass island silhouette, PNG transparent, soft 3D toy-like, slight isometric camera, no text/UI/watermark",
        "assets": [
            {
                "file": f"{item['category']}/{item['file']}",
                "filename": item["file"],
                "category": item["category"],
                "source": item["source"],
                "state": item["state"],
                "age": item["age"],
                "title": item["title"],
                "description": item["description"],
                "integration": item["integration"],
            }
            for item in DEFS
        ],
    }
    (OUT_DIR / "island-manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")


def write_readme() -> None:
    by_category: dict[str, list[dict[str, Any]]] = {}
    for item in DEFS:
        by_category.setdefault(item["category"], []).append(item)
    lines = [
        "# Floating Island Asset Pack",
        "",
        "Generated from `public/assets/game/floating-grass-block-natural.png`.",
        "",
        "Rules:",
        "",
        "- PNG with alpha transparency.",
        "- Same floating-island silhouette as the base image.",
        "- No text, UI, logo, or watermark inside images.",
        "- One island per energy family; technologies replace/evolve the built state.",
        "",
        "Use `island-manifest.json` as the integration source of truth.",
        "",
    ]
    for category, items in by_category.items():
        lines.append(f"## {category}")
        lines.append("")
        for item in items:
            lines.append(f"- `{category}/{item['file']}` - {item['title']}: {item['integration']}")
        lines.append("")
    (OUT_DIR / "README.md").write_text("\n".join(lines))


def write_contact_sheet() -> None:
    files = [(item, OUT_DIR / item["category"] / item["file"]) for item in DEFS]
    thumb = 150
    pad = 16
    label_h = 42
    cols = 5
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (thumb + pad) + pad, rows * (thumb + label_h + pad) + pad), (246, 244, 238))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 14)
        small = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 11)
    except OSError:
        font = ImageFont.load_default()
        small = ImageFont.load_default()

    for idx, (item, path) in enumerate(files):
        x = pad + (idx % cols) * (thumb + pad)
        y = pad + (idx // cols) * (thumb + label_h + pad)
        bg = Image.new("RGBA", (thumb, thumb), (236, 236, 229, 255))
        bd = ImageDraw.Draw(bg)
        cell = 12
        for yy in range(0, thumb, cell):
            for xx in range(0, thumb, cell):
                if (xx // cell + yy // cell) % 2:
                    bd.rectangle((xx, yy, xx + cell - 1, yy + cell - 1), fill=(250, 250, 246, 255))
        img = load_rgba(path)
        img.thumbnail((thumb - 6, thumb - 6), Image.Resampling.LANCZOS)
        bg.alpha_composite(img, ((thumb - img.width) // 2, (thumb - img.height) // 2))
        sheet.paste(bg.convert("RGB"), (x, y))
        draw.rounded_rectangle((x, y, x + thumb, y + thumb), radius=8, outline=(210, 203, 188), width=1)
        draw.text((x, y + thumb + 4), item["file"][:23], fill=(25, 25, 23), font=font)
        draw.text((x, y + thumb + 21), f"{item['category']} / {item['state']}", fill=(105, 92, 75), font=small)

    review_dir = OUT_DIR / "review"
    review_dir.mkdir(parents=True, exist_ok=True)
    sheet.save(review_dir / "island-contact-sheet.png")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for category in {item["category"] for item in DEFS}:
        (OUT_DIR / category).mkdir(parents=True, exist_ok=True)

    for defn in DEFS:
        if defn["category"] == "base" and defn["file"] == "island-base-blank.png":
            (OUT_DIR / "base").mkdir(parents=True, exist_ok=True)
            load_rgba(BASE_PATH).save(OUT_DIR / "base" / "island-base-blank.png")
        else:
            render(defn)

    write_manifest()
    write_readme()
    write_contact_sheet()
    print(f"Generated {len(DEFS)} island assets in {OUT_DIR}")


if __name__ == "__main__":
    main()
