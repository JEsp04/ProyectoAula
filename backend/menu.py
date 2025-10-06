import json # importamos la libreria json para formatear la salida de los datos
from usuario.usuario import Usuario # importamos la clase Usuario desde el modulo usuario para crear y gestionar usuarios
usuarios = [] # lista global para almacenar los usuarios
def menu_principal(usuarios):
    # muestra al usuario menu principal que permite crear, seleccionar usuarios o salir
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
    # crea un nuevo usuario y lo añade a la lista de usuarios pidiendo nombre e ingreso mensual
        nombre = input("Ingrese el nombre del usuario: ")
        ingreso = float(input("Ingrese el ingreso mensual: "))
        # Crear una instancia de Usuario y agregarla a la lista
        usuario = Usuario(nombre, ingreso)
        usuarios.append(usuario)
        print(f"Usuario '{nombre}' creado con éxito.\n")

def seleccionar_usuario(usuarios):
    # permite seleccionar un usuario existente de la lista y acceder a su menu, en este punto nos ayudamos un poco con el
    # uso de ChatGPT para mejorar la experiencia del usuario    
    if not usuarios:
        print("No hay usuarios disponibles. Cree uno primero.")
        return
    # Mostrar la lista de usuarios
    print("Usuarios disponibles:")
    for i, u in enumerate(usuarios):
        print(f"{i + 1}. {u.nombre}")
    # Seleccionar un usuario por índice
    try:
        idx = int(input("Seleccione un usuario por número: ")) - 1
        if 0 <= idx < len(usuarios):  # Verificar que el índice es válido
            menu_usuario(usuarios[idx]) # Llamar al menú del usuario seleccionado
        else:
            print("Número de usuario inválido.")
    except ValueError:
        print("Entrada inválida. Debe ingresar un número.")

def menu_usuario(usuario):
    # muestra el menu para gestionar las categorias, presupuestos y gastos del usuario seleccionado
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
            print(json.dumps(usuario.obtener_resumen(), indent=4, ensure_ascii=False))# formateamos la salida en json para que sea mas legible, esta parte tambien sehizo con ayuda de IA
        elif opcion == 4:
            print(json.dumps(usuario.obtener_historial(), indent=4, ensure_ascii=False)) # formateamos la salida en json para que sea mas legible, esta parte tambien sehizo con ayuda de IA
        elif opcion == 5:
                usuario.deshacer_ultimo_gasto()
        elif opcion == 6:
            break
        else:
            print("Opción inválida, intente de nuevo.")

def asignar_presupuesto(usuario):
    # permite asignar presupuestos a las categorias del usuario seleccionado
        print(f"Saldo restante disponible para asignar: {usuario.saldoRestante}")
        for categoria, obj in [("Alimentación", usuario.alimentacion), 
                              ("Transporte", usuario.transporte),
                              ("Hogar", usuario.hogar),
                              ("Otros", usuario.otros)]:
            while True: # bucle para asegurar que el usuario ingresa un monto valido
                try:
                    monto = float(input(f"Presupuesto asignado para {categoria}: "))
                    usuario.asignar_presupuesto(obj, monto)
                    break
                except Exception as e:
                    print("Error:", e)
                    
def registrar_gasto(usuario):
    # permite registrar un gasto en una categoria especifica del usuario seleccionado
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
        if opcion in categorias: # verificamos que la opcion es valida
            categoria = categorias[opcion] # obtenemos el objeto categoria correspondiente
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
            