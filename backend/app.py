import sqlite3
import os
from datetime import timedelta
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from werkzeug.security import generate_password_hash, check_password_hash

# ── App setup ──────────────────────────────────────────────────
app = Flask(__name__)

# Origins that are allowed to call the API.
# Override with CORS_ORIGINS env var (comma-separated) in production.
_default_origins = "http://localhost:3000,https://blog-five-xi-40.vercel.app"
_cors_origins = os.environ.get("CORS_ORIGINS", _default_origins).split(",")

CORS(
    app,
    resources={r"/api/*": {
        "origins": _cors_origins,
        # Preflight must echo these or the browser blocks the real request
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Authorization"],
        "supports_credentials": False,
        # Cache preflight response for 10 minutes to reduce extra round-trips
        "max_age": 600,
    }},
    # Also handle OPTIONS auto-reply at the app level
    automatic_options=True,
)

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "blogspace-dev-secret-change-in-prod")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)

jwt = JWTManager(app)


# ── CORS safety-net ────────────────────────────────────────────
# flask-cors handles most cases; this hook guarantees headers are
# present even on error responses so the browser preflight passes.
@app.after_request
def _add_cors_headers(response):
    origin = request.headers.get("Origin", "")
    if origin in _cors_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Max-Age"] = "600"
    return response

# ── Database helpers ───────────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "blogspace.db")


def get_db():
    """Return a per-request SQLite connection."""
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(exc=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    """Create tables if they don't exist."""
    with app.app_context():
        db = get_db()
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                name     TEXT    NOT NULL,
                email    TEXT    NOT NULL UNIQUE,
                password TEXT    NOT NULL,
                created_at TEXT  DEFAULT (datetime('now'))
            )
            """
        )
        db.commit()


# ── Auth routes ────────────────────────────────────────────────
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    # Validate
    if not name:
        return jsonify({"error": "Name is required"}), 400
    if not email or "@" not in email:
        return jsonify({"error": "Valid email is required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    db = get_db()

    # Check duplicate
    existing = db.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        return jsonify({"error": "An account with this email already exists"}), 409

    # Insert
    hashed = generate_password_hash(password, method='pbkdf2:sha256')
    cur = db.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        (name, email, hashed),
    )
    db.commit()

    token = create_access_token(identity=str(cur.lastrowid))
    return jsonify(
        {
            "token": token,
            "user": {"id": cur.lastrowid, "name": name, "email": email},
        }
    ), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    db = get_db()
    row = db.execute(
        "SELECT id, name, email, password FROM users WHERE email = ?", (email,)
    ).fetchone()

    if row is None or not check_password_hash(row["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(row["id"]))
    return jsonify(
        {
            "token": token,
            "user": {"id": row["id"], "name": row["name"], "email": row["email"]},
        }
    ), 200


@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def me():
    """Verify token and return the current user's profile."""
    user_id = get_jwt_identity()
    db = get_db()
    row = db.execute(
        "SELECT id, name, email, created_at FROM users WHERE id = ?", (user_id,)
    ).fetchone()

    if row is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify(
        {
            "user": {
                "id": row["id"],
                "name": row["name"],
                "email": row["email"],
                "created_at": row["created_at"],
            }
        }
    ), 200


# ── Health check ───────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


# ── AI Blog Generation ────────────────────────────────────────
import requests as _requests

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "mistral")


def _ollama(prompt: str) -> str:
    """Send a prompt to Ollama and return the response text."""
    resp = _requests.post(
        OLLAMA_URL,
        json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json().get("response", "").strip()


@app.route("/api/generate-blog", methods=["POST"])
def generate_blog():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()

    if not title:
        return jsonify({"error": "Title is required"}), 400

    try:
        # Step 1 — generate full blog content
        content_prompt = (
            "You are a professional blog writer.\n"
            f"Write a detailed blog on the topic: {title}.\n"
            "Include introduction, key points, and conclusion."
        )
        generated_content = _ollama(content_prompt)

        # Step 2 — summarise the generated content
        summary_prompt = (
            "Summarize the following blog into 4-5 concise lines:\n\n"
            f"{generated_content}"
        )
        generated_summary = _ollama(summary_prompt)

    except _requests.exceptions.ConnectionError:
        return jsonify({"error": "Ollama is not running. Start it with: ollama serve"}), 503
    except _requests.exceptions.Timeout:
        return jsonify({"error": "Ollama request timed out. Try again."}), 504
    except Exception as exc:
        return jsonify({"error": f"Generation failed: {str(exc)}"}), 500

    return jsonify({"content": generated_content, "summary": generated_summary}), 200


@app.route("/api/ask-question", methods=["POST"])
def ask_question():
    data     = request.get_json(silent=True) or {}
    blog     = (data.get("blog") or "").strip()
    question = (data.get("question") or "").strip()

    if not question:
        return jsonify({"error": "Question is required"}), 400
    if not blog:
        return jsonify({"error": "Blog content is required"}), 400

    prompt = (
        "You are an AI assistant.\n\n"
        "Answer the user's question ONLY using the given blog content.\n"
        "If the answer is not present in the blog, say 'Not found in the blog'.\n\n"
        f"Blog:\n{blog}\n\n"
        f"Question:\n{question}\n\n"
        "Answer clearly and concisely."
    )

    try:
        answer = _ollama(prompt)
    except _requests.exceptions.ConnectionError:
        return jsonify({"error": "Ollama is not running. Start it with: ollama serve"}), 503
    except _requests.exceptions.Timeout:
        return jsonify({"error": "Ollama request timed out. Try again."}), 504
    except Exception as exc:
        return jsonify({"error": f"AI call failed: {str(exc)}"}), 500

    return jsonify({"answer": answer}), 200


# ── Bootstrap ─────────────────────────────────────────────────
if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 5001))
    debug = os.environ.get("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
