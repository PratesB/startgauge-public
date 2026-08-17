from fastapi import FastAPI
from app.api.v1.api import router as api_vi_router


app = FastAPI()


# Routers
app.include_router(api_vi_router, prefix="/api/v1")