/*jslint
    indent: 4
*/
var mysql = require('mysql');

/* Se incluye el archivo que contiene las credenciales de la conexión a la BD: credencialesdb.json*/
var credenciales = require('../database/credencialesbd.json');

/*  Funcion listaractividades(res)
    - Necesita crear la conexión con la base de datos, en base a las credenciales hechas
    - Se realiza la consulta con una consulta y una función que maneja tanto el error, como la consulta
    - Se cierra la conexión con la DB
    - Se hace el renderizado con la vista: actividades.jade, mandandole la consulta: rows

*/

var listaractividades = function (req, res, callback) {
    var db = mysql.createConnection(credenciales);
    db.connect();
    //Antes Select * from Actividades where activo = 1
    //Despues Select * from Actividades a, imagenes i where a.activo = 1 and i.idImagenes = a.idActividad
    db.query('Select * from Actividades a, imagenes i where a.activo = 1 and i.idImagenes = a.idActividad', function (err, rows) {
        db.end();
        if (err) {
            console.log("Sucedio el error" + err);
            callback(err);
            return;
        }
        callback(null, rows);
    });
};

/*
    funcion listar solamente hace el redirect hacia la ventana de actividades.
*/
var listar = function (res) {
    res.redirect('/actividades/');
};

module.exports = {
    'listaractividades' : listaractividades,
    'listar' : listar
};
