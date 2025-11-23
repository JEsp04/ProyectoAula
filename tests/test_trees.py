from backend.models.category_node import CategoryNode
from backend.models.usuario import Usuario


def test_categorynode_recursive_totals():
    # Root node with own presupuesto/gastos
    root = CategoryNode("Root", presupuesto=100.0, gastos=5.0)

    # Child layers
    child_a = CategoryNode("A", presupuesto=50.0, gastos=20.0)
    child_b = CategoryNode("B", presupuesto=30.0, gastos=10.0)
    child_c = CategoryNode("C", presupuesto=20.0, gastos=2.0)

    # Build tree: root -> A -> B -> C
    child_b.add_child(child_c)
    child_a.add_child(child_b)
    root.add_child(child_a)

    # Totals should include all descendants
    assert root.total_presupuesto_recursive() == 100.0 + 50.0 + 30.0 + 20.0
    assert root.total_gastos_recursive() == 5.0 + 20.0 + 10.0 + 2.0


def test_usuario_build_tree_includes_movimiento_and_totals():
    u = Usuario("Tester", "tester@example.com", 1000.0)

    # assign presupuesto to alimentacion and add a gasto
    u.asignar_presupuesto(u.alimentacion, 400.0)
    mov = u.registrar_gasto(u.alimentacion, 150.0, "mercado")

    tree = u.build_category_tree_dict()
    assert isinstance(tree, dict)
    # find Alimentacion node
    children = tree.get("children", [])
    alim = None
    for c in children:
        if str(c.get("name", "")).lower().startswith("aliment"):
            alim = c
            break

    assert alim is not None, "Alimentacion node not found in tree"

    # gastos and presupuesto should reflect the change
    assert float(alim.get("gastos", 0)) >= 150.0
    assert float(alim.get("presupuesto", 0)) == 400.0

    # movimiento debe estar en la lista de movimientos
    movs = alim.get("movimientos", [])
    assert any(
        (
            m.get("descripcion") == "mercado"
            or m.get("descripcion") == mov.get("descripcion")
        )
        for m in movs
    )

    # root totals should include the gasto
    assert float(tree.get("total_gastos_recursive", 0)) >= 150.0
    assert float(tree.get("total_presupuesto_recursive", 0)) >= 400.0
