import React, { useState, useEffect } from 'react';
import axios from 'axios';

function About() {
  const [failedAttempts, setFailedAttempts] = useState([]);

  useEffect(() => {
    // Reemplaza 'localhost' con la dirección IP de tu servidor Flask
    const serverIp = '192.168.1.16'; // Ejemplo: '192.168.1.100'

    // Realiza una solicitud GET al servidor Flask para obtener los intentos fallidos de autenticación
    axios.get(`http://${serverIp}:8000/api/failed_auth_attempts`)
      .then(response => {
        setFailedAttempts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Intentos Fallidos de Autenticación</h1>
      <table>
        <thead>
          <tr>
            <th>Fecha y Hora</th>
            <th>Imagen</th>
          </tr>
        </thead>
        <tbody>
          {failedAttempts.map((attempt, index) => (
            <tr key={index}>
              <td>{attempt.fecha_hora}</td>
              <td>
                {attempt.imagen && (
                  <img
                    src={`data:image/jpeg;base64,${attempt.imagen}`}
                    alt="Imagen de intento fallido"
                    style={{ width: '100px', height: 'auto' }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default About;
