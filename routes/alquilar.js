const express = require('express');
const router = express.Router();

const mongodb = require('mongodb');
const { ObjectId } = require('mongodb');

router.get('/', (req, res) => {
  const collection = req.app.locals.collection;

  collection.find({}).limit(1000).toArray()
    .then(results => {
      res.render('alquilar', { listings: results, title: 'ApViMad' });
      console.log("Estás en la vista de alquilar");
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los datos' });
    });
});

router.get('/create', (req, res) => {
    res.render('alquilarCreate', { title: 'ApViMad' });
});

// Crear un nuevo elemento
router.post('/create', (req, res) => {
    const collection = req.app.locals.collection;
    const newListing = req.body;
  
    collection.insertOne(newListing)
      .then(result => {
        res.redirect('/alquilar'); // Redirige a la página de visualización después de crear el nuevo documento
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el nuevo documento' });
      });
  });


router.put('/:id', (req, res) => {
  const collection = req.app.locals.collection;
  const listingId = req.params.id;
  const updatedListing = req.body;

  collection.updateOne({ _id: new ObjectId(listingId) }, { $set: updatedListing })
    .then(result => {
      res.json({ message: 'Documento actualizado correctamente' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el documento' });
    });
});

router.delete('/:id', (req, res) => {
    const collection = req.app.locals.collection;
    const listingId = req.params.id;
  
    collection.deleteOne({ _id: listingId })
      .then(result => {
        res.sendStatus(200);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el documento' });
      });
  });
  
  
  
  

module.exports = router;
