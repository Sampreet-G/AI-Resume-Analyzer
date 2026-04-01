from fastapi import APIRouter, UploadFile, File
import shutil
import os
import joblib
from utils.pdf_parser import extract_text_from_pdf

router = APIRouter()

model = joblib.load('ml/model.pkl')
vectorizer = joblib.load('ml/vectorizer.pkl')

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post('/upload-resume')
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_pdf(file_path)

    transformed_text = vectorizer.transform([extracted_text])
    prediction = model.predict(transformed_text)[0]

    return {
        "filename": file.filename,
        "predicted_role": prediction,
        "resume_text": extracted_text[:1000]
    }