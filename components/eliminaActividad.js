/*jslint
    indent: 4, unparam: true
*/
var mysql = require('mysql');
var credenciales = require('../database/credencialesbd.json');
var listar = require('../components/listarActividades.js');

var fs = require('fs');
var path = require('path');

var elimina = function (req, res) {
    console.log(req.body);
    var idAct = req.body.id;

    var bd = mysql.createConnection(credenciales);
    var sql = 'UPDATE Actividades SET activo = 0 WHERE idActividad = ?';
    var params = [idAct];

    bd.connect();
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultado) {
        if (err) {
            bd.end();
            console.log(err);
        }
        bd.end();
        listar.listar(res);
    });
};

module.exports = {
    'elimina' : elimina
};
