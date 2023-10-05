from flask import Flask, render_template
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

# Configuración de la conexión a la base de datos MySQL
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'duvanlolZ245@',
    'database': 'face_recognition'
}

# Nombre de la columna que deseas explorar

def get_imagenes():
    imagenes = []
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute(f"SELECT image FROM personas")
        resultados = cursor.fetchall()
        for resultado in resultados:
            imagen = (resultado[0]).decode('utf-8')
            imagenes.append(imagen)

    except Error as e:
        print("Error en la consulta:", e)
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
    return imagenes

def get_ids():
    ids = []
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM personas")
        resultados = cursor.fetchall()
        for resultado in resultados:
            id_persona = resultado[0]
            ids.append(id_persona)
            print(id_persona)
    except Error as e:
        print("Error en la consulta de IDs:", e)
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
    return ids

def get_nombres():
    nombres = []
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT nombre FROM personas")
        resultados = cursor.fetchall()
        for resultado in resultados:
            nombre = resultado[0]
            nombres.append(nombre)
            print(nombre)
    except Error as e:
        print("Error en la consulta de nombres:", e)
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
    return nombres

@app.route('/')
def mostrar_imagenes():
    imagenes_base64 = get_imagenes()
    ids = get_ids()
    nombres = get_nombres()
    return render_template('personas.html', imagenes_base64=imagenes_base64, ids=ids, nombres=nombres)


if __name__ == '__main__':
    app.debug = True
    app.run(host='192.168.1.13', port=8000)
