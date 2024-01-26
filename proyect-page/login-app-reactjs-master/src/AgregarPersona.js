import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Container, TextField, Button, Avatar, Alert } from '@mui/material';

function AgregarPersona(props) {
  const [nombre, setNombre] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(''); 
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const serverPort = process.env.REACT_APP_SERVER_PORT;
  const handleAgregarPersona = async () => {
    try {
      // Validaciones básicas
      if (!nombre || !imagenFile) {
        setError('Nombre e imagen son obligatorios.');
        return;
      }

      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('imageFile', imagenFile);

      // Realizar la solicitud POST al endpoint de Flask
      const response = await axios.post(`http://${serverIp}:${serverPort}/api/add_person_react`, formData);

      setMensaje(response.data.message);
      setError('');
    } catch (error) {
      setMensaje('');

      // Manejar errores específicos
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Error al agregar persona');
      } else {
        setError('Error al agregar persona');
      }
    }
  };

  // Función para manejar el cambio de archivo en el input de imagen
  const handleImagenChange = (event) => {
    const file = event.target.files[0];
    setImagenFile(file);

    // Mostrar la vista previa de la imagen
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagenPreview(null);
    }
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Agregar Persona
      </Typography>
      {mensaje && <Alert severity="success">{mensaje}</Alert>}
      {error && (
        <Alert severity="error" style={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}
      <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField
          label="Nombre"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <label htmlFor="fileInput">
          <input
            type="file"
            onChange={handleImagenChange}
            accept="image/*"
            style={{ display: 'none' }}
            id="fileInput"
          />
          <Button component="span" variant="contained" color="primary" style={{ marginBottom: 20 }}>
            Subir Imagen
          </Button>
        </label>
        {imagenPreview && (
          <Avatar
            src={imagenPreview}
            alt="Imagen Preview"
            sx={{ width: '150px', height: '150px', marginBottom: '20px', borderRadius: '50%' }}
          />
        )}
        <Button variant="contained" color="primary" onClick={handleAgregarPersona}>
          Agregar Persona
        </Button>
      </form>
    </Container>
  );
}

export default AgregarPersona;
