var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/comprar', function(req, res, next) {
  res.render('comprar', { title: 'ApViMad' });
});

module.exports = router;
