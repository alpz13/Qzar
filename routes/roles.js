'use strict';

var express = require('express');
var router = express.Router();
var mysql = require('mysql');   

/* */
router.get('/', function (req, res, next) {
    var conexion = require('mysql').createConnection(require('../database/credencialesbd.json'));
    /*
    var consulta = 'SELECT P.idPermiso ,P.nombre FROM qzardb.Permisos as P ,qzardb.RolesPermisos as RP ,qzardb.Usuarios as U WHERE U.nombre = ? AND U.idRoles = RP.idRoles AND P.idPermiso = RP.idPermisos;';
    var valores = [nombreUsuario];
    */
    var consulta = 'SELECT R.idRol, R.nombre FROM qzardb.Roles as R WHERE R.activo = 1';

    conexion.query({sql: consulta, values: []}, function (err, renglones) {
        conexion.end();
        if (err) {
            // TO-DO: manejar el error!
            res.render('index', {usuario: req.session.usuario, mensaje: err, titulo: '###', aviso: {tipo: 'danger', icono: 'fa fa-exclamation-triangle', mensaje: err}});
            return;
        }
        /*
        var roles = [];
        for(var v in renglones) {
            roles.push(renglones[v]['nombre']);
        }
        */
        res.render('roles', {usuario: req.session.usuario, barraLateral: 'roles', titulo: 'Roles', roles: renglones});
    });
});

/* */
router.post('/crear', function (req, res, next) {
    res.send('Yay!');
});

/* */
router.post('/modificar/:id', function (req, res, next) {

});

/* */
router.post('/eliminar/:id', function (req, res, next) {

});

module.exports = router;