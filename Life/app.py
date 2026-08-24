# pyrefly: ignore [missing-import]
from flask import Flask, render_template, jsonify
import re
app = Flask(__name__)
def check_password_strength(password):
    # Analyze password complexity
    checks = {
        'length': len(password) >= 8,
        'lowercase': bool(re.search(r'[a-z]', password)),
        'uppercase': bool(re.search(r'[A-Z]', password)),
        'digit': bool(re.search(r'\d', password)),
        'special': bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
    }
    score = sum(checks.values())
    strength_map = {
        0: 'Very Weak',
        1: 'Very Weak',
        2: 'Weak',
        3: 'Medium',
        4: 'Strong',
        5: 'Very Strong'
    }
    strength = strength_map.get(score, 'Very Weak')
    
    suggestions = []
    if not checks['length']:
        suggestions.append("Make it at least 8 characters long.")
    if not checks['lowercase']:
        suggestions.append("Add at least one lowercase letter (a-z).")
    if not checks['uppercase']:
        suggestions.append("Add at least one uppercase letter (A-Z).")
    if not checks['digit']:
        suggestions.append("Add at least one number (0-9).")
    if not checks['special']:
        suggestions.append("Add at least one special character (e.g., !, @, #, $, etc.).")
        
    return {
        'suggestions': suggestions,
        'score': score,
        'strength': strength,
        'criteria': checks,
        
    }

@app.route("/")
def home():
    return render_template("index.html")

# Endpoint to check password strength via path variable
@app.route("/check/<password>")
def check_password(password):
    result = check_password_strength(password)
    # Include password in the response to align with requested pattern
    result['password'] = password
    return jsonify(result)

# Dynamic routing for username
@app.route("/<username>")
def username(username):
    return f"<h1>Username: {username}</h1>"

if __name__ == "__main__":
    app.run(debug=True)
