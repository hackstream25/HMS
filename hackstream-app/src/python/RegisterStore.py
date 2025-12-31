from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import random
import datetime as date

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'hms'

mysql = MySQL(app)

@app.route('/register', methods=['POST'])
def register():
    num = random.randint(1000, 9999)
    id = [int]
    var="IT"
    year=date.datetime.now().year
    yr=str(year)[-2:]
    teamid=var+str(num)+yr
    #print(teamid)

    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    institute = data.get('institute')
    #teamid = data.get('teamid')

    cur = mysql.connection.cursor()
    cur.execute(
        """
        INSERT INTO user (name, email, number, college, password, teamid)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (name, email, phone, institute, password, teamid)
    )
    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "User added."}), 201


if __name__ == '__main__':
    app.run(debug=True)
