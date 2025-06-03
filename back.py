from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

usuarios = {
    "admin": generate_password_hash("1234")
}

@app.route('/')
def home():
    return jsonify({"mensagem": "API Back End funcionando!"})

@app.route('/login', methods=['POST'])
def login():
    dados = request.json
    usuario = dados.get('usuario')
    senha = dados.get('senha')
    senha_hash = usuarios.get(usuario)
    
    if not usuario or not senha:
        return jsonify({"mensagem": "Usuário e senha são obrigatórios."}), 400
    elif senha_hash and check_password_hash(senha_hash, senha):
        return jsonify({"mensagem": "Login realizado com sucesso!"}), 200
    else:
        return jsonify({"mensagem": "Usuário ou senha inválidos."}), 401
