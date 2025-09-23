## Alimentacion, transporte, hogar, otros
class Categorias:
    def __init__(self):
        self.presupuestoInicial = 0
        self.saldoRestante = self.presupuestoInicial
        self.gastos = 0
        
class Alimentacion(Categorias):
    def __init__(self):
        super().__init__()

class Transporte(Categorias):
    def __init__(self):
        super().__init__()

class Hogar(Categorias):
    def __init__(self):
        super().__init__()

class Otros(Categorias):
    def __init__(self):
        super().__init__()
        
class Usuario:
    def __init__(self, nombre, ingreso_mensual):
        self.nombre = nombre
        self.ingreso_mensual = ingreso_mensual
        self.saldoRestante = ingreso_mensual
        self.gastosMensuales = 0
        self.alimentacion = Alimentacion()
        self.transporte = Transporte()
        self.hogar = Hogar()
        self.otros = Otros()

    def asignar_presupuesto(self, categoria, monto):
        if monto >= 0 and monto <= self.saldoRestante:
            categoria.presupuestoInicial = monto
            categoria.saldoRestante = monto
            self.saldoRestante -= monto
        else:
            raise Exception("Monto invalido para el presupuesto")
        
    def registrar_gasto(self, categoria, monto):
        if monto >= 0 and monto <= categoria.saldoRestante - categoria.gastos:
            categoria.gastos += monto
            self.gastosMensuales += monto
            categoria.saldoRestante -= monto
        else:
            raise Exception("Monto invalido para el gasto")
        
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
                    "Saldo Restante": self.alimentacion.saldoRestante
                },
                "Transporte": {
                    "Presupuesto Mensual": self.transporte.presupuestoInicial,
                    "Gastos Mensuales": self.transporte.gastos,
                    "Saldo Restante": self.transporte.saldoRestante
                },
                "Hogar": {
                    "Presupuesto Mensual": self.hogar.presupuestoInicial,
                    "Gastos Mensuales": self.hogar.gastos,
                    "Saldo Restante": self.hogar.saldoRestante
                },
                "Otros": {
                    "Presupuesto Mensual": self.otros.presupuestoInicial,
                    "Gastos Mensuales": self.otros.gastos,
                    "Saldo Restante": self.otros.saldoRestante
                },
                }
            }
        return resumen
    
    def Alertas (self):
        alertas = []

        if self.ingreso_mensual > 0:
            porcentaje_gasto = (self.gastosMensuales / self.ingreso_mensual) * 100
            if porcentaje_gasto >= 90:
                alertas.append("Alerta: Ha gastado más del 90% de su ingreso mensual.")
            elif porcentaje_gasto >= 80:
                alertas.append("Alerta: Ha gastado más del 80% de su ingreso mensual.")
        
        for nombre, categoria in [("Alimentación", self.alimentacion), 
                              ("Transporte", self.transporte),
                              ("Hogar", self.hogar),
                              ("Otros", self.otros)]:
            if categoria.presupuestoInicial > 0:
                porcentaje_categoria = (categoria.gastos / categoria.presupuestoInicial) * 100
                if porcentaje_categoria >= 90:
                    alertas.append(f"Alerta: Ha gastado más del 90% de su presupuesto en {nombre}.")
                elif porcentaje_categoria >= 80:
                    alertas.append(f"Alerta: Ha gastado más del 80% de su presupuesto en {nombre}.")
        return alertas

import json

usuarios = []

while True:
    opcion = input("¿Desea crear un usuario? (s/n): ").strip().lower()
    if opcion == 'n':
        break

    nombre = input("Nombre del usuario: ")
    ingreso = float(input("Ingreso mensual: "))
    usuario = Usuario(nombre, ingreso)

    for categoria, obj in [("Alimentación", usuario.alimentacion), 
                          ("Transporte", usuario.transporte),
                          ("Hogar", usuario.hogar),
                          ("Otros", usuario.otros)]:
        while True:
            try:
                monto = float(input(f"Presupuesto asignado para {categoria}: "))
                usuario.asignar_presupuesto(obj, monto)
                break
            except Exception as e:
                print("Error:", e)
        while True:
            try:
                gasto = float(input(f"Gasto en {categoria}: "))
                usuario.registrar_gasto(obj, gasto)
                break
            except Exception as e:
                print("Error:", e)

    usuarios.append(usuario)
    print(f"Usuario '{nombre}' creado con éxito.\n")

print("\nResúmenes de todos los usuarios:")
for u in usuarios:
    print(json.dumps(u.obtener_resumen(), indent=4, ensure_ascii=False))
