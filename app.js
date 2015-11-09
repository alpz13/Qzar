/*jslint
    indent: 4, unparam: true
*/
'use strict';

// npm
var express = require('express');
var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var inicio = require('./routes/inicio');
var sesiones = require('./routes/sesiones');
var modulos = require('./routes/modulos');
var usuarios = require('./routes/usuarios');
var actividades = require('./routes/actividades');
var retroalimentaciones = require('./routes/retroalimentaciones');
var lotes = require('./routes/lotes');

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

// URLs del sitio.
app.use('/', inicio);
// Si no ha iniciado sesión, se va directo a login.
app.get(/.*/, function(req, res, next) {
    if (!req.session.usuario) {
        res.redirect('/');
    } else {
        next();
    }
});
app.use('/sesiones', sesiones);
app.use('/modulos', modulos);
app.use('/actividades', actividades);
app.use('/usuarios', usuarios);
app.use('/lotes', lotes);
app.use('/retroalimentacion', retroalimentaciones);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('No se encontró la página que buscabas.');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.set('env', 'development');
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            usuario: req.session.usuario,
            mensaje: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        usuario: req.session.usuario,
        mensaje: err.message,
        error: {}
    });
});

module.exports = app;
