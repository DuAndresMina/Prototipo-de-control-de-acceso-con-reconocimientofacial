from flask import Flask, request, jsonify
import face_recognition
import mysql.connector
import json
import base64
from datetime import datetime  # Importa la clase datetime
import pytz

app = Flask(__name__)

# Configuración de la base de datos MySQL
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'duvanlolZ245@',
    'database': 'face_recognition',
}

# Conectar a la base de datos
def connect_to_database():
    return mysql.connector.connect(**db_config)

# Función para verificar si la persona ya está en la base de datos
def is_person_in_database(new_face_encoding, connection):
    cursor = connection.cursor()

    # Consulta para obtener todas las imágenes de la base de datos
    cursor.execute("SELECT encoding FROM personas")
    rows = cursor.fetchall()

    # Compara con cada imagen en la base de datos
    for row in rows:
        encoding_str = row[0]
        encoding = json.loads(encoding_str)  # Cargar la cadena JSON en una lista de Python
        results = face_recognition.compare_faces([encoding], new_face_encoding)

        # Si se encuentra una coincidencia, la persona ya está en la base de datos
        if any(results):
            return True

    return False

# Ruta para cargar una imagen de una persona y guardar sus características faciales en la base de datos
@app.route('/add_person', methods=['POST'])
def add_person_to_database():
    try:
        file = request.files['image']

        # Leer los datos binarios de la imagen directamente desde la solicitud
        image_data = file.read()
        
        # Cargar la imagen de la persona
        image = face_recognition.load_image_file(file)
        face_encoding = face_recognition.face_encodings(image)

        if not face_encoding:
            return jsonify({"message": "No se encontraron rostros en la imagen."}), 400

        # Conectar a la base de datos
        connection = connect_to_database()
        cursor = connection.cursor()

        # Verificar si la persona ya está en la base de datos
        if is_person_in_database(face_encoding[0], connection):
            cursor.close()
            connection.close()
            return jsonify({"message": "La persona ya está en la base de datos."}), 200

        # Convertir la matriz NumPy a una lista de Python
        face_encoding_list = face_encoding[0].tolist()

        # Luego, convierte la lista en una cadena JSON
        face_encoding_json = json.dumps(face_encoding_list)

        # Codificar la imagen en formato base64
        image_base64 = base64.b64encode(image_data).decode()


        # Insertar las características faciales y la imagen codificada en la base de datos
        cursor.execute("INSERT INTO personas (encoding, image) VALUES (%s, %s)", (face_encoding_json, image_base64,))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Características faciales y la imagen han sido almacenadas en la base de datos en formato base64."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Ruta para comparar una imagen con las características faciales de la base de datos
@app.route('/compare', methods=['POST'])
def compare_with_database():
    try:
        file = request.files['image']

        # Leer los datos binarios de la imagen directamente desde la solicitud
        image_data = file.read()
        
        # Cargar la imagen para comparación
        image = face_recognition.load_image_file(file)
        face_encoding_to_compare = face_recognition.face_encodings(image)

        if not face_encoding_to_compare:
            return jsonify({"message": "No se encontraron rostros en la imagen."}), 400

        # Conectar a la base de datos
        connection = connect_to_database()
        cursor = connection.cursor()

        # Consulta para obtener todas las imágenes de la base de datos
        cursor.execute("SELECT id, encoding FROM personas")
        rows = cursor.fetchall()

        # Inicializar una lista para almacenar resultados de comparación
        results = []

        # Compara con cada imagen en la base de datos
        for row in rows:
            person_id, encoding_str = row[0], row[1]
            encoding = json.loads(encoding_str)  # Cargar la cadena JSON en una lista de Python
            comparison_results = face_recognition.compare_faces([encoding], face_encoding_to_compare[0])

            # Si se encuentra una coincidencia, agrega el resultado a la lista de resultados
            if any(comparison_results):
                # Registra la fecha y hora de la autenticación
                colombia_timezone = pytz.timezone('America/Bogota')
                current_time_colombia = datetime.now(colombia_timezone)
                current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                formatted_time_colombia = current_time_colombia.strftime('%Y-%m-%d %H:%M:%S')

                # Inserta el registro de autenticación en la base de datos
                cursor.execute("INSERT INTO registro_autenticaciones (persona_id, fecha_hora) VALUES (%s, %s)",
                               (person_id, formatted_time_colombia))
                connection.commit()

                # Devuelve la respuesta
                results.append({"message": "Persona autorizada.", "person_id": person_id})
                cursor.close()
                connection.close()
                return jsonify(results), 200

        # Si no se encontraron coincidencias en la base de datos
        results.append({"message": "Persona no autorizada."})

        # Registra la fecha y hora de la autenticación
        colombia_timezone = pytz.timezone('America/Bogota')
        current_time_colombia = datetime.now(colombia_timezone)
        current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        formatted_time_colombia = current_time_colombia.strftime('%Y-%m-%d %H:%M:%S')

        # Convertir la matriz NumPy a una lista de Python
        face_encoding_list = face_encoding_to_compare[0].tolist()

        # Luego, convierte la lista en una cadena JSON
        face_encoding_json = json.dumps(face_encoding_list)

        # Codificar la imagen en formato base64
        image_base64 = base64.b64encode(image_data).decode()

        cursor.execute("INSERT INTO intentos_autenticacion (encoding, imagen, fecha_hora) VALUES (%s, %s, %s)",(face_encoding_json, image_base64, current_datetime))

        connection.commit()

        cursor.close()
        connection.close()
        return jsonify(results), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='192.168.1.13', port=8000)
