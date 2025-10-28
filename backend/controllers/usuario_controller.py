from backend.models.usuario import Usuario

class UsuarioController:
    def __init__(self):
        self.usuarios = []  # aquí se mantienen en memoria (luego storage los carga/guarda)

    def listar_usuarios(self):
        """Retorna la lista completa de usuarios"""
        return self.usuarios

    def buscar_por_email(self, email: str):
        """Busca un usuario por email (insensible a mayúsculas)"""
        email = email.lower()
        for usuario in self.usuarios:
            if usuario.email == email:
                return usuario
        return None

    def crear_usuario(self, nombre: str, email: str, ingreso: float, password: str):
        """Crea un nuevo usuario si no existe otro con el mismo email"""

        # validar email duplicado
        if self.buscar_por_email(email) is not None:
            raise Exception("Ya existe un usuario registrado con este email.")

        # Crear el usuario (sin password primero)
        usuario = Usuario(nombre=nombre, email=email, ingreso_mensual=ingreso)

        # Establecer contraseña (hash bcrypt)
        usuario.set_password(password)

        # Guardarlo en la lista local del controller
        self.usuarios.append(usuario)

        return usuario

    def login(self, email: str, password: str):
        """Valida credenciales de usuario"""
        usuario = self.buscar_por_email(email)
        if usuario is None:
            raise Exception("Email no registrado.")
        
        if not usuario.check_password(password):
            raise Exception("Contraseña incorrecta.")

        return usuario
