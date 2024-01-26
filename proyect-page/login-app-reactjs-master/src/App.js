import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // Importa tu archivo de estilos principal
import Login from './Login';
import Personas from './Personas_data';
import Autenticaciones from './Personas_auten'
import AgregarPersona from './AgregarPersona'; // Ajusta la ruta según tu estructura de carpetas
import Home from './Home';
import Navbar from './Utils/Navbar'; // Asegúrate de importar el componente Navbar
import Home2 from './Home2'
import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import { getToken, removeUserSession, setUserSession } from './Utils/Common';

function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    console.log('Token al inicio:', token);

    if (!token) {
      console.log('No hay token. Saliendo.');
      setAuthLoading(false);
      return;
    }
    const serverIp = process.env.REACT_APP_SERVER_IP;
    axios.get(`http://${serverIp}:4000/verifyToken?token=${token}`)
    .then(response => {
      console.log('Respuesta del servidor:', response);

      if (response.data && response.data.token && response.data.user) {
        setUserSession(response.data.token, response.data.user);
        console.log('Token y usuario almacenados. Desactivando carga de autenticación.');
        setAuthLoading(false);
      } else {
        console.log('La respuesta del servidor no contiene token o usuario.');
        removeUserSession();
        setAuthLoading(false);
      }
    }).catch(error => {
      console.error('Error al verificar el token:', error);
      removeUserSession();
      setAuthLoading(false);
    });
  }, []);

  if (authLoading) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Navbar />
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PrivateRoute exact path="/home-2" component={Home2} />
              <PublicRoute path="/login" component={Login} />
              <PrivateRoute path="/Usuarios" component={Personas} />
              <PrivateRoute path="/Registros" component={Autenticaciones} />
              <PrivateRoute path="/Agregar_personas" component={AgregarPersona} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
