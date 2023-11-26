import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { setUserSession } from './Utils/Common';
import { getUser, removeUserSession } from './Utils/Common';
import Home2 from './Home2';

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

// Crear un componente Styled para el formulario
const Form = styled.div`
  margin-top: 20px;
`;

// Crear un componente Styled para los campos de entrada
const InputField = styled.div`
  margin-bottom: 10px;
`;

// Crear un componente Styled para el botón de inicio de sesión
const LoginButton = styled.input`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// Crear un componente Styled para el mensaje de error
const ErrorMessage = styled.small`
  color: red;
`;

function Home(props) {
  // Estados del componente
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
  const user = getUser(); // Obtén los detalles del usuario desde el almacenamiento local

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      props.history.push('/home-2');
    }
  }, [props.history, user]);

  // Manejar el inicio de sesión
  const handleLogin = () => {
    setError(null);
    setLoading(true);


    // Hacer la llamada a la API para iniciar sesión
    axios
      .post('http://localhost:4000/users/signin', {
        username: username.value,
        password: password.value,
      })
      .then((response) => {
        setLoading(false);
        setUserSession(response.data.token, response.data.user);
        props.history.push('/');
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 400) {
          setError(error.response.data.message);
        } else {
          setError("Something went wrong. Please try again later.");
        }
      });
  }

    // Manejar el cierre de sesión
    const handleLogout = () => {
      removeUserSession();
      props.history.push('/');
    }

  return (
    <Container>
      {user ? (
        // Si el usuario ya ha iniciado sesión, muestra el mensaje de bienvenida y el botón de cierre de sesión
        <div>
          <Title>Welcome, {user.name}!</Title>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        // Si no ha iniciado sesión, muestra el formulario de inicio de sesión
        <div>
          <Title>Welcome to the Home Page!</Title>
          <Form>
            <InputField>
              <div>
                Username<br />
                <input type="text" {...username} autoComplete="new-password" />
              </div>
            </InputField>
            <InputField>
              <div>
                Password<br />
                <input type="password" {...password} autoComplete="new-password" />
              </div>
            </InputField>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <LoginButton type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} />
          </Form>
        </div>
      )}
    </Container>
  );
}

// Función para manejar los campos de entrada del formulario
const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  }

  return {
    value,
    onChange: handleChange,
  };
}

export default Home;
