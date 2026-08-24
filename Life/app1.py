# pyrefly: ignore [missing-import]
from flask import Flask , jsonify ,render_template
import re

app = Flask(__name__)

def passworD_validation(password):
    checks={
    "length" : len(password)>=8,
    "upper" : bool(re.search("[A-Z]",password)),
    "lower" : bool(re.search("[a-z]",password)),
    "number" : bool(re.search("\d",password)),
    "special" : bool(re.search("[!@#$%^&*(),.?:{}|<>]"))}

    score = sum(checks.values())

    if score == 5 :
        return "Strong"
    elif score >= 3:
        return "Weak"
    elif score >=1:
        return "Weak"
    else:
        return "Invalid Password"
    
    