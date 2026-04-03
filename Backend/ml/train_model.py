import pandas as pd
import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_absolute_error
import joblib

df = pd.read_csv('resume_dataset.csv')
df = df.dropna(subset=['Resume_str', 'Category'])
X_text = df['Resume_str'].astype(str)
y_role = df['Category']

# ── SKILL LIST ────────────────────────────────────────────────
SKILLS_LIST = [
    "python", "java", "javascript", "react", "node.js", "sql", "mongodb",
    "fastapi", "flask", "django", "machine learning", "deep learning",
    "nlp", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    "docker", "kubernetes", "aws", "git", "html", "css", "typescript",
    "c++", "c#", "golang", "rust", "figma", "tableau", "power bi",
    "excel", "data analysis", "data science", "devops", "linux", "rest api"
]

# ── GENERATE ATS SCORES FOR TRAINING DATA ────────────────────
def generate_ats_score(text):
    score = 0
    text_lower = text.lower()
    word_count = len(text.split())

    # Skills (max 40)
    found_skills = [s for s in SKILLS_LIST if s in text_lower]
    skill_count = len(found_skills)
    if skill_count >= 10: skill_score = 40
    elif skill_count >= 7: skill_score = 30
    elif skill_count >= 4: skill_score = 20
    elif skill_count >= 2: skill_score = 10
    else: skill_score = 0
    score += skill_score

    # Experience (max 20)
    exp_strong = ["internship", "intern at", "worked at", "software engineer",
                  "developer at", "analyst at", "manager at", "associate at"]
    exp_medium = ["experience", "role", "position", "employed", "company"]
    strong_hits = sum(1 for k in exp_strong if k in text_lower)
    medium_hits = sum(1 for k in exp_medium if k in text_lower)
    if strong_hits >= 2: exp_score = 20
    elif strong_hits == 1: exp_score = 14
    elif medium_hits >= 3: exp_score = 8
    elif medium_hits >= 1: exp_score = 4
    else: exp_score = 0
    score += exp_score

    # Projects (max 20)
    proj_hits = len(re.findall(r'(project|built|developed|created|implemented|designed)', text_lower))
    if proj_hits >= 6: proj_score = 20
    elif proj_hits >= 4: proj_score = 15
    elif proj_hits >= 2: proj_score = 10
    elif proj_hits >= 1: proj_score = 5
    else: proj_score = 0
    score += proj_score

    # Education (max 10)
    degree_kw = ["b.tech", "b.e", "bachelor", "master", "m.tech", "mba", "phd", "b.sc", "m.sc"]
    inst_kw = ["university", "institute", "iit", "nit", "college of engineering"]
    has_degree = any(k in text_lower for k in degree_kw)
    has_inst = any(k in text_lower for k in inst_kw)
    if has_degree and has_inst: edu_score = 10
    elif has_degree or has_inst: edu_score = 5
    else: edu_score = 0
    score += edu_score

    # Certifications (max 10)
    cert_kw = ["certification", "certified", "certificate", "aws certified",
               "google certified", "coursera", "udemy", "nptel", "hackerrank"]
    cert_hits = sum(1 for k in cert_kw if k in text_lower)
    if cert_hits >= 3: cert_score = 10
    elif cert_hits >= 2: cert_score = 7
    elif cert_hits == 1: cert_score = 4
    else: cert_score = 0
    score += cert_score

    # Penalties
    if word_count < 150: score = max(0, score - 15)
    elif word_count < 300: score = max(0, score - 8)
    if '@' not in text: score = max(0, score - 5)
    if not re.search(r'\d{10}|\d{3}[-.\s]\d{3}', text): score = max(0, score - 3)

    return min(score, 100)

# Generate ATS scores for entire dataset
print("Generating ATS scores for training data...")
y_ats = X_text.apply(generate_ats_score)
print(f"ATS score range: {y_ats.min()} - {y_ats.max()}, mean: {y_ats.mean():.1f}")

# ── VECTORIZER (shared for both models) ──────────────────────
print("Training TF-IDF vectorizer...")
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
X_vec = vectorizer.fit_transform(X_text)

# ── MODEL 1: ROLE CLASSIFIER ──────────────────────────────────
print("Training role classifier...")
X_train, X_test, y_train, y_test = train_test_split(
    X_vec, y_role, test_size=0.2, random_state=42
)
role_model = LogisticRegression(max_iter=1000)
role_model.fit(X_train, y_train)
role_preds = role_model.predict(X_test)
print(f"Role classifier accuracy: {accuracy_score(y_test, role_preds):.3f}")

# ── MODEL 2: ATS SCORE REGRESSOR ─────────────────────────────
print("Training ATS score regressor...")
X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(
    X_vec, y_ats, test_size=0.2, random_state=42
)

# Try both Ridge and RandomForest, keep the better one
ridge = Ridge(alpha=1.0)
ridge.fit(X_train_r, y_train_r)
ridge_preds = ridge.predict(X_test_r)
ridge_mae = mean_absolute_error(y_test_r, ridge_preds)

rf = RandomForestRegressor(n_estimators=20, random_state=42, n_jobs=-1)
rf.fit(X_train_r, y_train_r)
rf_preds = rf.predict(X_test_r)
rf_mae = mean_absolute_error(y_test_r, rf_preds)

print(f"Ridge MAE: {ridge_mae:.2f}")
print(f"Random Forest MAE: {rf_mae:.2f}")

ats_model = rf if rf_mae < ridge_mae else ridge
best_name = "Random Forest" if rf_mae < ridge_mae else "Ridge"
print(f"Using: {best_name}")

# ── SAVE ALL MODELS ───────────────────────────────────────────
joblib.dump(role_model, 'model.pkl')
joblib.dump(ats_model, 'ats_model.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')

print("\nAll models saved:")
print("  model.pkl       → role classifier")
print("  ats_model.pkl   → ATS score regressor")
print("  vectorizer.pkl  → shared TF-IDF vectorizer")