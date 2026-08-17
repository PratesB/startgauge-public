from fastapi import APIRouter

router = APIRouter()




# TODO: Test Endpoint
@router.get("/")
def read_users():
    return {"message": "Users endpoint GET for test"}

