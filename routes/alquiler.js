const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const xml2js = require('xml2js');
const fs = require('fs');
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);
const COLLECTION = 'alquiler';

// Cargar el schema XML
const xmlSchema = fs.readFileSync(__dirname + '/alquiler.xsd', 'utf-8');

// Middleware de análisis de JSON
router.use(express.json());

// Conexión a la base de datos
dbo.connectToDatabase();

// Obtener todos los registros de alquiler en formato XML
router.get('/', async (req, res) => {
  let limit = MAX_RESULTS;
  if (req.query.limit) {
    limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
  }
  let next = req.query.next;
  let query = {};
  if (next) {
    query = { _id: { $lt: new ObjectId(next) } };
  }
  
  if (req.query.barrio) {
    query.barrio = req.query.barrio;
  }

  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection(COLLECTION)
    .find(query, { projection: { descripcion: 1, barrio: 1, calle: 1, numero: 1, piso: 1, propietario: 1, precio: 1 } })
    .sort({ _id: -1 })
    .limit(limit)
    .toArray()
    .catch(err => res.status(400).send('Error searching for viviendas'));

  next = results.length == limit ? results[results.length - 1]._id : null;
  res.render('alquiler', { title: 'ApViMad', viviendas: results });
});

// Obtener un registro de alquiler por ID en formato XML
router.get('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  let query = { _id: new ObjectId(req.params.id) };
  let result = await dbConnect.collection(COLLECTION).findOne(query);
  if (!result) {
    res.send('Not found').status(404);
  } else {
    const xmlBuilder = new xml2js.Builder({
      rootName: 'alquiler',
      headless: true,
      xmldec: { version: '1.0', encoding: 'UTF-8' },
      xmlSchema: xmlSchema,
    });
    const xml = xmlBuilder.buildObject(result);

    res.set('Content-Type', 'application/xml');
    res.send(xml).status(200);
  }
});


router.get('/create/view', (req, res) => {
  res.render('createAlquiler');
});


// Agregar un registro de alquiler en formato XML
router.post('/', async (req, res) => {
  const dbConnect = dbo.getDb();
  let result = await dbConnect.collection(COLLECTION).insertOne(req.body);
  if (!result) {
    res.send('Not found').status(404);
  } else {
    res.redirect('/alquiler');
  }
});


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
    res.render('editarAlquiler', { vivienda });
  }
});



// Actualizar un registro de alquiler por ID
router.put('/:id', async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const update = { $set: req.body };
  const options = { returnOriginal: false };
  const dbConnect = dbo.getDb();
  let result = await dbConnect.collection(COLLECTION).findOneAndUpdate(query, update, options);
  if (!result.value) {
    res.send('Not found').status(404);
  } else {
    res.redirect('/alquiler');
  }
});

// Eliminar un registro de alquiler por ID
router.delete('/:id', async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const dbConnect = dbo.getDb();
  let result = await dbConnect.collection(COLLECTION).deleteOne(query);
  if (result.deletedCount === 0) {
    res.status(404).json({ message: 'Vivienda no encontrada' });
  } else {
    res.redirect('/alquiler');
  }
});

router.get('/barrio/:barrio', async (req, res) => {
  const barrio = req.params.barrio;

  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection(COLLECTION)
    .find({ barrio: barrio }, { projection: { descripcion: 1, barrio: 1, calle: 1, numero: 1, piso: 1, propietario: 1, precio: 1 } })
    .toArray()
    .catch(err => res.status(400).send('Error searching for alquileres'));

  res.render('alquiler', { title: 'ApViMad', viviendas: results });
});

module.exports = router;
