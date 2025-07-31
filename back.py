from flask import Flask
from rotas import registrar_rotas

app = Flask(__name__)

# Configuração do banco em config.py
app.config.from_pyfile('config.py')

# Registrar rotas em blueprint
registrar_rotas(app)

if __name__ == '__main__':
    app.run(debug=True)