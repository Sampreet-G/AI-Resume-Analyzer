from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import shutil, os, joblib, traceback
from utils.pdf_parser import (
    extract_text_from_pdf, extract_skills,
    calculate_ats_breakdown, get_missing_skills,
    get_suggestions
)

router = APIRouter()

# Load models with error handling
try:
    role_model = joblib.load('ml/model.pkl')
    print("✓ role_model loaded")
except Exception as e:
    print(f"✗ role_model FAILED: {e}")
    role_model = None

try:
    ats_model = joblib.load('ml/ats_model.pkl')
    print("✓ ats_model loaded")
except Exception as e:
    print(f"✗ ats_model FAILED: {e}")
    ats_model = None

try:
    vectorizer = joblib.load('ml/vectorizer.pkl')
    print("✓ vectorizer loaded")
except Exception as e:
    print(f"✗ vectorizer FAILED: {e}")
    vectorizer = None

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post('/upload-resume')
async def upload_resume(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, 'wb') as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"✓ File saved: {file.filename}")

        extracted_text = extract_text_from_pdf(file_path)
        print(f"✓ Text extracted: {len(extracted_text)} chars")

        skills_found = extract_skills(extracted_text)
        print(f"✓ Skills found: {skills_found}")

        vec = vectorizer.transform([extracted_text])
        print("✓ Vectorized")

        predicted_role = role_model.predict(vec)[0]
        print(f"✓ Role predicted: {predicted_role}")

        ml_ats_score = int(round(float(ats_model.predict(vec)[0])))
        ml_ats_score = max(0, min(100, ml_ats_score))

        # Pass ml_score so breakdown is consistent with it
        breakdown = calculate_ats_breakdown(extracted_text, skills_found, ml_ats_score)
        missing_skills = get_missing_skills(skills_found, predicted_role)
        suggestions = get_suggestions(ml_ats_score, missing_skills, breakdown)

        return {
            "filename":       file.filename,
            "predicted_role": predicted_role,
            "resume_text":    extracted_text[:1000],
            "ats_score":      ml_ats_score,
            "breakdown":      breakdown,
            "skills_found":   skills_found,
            "missing_skills": missing_skills,
            "suggestions":    suggestions
        }

    except Exception as e:
        print(f"✗ ERROR: {traceback.format_exc()}")
        return JSONResponse(status_code=500, content={"detail": str(e)})