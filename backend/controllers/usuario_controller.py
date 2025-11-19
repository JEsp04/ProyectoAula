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
        
        # Validar ingreso positivo
        if ingreso <= 0:
            raise Exception("El ingreso mensual debe ser mayor a cero.")

        # validar email duplicado
        if self.buscar_por_email(email) is not None:
            raise Exception("Ya existe un usuario registrado con este email.")

        # Crear el usuario (sin password primero)
        usuario = Usuario(nombre=nombre, email=email.lower(), ingreso_mensual=ingreso)

        # Establecer contraseña (hash bcrypt)
        usuario.set_password(password)

        # Guardarlo en la lista local del controller
        self.usuarios.append(usuario)

        return usuario

    def login(self, email: str, password: str):
        """Valida credenciales de usuario"""
        usuario = self.buscar_por_email(email)
        if not usuario:
            raise Exception("Email no registrado.")
        if not usuario.check_password(password):
            raise Exception("Contraseña incorrecta.")

        return usuario

    def actualizar_ingreso(self, email: str, nuevo_ingreso: float):
        """Actualiza el ingreso mensual de un usuario"""
        usuario = self.buscar_por_email(email)
        if not usuario:
            raise Exception("Usuario no encontrado.")
        
        if nuevo_ingreso <= 0:
            raise Exception("El ingreso mensual debe ser mayor a cero.")

        usuario.ingreso_mensual = nuevo_ingreso
        return usuario

    def asignar_presupuesto(self, email: str, categoria_nombre: str, monto: float):
        """Asigna un presupuesto a una categoría para un usuario"""
        usuario = self.buscar_por_email(email)
        if not usuario:
            raise Exception("Usuario no encontrado.")

        # Asume que las categorías tienen nombres de atributos como 'alimentacion', 'transporte', etc.
        categoria_attr = categoria_nombre.lower()
        if hasattr(usuario, categoria_attr):
            categoria_obj = getattr(usuario, categoria_attr)
            usuario.asignar_presupuesto(categoria_obj, monto)
            return usuario
        else:
            raise Exception(f"Categoría '{categoria_nombre}' no válida.")
