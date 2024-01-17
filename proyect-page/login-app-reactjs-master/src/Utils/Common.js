// return the user data from the session storage
export const getUser = () => {
  const userStr = sessionStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
}

// return the token from the session storage
export const getToken = () => {
  const token = sessionStorage.getItem('token');
  const tokenExp = sessionStorage.getItem('tokenExp');

  if (!token || !tokenExp) {
    console.log('No hay token o tiempo de expiración.');
    return null;
  }

  const currentTime = new Date().getTime() / 1000; // tiempo actual en segundos
  console.log('Tiempo actual:', currentTime);
  console.log('Tiempo de expiración del token:', tokenExp);

  if (currentTime > tokenExp) {
    console.log('Token expirado. Eliminando token y tiempo de expiración.');
    removeUserSession();
    return null;
  }

  console.log('Token válido.');
  return token;
};

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

export const setUserSession = (token, user) => {
  sessionStorage.setItem('token', token);

  // Calcular el tiempo de expiración del token (por ejemplo, 30 segundos desde ahora)
  const tokenExp = new Date().getTime() / 1000 + 600; // 30 segundos de duración

  console.log('Tiempo de expiración del token:', tokenExp);

  sessionStorage.setItem('tokenExp', tokenExp);
  sessionStorage.setItem('user', JSON.stringify(user));
};
