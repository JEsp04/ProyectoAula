class Categorias:
    def __init__(self):
        self.presupuestoInicial = 0
        self.saldoRestante = self.presupuestoInicial
        self.gastos = 0
        self.movimientos = []

#clase derivada que representa la categoria de alimentacion
# Hereda de la clase Categorias
class Alimentacion(Categorias):
    def __init__(self):
        # Llamada al constructor de la clase padre(Categorias)
        super().__init__()
        # Nombre especifico de la clase Alimentacion
        self.nombre = "Alimentacion"

#clase que representa la categoria de transporte e igulalmente hereda de la clase Categorias
class Transporte(Categorias):
    def __init__(self):
        # Llamada al constructor de la clase padre(Categorias)
        super().__init__()
        # Nombre especifico de la clase Transporte
        self.nombre = "Transporte"
#clase que representa la categoria de Hogar e igualmente hereda de la clase Categorias
class Hogar(Categorias):
    def __init__(self):
        # Llamada al constructor de la clase padre(Categorias)
        super().__init__()
        # Nombre especifico de la clase Hogar
        self.nombre = "Hogar"
#clase que representa la categoria de Otros e igualmente hereda de la clase Categorias
class Otros(Categorias):
    def __init__(self):
        # Llamada al constructor de la clase padre(Categorias)
        super().__init__()
        # Nombre especifico de la clase Otros
        self.nombre = "Otros"
        
        

