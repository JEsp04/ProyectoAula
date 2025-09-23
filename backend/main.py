from menu import menu_principal
from storage import cargar_usuarios, guardar_usuarios

usuarios = cargar_usuarios()


menu_principal(usuarios)


guardar_usuarios(usuarios)
