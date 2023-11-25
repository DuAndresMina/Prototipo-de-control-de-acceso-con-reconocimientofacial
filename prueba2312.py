from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Resto de tu código Flask
@socketio.on('connect')
def handle_connect():
    print('Un cliente se ha conectado al WebSocket')

@socketio.on('message_received')
def handle_message_received(message):
    print('Mensaje recibido del cliente: ' + message)
    # Puedes agregar código para procesar el mensaje y enviar una respuesta
    # Emitir una respuesta al cliente
    socketio.emit('response', 'Respuesta del servidor: ' + message)

if __name__ == '__main__':
    socketio.run(app, host='192.168.1.16', port=8000)
