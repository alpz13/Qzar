/*jslint
    indent: 4, unparam: true
*/
var mysql = require('mysql');
var credenciales = require('../database/credencialesbd.json');
var listar = require('../components/listarActividades.js');

var agrega = function (req, res) {
    var nombre = req.body.nombreactividad;
    var descripcion = req.body.descripcionactividad;
    var foto = req.body.Url;
    var bd = mysql.createConnection(credenciales);
    var sql = 'INSERT INTO actividades(nombre, descripcion, contenidoMultimedia) VALUES(?,?,?);';
    var params = [nombre, descripcion, foto];
    bd.connect();

    sql = mysql.format(sql, params);
    bd.query(sql, function (err) {
        if (err) {
            bd.end();
            console.log("error");
        }
        bd.end();
        listar.listaractividades(res);
    });

};

module.exports = {
    'agrega' : agrega
};