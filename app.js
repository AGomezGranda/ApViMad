var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var alquilarRouter = require('./routes/alquilar');

var polideportivoRouter = require('./routes/polideportivo');
var colegioRouter = require('./routes/colegio')
var comprarRouter = require('./routes/comprar');

var app = express();

//Conexion a la base de datos, MongoDB
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoURI = 'mongodb+srv://agomez:Apolin17@cluster-alvarog.vfwblbm.mongodb.net/Cluster-AlvaroG';

MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB Atlas');
    const db = client.db('sample_airbnb');
    const collection = db.collection('listingsAndReviews');
    app.locals.collection = collection;

  })
  .catch(error => console.error(error));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/alquilar', alquilarRouter);

app.get('/polideportivo', polideportivoRouter);
app.get('/colegio', colegioRouter)


app.get('/comprar', comprarRouter);

// app.use('/alquilar', alquilarRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
