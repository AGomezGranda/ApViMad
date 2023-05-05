const express = require('express');
const router = express.Router();
const path = require('path');

// Ruta para manejar la vista de polideportivos
router.get('/polideportivo', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/polideportivo.ejs'));
});

module.exports = router;
