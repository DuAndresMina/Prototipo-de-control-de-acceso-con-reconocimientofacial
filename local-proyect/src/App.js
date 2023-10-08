import React, { useEffect, useState } from 'react';
import './App.css'; // Importa el archivo CSS
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import PersonData from './person_data'; // Importa el componente PersonData
import AuthRecords from './person_auten'; // Importa el componente AuthRecords
import Home from './Home'; // Ajusta la ruta según la ubicación real de tu componente Home

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/persondata">Person Data</Link>
            </li>
            <li>
              <Link to="/authrecords">Auth Records</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/persondata">
            <PersonData />
          </Route>
          <Route path="/authrecords">
            <AuthRecords />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

