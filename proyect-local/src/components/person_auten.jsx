import React, { useState } from 'react';
import axios from 'axios';
import './person_auten.css';

function Contact() {
  const [searchTerm, setSearchTerm] = useState('');
  const [authRecords, setAuthRecords] = useState([]);

  const handleSearch = () => {
    // Reemplaza 'localhost' con la dirección IP de tu servidor Flask
    const serverIp = '192.168.1.13'; // Ejemplo: '192.168.1.100'

    // Realiza una solicitud GET al servidor Flask para buscar registros por person_id o nombre
    axios.get(`http://${serverIp}:8000/api/get_auth_records_by_id`, {
      params: {
        query: searchTerm,
      },
    })
      .then(response => {
        setAuthRecords(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className="App">
      <h1>Buscar Registros de Autenticación por ID de Persona o Nombre</h1>
      <div>
        <label>Buscar por ID o Nombre:</label>
        <input
          type="text"
          placeholder="Ingresa el ID o el nombre de la persona"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <button onClick={handleSearch}>Buscar</button>
      {authRecords.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Foto de la Persona</th>
            </tr>
          </thead>
          <tbody>
            {authRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.fecha_hora}</td>
                <td>
                  {record.image && (
                    <img
                      src={`data:image/jpeg;base64,${record.image}`}
                      alt="Foto de la persona"
                      style={{ width: '100px', height: 'auto' }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron registros.</p>
      )}
    </div>
  );
}

export default Contact;
