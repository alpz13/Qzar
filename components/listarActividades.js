/*jslint
    indent: 4
*/
var mysql = require('mysql');

/* Se incluye el archivo que contiene las credenciales de la conexión a la BD: credencialesdb.json*/
var credenciales = require('../database/credencialesbd.json');
var categoria = require('../components/categoria.js');

/*  Funcion listaractividades(res)
    - Necesita crear la conexión con la base de datos, en base a las credenciales hechas
    - Se realiza la consulta con una consulta y una función que maneja tanto el error, como la consulta
    - Se cierra la conexión con la DB
    - Se hace el renderizado con la vista: actividades.jade, mandandole la consulta: rows

*/

var listaractividades = function (req, res) {
    var db = mysql.createConnection(credenciales);
    db.connect();
    db.query('select * from Actividades, Categorias where idCategoria = idCategoriaAct and Actividades.activo = 1;', function (err, rows) {
        if (err) {
            console.log("Sucedio el error" + err);
        }
        db.end();

        categoria.listar(function (err, resCategorias) {
        if (err) {
            console.log(err);
        }
        //res.render('categoria',{ titulo: 'Categorias', usuario: req.session.usuario, barraLateral: 'categorias', categorias:resCategorias});
        res.render('actividades', { title: 'Actividades', actividades: rows, usuario: req.session.usuario, barraLateral: 'actividades', categorias:resCategorias });
        });

        //res.render('actividades', { title: 'Actividades', actividades: rows, usuario: req.session.usuario, barraLateral: 'actividades' });
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
