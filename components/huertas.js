/* globals require: true, console: true, module: true */
'use strict';

var mysql = require('mysql');

var credenciales = require('../database/credencialesbd.json');
var connection = mysql.createConnection(credenciales);

function desplegarCuadritos(idModulo, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = "Select ContenidoCuadritos.color, ContenidoCuadritos.nombre, Cuadritos.x, Cuadritos.y, Sectores.numeroSector from Sectores, Cuadritos, ContenidoCuadritos where Sectores.idModulos = ? AND Sectores.idSector = Cuadritos.idSectores AND Cuadritos.idContenidoCuadritos = ContenidoCuadritos.idContenidoCuadritos",
        params= [idModulo];
    
    sql = mysql.format(sql, params);

    //bd.connect();

    bd.query(sql, function (err, resultados) {
        if (err) {
            //bd.end();
            return callback(err, []);
        }
        //bd.end();
        return callback(null, resultados);
    });
}


//Borra el tamaño de la huerta
function borraHuerta(idModulo, alto, ancho, callback){
    var sql = "UPDATE Modulos SET Modulos.alto = ?, Modulos.ancho = ? WHERE Modulos.idModulo = ? ",
        params= [alto, ancho, idModulo];
    
    sql = mysql.format(sql, params);

    //bd.connect();

    bd.query(sql, function (err, resultados) {
        if (err) {
            //bd.end();
            return callback(err, []);
        }
        //bd.end();
        return callback(null, resultados);
    });
}

// Eliminar huerta.
function eliminaHuerta(idModulo) {
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //connection = creaConexion();
  //Guardar el cuadrito
  connection.query("DELETE FROM Cuadritos USING Cuadritos, Sectores, Modulos WHERE Sectores.idModulos = '"+idModulo+"' AND Cuadritos.idSectores = Sectores.idSector", function (err, rows, fields) {
    //Funcion callback del query
    if (!err) {
      //Si no ocurrio un error al realizar la query
      
    } else {
      //Error al ejecutar el query
      console.log(err);
    }
  });
  //Termina la conexion
  //connection.end();
}

function seleccionaCuadrito(idModulo, idSector, cuadrito) {
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //connection = creaConexion();
  //Guardar el cuadrito
  connection.query("SELECT DISTINCT idCuadrito from Cuadritos, Sectores, Modulos WHERE Sectores.idModulos = '"+idModulo+"' AND Sectores.idSector = Cuadritos.idSectores AND Cuadritos.x = '" + cuadrito["ejeX"] + "'   AND Cuadritos.y = '" + cuadrito["ejeY"] + "' ", function (err, rows, fields) {
    //Funcion callback del query
    if (!err) {
      //Si no ocurrio un error al realizar la query
      if(rows.length > 0) {
        //Existe el cuadrito
        var idCuadrito = rows[0].idCuadrito;
        actualizaCuadrito(idModulo, idSector, cuadrito, idCuadrito);
      } else {
        //No existe el cuadrito
        insertaCuadrito(idModulo, idSector, cuadrito);
      }
    } else {
      //Error al ejecutar el query
      console.log(err);
    }
  });
  //Termina la conexion
  //connection.end();
}

function actualizaCuadrito(idModulo, idSector, cuadrito, idCuadrito) {
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //connection = creaConexion();
  //Guardar el cuadrito
  connection.query('UPDATE Cuadritos SET Cuadritos.idSectores = '+idSector+', Cuadritos.idContenidoCuadritos = '+cuadrito["type"]+' WHERE Cuadritos.idCuadrito = '+idCuadrito+'', function (err, rows, fields) {
    //Funcion callback del query
    if (!err) {
      //Si no ocurrio un error al realizar la query
    } else {
      //Error al ejecutar el query
      console.log(err);
    }
  });
  //Termina la conexion
  //connection.end();
}

