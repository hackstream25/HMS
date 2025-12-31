from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class SignupRequest(BaseModel):
    leaderName: str
    email: str
    contactNumber: str
    college: str
    password: str
    confirmPassword: str

# Test signup API
@app.post("/")
def signup(user: SignupRequest):
    # Password validation
    if user.password != user.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    
    return {
        "status": "success",
        "message": "Data received and validated",
        "data": {
            "leaderName": user.leaderName,
            "email": user.email,
            "contactNumber": user.contactNumber,
            "college": user.college,
            
        }
    }