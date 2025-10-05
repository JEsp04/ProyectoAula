import importlib
import os

def test_roundtrip_guardar_y_cargar_usuarios(tmp_data_dir):
    storage = importlib.import_module("backend.storage")
    usuario_mod = importlib.import_module("backend.usuario.usuario")

    u = usuario_mod.Usuario("Alumno", 1000.0)
    u.asignar_presupuesto(u.alimentacion, 300.0)
    u.asignar_presupuesto(u.transporte, 200.0)
    u.asignar_presupuesto(u.hogar, 100.0)
    u.asignar_presupuesto(u.otros, 50.0)
    u.registrar_gasto(u.alimentacion, 80.0, "super")

    storage.guardar_usuarios([u], "data.json")
    assert os.path.exists("data.json")

    usuarios = storage.cargar_usuarios("data.json")
    assert isinstance(usuarios, list)
    assert len(usuarios) == 1
    u2 = usuarios[0]
    resumen = u2.obtener_resumen()

    # Chequeos resilientes a cambios de nombres internos
    assert resumen.get("Nombre") == "Alumno"
    assert resumen.get("Ingreso Mensual") == 1000.0

    categorias = resumen.get("Categorias", {})
    alim = categorias.get("Alimentacion", {})
    # Validar presupuesto mensual persiste
    assert alim.get("Presupuesto Mensual") == 300.0
    # Validar que algún campo de gasto/total/Movimientos refleje consumo
    gasto_val = (
        alim.get("Gastos")
        or alim.get("Gasto Total")
        or alim.get("Gastado")
        or 0.0
    )
    # También aceptar si se refleja en “Movimientos”
    movimientos = alim.get("Movimientos", [])
    monto_via_movs = sum(m.get("monto", 0) for m in movimientos) if isinstance(movimientos, list) else 0.0

    assert (gasto_val >= 80.0) or (monto_via_movs >= 80.0)

def test_cargar_usuarios_archivo_inexistente(tmp_data_dir):
    storage = importlib.import_module("backend.storage")
    usuarios = storage.cargar_usuarios("no_existe.json")
    assert isinstance(usuarios, list)
    assert len(usuarios) == 0
