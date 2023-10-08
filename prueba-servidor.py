from flask import Flask, request, jsonify
import face_recognition
import mysql.connector
import json
from flask import Flask, render_template
import base64
from datetime import datetime  # Importa la clase datetime
import pytz
from mysql.connector import Error
from flask_cors import CORS  # Importa CORS

app = Flask(__name__)
CORS(app)
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

@app.route('/api/get_person_data', methods=['GET', 'PUT', 'DELETE'])
def get_or_update_or_delete_person_data():
    if request.method == 'GET':
        try:
            conn = connect_to_database()
            if conn is None:
                return jsonify({"error": "Error de conexión a la base de datos"}), 500

            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT id, nombre, image FROM personas")
            personas_data = cursor.fetchall()
            cursor.close()
            conn.close()

            # Codifica las imágenes en Base64 antes de enviarlas en la respuesta JSON
            for persona in personas_data:
                if 'image' in persona:
                    imagen_bytes = persona['image']  # Obtiene los bytes de la imagen
                    imagen_base64 = (imagen_bytes).decode('utf-8')  # Codifica en Base64
                    persona['image'] = imagen_base64  # Actualiza la imagen en la respuesta JSON

            return jsonify(personas_data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    elif request.method == 'PUT':
        try:
            data = request.get_json()
            id_persona = data['id']
            nuevo_nombre = data['nombre']

            conn = connect_to_database()
            cursor = conn.cursor()
            cursor.execute("UPDATE personas SET nombre = %s WHERE id = %s", (nuevo_nombre, id_persona))
            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({"message": "Persona modificada exitosamente"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    elif request.method == 'DELETE':
        try:
            data = request.get_json()
            id_persona = data['id']

            conn = connect_to_database()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM personas WHERE id = %s", (id_persona,))
            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({"message": "Persona eliminada exitosamente"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

# Ruta para cargar una imagen de una persona y guardar sus características faciales en la base de datos
@app.route('/add_person', methods=['POST'])
def add_person_to_database():
    try:
        file = request.files['imageFile']

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
