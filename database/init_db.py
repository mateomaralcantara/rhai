from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base

from dotenv import load_dotenv
import os

load_dotenv()  # Carga el archivo .env

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
Base = declarative_base()

class Contacto(Base):
    __tablename__ = "contactos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, nullable=False)
    telefono = Column(String, nullable=True)
    mensaje = Column(String, nullable=True)

# Crear la tabla
Base.metadata.create_all(bind=engine)

print("✅ Tabla 'contactos' creada exitosamente.")
