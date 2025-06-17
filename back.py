import os
from flask import Flask, jsonify, request
from werkzeug.security import check_password_hash
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        user=os.getenv("DB_USER", "usuario"),
        password=os.getenv("DB_PASSWORD", "sua_senha_real"),
        database=os.getenv("DB_NAME", "db_Study_Better")
    )

@app.route('/')
def home():
    return jsonify({"mensagem": "API Back End funcionando!"})

@app.route('/login', methods=['POST'])
def login():
    dados = request.json
    usuario = dados.get('usuario')
    senha = dados.get('senha')

    if not usuario or not senha:
        return jsonify({"mensagem": "Usuário e senha são obrigatórios."}), 400

    try:
        db = get_db_connection()
        with db.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT senha_hash FROM usuarios WHERE usuario = %s", (usuario,))
            resultado = cursor.fetchone()
        db.close()
    except Error as e:
        return jsonify({"mensagem": "Erro no banco de dados.", "erro": str(e)}), 500

    if resultado and check_password_hash(resultado['senha_hash'], senha):
        return jsonify({"mensagem": "Login realizado com sucesso!"}), 200
    else:
        return jsonify({"mensagem": "Usuário ou senha inválidos."}), 401

