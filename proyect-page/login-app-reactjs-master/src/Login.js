import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from './Utils/Common';


function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    const serverIp = process.env.REACT_APP_SERVER_IP;
    console.log(serverIp);
    axios.post(`http://${serverIp}:4000/users/signin`, {
    username: username.value,
    password: password.value
    })
    
    .then(response => {
      setLoading(false);
      setUserSession(response.data.token, response.data.user);
      props.history.push('/dashboard');
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 400) setError(error.response.data.message);
      else setError("Se presento un problema para iniciar sesión.");
    });
  }

  return (
    <div>
      Login<br /><br />
      <div>
        Username<br />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;
