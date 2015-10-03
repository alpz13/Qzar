/*jslint
        indent: 4, unparam: true
*/
'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var crearHuerta = require('./routes/crearHuerta');
var formularioCrearHuerta = require('./routes/formularioCrearHuerta'); //donde leer
var crearHuertaGuardar = require('./routes/crearHuertaGuardar');
var modulos = require('./routes/modulos');
var actividades = require('./routes/actividades');
var sesiones = require('./routes/sesiones');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '9582a15ab51eec66ec5c5ed55cdaafb1c28c7375',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/', routes);
app.use('/users', users);
app.use('/modulo/huerta/crear', crearHuerta);//Si llaman esta url, ejecutar
app.use('/modulo/huerta/formulario', formularioCrearHuerta);
app.use('/modulo/huerta/crearGuardar', crearHuertaGuardar);
// Si no ha iniciado sesión, se va directo a login.
app.get(/.*/, function(req, res, next) {
    if (!req.session.usuario) {
        res.redirect('/');
    } else {
        next();
    }
});
app.use('/modulos', modulos);
app.use('/actividades', actividades);
app.use('/sesiones', sesiones);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
