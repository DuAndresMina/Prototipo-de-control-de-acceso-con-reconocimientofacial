require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 4000;

// static user details


// Configura los detalles de la conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  isAdmin: process.env.DB_ADMIN === 'true', // Asumiendo que DB_ADMIN será 'true' o 'false' en el .env
};

module.exports = dbConfig;

const dbConnection = mysql.createConnection(dbConfig);

// Conecta a la base de datos
dbConnection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

// Define y exporta la conexión para que puedas usarla en otras partes de tu aplicación
module.exports = dbConnection;

// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue

  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
});


// request handlers
app.get('/', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
  }

  // Realiza una consulta SQL para obtener los detalles del usuario a partir del userId
  const userId = req.user.userId;

  dbConnection.query('SELECT userId FROM usuarios WHERE userId = ?', [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: 'Error al consultar la base de datos.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    const user = results[0];

    // Devuelve los detalles del usuario
    return res.json({ success: true, user });
  });
});

app.post('/users/signin', function (req, res) {
  const user = req.body.username;
  const pwd = req.body.password;

  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Usuario o contraseña son necesarios."
    });
  }

  // Realiza una consulta SQL para verificar las credenciales en la base de datos
  dbConnection.query('SELECT * FROM usuarios WHERE username = ? AND password = ?', [user, pwd], (error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: 'Error al consultar la base de datos.' });
    }

    if (results.length === 0) {
      return res.status(401).json({
        error: true,
        message: "Usuario o contrañesa son incorrectos."
      });
    }

    // Usuario autenticado
    const authenticatedUser = results[0];

    // Generar token
    const token = utils.generateToken(authenticatedUser);
    const userObj = utils.getCleanUser(authenticatedUser);

    return res.json({ user: userObj, token });
  });
});



app.get('/verifyToken', function (req, res) {

  var token = req.body.token || req.query.token;
  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token es necesario."
    });
  }
  // check token that was passed by decoding token using secret
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) return res.status(401).json({
      error: true,
      message: "Token inválido."
    });

    // Realizar una consulta SQL para obtener el usuario correspondiente al userId en el token
    const userId = user.userId;
    dbConnection.query('SELECT userId FROM usuarios WHERE userId = ?', [userId], (error, results) => {
      if (error) {
        return res.status(500).json({
          error: true,
          message: 'Error al consultar la base de datos.'
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          error: true,
          message: "Usuario inválido."
        });
      }

      // Obtener los detalles del usuario
      const userObj = results[0];
      return res.json({ user: userObj, token });
    });
  });
});




app.listen(port, () => {
  console.log('Server started on: ' + port);
});
