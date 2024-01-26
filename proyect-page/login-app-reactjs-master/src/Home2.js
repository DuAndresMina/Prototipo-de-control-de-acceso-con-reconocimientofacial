import React from 'react';
import { Container, Typography } from '@mui/material';
import { getUser, removeUserSession } from './Utils/Common';

function Home2(props) {
  const user = getUser(); // Obtén los detalles del usuario desde el almacenamiento local

  // Manejar el cierre de sesión
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/');
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        ¡Bienvenidos!
      </Typography>
      {/* Agrega aquí la interfaz que deseas mostrar después de iniciar sesión */}
    </Container>
  );
}

export default Home2;
