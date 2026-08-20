from __future__ import annotations

import hashlib
import importlib.util
import tempfile
import unittest
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
FONT_SOURCE = ROOT / "apps/site/src/assets/fonts/BebasNeue-Regular.woff2"
LICENSE_SOURCE = ROOT / "apps/site/src/assets/fonts/BebasNeue-OFL.txt"
GENERATOR_PATH = ROOT / "scripts/assets/generate-approved-assets.py"

generator_spec = importlib.util.spec_from_file_location("generate_approved_assets", GENERATOR_PATH)
if generator_spec is None or generator_spec.loader is None:
    raise RuntimeError("Unable to load asset generator")
generator = importlib.util.module_from_spec(generator_spec)
generator_spec.loader.exec_module(generator)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class AssetGeneratorTests(unittest.TestCase):
    def test_font_output_is_reproducible(self) -> None:
        source_modified = TTFont(FONT_SOURCE, recalcTimestamp=False)["head"].modified

        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            first_directory = root / "first"
            second_directory = root / "second"

            generator.save_font(FONT_SOURCE, LICENSE_SOURCE, first_directory)
            generator.save_font(FONT_SOURCE, LICENSE_SOURCE, second_directory)

            first = first_directory / "BebasNeue-Regular.woff2"
            second = second_directory / "BebasNeue-Regular.woff2"
            generated_license = first_directory / "BebasNeue-OFL.txt"
            generated_modified = TTFont(first, recalcTimestamp=False)["head"].modified
            source_license_lines = LICENSE_SOURCE.read_text(encoding="utf-8").splitlines()
            normalized_license = "\n".join(line.rstrip() for line in source_license_lines) + "\n"

            self.assertEqual(source_modified, generated_modified)
            self.assertEqual(sha256(first), sha256(second))
            self.assertEqual(normalized_license, generated_license.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
