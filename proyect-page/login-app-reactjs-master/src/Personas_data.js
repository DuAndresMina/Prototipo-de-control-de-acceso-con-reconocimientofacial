import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, Table, TableHead, TableBody, TableRow, TableCell, TextField, Button, Avatar, Paper } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from '@mui/icons-material/Refresh';


import './person_data.css'; // Import the CSS file

function Personas(props) {
  const [personData, setPersonData] = useState([]);
  const [newNames, setNewNames] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const serverIp = '192.168.20.2';
    axios.get(`http://${serverIp}:8000/api/get_person_data`)
      .then(response => {
        setPersonData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleUpdatePerson = (id) => {
    const serverIp = '192.168.20.2';
    const newName = newNames[id];

    axios.put(`http://${serverIp}:8000/api/get_person_data`, {
      id: id,
      nombre: newName,
    })
      .then(response => {
        fetchData();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleNewNameChange = (id, value) => {
    setNewNames(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Personas en la Base de Datos
      </Typography>
      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Nombre</TableCell>
            <TableCell align="center">Foto</TableCell>
            <TableCell align="center">Actualizar Nombre</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {personData.map((person) => (
            <TableRow key={person.id}>
              <TableCell align="center">{person.id}</TableCell>
              <TableCell align="center">{person.nombre}</TableCell>
              <TableCell align="center">
                {person.image && (
                  <Avatar
                    src={`data:image/jpeg;base64,${person.image}`}
                    alt={`Foto de ${person.nombre}`}
                    sx={{ width: '100px', height: '100px' }}
                  />
                )}
              </TableCell>
              <TableCell align="center">
                <TextField
                  placeholder="Nuevo Nombre"
                  value={newNames[person.id] || ''}
                  onChange={(e) => handleNewNameChange(person.id, e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdatePerson(person.id)}
                  startIcon={<RefreshIcon />}
                  style={{ marginLeft: '8px' }}
                >
                  Actualizar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchData}
          startIcon={<AddCircleIcon />}
        >
          Actualizar Datos
        </Button>
      </div>
    </Container>
  );
}

export default Personas;
