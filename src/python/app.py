from flask import Flask
from auth import auth
from dashboard import dashboard_bp
from hackathon import hackathon
from submission import submission
from problem_statements import problem_bp
from announcements import announcement_bp
from admin_users import admin_users_bp
from admin_invite import admin_invite_bp
from admin_password import admin_password_bp
from judges import judges_bp
#from judgeTeams import judge_teams_bp
# from judgeAuth import judge_auth
# from judgeScore import judge_score_bp
from judgeOverview import judge_overview_bp
# from judgeRubrics import judge_rubric_bp
from judge_submissions import judge_submissions_bp
from google_sync import sync_bp 
from teams import teams_bp
from team import team
from email_utils import init_mail
from flask_cors import CORS
from admin_dashboard import admin_dashboard

app = Flask(__name__)

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

app.secret_key = "super-secret-key-change-this"

# Email init
init_mail(app)

# Register blueprints
app.register_blueprint(auth)
app.register_blueprint(dashboard_bp)
app.register_blueprint(hackathon)
app.register_blueprint(submission)
app.register_blueprint(team)
app.register_blueprint(problem_bp)
app.register_blueprint(admin_users_bp)
app.register_blueprint(announcement_bp)
app.register_blueprint(admin_invite_bp)
app.register_blueprint(admin_password_bp)
#app.register_blueprint(judge_teams_bp)
app.register_blueprint(teams_bp)
app.register_blueprint(admin_dashboard)
# app.register_blueprint(judge_auth)
# app.register_blueprint(judge_score_bp)
# app.register_blueprint(judge_rubric_bp)
app.register_blueprint(judge_submissions_bp)
app.register_blueprint(sync_bp)
app.register_blueprint(judge_overview_bp)
app.register_blueprint(judges_bp)

if __name__ == "__main__":
    app.run(debug=True)
