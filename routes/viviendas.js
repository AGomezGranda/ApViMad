const express = require('express');
const router = express.Router();
const Vivienda = require('../models/vivienda');
const methodOverride = require('method-override');
const dbo = require('../db/conn');
dbo.connectToDatabase();
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);
const COLLECTION = 'viviendas';


router.use(methodOverride('_method'));

// Obtener todas las viviendas
router.get('/', async (req, res) => {
  let limit = MAX_RESULTS;
  if (req.query.limit){
    limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
  }
  let next = req.query.next;
  let query = {}
  if (next){
    query = {_id: {$lt: new ObjectId(next)}}
  }
  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection(COLLECTION)
    .find(query,{projection:{descripcion:1, barrio:1, calle:1, numero:1, piso:1, propietario:1, precio:1}})
    .sort({_id: -1})
    .limit(limit)
    .toArray()
    .catch(err => res.status(400).send('Error searching for viviendas'));

  next = results.length == limit ? results[results.length - 1]._id : null;
  res.render('viviendas', { title: 'ApViMad', viviendas: results });
});

// Obtener una vivienda concreta
router.get('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  let query = {_id: new ObjectId(req.params.id)};
  let result = await dbConnect
    .collection(COLLECTION)
    .findOne(query);
  if (!result){
    res.send("Not found").status(404);
  } else {
    res.render('vivienda', { title: 'ApViMad', vivienda: result });
  }
});

// Vista de crear una vivienda
router.get('/create/view', (req, res) => {
  res.render('createVivienda');
});

// Crear una vivienda
router.post('/', async (req, res) => {
  const dbConnect = dbo.getDb();
  let result = await dbConnect
    .collection(COLLECTION)
    .insertOne(req.body);
  if (!result){
    res.send("Not found").status(404);
  } else {
    res.redirect('/viviendas');
  }
});

// Ruta para acceder a la vista de editar
router.get('/editar/:id', async (req, res) => {
  const { id } = req.params;
  const dbConnect = dbo.getDb();
  let query = {_id: new ObjectId(id)};
  let vivienda = await dbConnect
    .collection(COLLECTION)
    .findOne(query);
  if (!vivienda) {
    res.status(404).json({ message: 'Vivienda no encontrada' });
  } else {
    res.render('editar', { vivienda });
  }
});

// Ruta para actualizar una vivienda
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion, barrio, calle, numero, piso, propietario, precio } = req.body;
  const dbConnect = dbo.getDb();
  let result = await dbConnect
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { descripcion, barrio, calle, numero, piso, propietario, precio } });
  if (!result || result.modifiedCount === 0) {
    return res.status(404).json({ message: 'Vivienda no encontrada' });
  }
  res.redirect('/viviendas');
});

// Eliminar una vivienda
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const dbConnect = dbo.getDb();
  let result = await dbConnect
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    res.status(404).json({ message: 'Vivienda no encontrada' });
  } else {
    res.redirect('/viviendas');
  }
});

module.exports = router;
