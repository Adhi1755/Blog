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
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "blogspace-dev-secret-change-in-prod")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)

jwt = JWTManager(app)

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


# ── Bootstrap ─────────────────────────────────────────────────
if __name__ == "__main__":
    init_db()
    app.run(port=5001, debug=True)
