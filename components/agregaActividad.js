/*jslint
    indent: 4, unparam: true
*/
var mysql = require('mysql');
var credenciales = require('../database/credencialesbd.json');
var listar = require('../components/listarActividades.js');

var multiparty = require("multiparty");
var fs = require('fs');

var insertabd = function (req, res, nombre, descripcion, nombreimagen) {
    var bd = mysql.createConnection(credenciales);
    var sql = 'INSERT INTO actividades(nombre, descripcion, contenidoMultimedia) VALUES(?,?,?);';
    var params = [nombre, descripcion, nombreimagen];
    bd.connect();
    sql = mysql.format(sql, params);
    bd.query(sql, function (err) {
        if (err) {
            bd.end();
            console.log(err);
        }
        bd.end();
        listar.listaractividades(res);
    });
};

var agrega = function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var nombre = fields.nombreactividad;
        var descripcion = fields.descripcionactividad;
        var img = files.ima[0];
        fs.readFile(img.path, function (err, data) {
            var path = "./public/imagenes/actividades/" + img.originalFilename;
            fs.writeFile(path, data, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("upload success");
                    insertabd(req, res, nombre, descripcion, img.originalFilename);
                }
            });
        });
    });

};

module.exports = {
    'agrega' : agrega
};