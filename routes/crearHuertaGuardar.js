
var express = require('express');
var router = express.Router();

var insertaCuadrito = function(idModulo, idSector, cuadrito){
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  connection = creaConexion();
  //Guardar el cuadrito
  connection.query("INSERT INTO Cuadritos (idSectores, idContenidoCuadritos, x, y) VALUES ('" + idSector + "', '" + cuadrito["type"] + "', '" + cuadrito["ejeX"] + "', '" + cuadrito["ejeY"] + "')", function(err, rows, fields) {
    //Funcion callback del query
    if (!err){
      //Si no ocurrio un error al realizar la query
    } else{
      //Error al ejecutar el query
      console.log( "INSERT INTO Cuadritos (idSectores, idContenidoCuadritos, x, y) VALUES ('" + idSector + "', '" + cuadrito["type"] + "', '" + cuadrito["ejeX"] + "', '" + cuadrito["ejeY"] + "')");
      console.log('Error while performing Query. (insertar cuadrito)');
      console.log(err);
    }
  });
  //Termina la conexion
  connection.end();
}

var insertaSector = function(idModulo, numeroSector, cuadrito, _renglon, cuadritos){
  //Carga el modulo de mySQL
  console.log("-----------" + numeroSector);
  var mysql = require('mysql');
  connection = creaConexion();
  //Guardar el cuadrito
  connection.query("INSERT INTO Sectores (idModulos, numeroSector) VALUES ('" + idModulo + "', '" + numeroSector + "')", function(err, rows, fields) {
    //Funcion callback del query
    if (!err){
      //Si no ocurrio un error al realizar la query
      console.log(rows.insertId);
      insertaCuadrito(idModulo, rows.insertId, cuadrito);
      //return rows.insertId;
    } else{
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
  connection.end();
}

var selectSector = function(idModulo, cuadritos, _renglon){
  var cuadrito = cuadritos[_renglon];
  connection = creaConexion();
  connection.query("SELECT idSector from Sectores WHERE idModulos = '" + idModulo + "' AND numeroSector = '" + cuadrito['sector'] + "'", function(err, rows, fields) {
      if (!err) {
        var idSector;
        if(rows.length > 0){
          //Existe
          console.log("Select exitoso");
          console.log(rows[0].idSector);
          idSector=rows[0].idSector;
          insertaCuadrito(idModulo, idSector, cuadrito);
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
    connection.end();  
}



var creaConexion = function(){
  var credenciales = require('../database/credencialesbd.json');
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  //Crea la coneccion
  var connection = mysql.createConnection(credenciales);
  //Prueba si se conecto correctamente a la base de datos
  connection.connect(function(err){
    if(!err) {
      console.log("Database is connected ... \n"); 
    } else {
      console.log("Error connecting database ... \n");  
    }
  });
  return connection;
}


var tamHuerta = function(idModulo, alto, ancho){
  connection = creaConexion();
  connection.query("UPDATE Modulos set alto = '"+ alto +"', ancho = '"+ ancho +"' WHERE idModulo = '"+ idModulo + "'", function(err, rows, fields) {
      if (!err) {
        console.log("UPDATE Modulos set alto = '"+ alto +"', ancho = '"+ ancho +"' WHERE idModulo = '"+ idModulo + "'");
      } else {
        console.log('Error while performing Query. (Searching if sector exist)');
        console.log("este es el error joven: " + err);
      }
    
    });
    connection.end();  

}


router.post("/", function(request,response,next){
  //Carga el modulo de mySQL
  var mysql = require('mysql');
  
  var cuadritos = JSON.parse(request.body.cuadritos);
  var idModulo = request.body.modulo;
  //Ver si existe el sector, si no crearlo
  var renglones = cuadritos.length;
  //Alto y ancho
  var ancho = request.body.ancho;
  var alto = request.body.alto;
  tamHuerta(idModulo, alto, ancho);
  console.log("ALto:"+ alto);
  console.log("ancho: "+ ancho);
  //Existe el sector ¿?
  selectSector(idModulo, cuadritos, 0);
  //Termina la conexion
  //Redirecciona a una URL
  //response.redirect('/contador');
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify(idModulo));

});


module.exports = router;



