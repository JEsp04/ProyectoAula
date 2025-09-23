class Categorias:
    def __init__(self):
        self.presupuestoInicial = 0
        self.saldoRestante = self.presupuestoInicial
        self.gastos = 0
        self.movimientos = []
        
class Alimentacion(Categorias):
    def __init__(self):
        super().__init__()
        self.nombre = "Alimentacion"

class Transporte(Categorias):
    def __init__(self):
        super().__init__()
        self.nombre = "Transporte"

class Hogar(Categorias):
    def __init__(self):
        super().__init__()
        self.nombre = "Hogar"

class Otros(Categorias):
    def __init__(self):
        super().__init__()
        self.nombre = "Otros"
        
        

