import React from 'react';
import styled from 'styled-components';
import { getUser, removeUserSession } from './Utils/Common';

// Crear un componente Styled para el contenedor principal
const Container = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f0f0f0;
`;

// Crear un componente Styled para el título
const Title = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
`;

// Crear un componente Styled para el botón de cierre de sesión
const LogoutButton = styled.button`
  background-color: #e44d26;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d04023;
  }
`;

function Home2(props) {
  const user = getUser(); // Obtén los detalles del usuario desde el almacenamiento local

  // Manejar el cierre de sesión
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/');
  }

  return (
    <Container>
      <Title>Welcome, {user.name}!</Title>
      <LogoutButton  onClick={handleLogout}>Logout</LogoutButton >
      {/* Agrega aquí la interfaz que deseas mostrar después de iniciar sesión */}
    </Container>
  );
}

export default Home2;
