from fastapi import FastAPI, HTTPException
from backend.storage.storage import cargar_usuarios, guardar_usuarios
from backend.controllers.usuario_controller import UsuarioController
from backend.schemas.usuario_schema import UsuarioCreate

app = FastAPI(title="Gestor de Presupuestos - Proyecto Aula")

ctrl = UsuarioController()
ctrl.usuarios = cargar_usuarios()


@app.get("/")
def home():
    return {"message": "API funcionando correctamente ✅"}


@app.get("/usuarios")
def get_usuarios():
    return [u.obtener_resumen() for u in ctrl.listar_usuarios()]


@app.get("/usuarios/{email}")
def get_usuario(email: str):
    usuario = ctrl.buscar_por_email(email)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario.obtener_resumen()


@app.post("/usuarios")
def post_usuario(data: UsuarioCreate):
    try:
        nuevo = ctrl.crear_usuario(
            nombre=data.nombre,
            email=data.email,
            ingreso=data.ingreso,
            password=data.password
        )
        guardar_usuarios(ctrl.usuarios)
        return {"message": "Usuario creado exitosamente", "usuario": nuevo.obtener_resumen()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
