from fastapi import FastAPI
from routes import contacto

app = FastAPI()
app.include_router(contacto.router)
