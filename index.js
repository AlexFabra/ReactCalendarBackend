//es un import:
const express = require('express');
//para disponer de las variables de entorno de la carpeta env (necesario instalar npm i dotenv)
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./config');

//crear servidor de express (necesario instalar npm i express)
const app = express(); 

//bdd conn
dbConnection();

//cors
app.use(cors())

//Directorio publico
//middleware: función que se ejecuta cuando se hace una peticion al servidor
//este sirve para establecer un directorio publico
app.use(express.static('public'));

//lectura y parseo del body:
//las peticiones que vengan en formato json se van a procesar:
app.use(express.json());

//todo lo este
app.use('/api/auth', require('./routes/auth'));

app.use('/api/events', require('./routes/events'));

//Rutas:
// app.get('/',(req,res)=>{
//     res.json({ok:true})
// })
//escuchar peticiones:
app.listen(process.env.PORT,()=>{console.log(`Servidor activo en el puerto ${process.env.PORT}`)})