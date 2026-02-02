from flask import Flask
from auth import auth
from dashboard import dashboard_bp
from hackathon import hackathon
from submission import submission
from email_utils import init_mail
from flask_cors import CORS
from team import team

app = Flask(__name__)
app.secret_key = "hackstream_ultra_secret_key"

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173"]  # Vite
)

# Email init
init_mail(app)

# Register blueprints
app.register_blueprint(auth)
app.register_blueprint(dashboard_bp)
app.register_blueprint(hackathon)
app.register_blueprint(submission)
app.register_blueprint(team)

if __name__ == "__main__":
    app.run(debug=True)
