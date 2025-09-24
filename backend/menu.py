import json
from usuario.usuario import Usuario
usuarios = []
def menu_principal(usuarios):
    while True:
        print("\nMenú Principal:")
        print("1. Crear usuario")
        print("2. Seleccionar usuario existente")
        print("3. Salir")
        opcion = input("Elija una opción: ")
        if opcion == '1':
            crear_usuario(usuarios)
        elif opcion == '2':
            seleccionar_usuario(usuarios)
        elif opcion == '3':
            break
        else:
            print("Opción inválida, intente de nuevo.")

def crear_usuario(usuarios):
        nombre = input("Ingrese el nombre del usuario: ")
        ingreso = float(input("Ingrese el ingreso mensual: "))
        usuario = Usuario(nombre, ingreso)
        usuarios.append(usuario)
        print(f"Usuario '{nombre}' creado con éxito.\n")

def seleccionar_usuario(usuarios):
    if not usuarios:
        print("No hay usuarios disponibles. Cree uno primero.")
        return
    
    print("Usuarios disponibles:")
    for i, u in enumerate(usuarios):
        print(f"{i + 1}. {u.nombre}")

    try:
        idx = int(input("Seleccione un usuario por número: ")) - 1
        if 0 <= idx < len(usuarios):
            menu_usuario(usuarios[idx])
        else:
            print("Número de usuario inválido.")
    except ValueError:
        print("Entrada inválida. Debe ingresar un número.")

def menu_usuario(usuario):
    while True:
        print(f"\nMenú de Usuario - {usuario.nombre}:")
        print("1. Asignar presupuestos")
        print("2. Registrar gasto")
        print("3. Ver resumen")
        print("4. Ver historial de gastos")
        print("5. Deshacer último gasto")
        print("6. Volver al menú principal")
        opcion = int(input("Elija una opción: "))
        if opcion == 1:
            asignar_presupuesto(usuario)
        elif opcion == 2:
            registrar_gasto(usuario)
        elif opcion == 3:
            print(json.dumps(usuario.obtener_resumen(), indent=4, ensure_ascii=False))
        elif opcion == 4:
            print(json.dumps(usuario.obtener_historial(), indent=4, ensure_ascii=False))
        elif opcion == 5:
                usuario.deshacer_ultimo_gasto()
        elif opcion == 6:
            break
        else:
            print("Opción inválida, intente de nuevo.")

def asignar_presupuesto(usuario):
        print(f"Saldo restante disponible para asignar: {usuario.saldoRestante}")
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
                    
def registrar_gasto(usuario):
        categorias = {
            '1': usuario.alimentacion,
            '2': usuario.transporte,
            '3': usuario.hogar,
            '4': usuario.otros
        }
        print("Seleccione categoría del gasto:")
        print("1. Alimentación")
        print("2. Transporte")
        print("3. Hogar")
        print("4. Otros")
        opcion = input("Elija una opción: ")
        if opcion in categorias:
            categoria = categorias[opcion]
            try:
                print(f"Saldo restante en {categoria.nombre}: {categoria.saldoRestante}")
                monto = float(input("Ingrese el monto del gasto: "))
                descripcion = input("Ingrese una descripción (opcional): ")
                usuario.registrar_gasto(categoria, monto, descripcion)
                print("Gasto registrado con éxito.")
            except Exception as e:
                print("Error:", e)
        else:
            print("Opción inválida, intente de nuevo.")
            