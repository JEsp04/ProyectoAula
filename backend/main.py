from menu import menu_principal
from storage import cargar_usuarios, guardar_usuarios

def main():
    usuarios = cargar_usuarios()
    menu_principal(usuarios)
    guardar_usuarios(usuarios)

if __name__ == "__main__":
    main()