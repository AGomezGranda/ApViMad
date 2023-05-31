const express = require('express');
const router = express.Router();
const Vivienda = require('../models/vivienda');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

// Obtener todas las viviendas
router.get('/', (req, res) => {
  Vivienda
    .find()
    .then((data) => res.render('viviendas', { title: 'ApViMad', viviendas: data }))
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Obtener una vivienda concreta
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Vivienda
    .findById(id)
    .then((data) => res.json(data))
    .catch((err) => res.json({ message: err }));
});

//vista de crear una vivienda
router.get('/create', (req, res) => {
  res.send('Esta es la vista create')
  //res.render('create');
});

// Crear una vivienda
router.post('/', (req, res) => {
  const vivienda = new Vivienda(req.body);
  vivienda
    .save()
    .then(() => res.redirect('/viviendas'))
    .catch((err) => res.status(400).json({ message: err.message }));
});

// Ruta para acceder a la vista de editar
router.get('/editar/:id', (req, res) => {
  const { id } = req.params;
  Vivienda
    .findById(id)
    .then((vivienda) => {
      if (!vivienda) {
        res.status(404).json({ message: 'Vivienda no encontrada' });
      } else {
        res.render('editar', { vivienda });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Ruta para actualizar una vivienda
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { descripcion, barrio, calle, numero, piso, propietario, precio } = req.body;
  Vivienda
    .updateOne({ _id: id }, { $set: {descripcion, barrio, calle, numero, piso, propietario, precio } })
    .then((vivienda) => {
      if (!vivienda) {
        return res.status(404).json({ message: 'Vivienda no encontrada' });
      }
      res.redirect('/viviendas');
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Eliminar una vivienda
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Vivienda
    .deleteOne({ _id: id })
    .then(() => res.redirect('/viviendas'))
    .catch((err) => res.status(500).json({ message: err.message }));
});

module.exports = router;
  