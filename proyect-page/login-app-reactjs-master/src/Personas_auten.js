import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, Table, TableHead, TableBody, TableRow, TableCell, TextField, Paper } from '@mui/material';


function Autenticaciones(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [authRecords, setAuthRecords] = useState([]);
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const serverPort = process.env.REACT_APP_SERVER_PORT;
  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const fetchData = () => {
    axios.get(`http://${serverIp}:${serverPort}/api/get_auth_records_by_id`, {
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
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Buscar Registros de Autenticación por ID de Persona o Nombre
      </Typography>
      <div className="search-container">
        <TextField
          label="Buscar por ID o Nombre"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table component={Paper} sx={{ marginTop: '20px' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Fecha y Hora</TableCell>
            <TableCell align="center">Foto de la Persona</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {authRecords.map((record, index) => (
            <TableRow key={index}>
              <TableCell align="center">{record.fecha_hora}</TableCell>
              <TableCell align="center">
                {record.image && (
                  <img
                    src={`data:image/jpeg;base64,${record.image}`}
                    alt="Foto de la persona"
                    style={{ width: '100px', height: 'auto' }}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default Autenticaciones;
