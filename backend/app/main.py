from fastapi import FastAPI
from app.api.main import api_router
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings


app = FastAPI()


# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],   
    allow_credentials=True,                  
    allow_methods=["*"],                     
    allow_headers=["*"],                   
)


# Routers
app.include_router(api_router, prefix="/api/v1") 