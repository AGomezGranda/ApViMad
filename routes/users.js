var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// POST method route
router.post('/', function (req, res) {
  res.send('POST request to the homepage')
})

// PUT method route with user id
router.put('/users/:id', function (req, res) {
  res.send('PUT request to user with id: ' + req.params.id)
})

// DELETE method route with user id
router.delete('/users/:id', function (req, res) {
  res.send('DELETE request to user with id: ' + req.params.id)
})

module.exports = router;
