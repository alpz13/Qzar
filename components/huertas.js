/* globals require: true, console: true, module: true */
'use strict';

var mysql = require('mysql');

var credenciales = require('../database/credencialesbd.json');

function desplegarCuadritos(idModulo, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = "Select ContenidoCuadritos.color, ContenidoCuadritos.nombre, Cuadritos.x, Cuadritos.y, Sectores.numeroSector from Sectores, Cuadritos, ContenidoCuadritos where Sectores.idModulos = ? AND Sectores.idSector = Cuadritos.idSectores AND Cuadritos.idContenidoCuadritos = ContenidoCuadritos.idContenidoCuadritos",
        params= [idModulo];
    
    sql = mysql.format(sql, params);

    bd.query(sql, function (err, resultados) {
        if (err) {
            callback(err, []);
        } else {
            callback(null, resultados);
        }
    });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

//Borra el tamaño de la huerta
function borraHuerta(idModulo, callback){
    var bd = mysql.createConnection(credenciales),
        sql = "UPDATE Modulos SET Modulos.alto = null, Modulos.ancho = null WHERE Modulos.idModulo = ? ",
        params= [idModulo];
    
    sql = mysql.format(sql, params);

    bd.query(sql, function (err, resultados) {
        if (err) {
            callback(err, []);
        } else {
            callback(null, resultados);
        }
    });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

// Eliminar huerta.
function eliminaHuerta(idModulo, callback) {
    var bd = mysql.createConnection(credenciales),
        sql = "DELETE FROM Cuadritos USING Cuadritos, Sectores, Modulos WHERE Sectores.idModulos = ? AND Cuadritos.idSectores = Sectores.idSector",
        params= [idModulo];
    
    sql = mysql.format(sql, params);

    bd.query(sql, function (err, rows, fields) {
        if (err) {
            callback(err);
        } else {
            borraHuerta(idModulo, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

// Guardar el cuadrito
function seleccionaCuadrito(idModulo, idSector, cuadrito) {
    var bd = mysql.createConnection(credenciales),
        sql = "SELECT DISTINCT idCuadrito from Cuadritos, Sectores, Modulos WHERE Sectores.idModulos = ? AND Sectores.idSector = Cuadritos.idSectores AND Cuadritos.x = ? AND Cuadritos.y = ?",
        params= [idModulo, cuadrito["ejeX"], cuadrito["ejeY"]];
    
    sql = mysql.format(sql, params);

    bd.query(sql, function (err, rows, fields) {
        if (!err) {
            // ¿Existe el cuadrito?
            if(rows.length > 0) {
                var idCuadrito = rows[0].idCuadrito;
                actualizaCuadrito(idModulo, idSector, cuadrito, idCuadrito);
            } else {
                insertaCuadrito(idModulo, idSector, cuadrito);
            }
        } else {
            console.log(err);
        }
    });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function actualizaCuadrito(idModulo, idSector, cuadrito, idCuadrito) {
    var bd = mysql.createConnection(credenciales),
        sql = "UPDATE Cuadritos SET Cuadritos.idSectores = ?, Cuadritos.idContenidoCuadritos = ? WHERE Cuadritos.idCuadrito = ?",
        params= [idSector, cuadrito["type"], idCuadrito];
    
    sql = mysql.format(sql, params);

    bd.query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
    });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function insertaCuadrito(idModulo, idSector, cuadrito) {
    var bd = mysql.createConnection(credenciales),
        sql = "INSERT INTO Cuadritos (idSectores, idContenidoCuadritos, x, y) VALUES (?, ?, ?, ?)",
        params= [idSector, cuadrito["type"], cuadrito["ejeX"], cuadrito["ejeY"]];
    
    sql = mysql.format(sql, params);

    bd.query(sql, function (err, rows, fields) {
        if (err) {
              console.log(err);
        }
      });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function insertaSector(idModulo, numeroSector, cuadrito, _renglon, cuadritos) {
    var bd = mysql.createConnection(credenciales),
        sql = "INSERT INTO Sectores (idModulos, numeroSector) VALUES (?, ?)",
        params= [idModulo, numeroSector];
    
    sql = mysql.format(sql, params);

     bd.query(sql, function (err, rows, fields) {
        if (!err) {
            seleccionaCuadrito(idModulo, rows.insertId, cuadrito);
        } else {
            console.log(err);
        }
        if(cuadritos.length > _renglon+1) {
            selectSector(idModulo, cuadritos, _renglon+1);
        }
    });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function selectSector(idModulo, cuadritos, _renglon) {
    var bd = mysql.createConnection(credenciales),
        sql = "SELECT idSector from Sectores WHERE idModulos = ? AND numeroSector = ?",
        params= [idModulo, cuadritos["sector"]],
        cuadrito = cuadritos[_renglon];

    sql = mysql.format(sql, params);

    bd.query(sql, function (err, rows, fields) {
        if (!err) {
            var idSector;
            // ¿Existe sector?
            if(rows.length > 0) {
                idSector=rows[0].idSector;
                seleccionaCuadrito(idModulo, idSector, cuadrito);
                if(cuadritos.length > _renglon+1) {
                    selectSector(idModulo, cuadritos, _renglon+1);
                }
            } else {
                idSector = insertaSector(idModulo, cuadrito["sector"], cuadrito, _renglon, cuadritos);
            }
        } else {
            console.log("este es el error joven: " + err);
      }
    });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

// Actualiza el tamaño de la huerta.
function tamHuerta(idModulo, alto, ancho) {
    var bd = mysql.createConnection(credenciales),
        sql = "UPDATE Modulos set alto = ?, ancho = ? WHERE idModulo = ?",
        params= [alto, ancho, idModulo];

    sql = mysql.format(sql, params);

    bd.query(sql, function (err, rows, fields) {
        if (err) {
            console.log("este es el error joven: " + err);
        }
    });

    bd.end(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = {
    'cuadritos': desplegarCuadritos,
    'eliminar': eliminaHuerta,
    'tamHuerta': tamHuerta,
    'selectSector': selectSector,
    'seleccionaCuadrito': seleccionaCuadrito,
    'actualizar': actualizaCuadrito,
    'inserta': insertaCuadrito
};
