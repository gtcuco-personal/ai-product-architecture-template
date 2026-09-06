import importlib.util
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch


HELPER = Path(__file__).parents[2] / "scripts" / "run-python-ci.py"
SPEC = importlib.util.spec_from_file_location("run_python_ci", HELPER)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class PytestRunnerContractTest(unittest.TestCase):
    def test_invokes_existing_pytest_suite_and_propagates_zero_collection(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "requirements.txt").write_text("pytest>=7.4.0\n")
            (root / "tests").mkdir()
            (root / "tests" / "test_example.py").write_text("def test_example():\n    assert True\n")
            completed = subprocess.CompletedProcess([], 5)

            with patch.object(MODULE.subprocess, "run", return_value=completed) as run:
                self.assertEqual(MODULE.run_ci(root), 5)

            run.assert_called_once_with(
                [sys.executable, "-m", "pytest", "tests"], cwd=root, check=False
            )

    def test_syntax_walk_prunes_dependency_directories(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / ".venv").mkdir()
            (root / ".venv" / "broken.py").write_text("def broken(:\n")
            (root / "valid.py").write_text("value = 1\n")

            self.assertEqual(MODULE.check_syntax(root), 0)


if __name__ == "__main__":
    unittest.main()
