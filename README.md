# Sistema de Verificación Facial con ESP32CAM, ESP8266 y Servidor Flask

Este proyecto implementa un sistema de verificación facial que utiliza el módulo ESP32CAM para capturar imágenes, el ESP8266 para mostrar resultados en una pantalla TFT y un servidor Flask para manejar la autenticación facial y la base de datos de encodings faciales.

## Configuración del Proyecto

A continuación, se detallan los pasos necesarios para configurar cada componente del proyecto.

### ESP32CAM

1. **Credenciales de Red:**
   - Abre el archivo `ESP32CAM.ino` en la carpeta `ESP32CAM`.
   - Modifica las variables `ssid` y `password` con las credenciales de tu red WiFi.

2. **Configuración del Servidor:**
   - En el mismo archivo, ajusta la variable `serverName` con la dirección del servidor Flask.
   - Personaliza `serverPort` y `serverPath` según la configuración de tu servidor.

3. **Clave API (Opcional):**
   - Si utilizas una clave API en el servidor Flask, asegúrate de ajustar la variable `api_key` en el código.

### ESP8266

1. **Configuración de la Pantalla TFT:**
   - Abre el archivo `ESP8266_Pantalla_ILI9488.ino` en la carpeta `ESP8266_Pantalla_ILI9488`.
   - Ajusta cualquier configuración relacionada con la pantalla TFT según las especificaciones de tu hardware.

2. **Configuración del Intervalo de Reinicio:**
   - Modifica la variable `intervaloReinicio` para establecer el intervalo de reinicio del ESP8266.

### Servidor Flask

1. **Configuración de la Base de Datos:**
   - Asegúrate de tener un servidor MySQL en ejecución.
   - Crea una base de datos llamada `face_recognition` y ejecuta el script `face_recognition.sql` para crear las tablas necesarias.

2. **Variables de Entorno:**
   - Crea un archivo `.env` en la raíz del proyecto Flask.
   - Configura las siguientes variables en el archivo `.env`:
     - `DB_HOST`: Dirección del servidor de base de datos.
     - `DB_USER`: Usuario de la base de datos.
     - `DB_PASSWORD`: Contraseña del usuario.
     - `DB_DATABASE`: Nombre de la base de datos.
     - `API_KEY`: Clave API para autenticación (opcional).

3. **Instalación de Dependencias:**
   - Ejecuta `pip install -r requirements.txt` para instalar las dependencias del servidor Flask.
  
`Flask==2.1.0
flask-cors==3.0.10
flask-socketio==5.0.1
face-recognition==1.3.0
mysql-connector-python==8.0.28
python-dotenv==0.19.0
pillow==8.4.0
pytz==2021.3`

4. **Ejecución del Servidor:**
   - Ejecuta `python server.py` para iniciar el servidor Flask.

### Base de Datos

1. **Copia de Seguridad:**
   - En la carpeta `Database_Backup`, encuentra un archivo de copia de seguridad (`face_recognition.sql`).
   - Utiliza este archivo para restaurar la base de datos en tu servidor MySQL.

---

Con estas configuraciones, el sistema debería funcionar correctamente. Asegúrate de seguir estos pasos y personalizar las configuraciones según tus necesidades.
