from fastapi import APIRouter



router = APIRouter()



@router.get("/test")
async def test_users_route():
    return {"message": "Users router is ok"}
