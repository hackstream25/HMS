import os
import shutil
import subprocess
import uuid
from db import get_db_connection   # <-- must exist in your project

# -------- CONFIG --------

BASE_DIR = "plagiarism_workspace"
SIMILARITY_THRESHOLD = 60

IGNORE_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "build",
    "venv",
    "__pycache__",
    ".next"
}

CODE_EXTENSIONS = (".py", ".js", ".jsx", ".ts", ".java")

os.makedirs(BASE_DIR, exist_ok=True)

# -------- HELPERS --------

def clone_repo(repo_url):
    repo_id = str(uuid.uuid4())
    repo_path = os.path.join(BASE_DIR, repo_id)

    subprocess.run(
        ["git", "clone", "--depth=1", repo_url, repo_path],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=True
    )

    return repo_path


def clean_repo(path):
    for root, dirs, _ in os.walk(path):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]


def extract_code(path):
    code = ""
    for root, _, files in os.walk(path):
        for file in files:
            if file.endswith(CODE_EXTENSIONS):
                try:
                    with open(
                        os.path.join(root, file),
                        "r",
                        encoding="utf-8",
                        errors="ignore"
                    ) as f:
                        code += f.read() + " "
                except:
                    pass
    return code


def similarity(code_a, code_b):
    set_a = set(code_a.split())
    set_b = set(code_b.split())

    if not set_a or not set_b:
        return 0

    return int((len(set_a & set_b) / len(set_a | set_b)) * 100)

# -------- CORE FUNCTION --------

def run_plagiarism_check(submission_id):
    """
    Fetches github_link from MySQL using submission ID
    Compares against other submissions
    Returns similarity result (no DB write)
    """

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Get current submission
    cursor.execute(
        """
        SELECT id, teamid, github_link
        FROM submissions
        WHERE id = %s
        """,
        (submission_id,)
    )
    current = cursor.fetchone()

    if not current or not current["github_link"]:
        cursor.close()
        conn.close()
        return {"error": "GitHub link not found for this submission"}

    current_path = clone_repo(current["github_link"])
    clean_repo(current_path)
    current_code = extract_code(current_path)

    max_similarity = 0
    matched_team = None

    # Compare with other submissions
    cursor.execute(
        """
        SELECT id, teamid, github_link
        FROM submissions
        WHERE id != %s AND github_link IS NOT NULL
        """,
        (submission_id,)
    )
    others = cursor.fetchall()

    for sub in others:
        try:
            other_path = clone_repo(sub["github_link"])
            clean_repo(other_path)
            other_code = extract_code(other_path)

            score = similarity(current_code, other_code)

            if score > max_similarity:
                max_similarity = score
                matched_team = sub["teamid"]

            shutil.rmtree(other_path, ignore_errors=True)
        except:
            continue

    shutil.rmtree(current_path, ignore_errors=True)

    cursor.close()
    conn.close()

    return {
        "submission_id": submission_id,
        "similarity_percentage": max_similarity,
        "flagged": max_similarity >= SIMILARITY_THRESHOLD,
        "matched_with_team": matched_team
    }