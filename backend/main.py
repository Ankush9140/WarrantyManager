from fastapi import FastAPI
from controller.warranty_controller import router as warranty_router
from controller.auth_controller import router as auth_router
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="Warranty Management System")

origins = [
    "http://localhost:4200",   # Angular dev server
    "http://127.0.0.1:4200"    # sometimes Angular runs here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],            # allow all HTTP methods
    allow_headers=["*"],            # allow all headers
)

app.include_router(warranty_router, prefix="/v1/api/warranty", tags=["Warranty"])
app.include_router(auth_router, prefix="/v1/api", tags=["Authnetication"])

@app.get("/")
def home():
    return {"message": "Warranty Management API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1", 
        port=8000,         
        reload=True       
    )
