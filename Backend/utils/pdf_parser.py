import pdfplumber
import re

SKILLS_LIST = [
    "python", "java", "javascript", "react", "node.js", "sql", "mongodb",
    "fastapi", "flask", "django", "machine learning", "deep learning",
    "nlp", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    "docker", "kubernetes", "aws", "git", "html", "css", "typescript",
    "c++", "c#", "golang", "rust", "figma", "tableau", "power bi",
    "excel", "data analysis", "data science", "devops", "linux", "rest api"
]

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages[:5]:  # max 5 pages
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"PDF error: {e}")
        return ""
    return text

def extract_skills(text):
    text_lower = text.lower()
    found = [skill for skill in SKILLS_LIST if skill in text_lower]
    return list(set(found))

def calculate_ats_breakdown(text, skills_found, ml_score):
    """
    Distribute the ML-predicted score across categories
    proportionally based on what's actually found in the resume.
    """
    text_lower = text.lower()

    # Calculate raw weights for each category
    weights = {}

    # Skills weight (max 40)
    skill_count = len(skills_found)
    if skill_count >= 10: weights["Skills"] = 40
    elif skill_count >= 7: weights["Skills"] = 30
    elif skill_count >= 4: weights["Skills"] = 20
    elif skill_count >= 2: weights["Skills"] = 10
    else: weights["Skills"] = 0

    # Experience weight (max 20)
    exp_strong = ["internship", "intern at", "worked at", "software engineer",
                  "developer at", "analyst at", "associate at"]
    exp_medium = ["experience", "role", "position", "employed", "company"]
    strong_hits = sum(1 for k in exp_strong if k in text_lower)
    medium_hits = sum(1 for k in exp_medium if k in text_lower)
    if strong_hits >= 2: weights["Experience"] = 20
    elif strong_hits == 1: weights["Experience"] = 14
    elif medium_hits >= 3: weights["Experience"] = 8
    elif medium_hits >= 1: weights["Experience"] = 4
    else: weights["Experience"] = 0

    # Projects weight (max 20)
    import re
    proj_hits = len(re.findall(
        r'(project|built|developed|created|implemented|designed)', text_lower))
    if proj_hits >= 6: weights["Projects"] = 20
    elif proj_hits >= 4: weights["Projects"] = 15
    elif proj_hits >= 2: weights["Projects"] = 10
    elif proj_hits >= 1: weights["Projects"] = 5
    else: weights["Projects"] = 0

    # Education weight (max 10)
    degree_kw = ["b.tech", "b.e", "bachelor", "master", "m.tech", "mba", "phd", "b.sc", "m.sc"]
    inst_kw = ["university", "institute", "iit", "nit", "college of engineering"]
    has_degree = any(k in text_lower for k in degree_kw)
    has_inst = any(k in text_lower for k in inst_kw)
    if has_degree and has_inst: weights["Education"] = 10
    elif has_degree or has_inst: weights["Education"] = 5
    else: weights["Education"] = 0

    # Certifications weight (max 10)
    cert_kw = ["certification", "certified", "certificate", "aws certified",
               "google certified", "coursera", "udemy", "nptel", "hackerrank"]
    cert_hits = sum(1 for k in cert_kw if k in text_lower)
    if cert_hits >= 3: weights["Certifications"] = 10
    elif cert_hits >= 2: weights["Certifications"] = 7
    elif cert_hits == 1: weights["Certifications"] = 4
    else: weights["Certifications"] = 0

    # Now scale all weights so they sum to ml_score
    raw_total = sum(weights.values())

    if raw_total == 0:
        # fallback — distribute ml_score equally
        per = ml_score // 5
        return {k: per for k in weights}

    scale = ml_score / raw_total
    breakdown = {}
    distributed = 0
    items = list(weights.items())

    for i, (k, v) in enumerate(items):
        if i == len(items) - 1:
            # last item gets remainder to avoid rounding errors
            breakdown[k] = ml_score - distributed
        else:
            scaled = round(v * scale)
            breakdown[k] = scaled
            distributed += scaled

    # Clamp each to its max
    maxes = {"Skills": 40, "Experience": 20, "Projects": 20, "Education": 10, "Certifications": 10}
    for k in breakdown:
        breakdown[k] = max(0, min(breakdown[k], maxes.get(k, 20)))

    return breakdown

def get_missing_skills(skills_found, predicted_role):
    role_skills_map = {
        "Data Scientist": ["python", "machine learning", "tensorflow", "pandas", "sql", "deep learning"],
        "Web Developer": ["html", "css", "javascript", "react", "node.js", "rest api"],
        "Java Developer": ["java", "spring", "sql", "git", "docker"],
        "Python Developer": ["python", "django", "flask", "sql", "git", "docker"],
        "DevOps Engineer": ["docker", "kubernetes", "aws", "linux", "git", "ci/cd"],
        "Android Developer": ["java", "kotlin", "android", "git", "sql"],
        "HR": ["communication", "recruitment", "excel", "hrms"],
        "Business Analyst": ["excel", "tableau", "sql", "data analysis", "power bi"],
    }
    required = role_skills_map.get(predicted_role, [])
    missing = [s for s in required if s not in skills_found]
    return missing

def get_suggestions(ats_score, missing_skills, breakdown):
    suggestions = []
    if breakdown.get("Experience", 0) == 0:
        suggestions.append("Add internship or work experience to your resume.")
    if breakdown.get("Projects", 0) < 10:
        suggestions.append("Include more projects with descriptions of what you built.")
    if breakdown.get("Certifications", 0) == 0:
        suggestions.append("Add certifications or online courses you have completed.")
    if len(missing_skills) > 0:
        suggestions.append(f"Learn missing skills: {', '.join(missing_skills[:3])}.")
    if ats_score < 50:
        suggestions.append("Use more relevant keywords so ATS systems can detect your profile.")
    if not suggestions:
        suggestions.append("Great resume! Keep it updated with latest projects and skills.")
    return suggestions