from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.models import Contacto
from database.connection import SessionLocal  # ⬅️ Este import es esencial

router = APIRouter()

class ContactForm(BaseModel):
    nombre: str
    email: str
    telefono: str = ""
    mensaje: str = ""

@router.post("/api/enviar-contacto")
def enviar_contacto(form: ContactForm):
    try:
        db = SessionLocal()
        nuevo = Contacto(
            nombre=form.nombre,
            email=form.email,
            telefono=form.telefono,
            mensaje=form.mensaje
        )
        db.add(nuevo)
        db.commit()
        db.refresh(nuevo)
        db.close()
        return {"ok": True}
    except Exception as e:
        print("❌ Error al guardar:", e)
        raise HTTPException(status_code=500, detail="Error interno del servidor")
