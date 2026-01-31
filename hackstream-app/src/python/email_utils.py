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
https://forms.gle/qRy8YTFFcBLonfnr9

Regards,
HackStream Team 🚀
"""
        mail.send(msg)
        


def send_admin_invite(app, to_email, name, invite_link):
    with app.app_context():
        msg = Message(
            subject="HackStream Admin Access Invitation",
            recipients=[to_email]
        )
        msg.body = f"""
Hello {name},

You have been invited to join the HackStream core team.

🔐 Complete your setup here:
{invite_link}

If you didn’t expect this, you can safely ignore this email.

— HackStream Team 🚀
"""
        mail.send(msg)


def send_judge_invite(app, to_email, name, invite_link):
    with app.app_context():
        msg = Message(
            subject="HackStream Judge Access Invitation ⚖️",
            recipients=[to_email]
        )
        msg.body = f"""
Hello {name},

You have been invited as a Judge for HackStream.

To start reviewing teams and submitting scores, please set up your account here:
{invite_link}

Regards,
HackStream Team 🚀
"""
        mail.send(msg)
