import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setUserSession } from './Utils/Common';
import { getUser, removeUserSession } from './Utils/Common';
import Home2 from './Home2'
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
      props.history.push('/home-2'); // Cambié la redirección a '/dash' en lugar de '/'
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
        props.history.push('/'); // Redirigir al inicio de sesión exitoso
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
    <div>
      {user ? (
        // Si el usuario ya ha iniciado sesión, muestra el botón de cierre de sesión
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        // Si no ha iniciado sesión, muestra el formulario de inicio de sesión
        <div>
          Welcome to the Home Page!
          <div>
            Login<br /><br />
            <div>
              Username<br />
              <input type="text" {...username} autoComplete="new-password" />
            </div>
            <div style={{ marginTop: 10 }}>
              Password<br />
              <input type="password" {...password} autoComplete="new-password" />
            </div>
            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
            <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />
          </div>
        </div>
      )}
    </div>
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
