import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setUserSession } from './Utils/Common';
import { getUser, removeUserSession } from './Utils/Common';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

function Home(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
  const user = getUser();

  useEffect(() => {
    if (user) {
      props.history.push('/home-2');
    }
  }, [props.history, user]);

  const handleLogin = () => {
    setError(null);
    setLoading(true);
    const serverIp = process.env.REACT_APP_SERVER_IP;
    axios.post(`http://${serverIp}:4000/users/signin`, {
    username: username.value,
    password: password.value
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
          setError('El usuario o la contraseña son incorrectos, por favor validar de nuevo.');
        }
      });
  };

  const handleLogout = () => {
    removeUserSession();
    props.history.push('/');
  };

  return (
    <Container>
      {user ? (
        <Box textAlign="center">
          <Typography variant="h4">¡Bienvenidos!</Typography>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      ) : (
        <Box textAlign="center">
          <Typography variant="h4">¡Bienvenidos!</Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              label="Usuario"
              type="text"
              {...username}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Contraseña"
              type="password"
              {...password}
              sx={{ mb: 2 }}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange: handleChange,
  };
};

export default Home;
