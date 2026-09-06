#!/usr/bin/env python3
"""Run the template's deliberately small Python quality contract."""

from __future__ import annotations

import argparse
import os
from pathlib import Path
import subprocess
import sys
import tokenize
import unittest


EXCLUDED_DIRECTORIES = {
    ".git", ".mypy_cache", ".pytest_cache", ".ruff_cache", ".tox", ".venv",
    "__pycache__", "build", "dist", "node_modules", "venv",
}


def python_files(root: Path):
    for directory, child_directories, filenames in os.walk(root):
        child_directories[:] = sorted(
            name for name in child_directories if name not in EXCLUDED_DIRECTORIES
        )
        for filename in sorted(filenames):
            if filename.endswith(".py"):
                yield Path(directory) / filename


def check_syntax(root: Path) -> int:
    failures = 0
    for path in python_files(root):
        try:
            with tokenize.open(path) as source_file:
                compile(source_file.read(), str(path), "exec")
        except (OSError, SyntaxError, UnicodeError) as error:
            print(f"Syntax check failed: {error}", file=sys.stderr)
            failures += 1
    return failures


def pytest_declared(requirements: Path) -> bool:
    import re
    pattern = re.compile(r"^pytest(?:\[[^\]]+\])?(?:\s*(?:===|==|~=|!=|<=|>=|<|>).*)?$", re.I)
    return any(pattern.fullmatch(line.split("#", 1)[0].strip()) for line in requirements.read_text().splitlines())


def run_ci(root: Path, runner: str = "pytest") -> int:
    requirements = root / "requirements.txt"
    if runner == "pytest" and (not requirements.is_file() or not pytest_declared(requirements)):
        print("Unsupported Python setup: expected requirements.txt declaring pytest.", file=sys.stderr)
        return 2
    if check_syntax(root):
        return 1
    if not (root / "tests").is_dir():
        print("Python CI requires a tests/ directory; refusing to report a green run.", file=sys.stderr)
        return 2

    if runner == "unittest":
        suite = unittest.defaultTestLoader.discover(str(root / "tests"))
        count = suite.countTestCases()
        if count == 0:
            print("unittest collected zero tests; refusing to report a green run.", file=sys.stderr)
            return 5
        return 0 if unittest.TextTestRunner(verbosity=2).run(suite).wasSuccessful() else 1

    command = [sys.executable, "-m", "pytest", "tests"]
    print("Running:", " ".join(command), flush=True)
    return subprocess.run(command, cwd=root, check=False).returncode


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--runner", choices=("pytest", "unittest"), default="pytest")
    args = parser.parse_args()
    return run_ci(Path.cwd(), args.runner)


if __name__ == "__main__":
    raise SystemExit(main())
