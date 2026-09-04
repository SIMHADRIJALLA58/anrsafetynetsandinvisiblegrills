from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from datetime import datetime
import os, random, string

app = Flask(__name__, static_folder="static", static_url_path="")
app.secret_key = os.getenv("SECRET_KEY", "dev-secret")
bcrypt = Bcrypt(app)

# MongoDB Atlas connection
client = MongoClient(os.getenv("MONGODB_URI", "YOUR_ATLAS_URI"))
db = client["ATM_System"]
users = db["users"]

# Helper: generate 10-digit account number
def generate_account_number():
    return "".join(random.choices(string.digits, k=10))

# ---------------- API Routes ----------------

# Serve home page
@app.route("/")
def index():
    return app.send_static_file("index.html")

# ---- Register ----
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    name, pin = data.get("name"), data.get("pin")

    if not name or not pin or not pin.isdigit():
        return jsonify({"error": "Invalid input"}), 400

    hashed_pin = bcrypt.generate_password_hash(pin).decode("utf-8")
    acc_num = generate_account_number()

    users.insert_one({
        "account_number": acc_num,
        "name": name,
        "pin": hashed_pin,
        "balance": 0,
        "locked": False,
        "failed_attempts": 0,
        "created_at": datetime.utcnow()
    })

    return jsonify({"message": "Account created", "account_number": acc_num}), 201

# ---- Login ----
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    acc_num, pin = data.get("account_number"), data.get("pin")

    user = users.find_one({"account_number": acc_num})
    if not user:
        return jsonify({"error": "Invalid account"}), 401

    if user.get("locked"):
        return jsonify({"error": "Account locked"}), 403

    if bcrypt.check_password_hash(user["pin"], pin):
        users.update_one({"_id": user["_id"]}, {"$set": {"failed_attempts": 0}})
        session["account_number"] = acc_num
        return jsonify({"message": "Login successful", "name": user["name"], "balance": user["balance"]})
    else:
        new_attempts = user.get("failed_attempts", 0) + 1
        update_data = {"failed_attempts": new_attempts}
        if new_attempts >= 3:
            update_data["locked"] = True
        users.update_one({"_id": user["_id"]}, {"$set": update_data})
        if new_attempts >= 3:
            return jsonify({"error": "Account locked after 3 wrong attempts"}), 403
        return jsonify({"error": f"Wrong PIN. {3-new_attempts} tries left"}), 401

# ---- Check Balance ----
@app.route("/api/balance", methods=["GET"])
def balance():
    acc_num = session.get("account_number")
    if not acc_num:
        return jsonify({"error": "Unauthorized"}), 401
    user = users.find_one({"account_number": acc_num}, {"balance": 1})
    return jsonify({"balance": user["balance"]})

# ---- Logout ----
@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"})

if __name__ == "__main__":
    app.run(debug=True)
