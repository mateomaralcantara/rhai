import sys
import os

# Asegura que el path raíz esté en el sys.path para importar correctamente
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from backend.database.connection import engine, Base
from backend.database.models import Contacto

# Eliminar la tabla
Base.metadata.drop_all(bind=engine)
print("❌ Tabla 'contactos' eliminada.")
