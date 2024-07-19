const express = require("express");
// me voy a traer mis funciones o mejor dicho controladores de mi carpeta controllers aqui para tener en este archivo solo lo que son las rutas
const {
  getAnimales,
  postAnimal,
  putAnimal,
  deleteAnimal,
  getAnimalById,
} = require("../controllers/animalesControllers");

const animalesRoutes = express.Router();

// CRUD
// CREATE = meter informacion a la base de datos que es un POST
// READ = leer la información de la BBDD que es un GET
// UPDATE = actualizar la información de la BBDD que puede ser un PATCH o un PUT
// DELETE = borrar la información de la BBDD que es un DELETE

// Rutas para las operaciones CRUD
animalesRoutes.get("/", getAnimales);
animalesRoutes.post("/", postAnimal);
animalesRoutes.put("/:id", putAnimal);
animalesRoutes.delete("/:id", deleteAnimal);
animalesRoutes.get("/:id", getAnimalById);

module.exports = animalesRoutes;
