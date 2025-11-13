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
    try:
        with open(archivo, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Usuario(s) guardado(s) correctamente en {archivo}")
    except Exception as e:
        print(f"Error al guardar usuarios: {e}")

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
                ingreso_mensual=u.get("ingreso_mensual", 0.0),
                password_hash=u.get("password_hash", "")
            )

            # Restaurar estado financiero
            usuario.saldoRestante = u.get("saldoRestante", 0.0)
            usuario.gastosMensuales = u.get("gastosMensuales", 0.0)

            # Restaurar categorías (si no existen, crear nuevas)
            usuario.alimentacion = Alimentacion()
            usuario.alimentacion.__dict__.update(u["categorias"].get("alimentacion", {}))

            usuario.transporte = Transporte()
            usuario.transporte.__dict__.update(u["categorias"].get("transporte", {}))

            usuario.hogar = Hogar()
            usuario.hogar.__dict__.update(u["categorias"].get("hogar", {}))

            usuario.otros = Otros()
            usuario.otros.__dict__.update(u["categorias"].get("otros", {}))

            # Restaurar historial (si existe)
            usuario.historial = u.get("historial", [])

            usuarios.append(usuario)

        print(f"usuario(s) cargado(s) desde {archivo}")

    except FileNotFoundError:
        print(f"Archivo {archivo} no encontrado. Se iniciará con lista vacía.")
    except json.JSONDecodeError:
        print(f"Error: el archivo {archivo} está corrupto o tiene formato inválido.")
    except Exception as e:
        print(f"Error inesperado al cargar usuarios: {e}")

    return usuarios
