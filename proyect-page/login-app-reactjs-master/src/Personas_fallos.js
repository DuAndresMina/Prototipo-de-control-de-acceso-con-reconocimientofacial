import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import './failed_auten.css';

function Personas_fallos(props) {
  const [failedAttempts, setFailedAttempts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const serverIp = '192.168.20.2';
    axios.get(`http://${serverIp}:8000/api/failed_auth_attempts`)
      .then(response => {
        setFailedAttempts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Intentos Fallidos de Autenticación
      </Typography>
      <Table component={Paper} sx={{ marginTop: '20px' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Fecha y Hora</TableCell>
            <TableCell align="center">Imagen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {failedAttempts.map((attempt, index) => (
            <TableRow key={index}>
              <TableCell align="center">{attempt.fecha_hora}</TableCell>
              <TableCell align="center">
                {attempt.imagen && (
                  <img
                    src={`data:image/jpeg;base64,${attempt.imagen}`}
                    alt="Imagen de intento fallido"
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

export default Personas_fallos;
