const Animal = require("../models/animalModel");

const getAnimales = async (req, res) => {
  try {
    // Obtener parámetros de consulta
    const { ciudad, especie, genero, tamaño, edad } = req.query;

    // Crear objeto de filtro con los parámetros proporcionados
    const filter = {};
    if (ciudad) filter.ciudad = ciudad;
    if (genero) filter.genero = genero;
    if (tamaño) filter.tamaño = tamaño;
    if (edad) filter.edad = edad;

    // Verificar si hay algún parámetro de consulta
    const hasFilters = Object.keys(filter).length > 0;

    let animalesFiltrados;
    if (hasFilters) {
      if (especie) {
        // Dividir los valores de especie por coma y crear un array
        const especiesArray = especie.split(',');
        // Filtrar animales para cada valor de especie y combinar los resultados
        const promises = especiesArray.map(especieValue => Animal.find({ ...filter, especie: especieValue }));
        animalesFiltrados = (await Promise.all(promises)).flat();
      } else {
        animalesFiltrados = await Animal.find(filter);
      }
    } else {
      animalesFiltrados = await Animal.find();
    }

    // Devolver los animales filtrados
    return res.status(200).json(animalesFiltrados);
  } catch (error) {
    return res.status(500).json(error);
  }
};


const getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;
    const animal = await Animal.findById( id ); // Buscar por la propiedad id

    if (!animal) {
      return res.status(404).json({ message: "No se encontró ningún animal con ese ID" });
    }

    return res.status(200).json(animal);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const postAnimal = async (req, res) => {
  try {
    const newAnimal = new Animal(req.body);
    const createdAnimal = await newAnimal.save();
    return res.status(201).json(createdAnimal);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const putAnimal = async (req, res) => {
  try {
    const { id } = req.params;
const updatedAnimal = await Animal.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedAnimal) {
      return res.status(404).json({ message: "No tenemos ningún animal con ese ID" });
    }

    return res.status(200).json(updatedAnimal);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAnimal = await Animal.findOneAndDelete(id);

    if (!deletedAnimal) {
      return res.status(404).json({ message: "No tenemos ningún animal con ese ID" });
    }

    return res.status(200).json(deletedAnimal);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { getAnimales, getAnimalById, postAnimal, putAnimal, deleteAnimal };
