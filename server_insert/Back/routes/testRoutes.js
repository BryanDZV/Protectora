const express = require("express");
const router = express.Router();
const Animal = require("../../Back/models/animalModel")


// Ruta para obtener todos los animales TEST DEL SERVIDOR

router.get("/test-animales", async (req, res) => {
  try {
    const animals = await Animal.find({});
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los datos", error });
  }
});

module.exports = router;
