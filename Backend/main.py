from fastapi import FastAPI
from routes.resume import router as resume_router

app = FastAPI()

app.include_router(resume_router)

@app.get('/')
def home():
    return {"message": "Resume Analyzer Backend Running"}