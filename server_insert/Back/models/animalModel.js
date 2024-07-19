const mongoose = require("mongoose");

// Definición del esquema
const animalSchema = new mongoose.Schema({

  especie: { type: String, required: true },
  edad: { type: String, required: true },
  fechaDeNacimiento: { type: Date, required: true },
  genero: { type: String, required: true },
  size: { type: String, required: true },
  peso: { type: Number, required: true },
  vacunado: { type: Boolean, required: true },
  desparasitado: { type: Boolean, required: true },
  sano: { type: Boolean, required: true },
  esterilizado: { type: Boolean, required: true },
  identificado: { type: Boolean, required: true },
  microchip: { type: Boolean, required: true },
  nombre: { type: String, required: true },
  foto: { type: String, required: true },
  ubicacion: { type: String, required: true },
  ciudad: { type: String, required: true },
  personalidad: [{ type: String, required: true }],
  historia: { type: String, required: true },
  aSaber: { type: String, required: true },
  requisitosAdopcion: { type: String, required: true },
  tasaAdopcion: { type: Number, required: true },
  seEnvia: { type: String, required: true },
  adoptionState: { type: String, required: true }
},{
    timestamps:true
    // te genera la fecha de creacion del objeto y fecha de modificacion
});

// Creación del modelo
//const Animal = mongoose.model("Animal", animalSchema);
// Aquí especifica el nombre de la colección si ya tengo colecciones
const Animal = mongoose.model("Animal", animalSchema,"Animales");
module.exports = Animal;

