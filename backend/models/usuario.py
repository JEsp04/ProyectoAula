import uuid # para generar IDs únicas para los movimientos
from datetime import datetime # para manejar fechas y horas
from backend.models.categorias import Alimentacion, Transporte, Hogar, Otros # importamos las categorias
from hashlib import sha256  # para hashear contraseñas
import bcrypt
class Usuario:
    # clase que representa a un usuario con sus categorias, presupuestos y gastos
    def __init__(self, nombre, email, ingreso_mensual, password_hash=None):
        self.nombre = nombre
        self.email = email
        self.ingreso_mensual = float(ingreso_mensual)
        self.saldoRestante = float(ingreso_mensual)
        self.gastosMensuales = 0
        
        self.password_hash = password_hash
        
        # Categorías
        self.alimentacion = Alimentacion()
        self.transporte = Transporte()
        self.hogar = Hogar()
        self.otros = Otros()
        self.historial = [] # historial de todos los movimientos del usuario
        self.pila = [] # pila para deshacer acciones como el ultimo gasto registrado

    def set_password(self, password: str):
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.password_hash = hashed.decode('utf-8')

    def check_password(self, password: str) -> bool:
        if self.password_hash is None:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
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
            "nombre": self.nombre,
            "email": self.email,
            "ingreso": self.ingreso_mensual,
            "saldoRestante": self.saldoRestante,
            "gastosMensuales": self.gastosMensuales,
            "categorias": {
                "alimentacion": {
                    "presupuestoMensual": self.alimentacion.presupuestoInicial,
                    "gastosMensuales": self.alimentacion.gastos,
                    "saldoRestante": self.alimentacion.saldoRestante,
                    "movimientos": self.obtener_resumen_categoria(self.alimentacion)
                },
                "transporte": {
                    "presupuestoMensual": self.transporte.presupuestoInicial,
                    "gastosMensuales": self.transporte.gastos,
                    "saldoRestante": self.transporte.saldoRestante,
                    "movimientos": self.obtener_resumen_categoria(self.transporte)
                },
                "hogar": {
                    "presupuestoMensual": self.hogar.presupuestoInicial,
                    "gastosMensuales": self.hogar.gastos,
                    "saldoRestante": self.hogar.saldoRestante,
                    "movimientos": self.obtener_resumen_categoria(self.hogar)
                },
                "otros": {
                    "presupuestoMensual": self.otros.presupuestoInicial,
                    "gastosMensuales": self.otros.gastos,
                    "saldoRestante": self.otros.saldoRestante,
                    "movimientos": self.obtener_resumen_categoria(self.otros)
                },
            },
            "alertas": self.Alertas()
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
        if not self.pila:
            raise Exception("No hay gastos para deshacer")
        
        _, categoria, monto, movimiento = self.pila.pop()

        categoria.gastos -= monto
        categoria.saldoRestante += monto
        self.gastosMensuales -= monto

        categoria.movimientos.remove(movimiento)
        self.historial.remove(movimiento)

        return movimiento 
    
    def obtener_gasto_por_id(self, gasto_id):
        # comparar por string para evitar problemas de tipo (int vs str)
        target = str(gasto_id)
        for movimiento in self.historial:
            try:
                if str(movimiento.get("id")) == target:
                    return movimiento
            except Exception:
                # seguir buscando si hay estructuras inesperadas
                continue
        return None