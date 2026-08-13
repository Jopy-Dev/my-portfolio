from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from shutil import copyfile

from fontTools.ttLib import TTFont
from PIL import Image


TERRAIN_SOURCE_SHA256 = "5266483429146b8aa192786e290e218111cd9e85288f3b25b6eb3ad77b459557"
TERRAIN_WIDTHS = (640, 960, 1280, 1536)
TERRAIN_ENCODINGS = (
    ("AVIF", "avif", {"quality": 58, "speed": 6}),
    ("WEBP", "webp", {"quality": 80, "method": 6}),
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def file_record(path: Path, file_format: str) -> dict[str, object]:
    return {
        "path": path.as_posix(),
        "format": file_format,
        "bytes": path.stat().st_size,
        "sha256": sha256(path),
    }


def save_derivative(
    image: Image.Image,
    output_directory: Path,
    width: int,
    height: int,
    image_format: str,
    extension: str,
    options: dict[str, int],
) -> dict[str, object]:
    target = output_directory / f"night-atlas-{width}.{extension}"
    image.save(target, image_format, **options)
    record = file_record(target, extension)
    return {
        "path": record["path"],
        "width": width,
        "height": height,
        "format": record["format"],
        "bytes": record["bytes"],
        "sha256": record["sha256"],
    }


def terrain_derivatives(
    source_image: Image.Image, output_directory: Path, width: int
) -> list[dict[str, object]]:
    height = round(source_image.height * width / source_image.width)
    image = source_image
    if width != source_image.width:
        image = source_image.resize((width, height), Image.Resampling.LANCZOS)
    return [
        save_derivative(
            image,
            output_directory,
            width,
            height,
            image_format,
            extension,
            options,
        )
        for image_format, extension, options in TERRAIN_ENCODINGS
    ]


def save_terrain(source: Path, output_directory: Path) -> list[dict[str, object]]:
    if sha256(source) != TERRAIN_SOURCE_SHA256:
        raise ValueError(
            "Terrain source hash does not match owner-approved Night Atlas asset"
        )

    output_directory.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = image.convert("RGB")
        return [
            record
            for width in TERRAIN_WIDTHS
            for record in terrain_derivatives(image, output_directory, width)
        ]


def save_font(source: Path, license_source: Path, output_directory: Path) -> dict[str, object]:
    output_directory.mkdir(parents=True, exist_ok=True)
    target = output_directory / "BebasNeue-Regular.woff2"
    font = TTFont(source)
    font.flavor = "woff2"
    font.save(target)
    license_target = output_directory / "BebasNeue-OFL.txt"
    copyfile(license_source, license_target)
    record = file_record(target, "woff2")
    return {
        **record,
        "licensePath": license_target.as_posix(),
        "license": "OFL-1.1",
    }


def relative_records(
    records: list[dict[str, object]],
    root: Path,
    keys: tuple[str, ...] = ("path",),
) -> list[dict[str, object]]:
    for record in records:
        for key in keys:
            record[key] = Path(str(record[key])).relative_to(root).as_posix()
    return records


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--terrain", required=True, type=Path)
    parser.add_argument("--font", required=True, type=Path)
    parser.add_argument("--font-license", required=True, type=Path)
    parser.add_argument("--root", default=Path.cwd(), type=Path)
    return parser.parse_args()


def create_manifest(
    terrain_records: list[dict[str, object]], font_record: dict[str, object]
) -> dict[str, object]:
    return {
        "version": 1,
        "approvedBy": "Mark Jommer",
        "approvedOn": "2026-08-14",
        "assets": [
            {
                "id": "night-atlas-terrain",
                "sourceProvider": "OpenAI ImageGen",
                "sourceReference": "Option C — Night Atlas",
                "sourceSha256": TERRAIN_SOURCE_SHA256,
                "license": "owner-approved generated asset",
                "role": "decorative capability terrain",
                "altOwner": "decorative-empty-alt",
                "derivatives": terrain_records,
            },
            {
                "id": "bebas-neue-regular",
                "sourceProvider": "Google Fonts upstream distribution",
                "role": "display landmarks",
                **font_record,
            },
        ],
    }


def write_manifest(root: Path, manifest: dict[str, object]) -> None:
    manifest_path = root / "apps/site/src/assets/asset-manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def main() -> None:
    arguments = parse_arguments()
    root = arguments.root.resolve()

    terrain_records = save_terrain(
        arguments.terrain.resolve(), root / "apps/site/public/assets/terrain"
    )
    font_record = save_font(
        arguments.font.resolve(),
        arguments.font_license.resolve(),
        root / "apps/site/src/assets/fonts",
    )
    manifest = create_manifest(
        relative_records(terrain_records, root),
        relative_records([font_record], root, ("path", "licensePath"))[0],
    )
    write_manifest(root, manifest)


if __name__ == "__main__":
    main()
