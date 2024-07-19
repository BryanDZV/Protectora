const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const PORT = process.env.PORT;
const { connect } = require("./hola/db");
const cors = require('cors');
const bodyParser = require('body-parser')


// nos tenemos que traer nuestra función connect que hemos exportando anteriormente
const app = express();

// aqui iniciamos nuestra funcion connect que es la que nos permitira estar ligados o conectados a nuestra base de datos
connect();

// Habilitar CORS para todas las solicitudes cone sto puedo hacer peti desde front
app.use(cors());

// nos vamos a traer nuestro router que esta ahora mismo exportado en nuestra carpeta de routes

const userRouter = require ('./Back/routes/userRoutes');
const formsRouter = require ('./Back/routes/formsRoutes');
const animalesRoutes = require("./back/routes/animalesRoutes");
// const Animal = require("./back/models/animalModel");
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true
  })
)
app.use(
  bodyParser.json({
    limit: '20mb'
  })
)

app.use("/animales", animalesRoutes);
app.use("/form",formsRouter)
app.use("/user",userRouter)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Escucha en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});























