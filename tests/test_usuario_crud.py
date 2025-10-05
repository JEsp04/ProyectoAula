import importlib

def test_update_usuario(tmp_data_dir):
    usuario_mod = importlib.import_module("backend.usuario.usuario")
    u = usuario_mod.Usuario("Alumno", 1000.0)

    # Asignar presupuesto inicial y luego actualizarlo
    u.asignar_presupuesto(u.alimentacion, 300.0)
    u.asignar_presupuesto(u.alimentacion, 400.0)  # actualización

    resumen = u.obtener_resumen()
    # Ajusta la clave si tu resumen usa otro nombre
    assert resumen["Categorias"]["Alimentacion"]["Presupuesto Mensual"] == 400.0
