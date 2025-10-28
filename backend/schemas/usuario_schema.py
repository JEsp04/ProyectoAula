from pydantic import BaseModel, EmailStr, Field

class UsuarioCreate(BaseModel):
    nombre: str = Field(..., min_length=2, description="Nombre del usuario")
    email: EmailStr
    password: str = Field(..., min_length=6, description="Contraseña en texto plano (será hasheada)")
    ingreso: float = Field(..., ge=0, description="Ingreso mensual del usuario")


class UsuarioResponse(BaseModel):
    nombre: str
    email: EmailStr
    ingreso: float
    saldoRestante: float
    gastosMensuales: float

    class Config:
        orm_mode = True
