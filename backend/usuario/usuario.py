import uuid
from datetime import datetime
from categorias import Alimentacion, Transporte, Hogar, Otros
class Usuario:
    def __init__(self, nombre, ingreso_mensual):
        self.nombre = nombre
        self.ingreso_mensual = float(ingreso_mensual)
        self.saldoRestante = float(ingreso_mensual)
        self.gastosMensuales = 0
        
        self.alimentacion = Alimentacion()
        self.transporte = Transporte()
        self.hogar = Hogar()
        self.otros = Otros()
        self.historial = []

    def asignar_presupuesto(self, categoria, monto):
        monto = float(monto)
        if monto >= 0 and monto <= self.saldoRestante:
            categoria.presupuestoInicial = monto
            categoria.saldoRestante = monto
            self.saldoRestante -= monto
        else:
            raise Exception("Monto invalido para el presupuesto (supera saldo de la categoria)")
        
    def registrar_gasto(self, categoria, monto, descripcion=""):
        monto = float(monto)
        
        if monto <= categoria.saldoRestante:
            categoria.gastos += monto
            categoria.saldoRestante -= monto
            self.gastosMensuales += monto
            
        else:
            raise Exception("Monto invalido para el gasto")
        
        fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        movimiento = {
            "id": str(uuid.uuid4()),
            "categoria": categoria.nombre,
            "monto": monto,
            "descripcion": descripcion,
            "fecha": fecha
        }
        categoria.movimientos.append(movimiento)
        self.historial.append(movimiento)
        
        return movimiento
    
    def obtener_historial(self):
        def __key(movimiento):
            return datetime.strptime(movimiento["fecha"], "%Y-%m-%d %H:%M:%S")
        
        return sorted(self.historial, key=__key, reverse=True)
    
    def obtener_resumen_categoria(self, categoria):
        def _key(movimiento):
            return datetime.strptime(movimiento["fecha"], "%Y-%m-%d %H:%M:%S")
        
        return sorted(categoria.movimientos, key=_key)

    
    def obtener_resumen(self):
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
        alertas = []

        if self.ingreso_mensual > 0:
            porcentaje_gasto = (self.gastosMensuales / self.ingreso_mensual) * 100
            if porcentaje_gasto >= 80:
                alertas.append(f"Alerta: Ha gastado el {porcentaje_gasto:.2f}% de su ingreso mensual.")
        
        for nombre, categoria in [("Alimentación", self.alimentacion), 
                              ("Transporte", self.transporte),
                              ("Hogar", self.hogar),
                              ("Otros", self.otros)]:
            if categoria.presupuestoInicial > 0:
                porcentaje_categoria = (categoria.gastos / categoria.presupuestoInicial) * 100
                if porcentaje_categoria >= 80:
                    alertas.append(f"Alerta: Ha gastado el {porcentaje_categoria}% de su presupuesto en {nombre}.")
        return alertas
    