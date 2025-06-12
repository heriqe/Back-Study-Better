from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector

app = Flask(__name__)

db = mysql.connector.connect(
    host="localhost",
    user="usuario",
    password="senha_hash",
    database="db_Study_Better"
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

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT senha_hash FROM usuarios WHERE usuario = %s", (usuario,))
    resultado = cursor.fetchone()
    cursor.close()

    if resultado and check_password_hash(resultado['senha_hash'], senha):
        return jsonify({"mensagem": "Login realizado com sucesso!"}), 200
    else:
        return jsonify({"mensagem": "Usuário ou senha inválidos."}), 401
