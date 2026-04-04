# AI Resume Analyzer

A futuristic full-stack machine learning web application that analyzes resumes using NLP and predicts the most suitable job role and accordingly generates its ATS score.

## Features

- Upload PDF resumes
- Extract resume text automatically
- Predict suitable job role using ML
- ATS score generation
- Resume improvement suggestions
- Resume download report
- Modern glassmorphism UI
- Dark futuristic theme with neon lime accents
- FastAPI backend
- React frontend
- Swagger API testing support

---

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Lucide React

### Backend
- FastAPI
- Python
- Uvicorn
- pdfplumber

### Machine Learning
- Scikit-learn
- Pandas
- NumPy
- TF-IDF Vectorizer
- Logistic Regression

### Database
- MongoDB

---

## Folder Structure

AI Resume Analyzer/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── utils/
│   ├── ml/
│   ├── uploads/
│   ├── main.py
│   └── requirements.txt
│
├── .gitignore
└── README.md

---

## Installation

### Clone Repository

git clone https://github.com/yourusername/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer

---

## Backend Setup

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs on:
http://127.0.0.1:8000

Swagger docs:
http://127.0.0.1:8000/docs

---

## Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173

---

## Machine Learning Model

The model is trained using:

- Resume dataset from Kaggle
- TF-IDF Vectorizer
- Logistic Regression

Current model accuracy:
64.5%

---

## API Endpoints

GET /
POST /upload-resume

---

## Future Improvements

- User authentication
- Resume history
- Admin dashboard
- Job description matching

---

## UI Theme

- Background: #0A0A0A
- Primary Accent: #CCFF00
- Secondary Accent: #DFFF00
- Glassmorphism cards
- Futuristic neon design

---

## Author

Sampreet Ghosh

---

## License

This project is open-source and available under the MIT License.
