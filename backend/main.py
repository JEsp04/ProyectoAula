from menu import menu_principal
from storage import cargar_usuarios, guardar_usuarios

def main():
    # funcion principal
    #1. cargar los usuarios desde el almacenamiento
    #2. Llamar el menu principal
    #3. Guardar los usuarios de nuevo en el almacenamiento al salir
    usuarios = cargar_usuarios()
    menu_principal(usuarios)
    guardar_usuarios(usuarios)
    
# Ejecutar la funcion principal si este archivo es el programa principal
if __name__ == "__main__":
    main()