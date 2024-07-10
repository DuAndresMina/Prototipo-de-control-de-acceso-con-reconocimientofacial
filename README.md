# Prototipo de reconocimiento facial para control de acceso
![Imagen del proyecto](https://github.com/DuAndresMina/Prototipo-de-reconocimiento-facial-para-control-de-acceso/blob/master/download.gif?raw=true)

## Descripción 📑

Este proyecto implementa un sistema de verificación facial que utiliza el módulo ESP32CAM para capturar imágenes, el ESP8266 para mostrar resultados en una pantalla TFT y un servidor Flask para manejar la autenticación facial y la base de datos de encodings faciales.

## Tecnologías 🛠
<!-- Iconos sacados de: https://dev.to/envoy_/150-badges-for-github-pnk -->
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://es.wikipedia.org/wiki/HTML5)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://es.wikipedia.org/wiki/CSS)
[![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://es.wikipedia.org/wiki/JavaScript)
[![MySQL](https://img.shields.io/badge/MySQL-1572B6?style=for-the-badge&logo=MySQL&logoColor=white)](https://es.wikipedia.org/wiki/MySQL)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://es.wikipedia.org/wiki/Python)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://es.wikipedia.org/wiki/Express.js)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://es.wikipedia.org/wiki/react)
[![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://es.wikipedia.org/wiki/Material_Design)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://es.wikipedia.org/wiki/flask)
[![C](https://img.shields.io/badge/C-00599C?style=for-the-badge&logo=c&logoColor=white)]([https://es.wikipedia.org/wiki/C](https://es.wikipedia.org/wiki/C_(lenguaje_de_programación)))

## Vista previa del proyecto
Si quieres hechas un vistazo al proyecto, te recomiendo:

![Captura del proyecto](https://github.com/DuAndresMina/Prototipo-de-reconocimiento-facial-para-control-de-acceso/blob/master/IMG_7635.jpg?raw=true)

![Captura del proyecto](https://github.com/DuAndresMina/Prototipo-de-reconocimiento-facial-para-control-de-acceso/blob/master/IMG_7644.jpg?raw=true)
<p align="center">
  <img src="https://github.com/DuAndresMina/Prototipo-de-reconocimiento-facial-para-control-de-acceso/blob/master/img2.png" />
</p>

## Autor ✒️
* **Duvan Andres Mina Landazuri**
  
* Este proyecto fue elaborado junto con [@ajota29](https://github.com/ajota29)

* [duvan.andres312@gmail.com](duvan.andres312@gmail.com)
* [LinkedIn](https://www.linkedin.com/in/duvan-mina-644b13156/)

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


4. **Ejecución del Servidor:**
   - Ejecuta `python server.py` para iniciar el servidor Flask.

### Base de Datos

1. **Copia de Seguridad:**
   - En la carpeta `Database_Backup`, encuentra un archivo de copia de seguridad (`face_recognition.sql`).
   - Utiliza este archivo para restaurar la base de datos en tu servidor MySQL.

---

Con estas configuraciones, el sistema debería funcionar correctamente. Asegúrate de seguir estos pasos y personalizar las configuraciones según tus necesidades De ser necesario, revisa nuestro documento de proyecto grado donde contiene todo sobre lo que se realizo https://repositorio.uniajc.edu.co/entities/publication/e5c0ed2f-cf7c-4480-8dd7-146fb97a1ec3.


## Licencia 📄
MIT Public License v3.0
No puede usarse comencialmente.
