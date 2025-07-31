from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from db import obter_conexao

bp = Blueprint('rotas', __name__)

@bp.route('/registrar', methods=['POST'])
def registrar():
    dados = request.get_json()
    usuario = dados.get('usuario')
    senha = dados.get('senha')
    if not usuario or not senha:
        return jsonify({'erro': 'Usuário ou senha ausente'}), 400
    senha_hash = generate_password_hash(senha)
    try:
        conn = obter_conexao()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, password) VALUES (%s, %s)', (usuario, senha_hash))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'mensagem': 'Usuário registrado com sucesso'}), 201
    except mysql.connector.IntegrityError:
        return jsonify({'erro': 'Usuário já existe'}), 409

@bp.route('/login', methods=['POST'])
def login():
    dados = request.get_json()
    usuario = dados.get('usuario')
    senha = dados.get('senha')
    if not usuario or not senha:
        return jsonify({'erro': 'Usuário ou senha ausente'}), 400
    conn = obter_conexao()
    cursor = conn.cursor()
    cursor.execute('SELECT password FROM users WHERE username = %s', (usuario,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if row and check_password_hash(row[0], senha):
        return jsonify({'mensagem': 'Login bem-sucedido'}), 200
    else:
        return jsonify({'erro': 'Credenciais inválidas'}), 401

@bp.route('/quizzes', methods=['GET'])
def listar_quizzes():
    conn = obter_conexao()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id_quiz, quiz_titulo, descricao FROM quizzes')
    quizzes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(quizzes), 200

@bp.route('/quizzes', methods=['POST'])
def criar_quiz():
    dados = request.get_json()
    titulo = dados.get('titulo')
    descricao = dados.get('descricao')
    if not titulo:
        return jsonify({'erro': 'Título ausente'}), 400
    conn = obter_conexao()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO quizzes (quiz_titulo, descricao) VALUES (%s, %s)', (titulo, descricao))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensagem': 'Quiz criado'}), 201

@bp.route('/quizzes/<int:quiz_id>/questoes', methods=['GET'])
def listar_questoes(quiz_id):
    conn = obter_conexao()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id_questao, questao_texto FROM questoes WHERE id_quiz = %s', (quiz_id,))
    questoes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(questoes), 200

@bp.route('/questoes/<int:questao_id>/responder', methods=['POST'])
def responder_questao(questao_id):
    dados = request.get_json()
    resposta_usuario = dados.get('resposta')
    conn = obter_conexao()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT resposta_correta FROM questoes WHERE id_questao = %s', (questao_id,))
    questao = cursor.fetchone()
    cursor.close()
    conn.close()
    if questao and resposta_usuario == questao['resposta_correta']:
        return jsonify({'correta': True}), 200
    else:
        return jsonify({'correta': False}), 200

@bp.route('/conteudos', methods=['GET'])
def listar_conteudos():
    conn = obter_conexao()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id_conteudo, conteudo_titulo, resumo FROM conteudos')
    conteudos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(conteudos), 200

@bp.route('/horarios', methods=['POST'])
def criar_horario():
    dados = request.get_json()
    id_usuario = dados.get('id_usuario')
    data = dados.get('data')
    atividade = dados.get('atividade')
    if not id_usuario or not data or not atividade:
        return jsonify({'erro': 'Campos ausentes'}), 400
    conn = obter_conexao()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO horarios (id_user, data_hora, atividade) VALUES (%s, %s, %s)', (id_usuario, data, atividade))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensagem': 'Horário criado'}), 201

@bp.route('/horarios/<int:id_usuario>', methods=['GET'])
def listar_horarios(id_usuario):
    conn = obter_conexao()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT data_hora, atividade FROM horarios WHERE id_user = %s', (id_usuario,))
    horarios = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(horarios), 200

def registrar_rotas(app):
    app.register_blueprint(bp)