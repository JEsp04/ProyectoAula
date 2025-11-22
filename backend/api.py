from fastapi import FastAPI, HTTPException
from backend.storage.storage import cargar_usuarios, guardar_usuarios
from backend.controllers.usuario_controller import UsuarioController
from backend.schemas.usuario_schema import UsuarioCreate, UsuarioLogin, PresupuestoAsignar, GastoRegistrar

from fastapi.middleware.cors import CORSMiddleware
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "4775a934038fca912d87691f6e73f87852b24e7d18627c25a48a89c670407d97" 
ALGORITHM = "HS256"

app = FastAPI(title="Gestor de Presupuestos - Proyecto Aula")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
ctrl = UsuarioController()
ctrl.usuarios = cargar_usuarios()


@app.get("/api")
def home():
    return {"message": "API funcionando correctamente ✅"}


@app.get("/api/usuarios/ObtenerTodos")
def get_usuarios():
    return [u.obtener_resumen() for u in ctrl.listar_usuarios()]


@app.get("/api/usuarios/ObtenerPor/{email}")
def get_usuario(email: str):
    usuario = ctrl.buscar_por_email(email)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario.obtener_resumen()


@app.post("/api/usuarios/register")
def post_usuario(data: UsuarioCreate):
    try:
        existente = ctrl.buscar_por_email(data.email)
        if existente:
            raise HTTPException(status_code=400, detail="El correo ya está registrado")
        
        nuevo = ctrl.crear_usuario(
            nombre=data.nombre,
            email=data.email,
            ingreso=data.ingreso_mensual,
            password=data.password
        )
        guardar_usuarios(ctrl.usuarios)
        token = jwt.encode({
            "email": nuevo.email,
            "exp": datetime.utcnow() + timedelta(hours=24)
        },
        SECRET_KEY,
        algorithm=ALGORITHM
        )
        return {"message": "Usuario creado exitosamente", 
                "usuario": nuevo.obtener_resumen(),
                "token": token
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/usuarios/login")
def login(data: UsuarioLogin):
    try:
        usuario = ctrl.buscar_por_email(data.email)
        if not usuario or not usuario.check_password(data.password):
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")

        token = jwt.encode({
            "email": usuario.email,
            "exp": datetime.utcnow() + timedelta(hours=24)
        },
        SECRET_KEY,
        algorithm=ALGORITHM
        )
        
        return {"message": "Inicio de sesión exitoso", 
                "usuario": usuario.obtener_resumen(),
                "token": token
                }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/usuarios/{email}/presupuesto")
def asignar_presupuesto(email: str, data: PresupuestoAsignar):
    """Asigna un presupuesto a una categoría del usuario"""
    usuario = ctrl.buscar_por_email(email)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Validar categoría
    categoria = data.categoria.lower()
    categorias_validas = {
        "alimentacion": usuario.alimentacion,
        "transporte": usuario.transporte,
        "hogar": usuario.hogar,
        "otros": usuario.otros
    }

    if categoria not in categorias_validas:
        raise HTTPException(status_code=400, detail="Categoría no válida. Usa: Alimentacion, Transporte, Hogar u Otros.")

    try:
        # Asigna el presupuesto
        usuario.asignar_presupuesto(categorias_validas[categoria], data.monto)
        guardar_usuarios(ctrl.usuarios)
        return {
            "message": f"Presupuesto asignado correctamente a {data.categoria}",
            "usuario": usuario.obtener_resumen()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post("/api/usuarios/{email}/gasto")
def registrar_gasto(email: str, data: GastoRegistrar):
    """Registra un gasto en una categoría específica del usuario"""
    usuario = ctrl.buscar_por_email(email)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    categoria_nombre = data.categoria.lower()
    categorias_validas = {
        "alimentacion": usuario.alimentacion,
        "transporte": usuario.transporte,
        "hogar": usuario.hogar,
        "otros": usuario.otros
    }

    if categoria_nombre not in categorias_validas:
        raise HTTPException(status_code=400, detail="Categoría no válida. Usa: Alimentacion, Transporte, Hogar u Otros.")

    categoria = categorias_validas[categoria_nombre]

    try:
        movimiento = usuario.registrar_gasto(categoria, data.monto, data.descripcion)
        guardar_usuarios(ctrl.usuarios)
        return {
            "message": f"Gasto registrado correctamente en {data.categoria}",
            "movimiento": movimiento,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.delete("/api/usuarios/{email}/gasto/{id}")
def eliminar_gasto(email: str, id: str):
    """Elimina un gasto del historial del usuario. El id del gasto puede ser string (uuid)."""
    usuario = ctrl.buscar_por_email(email)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    try:
        # usar el método del modelo que revierte totales y elimina el movimiento
        movimiento = usuario.eliminar_gasto_por_id(id)
        if not movimiento:
            try:
                existing = [m.get("id") for m in usuario.historial]
            except Exception:
                existing = []
            print(f"[eliminar_gasto] id solicitado={id} - ids disponibles={existing}")
            raise HTTPException(status_code=404, detail="Gasto no encontrado")

        guardar_usuarios(ctrl.usuarios)
        return {
            "message": "Gasto eliminado correctamente",
            "movimiento": movimiento
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    