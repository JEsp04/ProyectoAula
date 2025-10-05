
import sys, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND = os.path.join(ROOT, "backend")
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)
if BACKEND not in sys.path:
    sys.path.insert(0, BACKEND)


import json, os, shutil, tempfile, importlib
import pytest

@pytest.fixture
def tmp_data_dir(monkeypatch):
    tmpdir = tempfile.mkdtemp()
    monkeypatch.chdir(tmpdir)
    yield tmpdir
    shutil.rmtree(tmpdir, ignore_errors=True)

@pytest.fixture
def sample_json_user():
    
    return {"id": 1, "nombre": "Alumno", "email": "alumno@uni.edu", "presupuesto": 1000}

@pytest.fixture
def storage(tmp_data_dir):

    return importlib.import_module("backend.storage")
