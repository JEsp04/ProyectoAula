import json # biblioteca para manejar archivos JSON
from usuario.usuario import Usuario # importamos la clase Usuario para crear y manejar usuarios


def guardar_usuarios(usuarios, archivo="usuarios.json"):
    #guarda la informacion de los usuarios en un archivo JSON
    #convierte cada usuario a un diccionario usando el metodo obtener_resumen y lo almacena en formato JSON
    # cada usuario se guarda con su nombre, ingreso mensual, categorias, presupuestos, gastos y movimientos
    data = []
    # convertimos cada usuario a un diccionario
    for u in usuarios:
        data.append(u.obtener_resumen())
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
        # abrimos el archivo JSON y cargamos los datos
        with open(archivo, "r", encoding="utf-8") as f:
            data = json.load(f)
            # reconstruimos cada usuario y sus categorias
            for u in data:
                # reconstruimos cada usuario y sus categorias
                usuario = Usuario(u["Nombre"], u["Ingreso Mensual"])
                # asignamos los presupuestos y movimientos guardados
                usuario.asignar_presupuesto(usuario.alimentacion, u["Categorias"]["Alimentacion"]["Presupuesto Mensual"])
                usuario.asignar_presupuesto(usuario.transporte, u["Categorias"]["Transporte"]["Presupuesto Mensual"])
                usuario.asignar_presupuesto(usuario.hogar, u["Categorias"]["Hogar"]["Presupuesto Mensual"])
                usuario.asignar_presupuesto(usuario.otros, u["Categorias"]["Otros"]["Presupuesto Mensual"])
                # reconstruimos los movimientos de cada categoria
                for categoria, obj in [
                    ("Alimentacion", usuario.alimentacion),
                    ("Transporte", usuario.transporte),
                    ("Hogar", usuario.hogar),
                    ("Otros", usuario.otros),
                ]:
                    for mov in u["Categorias"][categoria]["Movimientos"]:
                        usuario.registrar_gasto(obj, mov["monto"], mov["descripcion"])
                # añadimos el usuario a la lista
                usuarios.append(usuario)
    except FileNotFoundError: # si el archivo no existe, no se cargan usuarios
        pass
    return usuarios
