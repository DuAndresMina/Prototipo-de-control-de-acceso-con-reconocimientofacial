import React, { useState } from "react";
import "./Navbar.css";
import { NavLink } from 'react-router-dom';
import { getUser, removeUserSession } from './Common';

function Navbar(props) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

// handle click event of logout button
const handleLogout = () => {
  removeUserSession();
  if (props.history) {
    props.history.push('/');
  } else {
    // Handle the case when props.history is undefined
    // You can choose to navigate to another page or handle it accordingly
  }
}


  const user = getUser();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" exact className="nav-logo">
          Facetag
          <i className="fas fa-code"></i>
        </NavLink>

        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <NavLink to="/" exact className="nav-links" onClick={handleClick}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/Usuarios" exact className="nav-links" onClick={handleClick}>
              Usuarios
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/Registros" exact className="nav-links" onClick={handleClick}>
              Registros de Autenticación
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/Invalidos" exact className="nav-links" onClick={handleClick}>
              Registros Inválidos
            </NavLink>
          </li>
          {user ? (
            <li className="nav-item">
              <input 
              type="button" onClick={handleLogout} value="Logout" className="logout-button"/>
            </li>
          ) : null}
        </ul>

        <div className="nav-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
