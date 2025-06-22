from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(_name_)
CORS(app)

@app.route("/api/message", methods=["POST"])
def message():
    data = request.get_json()
    user_input = data.get("message", "")
    
    response = f"Received your message: {user_input} (Hindi GPT reply will come here)"
    
    return jsonify({"response": response})

if _name_ == "_main_":
    app.run(debug=True)