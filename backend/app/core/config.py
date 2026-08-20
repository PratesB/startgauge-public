from decouple import config



class Settings:
    # Database
    DATABASE_URL = config("DATABASE_URL", cast=str)

    # JWT
    SECRET_KEY = config("SECRET_KEY", cast=str)
    ALGORITHM = config("ALGORITHM", cast=str, default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES", cast=int, default=30)
    REFRESH_TOKEN_EXPIRE_DAYS = config("REFRESH_TOKEN_EXPIRE_DAYS", cast=int, default=7)

    # Redis
    REDIS_URL = config("REDIS_URL", cast=str)
    
    # Gemini AI
    GEMINI_API_KEY = config("GEMINI_API_KEY", cast=str)
    

settings = Settings()