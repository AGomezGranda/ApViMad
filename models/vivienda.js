const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Definir el esquema de la vivienda
const viviendaSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true
  },
  barrio: {
    type: String,
    required: true
  },
  calle: {
    type: String,
    required: true
  },
  numero: {
    type: Number,
    required: true
  },
  piso: {
    type: String,
    required: true
  },
  propietario: {
    type: String,
    required: true
  },
  precio: {
    type: String,
    required: true
  }
});

viviendaSchema.plugin(mongoosePaginate);
// Crear el modelo de la vivienda
const Vivienda = mongoose.model('Vivienda', viviendaSchema);

module.exports = Vivienda;
