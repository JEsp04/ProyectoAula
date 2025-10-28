import json # biblioteca para manejar archivos JSON
from backend.models.usuario import Usuario # importamos la clase Usuario para crear y manejar usuarios
from backend.models.categorias import Alimentacion, Transporte, Hogar, Otros

ARCHIVO_USUARIOS = "usuarios.json"

def guardar_usuarios(usuarios, archivo=ARCHIVO_USUARIOS):
    #guarda la informacion de los usuarios en un archivo JSON
    #convierte cada usuario a un diccionario usando el metodo obtener_resumen y lo almacena en formato JSON
    # cada usuario se guarda con su nombre, ingreso mensual, categorias, presupuestos, gastos y movimientos
    data = []
    # convertimos cada usuario a un diccionario
    for u in usuarios:
        data.append({
            "nombre": u.nombre,
            "email": u.email,
            "password_hash": u.password_hash,
            "ingreso_mensual": u.ingreso_mensual,
            "saldoRestante": u.saldoRestante,
            "gastosMensuales": u.gastosMensuales,
            "categorias": {
                "alimentacion": u.alimentacion.__dict__,
                "transporte": u.transporte.__dict__,
                "hogar": u.hogar.__dict__,
                "otros": u.otros.__dict__
            },
            "historial": u.historial
        })
        
        # guardamos el diccionario en un archivo JSON
    with open(archivo, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def cargar_usuarios(archivo="usuarios.json"):
    # carga la informacion de los usuarios desde un archivo JSON en el que se almaceno previamente
    #reconstruye cada usuario y sus categorias, presupuestos y movimientos guardados
    # devuelve una lista de objetos Usuario
    # En este puntos tambein optamos por guiarmnos con IA para el tema de los archvios JSON
    usuarios = []
    try:
        with open(archivo, "r", encoding="utf-8") as f:
            data = json.load(f)
            for u in data:
                usuario = Usuario(
                    nombre=u["nombre"],
                    email=u["email"],
                    ingreso_mensual=u["ingreso_mensual"],
                    password_hash=u["password_hash"]
                )

                # restauramos estado financiero
                usuario.saldoRestante = u["saldoRestante"]
                usuario.gastosMensuales = u["gastosMensuales"]

                # restaurar movimientos en categorías
                usuario.alimentacion.__dict__.update(u["categorias"]["alimentacion"])
                usuario.transporte.__dict__.update(u["categorias"]["transporte"])
                usuario.hogar.__dict__.update(u["categorias"]["hogar"])
                usuario.otros.__dict__.update(u["categorias"]["otros"])

                # historial general
                usuario.historial = u["historial"]

                usuarios.append(usuario)
    except FileNotFoundError:
        pass
    return usuarios
