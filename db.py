import mysql.connector
from config import config_banco

def obter_conexao():
    return mysql.connector.connect(**config_banco)
