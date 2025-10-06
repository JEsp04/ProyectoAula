import uuid # para generar IDs únicas para los movimientos
from datetime import datetime # para manejar fechas y horas
from categorias import Alimentacion, Transporte, Hogar, Otros # importamos las categorias
class Usuario:
    # clase que representa a un usuario con sus categorias, presupuestos y gastos
    def __init__(self, nombre, ingreso_mensual):
        self.nombre = nombre
        self.ingreso_mensual = float(ingreso_mensual)
        self.saldoRestante = float(ingreso_mensual)
        self.gastosMensuales = 0
        
        self.alimentacion = Alimentacion()
        self.transporte = Transporte()
        self.hogar = Hogar()
        self.otros = Otros()
        self.historial = [] # historial de todos los movimientos del usuario
        self.pila = [] # pila para deshacer acciones como el ultimo gasto registrado

    def asignar_presupuesto(self, categoria, monto):
        # asigna un presupuesto a una categoria especifica del usuario
        monto = float(monto)
        if monto >= 0 and monto <= self.saldoRestante: # verificamos que el monto es valido
            categoria.presupuestoInicial = monto
            categoria.saldoRestante = monto
            self.saldoRestante -= monto
        else:
            raise Exception("Monto invalido para el presupuesto (supera saldo de la categoria)")
        
    def registrar_gasto(self, categoria, monto, descripcion=""):
        # registra un gasto en una categoria especifica del usuario
        monto = float(monto)
        if monto <= categoria.saldoRestante:
            categoria.gastos += monto
            categoria.saldoRestante -= monto
            self.gastosMensuales += monto
            
        else:
            raise Exception("Monto invalido para el gasto")
        
        fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S") # obtenemos la fecha y hora actual, strftime la formatea como cadena esto tambien se hizo con ayuda de IA
        movimiento = {
            "id": str(uuid.uuid4()), # generamos un ID unico para el movimiento con uuid4
            "categoria": categoria.nombre,
            "monto": monto,
            "descripcion": descripcion,
            "fecha": fecha
        }
        # se guarda en el historial global del usuario y en el historial de la categoria
        categoria.movimientos.append(movimiento)
        self.historial.append(movimiento)
        # se guarda en la pila para poder deshacer el ultimo gasto si es necesario
        self.pila.append(("gasto", categoria, monto, movimiento))
        return movimiento
    
    def obtener_historial(self):
        # devuelve el historial de movimientos del usuario ordenado por fecha (el mas reciente primero)
        def __key(movimiento):
            return datetime.strptime(movimiento["fecha"], "%Y-%m-%d %H:%M:%S")
        
        return sorted(self.historial, key=__key, reverse=True)
    
    def obtener_resumen_categoria(self, categoria):
        # devuelve los movimientos de una categoria especifica ordenados por fecha (el mas antiguo primero)
        def _key(movimiento):
            return datetime.strptime(movimiento["fecha"], "%Y-%m-%d %H:%M:%S")
        
        return sorted(categoria.movimientos, key=_key)

    
    def obtener_resumen(self):
        # devuelve un resumen del usuario con sus categorias, presupuestos, gastos, movimientos y alertas
        resumen = {
            "Nombre": self.nombre,
            "Ingreso Mensual": self.ingreso_mensual,
            "Saldo Restante": self.saldoRestante,
            "Gastos Mensuales": self.gastosMensuales,
            "Categorias": {
                "Alimentacion": {
                    "Presupuesto Mensual": self.alimentacion.presupuestoInicial,
                    "Gastos Mensuales": self.alimentacion.gastos,
                    "Saldo Restante": self.alimentacion.saldoRestante,
                    "Movimientos": self.obtener_resumen_categoria(self.alimentacion)
                },
                "Transporte": {
                    "Presupuesto Mensual": self.transporte.presupuestoInicial,
                    "Gastos Mensuales": self.transporte.gastos,
                    "Saldo Restante": self.transporte.saldoRestante,
                    "Movimientos": self.obtener_resumen_categoria(self.transporte)
                },
                "Hogar": {
                    "Presupuesto Mensual": self.hogar.presupuestoInicial,
                    "Gastos Mensuales": self.hogar.gastos,
                    "Saldo Restante": self.hogar.saldoRestante,
                    "Movimientos": self.obtener_resumen_categoria(self.hogar)
                },
                "Otros": {
                    "Presupuesto Mensual": self.otros.presupuestoInicial,
                    "Gastos Mensuales": self.otros.gastos,
                    "Saldo Restante": self.otros.saldoRestante,
                    "Movimientos": self.obtener_resumen_categoria(self.otros)
                },
                },
            "Alertas": self.Alertas()
            }
        return resumen
    
    def Alertas (self):
        # genera alertas si el usuario ha gastado mas del 80% de su ingreso mensual o del presupuesto de alguna categoria
        alertas = [] # lista para almacenar las alertas
        # alerta general por gasto excesivo
        if self.ingreso_mensual > 0:
            porcentaje_gasto = (self.gastosMensuales / self.ingreso_mensual) * 100
            if porcentaje_gasto >= 80:
                alertas.append(f"Alerta: Ha gastado el {porcentaje_gasto:.2f}% de su ingreso mensual.")
        # alertas por gasto en categorias
        for nombre, categoria in [("Alimentación", self.alimentacion), 
                              ("Transporte", self.transporte),
                              ("Hogar", self.hogar),
                              ("Otros", self.otros)]:# lista de categorias y sus objetos correspondientes
            if categoria.presupuestoInicial > 0:
                porcentaje_categoria = (categoria.gastos / categoria.presupuestoInicial) * 100
                if porcentaje_categoria >= 80:
                    alertas.append(f"Alerta: Ha gastado el {porcentaje_categoria:.2f}% del presupuesto asignado para la categoría {nombre}.")
        return alertas
    
    def deshacer_ultimo_gasto(self):
        # deshace el ultimo gasto registrado por el usuario
        # muestra los detalles del ultimo gasto y pide confirmacion antes de eliminarlo
        # si confirma, el gasto se elimina del historial y se actualizan los totales
        if not self.pila:
            raise Exception("No hay gastos para deshacer")
        
        _, categoria, monto, movimiento = self.pila[-1] # obtenemos el ultimo gasto sin eliminarlo aun
        print("\nÚltimo gasto registrado:")
        print(f"Categoría: {categoria.nombre}")
        print(f"Monto: {monto}")
        print(f"Descripción: {movimiento['descripcion']}")
        print(f"Fecha: {movimiento['fecha']}")
        
        confirmar = input("¿Desea deshacer este gasto? (s/n): ").lower().strip() # pedimos confirmacion al usuario
        if confirmar != 's':
            print("Operación cancelada.")
            return
        
        _, categoria, monto, movimiento = self.pila.pop() # eliminamos el ultimo gasto de la pila     
        categoria.gastos -= monto
        categoria.saldoRestante += monto
        self.gastosMensuales -= monto
        
        categoria.movimientos.remove(movimiento) # eliminamos el movimiento del historial de la categoria
        self.historial.remove(movimiento) # eliminamos el movimiento del historial global del usuario
        
        print("Último gasto deshecho con éxito.")
        