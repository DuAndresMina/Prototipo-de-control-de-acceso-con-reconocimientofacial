import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './person_auten.css';

function Autenticaciones(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [authRecords, setAuthRecords] = useState([]);


  useEffect(() => {
    // Reemplaza 'localhost' con la dirección IP de tu servidor Flask
    const serverIp = '192.168.20.2'; // Ejemplo: '192.168.1.100'

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
  }, [searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchTerm);
  };


  return (
    <div className="App" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Buscar Registros de Autenticación por ID de Persona o Nombre</h1>
      <div style={{ textAlign: 'center' }}>
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
        <thead >
          <tr style={{ textAlign: 'center' }}>
            <th style={{ textAlign: 'center' }}>Fecha y Hora</th>
            <th style={{ textAlign: 'center' }}>Foto de la Persona</th>
          </tr>
        </thead>
        <tbody>
          {authRecords.map((record, index) => (
            <tr key={index}>
              <td style={{ textAlign: 'center' }}>{record.fecha_hora}</td>
              <td style={{ textAlign: 'center' }}>
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

export default Autenticaciones;
