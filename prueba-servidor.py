from flask import request, jsonify
import face_recognition
import mysql.connector
import json
from flask import Flask
import base64
from datetime import datetime  # Importa la clase datetime
import pytz
from flask_cors import CORS  # Importa CORS
from flask_socketio import SocketIO, emit
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

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
        results = face_recognition.compare_faces([encoding], new_face_encoding, tolerance=0.49)

        # Si se encuentra una coincidencia, la persona ya está en la base de datos
        if any(results):
            return True

    return False

@app.route('/api/get_person_data', methods=['GET', 'PUT'])
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


@app.route('/api/get_auth_records_by_id', methods=['GET'])
def get_auth_records_by_id():
    try:
        conn = connect_to_database()
        if conn is None:
            return jsonify({"error": "Error de conexión a la base de datos"}), 500

        cursor = conn.cursor(dictionary=True)

        query = request.args.get('query', type=str)

        # Modifica la consulta SQL para seleccionar la fecha_hora de los registros de autenticación
        # y la imagen de la persona
        cursor.execute("SELECT registro_autenticaciones.fecha_hora, personas.image "
                       "FROM registro_autenticaciones "
                       "INNER JOIN personas ON registro_autenticaciones.persona_id = personas.id "
                       "WHERE registro_autenticaciones.persona_id = %s OR personas.nombre = %s",
                       (query, query))
        
        auth_records = cursor.fetchall()
        cursor.close()
        conn.close()

        # Codifica las imágenes en Base64 antes de enviarlas en la respuesta JSON
        for record in auth_records:
            if 'image' in record:
                imagen_bytes = record['image']  # Obtiene los bytes de la imagen
                imagen_base64 = (imagen_bytes).decode('utf-8')  # Codifica en Base64
                record['image'] = imagen_base64  # Actualiza la imagen en la respuesta JSON

        return jsonify(auth_records)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/failed_auth_attempts', methods=['GET'])
def get_failed_auth_attempts():
    try:
        conn = connect_to_database()
        if conn is None:
            return jsonify({"error": "Error de conexión a la base de datos"}), 500

        cursor = conn.cursor(dictionary=True)

        # Realiza una consulta SQL para seleccionar todos los registros de intentos fallidos de autenticación
        cursor.execute("SELECT fecha_hora, imagen FROM intentos_autenticacion")

        auth_attempts = cursor.fetchall()
        cursor.close()
        conn.close()

        # Codifica las imágenes en Base64 antes de enviarlas en la respuesta JSON
        for attempt in auth_attempts:
            if 'imagen' in attempt:
                imagen_bytes = attempt['imagen']  # Obtiene los bytes de la imagen
                imagen_base64 = (imagen_bytes).decode('utf-8')  # Codifica en Base64
                attempt['imagen'] = imagen_base64  # Actualiza la imagen en la respuesta JSON

        return jsonify(auth_attempts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
from io import BytesIO
from PIL import Image


@app.route('/api/add_person_react', methods=['POST'])
def add_person_to_database_react():
    try:
        file = request.files['imageFile']
        nombre = request.form.get('nombre')

        # Leer los datos binarios de la imagen directamente desde la solicitud
        image_data = file.read()
        
        # Cargar la imagen de la persona desde datos binarios
        image = face_recognition.api.load_image_file(BytesIO(image_data))
        face_locations = face_recognition.face_locations(image)

        if not face_locations:
            return jsonify({"message": "No se encontraron rostros en la imagen."}), 400

        # Obtener las coordenadas del primer rostro y recortar la imagen
        top, right, bottom, left = face_locations[0]
        cropped_face = image[top:bottom, left:right].copy()  # Utiliza copy() para crear una copia C-contigua

        face_encoding = face_recognition.face_encodings(cropped_face)
        
        # Conectar a la base de datos
        connection = connect_to_database()
        cursor = connection.cursor()

        # Verificar si la persona ya está en la base de datos
        if is_person_in_database(face_encoding[0], connection):
            cursor.close()
            connection.close()
            return jsonify({"message": "La persona ya está en la base de datos."}), 300
        
                # Convertir la matriz NumPy a una cadena base64
        image_pil = Image.fromarray(cropped_face)
        buffer = BytesIO()
        image_pil.save(buffer, format="JPEG")
        cropped_image_base64 = base64.b64encode(buffer.getvalue()).decode()        

        # Convertir la matriz NumPy a una lista de Python
        face_encoding_list = face_encoding[0].tolist()

        # Luego, convierte la lista en una cadena JSON
        face_encoding_json = json.dumps(face_encoding_list)

        # Insertar las características faciales y la imagen codificada en la base de datos
        cursor.execute("INSERT INTO personas (nombre, encoding, image) VALUES (%s, %s, %s)", (nombre, face_encoding_json, cropped_image_base64,))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Características faciales y la imagen han sido almacenadas en la base de datos."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




    
# Ruta para comparar una imagen con las características faciales de la base de datos
@app.route('/compare', methods=['POST', 'GET'])
def compare_with_database():
    try:
        file = request.files['imageFile']

        # Leer los datos binarios de la imagen directamente desde la solicitud
        image_data = file.read()

        # Cargar la imagen de la persona desde datos binarios
        image = face_recognition.api.load_image_file(BytesIO(image_data))
        face_locations = face_recognition.face_locations(image)
        
        if not face_locations:
            return jsonify({"message": "No se encontraron rostros en la imagen."}), 400

        # Obtener las coordenadas del primer rostro y recortar la imagen
        top, right, bottom, left = face_locations[0]
        cropped_face = image[top:bottom, left:right].copy()  # Utiliza copy() para crear una copia C-contigua



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
            comparison_results = face_recognition.compare_faces([encoding], face_encoding_to_compare[0], tolerance=0.49)

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

        image_pil = Image.fromarray(cropped_face)
        buffer = BytesIO()
        image_pil.save(buffer, format="JPEG")
        cropped_image_base64 = base64.b64encode(buffer.getvalue()).decode()    


        cursor.execute("INSERT INTO intentos_autenticacion (encoding, imagen, fecha_hora) VALUES (%s, %s, %s)",(face_encoding_json, cropped_image_base64, current_datetime))

        connection.commit()

        cursor.close()
        connection.close()
        return jsonify(results), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    cert_file = 'certificado.pem'
    key_file = 'clave-privada.pem'
    app.run(host='192.168.20.2', port=8000, ssl_context=(cert_file, key_file))
