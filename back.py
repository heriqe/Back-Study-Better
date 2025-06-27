from flask import Flask, request, jsonify
import mysql.connector
# pip install flask mysql-connector-python werkzeug
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
db_config = {
    'host': 'localhost',
    'user': 'seu_usuario',
    'password': 'sua_senha',
    'database': 'db_Study_Better'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400
    hashed_password = generate_password_hash(password)
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, password) VALUES (%s, %s)', (username, hashed_password))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'User registered successfully'}), 201
    except mysql.connector.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 409

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT password FROM users WHERE username = %s', (username,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if row and check_password_hash(row[0], password):
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/quizzes', methods=['GET'])
def get_quizzes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, title, description FROM quizzes')
    quizzes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(quizzes), 200

@app.route('/quizzes', methods=['POST'])
def create_quiz():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    if not title:
        return jsonify({'error': 'Missing title'}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO quizzes (title, description) VALUES (%s, %s)', (title, description))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Quiz created'}), 201

@app.route('/quizzes/<int:quiz_id>/questions', methods=['GET'])
def get_questions(quiz_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, question_text FROM questions WHERE quiz_id = %s', (quiz_id,))
    questions = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(questions), 200

@app.route('/questions/<int:question_id>/answer', methods=['POST'])
def answer_question(question_id):
    data = request.get_json()
    user_answer = data.get('answer')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT correct_answer FROM questions WHERE id = %s', (question_id,))
    question = cursor.fetchone()
    cursor.close()
    conn.close()
    if question and user_answer == question['correct_answer']:
        return jsonify({'correct': True}), 200
    else:
        return jsonify({'correct': False}), 200

@app.route('/contents', methods=['GET'])
def get_contents():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, title, summary FROM contents')
    contents = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(contents), 200

@app.route('/schedules', methods=['POST'])
def create_schedule():
    data = request.get_json()
    user_id = data.get('user_id')
    date = data.get('date')
    activity = data.get('activity')
    if not user_id or not date or not activity:
        return jsonify({'error': 'Missing fields'}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO schedules (user_id, date, activity) VALUES (%s, %s, %s)', (user_id, date, activity))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Schedule created'}), 201

@app.route('/schedules/<int:user_id>', methods=['GET'])
def get_schedule(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT date, activity FROM schedules WHERE user_id = %s', (user_id,))
    schedule = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(schedule), 200

if __name__ == '__main__':
    app.run(debug=True)