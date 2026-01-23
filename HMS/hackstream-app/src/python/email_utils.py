from flask_mail import Mail, Message

mail = Mail()

def init_mail(app):
    app.config.update(
        MAIL_SERVER="smtp.gmail.com",
        MAIL_PORT=587,
        MAIL_USE_TLS=True,
        MAIL_USERNAME="hackstream25@gmail.com",
        MAIL_PASSWORD="ffboutidxxfeevtk",
        MAIL_DEFAULT_SENDER="hackstream25@gmail.com"
    )
    mail.init_app(app)


def send_team_email(app, to_email, leader_name, team_id):
  
    with app.app_context():
        msg = Message(
            subject="HackStream Team Registration Successful 🎉",
            recipients=[to_email]
        )

        msg.body = f"""
Hello {leader_name},

🎉 Your team is registered!

🆔 Team ID: {team_id}

📋 Complete registration:
https://forms.gle/MiP856iTAGwgYbXw9

Regards,
HackStream Team 🚀
"""
        mail.send(msg)
