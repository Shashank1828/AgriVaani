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
    




@app.route('/api/mandi', methods=['GET'])
def get_mandi_data():
    page = int(request.args.get('page', 1))
    page_size = 15
    offset = (page - 1) * page_size

    conn = sqlite3.connect('mandi_data.db')
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM mandi_rates")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT crop, state, rate FROM mandi_rates LIMIT ? OFFSET ?", (page_size, offset))
    rows = cursor.fetchall()

    data = [{"crop": row[0], "state": row[1], "rate": row[2]} for row in rows]

    return jsonify({
        "data": data,
        "total": total,
        "page": page,
        "total_pages": (total + page_size - 1) // page_size
    })






@app.route("/api/farming-calendar", methods=["GET"])
def get_calendar():
    state = request.args.get("state", "").strip()
    month = request.args.get("month", "").strip()

    if not state:
        return jsonify({"error": "राज्य आवश्यक है"}), 400

    try:
        conn = sqlite3.connect("crop_calendar.db")
        cur = conn.cursor()
        query = "SELECT month, crops, activities, precautions FROM calendar WHERE state = ?"
        params = [state]

        if month.isdigit():
            query += " AND month = ?"
            params.append(int(month))

        cur.execute(query, params)
        rows = cur.fetchall()
        conn.close()

        result = [{
            "month": row[0],
            "crops": row[1],
            "activities": row[2],
            "precautions": row[3]
        } for row in rows]

        return jsonify({"state": state, "data": result})

    except Exception as e:
        return jsonify({"error": "सर्वर त्रुटि"}), 500
    




# ✅ Fertilizer database path declared here
FERTILIZER_DB = "fertilizer.db"

@app.route("/api/fertilizer", methods=["GET"])
def get_fertilizer_advice():
    crop = request.args.get("crop", "").strip()
    area = request.args.get("area", "").strip()
    unit = request.args.get("unit", "hectare").strip()

    if not crop or not area:
        return jsonify({"error": "फसल और क्षेत्र आवश्यक हैं।"}), 400

    try:
        area = float(area)
        if unit == "acre":
            area *= 0.4047  # convert acre to hectare

        conn = sqlite3.connect(FERTILIZER_DB)
        cursor = conn.cursor()
        cursor.execute("SELECT urea_kg_per_hectare, dap_kg_per_hectare, potash_kg_per_hectare, water_liters_per_hectare FROM fertilizer_data WHERE crop = ?", (crop,))
        row = cursor.fetchone()
        conn.close()

        if not row:
            return jsonify({"error": "इस फसल की जानकारी उपलब्ध नहीं है।"}), 404

        result = {
            "crop": crop,
            "area_in_hectare": round(area, 2),
            "urea_kg": round(row[0] * area, 2),
            "dap_kg": round(row[1] * area, 2),
            "potash_kg": round(row[2] * area, 2),
            "water_liters": round(row[3] * area, 2)
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"सर्वर त्रुटि: {str(e)}"}), 500


    

    


# ▶ Run the server
if __name__ == "__main__":
    app.run(debug=True)



