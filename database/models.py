from sqlalchemy import Column, Integer, String
from database.connection import Base

class Contacto(Base):
    __tablename__ = "contactos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    email = Column(String)
    telefono = Column(String)
    mensaje = Column(String)
