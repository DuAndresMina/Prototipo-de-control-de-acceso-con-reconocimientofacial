import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // Importa tu archivo de estilos principal
import Login from './Login';
import Personas from './Personas_data';
import Autenticaciones from './Personas_auten'
import Personas_fallos from './Personas_fallos';
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
    if (!token) {
      return;
    }

    axios.get(`http://localhost:4000/verifyToken?token=${token}`).then(response => {
      setUserSession(response.data.token, response.data.user);
      setAuthLoading(false);
    }).catch(error => {
      removeUserSession();
      setAuthLoading(false);
    });
  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Navbar /> {/* Asegúrate de incluir el componente Navbar dentro de BrowserRouter */}
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PrivateRoute exact path="/home-2" component={Home2} />
              <PublicRoute path="/login" component={Login} />
              <PrivateRoute path="/Usuarios" component={Personas} />
              <PrivateRoute path="/Registros" component={Autenticaciones} />
              <PrivateRoute path="/Invalidos" component={Personas_fallos} />
              <PrivateRoute path="/Agregar_personas" component={AgregarPersona} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
