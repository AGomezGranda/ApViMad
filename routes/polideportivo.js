const express = require('express');
const router = express.Router();
const path = require('path');

// Ruta para manejar la vista de polideportivos
router.get('/polideportivo', (req, res) => {
  // res.send('Estas en la vista de polideportivos');
  res.render('polideportivo', { title: 'ApViMad' });
});

module.exports = router;
