var express = require('express');
var router = express.Router();


//////////////////
var insertaCuadrito = function(connection, idModulo, idSector, cuadrito){
        //Guardar el cuadrito
    connection.query("INSERT INTO Cuadritos (idModulos, idSectores, contenido, x, y) VALUES ('" + idModulo + "', '" + idSector + "', '" + cuadrito["type"] + "', '" + cuadrito["ejeX"] + "', '" + cuadrito["ejeY"] + "')", function(err, rows, fields) {
                //Funcion callback del query
                if (!err){
                        //Si no ocurrio un error al realizar la query
                } else{
                        //Error al ejecutar el query
                        console.log('Error while performing Query.');
                }
        });
}
 
var insertaSector = function(connection, idModulo, numeroSector){
        //Guardar el cuadrito
    connection.query("INSERT INTO Sectores (idModulos, numeroSector) VALUES ('" + idModulo + "', '" + numeroSector + "')", function(err, rows, fields) {
                //Funcion callback del query
                if (!err){
                        //Si no ocurrio un error al realizar la query
                        return rows[0];
                } else{
                        //Error al ejecutar el query
                        console.log('Error while performing Query.');
                }
        });
}
 
 
router.post("/modulo/huerta/crearGuardar", function(request,response,next){
        //Carga el modulo de mySQL
        var mysql = require('mysql');
        //Crea la coneccion
        var connection = mysql.createConnection({
          host     : 'localhost',
          user     : '',
          password : '',
          database : ''
        });
        //Prueba si se conecto correctamente a la base de datos
        connection.connect(function(err){
        if(!err) {
            console.log("Database is connected ... \n\n");  
        } else {
            console.log("Error connecting database ... \n\n");  
        }
        });
 
        var cuadritos = request.body.cuadritos;
        var idModulo = request.body.modulo;
 
        //Ver si existe el sector, si no crearlo
        cuadritos.forEach(function(cuadrito) {
            //Existe el sector ¿?
            connection.query("SELECT idSector from Sectores WHERE idModulos = '" + idModulo + "' numeroSector = '" + cuadrito['numeroSector'] + "' ", function(err, rows, fields) {
                        if (!err) {
                                var idSector;
                                if(rows.length > 0){
                                        //Existe
                                        idSector=rows[0];
                                } else {
                                        //No existe
                                        idSector = insertaSector(connection, idModulo, cuadrito["numeroSector"])
                                }
                                insertaCuadrito(connection, idModulo, idSector, cuadrito);
                        } else {
                                console.log('Error while performing Query. (Searching if sector exist)');
                        }
                });
                         
           
        });
       
        //Termina la conexion
        connection.end();
        //Redirecciona a una URL
        response.redirect('/contador');
});





//////////////////


module.exports = router;
