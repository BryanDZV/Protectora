const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');// para poder unir rutas
const { connect } = require("./hola/db");


// Inicializar la aplicación
const app = express();

// Conectar a la base de datos
connect();

// Habilitar CORS con opciones específicas
app.use(cors({
  origin: '*', // Cambia esto según tu entornohttp://localhost:4200
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configurar bodyParser para manejar solicitudes JSON y URL-encoded
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(bodyParser.json({ limit: '20mb' }));

// Rutas de API
const userRouter = require('./Back/routes/userRoutes');
const formsRouter = require('./Back/routes/formsRoutes');
const animalesRoutes = require('./Back/routes/animalesRoutes');
const testRouter = require('./Back/routes/testRoutes');


app.use("/animales", animalesRoutes);
app.use("/form", formsRouter);
app.use("/user", userRouter);
app.use("/test", testRouter);

//PARA PROBAR QUE RECIBES LOS DATOS DEL SERVIDOR ES http://localhost:5002/test/test-animales OOO http://localhost:5002/animales

// Servir archivos estáticos
app.use(express.static(path.join(__dirname,'dist', 'protectora', 'browser')));

// Ruta para manejar cualquier solicitud no manejada (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'protectora', 'browser', 'index.html'));
});



// Escuchar en el puerto especificado
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto : ${PORT}`);//`Servidor escuchando en el puerto http://localhost:${PORT}`
});





























// const express = require("express");
// const dotenv = require("dotenv");
// dotenv.config();
// const axios = require("axios");
// const PORT = process.env.PORT;
// const { connect } = require("./hola/db");
// const cors = require('cors');
// const bodyParser = require('body-parser')


// // nos tenemos que traer nuestra función connect que hemos exportando anteriormente
// const app = express();

// // aqui iniciamos nuestra funcion connect que es la que nos permitira estar ligados o conectados a nuestra base de datos
// connect();

// // Habilitar CORS para todas las solicitudes cone sto puedo hacer peti desde front
// app.use(cors({
//   origin: '*', // http://localhost:4200Cambia esto a tu URL de frontend en producción
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // nos vamos a traer nuestro router que esta ahora mismo exportado en nuestra carpeta de routes

// const userRouter = require ('./Back/routes/userRoutes');
// const formsRouter = require ('./Back/routes/formsRoutes');
// const animalesRoutes = require("./back/routes/animalesRoutes");
// // const Animal = require("./back/models/animalModel");
// app.use(
//   bodyParser.urlencoded({
//     limit: '20mb',
//     extended: true
//   })
// )
// app.use(
//   bodyParser.json({
//     limit: '20mb'
//   })
// )

// app.use("/animales", animalesRoutes);
// app.use("/form",formsRouter)
// app.use("/user",userRouter)

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // Escucha en el puerto especificado
// app.listen(PORT, () => {
//     console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
// });























