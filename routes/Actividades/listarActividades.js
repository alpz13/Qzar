/*jslint
    indent: 4
*/
var mysql = require('mysql');

/* Se incluye el archivo que contiene las credenciales de la conexión a la DB: credencialesdb.js*/
var credenciales = require('../../database/credencialesdb.js');

/*  Funcion listaractividades(res)
    - Necesita crear la conexión con la base de datos, en base a las credenciales hechas
    - Se realiza la consulta con una consulta y una función que maneja tanto el error, como la consulta
    - Se cierra la conexión con la DB
    - Se hace el renderizado con la vista: actividades.jade, mandandole la consulta: rows

*/

var listaractividades = function (res) {
    var db = mysql.createConnection(credenciales);
    db.connect();
    db.query('Select * from actividades', function (err, rows) {
        if (err) {
            console.log("Sucedio el error" + err);
            db.end();
        }
        db.end();
        res.render('actividades', {
            title: 'Actividades',
            actividades: rows
        });
    });
};

module.exports = {
    'listaractividades' : listaractividades
};