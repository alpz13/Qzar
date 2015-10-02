/*jslint
    indent: 4, unparam: true
*/
var mysql = require('mysql');
var credenciales = require('../database/credencialesbd.json');
var listar = require('../components/listarActividades.js');

var multiparty = require("multiparty");
var fs = require('fs');

var agrega = function (req, res) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var nombre = fields.nombreactividad;
        var descripcion = fields.descripcionactividad;
        var bd = mysql.createConnection(credenciales);
        var sql = 'INSERT INTO actividades(nombre, descripcion) VALUES(?,?);';
        var params = [nombre, descripcion];
        bd.connect();
        sql = mysql.format(sql, params);
        var nombreId = 0;
        bd.query(sql, function (err, resultado) {
            if (err) {
                bd.end();
                console.log(err);
            }
            bd.end();
            nombreId = resultado.insertId;
            var img = files.ima[0];
            fs.readFile(img.path, function (err, data) {
                var path = "./public/images/actividades/" + nombreId + ".png";
                fs.writeFile(path, data, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("upload success");
                        bd = mysql.createConnection(credenciales);
                        sql = 'INSERT INTO imagenes(ruta) VALUES(?);';
                        params = [nombreId];
                        bd.connect();
                        sql = mysql.format(sql, params);
                        bd.query(sql, function (err) {
                            if (err) {
                                bd.end();
                                console.log(err);
                            }
                            bd.end();
                        });
                    }
                    listar.listar(res);
                });
            });
        });
    });
};

module.exports = {
    'agrega' : agrega
};



