import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './person_auten.css';

function Contact() {
  const [searchTerm, setSearchTerm] = useState('');
  const [authRecords, setAuthRecords] = useState([]);
  const [authRecordIdToDelete, setAuthRecordIdToDelete] = useState('');

  useEffect(() => {
    // Reemplaza 'localhost' con la dirección IP de tu servidor Flask
    const serverIp = '192.168.1.13'; // Ejemplo: '192.168.1.100'

    // Realiza una solicitud GET al servidor Flask para buscar registros por person_id o nombre
    axios.get(`http://${serverIp}:8000/api/auth_records`, {
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
  }, [searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchTerm);
  };

  const handleDeleteAuthRecord = () => {
    // Reemplaza 'localhost' con la dirección IP de tu servidor Flask
    const serverIp = '192.168.1.13'; // Ejemplo: '192.168.1.100'

    // Realiza una solicitud DELETE al servidor Flask para eliminar un registro de autenticación por su ID
    axios.delete(`http://${serverIp}:8000/api/delete_auth_record`, {
      data: { id: authRecordIdToDelete },
    })
      .then(response => {
        // Actualiza la lista de registros después de la eliminación
        setAuthRecords(authRecords.filter(record => record.id !== authRecordIdToDelete));
        setAuthRecordIdToDelete('');
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
        <button onClick={handleSearch}>Buscar</button>
      </div>
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
    </div>
  );
}

export default Contact;
