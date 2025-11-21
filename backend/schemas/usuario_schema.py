from pydantic import BaseModel, EmailStr, Field

class UsuarioCreate(BaseModel):
    nombre: str = Field(..., min_length=2, description="Nombre del usuario")
    email: EmailStr
    ingreso_mensual: float = Field(..., description="Ingreso mensual del usuario")
    password: str = Field(..., min_length=6, description="Contraseña en texto plano (será hasheada)")

class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True

class UsuarioUpdateIngreso(BaseModel):
    ingreso_mensual: float = Field(..., gt=0, description="Nuevo ingreso mensual del usuario")


class PresupuestoAsignar(BaseModel):
    categoria: str = Field(..., description="Nombre de la categoría: Alimentacion, Transporte, Hogar u Otros")
    monto: float = Field(..., gt=0, description="Monto del presupuesto a asignar (mayor que 0)")


class GastoRegistrar(BaseModel):
    categoria: str = Field(..., description="Categoría donde se registrará el gasto: Alimentacion, Transporte, Hogar u Otros")
    monto: float = Field(..., gt=0, description="Monto del gasto")
    descripcion: str = Field("", description="Descripción opcional del gasto")