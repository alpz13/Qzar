var listarRetroalimentaciones = function (idModulo, res) {
  var credenciales = require('../database/credencialesbd.json');
  var mysql = require('mysql');
  var connection = mysql.createConnection(credenciales);
  connection.connect(function (err) {
    if (!err) {
      console.log("Database is connected ... \n");
      connection.query("select ret.fecha as date, ret.descripcion as descripcion FROM Retroalimentaciones as ret WHERE ret.idModulos = " + idModulo, function (err, rows) {
        if (!err) {
          console.log(rows);
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(rows));
          return;
        }
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
        return;
      });
      connection.end();
    } else {
      console.log("Error connecting database ... \n");
    }
  });
};

module.exports = {
  'listarRetroalimentaciones': listarRetroalimentaciones
};