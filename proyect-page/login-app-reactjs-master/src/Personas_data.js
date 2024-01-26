import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, Table, TableHead, TableBody, TableRow, TableCell, TextField, Button, Avatar, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

function Personas(props) {
  const [personToDelete, setPersonToDelete] = useState(null);
  const [personData, setPersonData] = useState([]);
  const [newNames, setNewNames] = useState({});
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const serverPort = process.env.REACT_APP_SERVER_PORT;

  const handleNewNameChange = (id, value) => {
    setNewNames(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {

    axios.get(`http://${serverIp}:${serverPort}/api/get_person_data`)
      .then(response => {
        setPersonData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleUpdatePerson = (id) => {
    const newName = newNames[id];

    axios.put(`http://${serverIp}:${serverPort}/api/get_person_data`, {
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

  const handleDeletePerson = (id) => {
    // Abrir el diálogo de confirmación
    setPersonToDelete(id);
    setConfirmationDialogOpen(true);
  };

  const confirmDeletion = () => {
    // Cierra el diálogo de confirmación
    setConfirmationDialogOpen(false);

    // Verifica si la confirmación está marcada
    if (confirmationChecked) {
      // Elimina la persona si la confirmación está marcada

      // Primero, eliminar los registros asociados a la persona
      axios.delete(`http://${serverIp}:${serverPort}/api/delete_auth_records/${personToDelete}`)
        .then(response => {
          // Luego, eliminar la persona
          axios.delete(`http://${serverIp}:${serverPort}/api/delete_person/${personToDelete}`)
            .then(response => {
              fetchData();  // Vuelve a cargar los datos después de la eliminación
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const handleConfirmationCheckboxChange = (event) => {
    // Maneja el cambio en la confirmación del checkbox
    setConfirmationChecked(event.target.checked);
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
            <TableCell align="center">Acciones</TableCell>
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
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeletePerson(person.id)}
                  style={{ marginLeft: '8px' }}
                >
                  Eliminar
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

      {/* Diálogo de confirmación */}
      <Dialog open={confirmationDialogOpen} onClose={() => setConfirmationDialogOpen(false)}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={confirmationChecked} onChange={handleConfirmationCheckboxChange} />}
            label="¿Estás seguro que quieres realizar esta acción?"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDeletion} color="secondary" disabled={!confirmationChecked}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Personas;
