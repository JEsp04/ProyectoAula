import importlib

def _new_categoria(nombre="Alimentacion"):
    mod = importlib.import_module("backend.categorias")
    # Instancia de la subclase elegida
    clase = getattr(mod, nombre)
    return clase()

def set_presupuesto(cat, monto):
    cat.presupuestoInicial = monto
    cat.saldoRestante = monto

def add_gasto(cat, monto, descripcion=""):
    # valida y aplica
    if monto <= 0:
        raise ValueError("monto inválido")
    cat.gastos += monto
    cat.saldoRestante = max(0, cat.saldoRestante - monto)
    cat.movimientos.append({"tipo": "gasto", "monto": monto, "desc": descripcion})

def get_gastado(cat):
    return cat.gastos

def get_alerts(cat):
    # genera mensajes según umbrales 80/90% del presupuesto
    if cat.presupuestoInicial <= 0:
        return []
    p = (cat.gastos / cat.presupuestoInicial) * 100
    alerts = []
    if p >= 90:
        alerts.append(f"ALERTA: 90% alcanzado ({p:.1f}%)")
    elif p >= 80:
        alerts.append(f"Atención: 80% alcanzado ({p:.1f}%)")
    return alerts

def test_acumula_gasto_por_categoria():
    cat = _new_categoria("Alimentacion")
    set_presupuesto(cat, 300)
    add_gasto(cat, 50, "super")
    assert get_gastado(cat) == 50

def test_alerta_80_y_90():
    cat = _new_categoria("Otros")
    set_presupuesto(cat, 100)
    add_gasto(cat, 80, "compra")
    assert any("80%" in a or "80" in a for a in get_alerts(cat))
    add_gasto(cat, 10, "extra")
    assert any("90%" in a or "90" in a for a in get_alerts(cat))
