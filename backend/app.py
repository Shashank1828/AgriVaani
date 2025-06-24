"""
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

# 🔐 Step 1: Add your API key here
GOOGLE_API_KEY = "AIzaSyDkON7bo8BWTI_bI3-cO7uKzxPuuw53Coo"
genai.configure(api_key=GOOGLE_API_KEY)

# 🔁 Step 2: Create model object
model = genai.GenerativeModel("models/gemini-1.5-pro")

# ✅ Step 3: Set up Flask app
app = Flask(__name__)
CORS(app)

# 🔄 Step 4: API endpoint to receive user message
@app.route("/api/message", methods=["POST"])
def message():
    data = request.get_json()
    user_input = data.get("message", "")
 
    try:
        response = model.generate_content(user_input)
        return jsonify({"reply": response.text})
    except Exception as e:
        print("Error:", e)
        return jsonify({"reply": "❌ कोई त्रुटि हुई!"}), 500

# ▶ Step 5: Run the server
if __name__ == "__main__":
    app.run(debug=True)
    """

"""
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

# 🔐 Step 1: Add your API key here
GOOGLE_API_KEY = "AIzaSyDkON7bo8BWTI_bI3-cO7uKzxPuuw53Coo"
genai.configure(api_key=GOOGLE_API_KEY)

# 🔁 Step 2: Create model object
model = genai.GenerativeModel("models/gemini-1.5-pro")

# ✅ Step 3: Set up Flask app
app = Flask(__name__)
CORS(app)

# 🔄 Step 4: API endpoint to receive user message
@app.route("/api/message", methods=["POST"])
def message():
    data = request.get_json()
    user_input = data.get("message", "")
 
    try:
        response = model.generate_content(user_input)
        return jsonify({"reply": response.text})
    except Exception as e:
        print("Error:", e)
        return jsonify({"reply": "❌ कोई त्रुटि हुई!"}), 500

# ▶ Step 5: Run the server
if __name__ == "__main__":
    app.run(debug=True)
    """

import google.generativeai as genai
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

# 🔐 Gemini API Key
GOOGLE_API_KEY = "AIzaSyDkON7bo8BWTI_bI3-cO7uKzxPuuw53Coo"
genai.configure(api_key=GOOGLE_API_KEY)

# 🔁 Gemini Model
model = genai.GenerativeModel("models/gemini-1.5-pro")

# ✅ Flask App Setup
app = Flask(__name__)
CORS(app)
app.secret_key = "supersecretkey"  # Needed for session handling

# 🗃️ Initialize SQLite DB
def init_db():
    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        area TEXT,
        country TEXT,
        state TEXT,
        mobile TEXT UNIQUE,
        password TEXT
    )''')
    conn.commit()
    conn.close()

init_db()

# 🤖 AI Message API
@app.route("/api/message", methods=["POST"])
def message():
    data = request.get_json()
    user_input = data.get("message", "")

    try:
        response = model.generate_content(user_input)
        return jsonify({"reply": response.text})
    except Exception as e:
        print("Error:", e)
        return jsonify({"reply": "❌ कोई त्रुटि हुई!"}), 500

# 📝 Register New User
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    area = data.get("area")
    country = data.get("country")
    state = data.get("state")
    mobile = data.get("mobile")
    password = generate_password_hash(data.get("password"))

    try:
        conn = sqlite3.connect("users.db")
        c = conn.cursor()
        c.execute("INSERT INTO users (name, area, country, state, mobile, password) VALUES (?, ?, ?, ?, ?, ?)",
                  (name, area, country, state, mobile, password))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Account created successfully!"})
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "This mobile number is already registered."})

# 🔐 Login Existing User
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    mobile = data.get("mobile")
    password = data.get("password")

    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    c.execute("SELECT password FROM users WHERE mobile = ?", (mobile,))
    row = c.fetchone()
    conn.close()

    if row and check_password_hash(row[0], password):
        session["user"] = mobile
        return jsonify({"success": True, "message": "Login successful!"})
    else:
        return jsonify({"success": False, "message": "Invalid mobile or password."})
    





    

# ▶ Run the server
if __name__ == "__main__":
    app.run(debug=True)


