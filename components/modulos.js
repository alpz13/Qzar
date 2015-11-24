/*jslint
  indent: 4, unparam: true
 */
'use strict';

var mysql = require('mysql');

var credenciales = require('../database/credencialesbd.json');

function crearModulo(moduloNuevo, callback) {

    var bd = mysql.createConnection(credenciales),
        sql = 'INSERT INTO Modulos(nombre, numeroModulo, activo) VALUES(?,?,1);',
        params = [moduloNuevo.nombre, moduloNuevo.numeroModulo];

    bd.connect();

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err, resultado) {
        bd.end();
        if (err) {
            callback(err);
        } else {
            callback(null, resultado.insertId);
        }
    });
}

function listarModulos(callback) {

    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT m.idModulo, m.nombre, m.numeroModulo, u.nombre as admin FROM Modulos AS m LEFT JOIN (SELECT nombre, idModulo FROM Usuarios WHERE (idRoles = 2 OR idRoles = 1) AND activo = 1 GROUP BY idModulo) AS u ON m.idModulo = u.idModulo WHERE m.activo = 1;';

    bd.connect();

    // Ejecuta consulta.
    bd.query(sql, function (err, resultados) {
        bd.end();
        if (err) {
            callback(err);
        } else {
            callback(null, resultados);
        }
    });
}

function mostrarModulos(id, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'SELECT m.idModulo, m.nombre, m.numeroModulo, u.nombre as admin, m.ancho, m.alto FROM Modulos AS m LEFT JOIN (SELECT nombre, idModulo FROM Usuarios WHERE (idRoles = 2 OR idRoles = 1) AND activo = 1 GROUP BY idModulo) AS u ON m.idModulo = u.idModulo WHERE m.idModulo = ? AND m.activo = 1;',
        params= [id];
    
    sql = mysql.format(sql, params);

    bd.connect();

    bd.query(sql, function (err, resultados) {
        bd.end();
        if (err) {
            callback(err, []);
        } else {
            callback(null, resultados);
        }
    });
}

function actualizarModulo(modulo, callback) {

    var bd = mysql.createConnection(credenciales),
        sql = 'UPDATE Modulos SET nombre = ?, numeroModulo = ? WHERE idModulo = ?;',
        params = [modulo.nombre, modulo.numeroModulo, modulo.idModulo];

    bd.connect();

    // Prepara consulta y la ejecuta.
    sql = mysql.format(sql, params);
    bd.query(sql, function (err) {
        if (err) {
            bd.end();
            return callback(err);
        }
        bd.end();
        return callback(null);
    });
}

var eliminaHuerta = function (idModulo, callback) {
  var credenciales = require('../database/credencialesbd.json');
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //Crea la coneccion
  var connection = mysql.createConnection(credenciales);
  //Prueba si se conecto correctamente a la base de datos
  connection.connect(function (err) {
    if(!err) {
      console.log("Database is connected ... \n");
      //Guardar el cuadrito
      connection.query("DELETE FROM Cuadritos USING Cuadritos, Sectores, Modulos WHERE Sectores.idModulos = '"+idModulo+"' AND Cuadritos.idSectores = Sectores.idSector", function (err, rows, fields) {
        //Funcion callback del query
        if (!err) {
          //Si no ocurrio un error al realizar la query
          return callback(null, fields);
        } else {
          //Error al ejecutar el query
          return callback(err, []);
          console.log(err);
        }
      });
      //Termina la conexion
    } else {
      console.log("Error connecting database ... \n");  
    }
    connection.end();
  });
  
}

function eliminarModulo(id, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = 'UPDATE Modulos SET activo=0 WHERE idModulo=?;',
        params= [id];
    
    sql = mysql.format(sql, params);

    bd.connect();

    bd.query(sql, function (err, resultados) {
        if (err) {
            bd.end();
            return callback(err, []);
        }
        eliminaHuerta(id, callback);
        bd.end();
        
    });
}



function desplegarCuadritos(idModulo, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = "Select ContenidoCuadritos.color, ContenidoCuadritos.nombre, Cuadritos.x, Cuadritos.y, Sectores.numeroSector from Sectores, Cuadritos, ContenidoCuadritos where Sectores.idModulos = ? AND Sectores.idSector = Cuadritos.idSectores AND Cuadritos.idContenidoCuadritos = ContenidoCuadritos.idContenidoCuadritos",
        params= [idModulo];
    
    sql = mysql.format(sql, params);

    bd.connect();

    bd.query(sql, function (err, resultados) {
        if (err) {
            bd.end();
            return callback(err, []);
        }
        bd.end();
        return callback(null, resultados);
    });
}


//Borra el tamaño de la huerta
function borraHuerta(idModulo, alto, ancho, callback){
    var bd = mysql.createConnection(credenciales),
        sql = "UPDATE Modulos SET Modulos.alto = ?, Modulos.ancho = ? WHERE Modulos.idModulo = ? ",
        params= [alto, ancho, idModulo];
    
    sql = mysql.format(sql, params);

    bd.connect();

    bd.query(sql, function (err, resultados) {
        if (err) {
            bd.end();
            return callback(err, []);
        }
        bd.end();
        return callback(null, resultados);
    });
}


module.exports = {
    'crear' : crearModulo,
    'listar' : listarModulos,
    'mostrar' : mostrarModulos,
    'actualizar' : actualizarModulo,
    'eliminar' : eliminarModulo,
    'desplegar': desplegarCuadritos,
    'borraHuerta': borraHuerta
};
