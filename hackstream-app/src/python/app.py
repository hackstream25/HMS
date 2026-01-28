from flask import Flask
from auth import auth
from dashboard import dashboard_bp
from hackathon import hackathon
from submission import submission_bp
from announcement import announcement_bp
from judgeTeams import judge_teams_bp
from judgeAuth import judge_auth
from judgeScore import judge_score_bp
from judgeOverview import judge_overview_bp
from email_utils import init_mail
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Email init
init_mail(app)

# Register blueprints
app.register_blueprint(auth)
app.register_blueprint(dashboard_bp)
app.register_blueprint(hackathon)
app.register_blueprint(submission_bp)
app.register_blueprint(announcement_bp, url_prefix="/api")
app.register_blueprint(judge_teams_bp)
app.register_blueprint(judge_auth)
app.register_blueprint(judge_score_bp)
app.register_blueprint(judge_overview_bp)

if __name__ == "__main__":
    app.run(debug=True)
