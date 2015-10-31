var listarActividadesAsignadas = function (idModulo, res) {
  var credenciales = require('../database/credencialesbd.json');
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //Crea la coneccion
  var connection = mysql.createConnection(credenciales);
  //Prueba si se conecto correctamente a la base de datos
  connection.connect(function (err) {
    if (!err) {
      console.log("Database is connected ... \n");
      //Guardar el cuadrito
      console.log("antes de la query");
      //connection.query("select ac.fecha as startDate, ac.fecha as endDate, a.nombre as title, ac.idSectores, s.numeroSector FROM Actividades as a, ActividadesAsignadas as ac, Sectores as s WHERE ac.idModulos = " + idModulo + " AND a.idActividad = ac.idActividades AND s.idSector = ac.idSectores", function (err, rows) {
      connection.query("select ac.fecha as date, a.nombre as title, ac.idSectores, s.numeroSector FROM Actividades as a, ActividadesAsignadas as ac, Sectores as s WHERE ac.idModulos = " + idModulo + " AND a.idActividad = ac.idActividades AND s.idSector = ac.idSectores", function (err, rows) {
        //Funcion callback del query
        console.log("despues de la query");
        if (!err) {
          //Si no ocurrio un error al realizar la query
          console.log(rows);
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(rows));
          return;
          //return rows.insertId;
        }
        //Error al ejecutar el query
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
        return;
      });
      //Termina la conexion
      connection.end();
    } else {
      console.log("Error connecting database ... \n");
    }
  });
};

module.exports = {
  'listarActividadesAsignadas': listarActividadesAsignadas
};
