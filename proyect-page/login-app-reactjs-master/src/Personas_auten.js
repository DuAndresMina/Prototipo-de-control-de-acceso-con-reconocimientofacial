import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, Table, TableHead, TableBody, TableRow, TableCell, TextField, Button, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './person_auten.css';

function Autenticaciones(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [authRecords, setAuthRecords] = useState([]);

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const fetchData = () => {
    const serverIp = '192.168.20.2';
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

  const handleSearch = () => {
    fetchData();
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Buscar
        </Button>
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
