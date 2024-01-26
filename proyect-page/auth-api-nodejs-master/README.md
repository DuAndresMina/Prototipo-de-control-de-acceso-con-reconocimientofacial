# Servidor Express de Logeo

Este proyecto es un servidor Express que proporciona servicios de autenticación y autorización para una aplicación. Se basa en el trabajo inicial de [cluemediator](https://github.com/cluemediator/auth-api-nodejs), al que agradecemos por su contribución.

## Instrucciones de Uso

### Requisitos Previos
Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu máquina.

### Configuración del Entorno
1. Clona este repositorio en tu máquina local.
2. Crea un archivo `.env` en la raíz del proyecto y configura las variables de entorno necesarias. Puedes utilizar el archivo `.env.example` como referencia.

### Instalación de Dependencias
Ejecuta el siguiente comando para instalar las dependencias:

```bash
npm install
```

## Iniciar el Servidor

Ejecuta el siguiente comando para iniciar el servidor:

```bash
npm start
```

## Variables de Entorno
Asegúrate de configurar correctamente las siguientes variables de entorno en tu archivo `.env`:

Puerto en el que se ejecutará el servidor (por defecto, 4000) : `PORT`.

Configuración de la base de datos MySQL: `DB_HOST`, `DB_USER,`, `DB_PASSWORD`, `DB_DATABASE`.

Clave secreta para la generación de tokens JWT. (por defecto, ABCDEF$123): `JWT_SECRET`.


## Contribuciones y Agradecimientos
Este proyecto se basa en el trabajo inicial de cluemediator. Agradecemos a la comunidad de código abierto y a todos aquellos que han contribuido a este proyecto.
