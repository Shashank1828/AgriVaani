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

    # 🔮 Get reply from Gemini
    response = model.generate_content(user_input)
    reply = response.text

    return jsonify({"response": reply})

# ▶ Step 5: Run the server
if __name__ == "__main__":
    app.run(debug=True)