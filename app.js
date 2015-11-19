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
var crearHuerta = require('./routes/crearHuerta');
var modulos = require('./routes/modulos');
var actividades = require('./routes/actividades');
var sesiones = require('./routes/sesiones');
var usuarios = require('./routes/usuarios');
var asignacion = require('./routes/asignacion');
var retroalimentacion = require('./routes/retroalimentacion');
var sector = require('./routes/sector');
var categoria = require('./routes/categoria');
var roles = require('./routes/roles');

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

//Si llaman esta url, ejecutar
app.use('/', routes);
app.use('/sesiones', sesiones);
// Si no ha iniciado sesión, se va directo a login.
app.get(/.*/, function(req, res, next) {
    if (!req.session.usuario) {
        res.redirect('/');
    } else {
        next();
    }
});
app.post(/.*/, function(req, res, next) {
    if (!req.session.usuario) {
        res.redirect('/');
    } else {
        next();
    }
});
app.use('/modulo/huerta', crearHuerta);
app.use('/modulos', modulos);
app.use('/actividades', actividades);
app.use('/usuarios', usuarios);
app.use('/asignacion', asignacion);
app.use('/retroalimentacion', retroalimentacion);
app.use('/sector', sector);
app.use('/categoria', categoria);
app.use('/roles', roles);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('No se encontró la página.');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.set('env', 'development');
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
		if (err.status === 403) {
			err.message = "No tienes permiso para hacer esta acción. " + err.message;
		}
        res.status(err.status || 500);
        res.render('error', {
            usuario: req.session.usuario,
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	if (err.status === 403) {
		err.message = "No tienes permiso para hacer esta acción. " + err.message;
	}
    res.status(err.status || 500);
    res.render('error', {
        usuario: req.session.usuario,
        message: err.message,
        error: {}
    });
});

module.exports = app;
