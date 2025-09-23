import json
from usuario.usuario import Usuario


def guardar_usuarios(usuarios, archivo="usuarios.json"):
    data = []
    for u in usuarios:
        data.append(u.obtener_resumen())
    with open(archivo, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def cargar_usuarios(archivo="usuarios.json"):
    usuarios = []
    try:
        with open(archivo, "r", encoding="utf-8") as f:
            data = json.load(f)
            for u in data:
                usuario = Usuario(u["Nombre"], u["Ingreso Mensual"])
                
                usuario.asignar_presupuesto(usuario.alimentacion, u["Categorias"]["Alimentacion"]["Presupuesto Mensual"])
                usuario.asignar_presupuesto(usuario.transporte, u["Categorias"]["Transporte"]["Presupuesto Mensual"])
                usuario.asignar_presupuesto(usuario.hogar, u["Categorias"]["Hogar"]["Presupuesto Mensual"])
                usuario.asignar_presupuesto(usuario.otros, u["Categorias"]["Otros"]["Presupuesto Mensual"])
                
                for categoria, obj in [
                    ("Alimentacion", usuario.alimentacion),
                    ("Transporte", usuario.transporte),
                    ("Hogar", usuario.hogar),
                    ("Otros", usuario.otros),
                ]:
                    for mov in u["Categorias"][categoria]["Movimientos"]:
                        usuario.registrar_gasto(obj, mov["monto"], mov["descripcion"])
                
                usuarios.append(usuario)
    except FileNotFoundError:
        pass
    return usuarios