function insertaCuadrito(idModulo, idSector, cuadrito) {
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //connection = creaConexion();
  //Guardar el cuadrito
  connection.query("INSERT INTO Cuadritos (idSectores, idContenidoCuadritos, x, y) VALUES ('" + idSector + "', '" + cuadrito["type"] + "', '" + cuadrito["ejeX"] + "', '" + cuadrito["ejeY"] + "')", function (err, rows, fields) {
    //Funcion callback del query
    if (!err) {
      //Si no ocurrio un error al realizar la query
    } else {
      //Error al ejecutar el query
      console.log(err);
    }
  });
  //Termina la conexion
  //connection.end();
}

function insertaSector(idModulo, numeroSector, cuadrito, _renglon, cuadritos) {
  //Carga el modulo de mySQL
  console.log("-----------" + numeroSector);
  var mysql = require('mysql');
  //connection = creaConexion();
  //Guardar el cuadrito
  connection.query("INSERT INTO Sectores (idModulos, numeroSector) VALUES ('" + idModulo + "', '" + numeroSector + "')", function (err, rows, fields) {
    //Funcion callback del query
    if (!err) {
      //Si no ocurrio un error al realizar la query
      console.log(rows.insertId);
      seleccionaCuadrito(idModulo, rows.insertId, cuadrito);
      //return rows.insertId;
    } else {
      //Error al ejecutar el query
      console.log("INSERT INTO Sectores (idModulos, numeroSector) VALUES ('" + idModulo + "', '" + numeroSector + "')");
      console.log('Error while performing Query. (insertar sector)');
      console.log(err);
    }
    if(cuadritos.length > _renglon+1)
      selectSector(idModulo, cuadritos, _renglon+1)
    console.log("+++++++++++++++++" + numeroSector);
  });
  //Termina la conexion
  //connection.end();
}

function selectSector(idModulo, cuadritos, _renglon) {
  var cuadrito = cuadritos[_renglon];
  //connection = creaConexion();
  connection.query("SELECT idSector from Sectores WHERE idModulos = '" + idModulo + "' AND numeroSector = '" + cuadrito['sector'] + "'", function (err, rows, fields) {
      if (!err) {
        var idSector;
        if(rows.length > 0) {
          //Existe
          console.log("Select exitoso");
          console.log(rows[0].idSector);
          idSector=rows[0].idSector;
          seleccionaCuadrito(idModulo, idSector, cuadrito);
          if(cuadritos.length > _renglon+1)
            selectSector(idModulo, cuadritos, _renglon+1);
        } else {
          //No existe
          console.log("Select no exitoso");
          idSector = insertaSector(idModulo, cuadrito["sector"], cuadrito, _renglon, cuadritos);
        }
        
      } else {
        console.log('Error while performing Query. (Searching if sector exist)');
        console.log("este es el error joven: " + err);
        //console.log(cuadrito['type']);
        //console.log("SELECT idSector from Sectores WHERE idModulos = '" + idModulo + "' numeroSector = '" + cuadrito['sector'] + "' ");
      }
    
    });
    //connection.end();  
}



function creaConexion() {
  //Prueba si se conecto correctamente a la base de datos
  connection.connect(function (err) {
    if(!err) {
      console.log("Database is connected ... \n"); 
    } else {
      console.log("Error connecting database ... \n");  
    }
  });
  return connection;
}


function tamHuerta(idModulo, alto, ancho) {
  connection.query("UPDATE Modulos set alto = '"+ alto +"', ancho = '"+ ancho +"' WHERE idModulo = '"+ idModulo + "'", function (err, rows, fields) {
      if (!err) {
        console.log("UPDATE Modulos set alto = '"+ alto +"', ancho = '"+ ancho +"' WHERE idModulo = '"+ idModulo + "'");
      } else {
        console.log('Error while performing Query. (Searching if sector exist)');
        console.log("este es el error joven: " + err);
      }
    
    });
    //connection.end();  

}

module.exports = {
    'cuadritos': desplegarCuadritos,
	'borrar': borraHuerta,
	'tamHuerta': tamHuerta,
	'selectSector': selectSector,
	'seleccionaCuadrito': seleccionaCuadrito,
	'actualizar': actualizaCuadrito,
	'inserta': insertaCuadrito
};
