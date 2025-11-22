class CategoryNode:

    def __init__(
        self, name, presupuesto=0.0, gastos=0.0, saldoRestante=0.0, movimientos=None
    ):
        self.name = name
        self.presupuesto = float(presupuesto or 0)
        self.gastos = float(gastos or 0)
        self.saldoRestante = float(saldoRestante or 0)
        self.movimientos = movimientos[:] if movimientos else []
        self.children = []

    def add_child(self, node):
        self.children.append(node)

    def total_gastos_recursive(self):
        total = self.gastos
        for c in self.children:
            total += c.total_gastos_recursive()
        return total

    def total_presupuesto_recursive(self):
        total = self.presupuesto
        for c in self.children:
            total += c.total_presupuesto_recursive()
        return total

    def to_dict(self):
        return {
            "name": self.name,
            "presupuesto": self.presupuesto,
            "gastos": self.gastos,
            "saldoRestante": self.saldoRestante,
            "movimientos": list(self.movimientos),
            "children": [c.to_dict() for c in self.children],
            "total_gastos_recursive": self.total_gastos_recursive(),
            "total_presupuesto_recursive": self.total_presupuesto_recursive(),
        }
