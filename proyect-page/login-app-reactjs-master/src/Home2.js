import React from 'react';
import { getUser, removeUserSession } from './Utils/Common';

function Home2(props) {
  const user = getUser(); // Obtén los detalles del usuario desde el almacenamiento local

  // Manejar el cierre de sesión
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/');
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={handleLogout}>Logout</button>
      {/* Agrega aquí la interfaz que deseas mostrar después de iniciar sesión */}
    </div>
  );
}

export default Home2;
