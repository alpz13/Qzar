/*jslint
    indent: 4, unparam: true
*/
// crea variable para la base de datos
var mysql = require('mysql');
/* incluye el archivo que contiene las credenciales de la conexión a la BD: credencialesdb.json */
var credenciales = require('../database/credencialesbd.json');

/* crea la referencia a la libreria de node npm multiparty cuya funcion es el manejo de documentos */
var multiparty = require("multiparty");
/* crea la referencia a libreria fs de filesistem 
   para poder obtener acceso a escrituras y lecturas 
   de los archivos temporales.
*/
var fs = require('fs');

/* referencia a la libreria path para poder obtener la extension de los archivos*/
var path = require('path');


/* funcion agregar, cuya logica es obtener los campos recuperados del req obtenido de la forma
    asignarlos a variables internas para un mayor control, obtener el archivo anexado a la actividad
    obtener la extension de dicho archivo.
    construye la consulta para registrarla en la base de datos, creamos un arreglo con los parametros para poblar la consulta
    hacemos la conexion a la base de datos y asignamos los parametros del arreglo a la cadena de la consulta para ser ejecutada.
    guardamos el id de la actividad que acabamos de insertar para renombrar la imagen en base al id de la actividad
    creamos la ruta donde el documento anexado a la actividad se va a guardar y le anexamos el nombre del archivo y su extencion
    guardamos el archivo en el servidor.
    una vez guardado el nombre en el servidor guardamos el registro del archivo en la base de datos, ejecutamos la consulta
    ejecutamos la consulta y volvemos a cargar la pantalla de listar actividades con los nuevos registros.
*/
var agrega = function (req, callback) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var nombre = fields.nombreactividad;
        var descripcion = fields.descripcionactividad;
        var activo = 1;
        var bd = mysql.createConnection(credenciales);
        var nombreoriginal = files.ima[0].originalFilename;
        var ext = path.extname(nombreoriginal);
        var sql = 'INSERT INTO Actividades(nombre, descripcion, activo) VALUES(?,?, ?);';
        var params = [nombre, descripcion, activo];
        bd.connect();
        sql = mysql.format(sql, params);
        var nombreId = 0;
        bd.query(sql, function (err, resultado) {
            if (err) {
                bd.end();
                callback(err);
                return;
            }
            bd.end();
            nombreId = resultado.insertId + ext;
            var img = files.ima[0];
            fs.readFile(img.path, function (err, data) {
                var path = "./public/images/actividades/" + nombreId;
                fs.writeFile(path, data, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log("upload success");
                        bd = mysql.createConnection(credenciales);
                        sql = 'INSERT INTO Imagenes(ruta) VALUES(?);';
                        params = [nombreId];
                        bd.connect();
                        sql = mysql.format(sql, params);
                        bd.query(sql, function (err) {
                            bd.end();
                            if (err) {
                                console.log(err);
                            }
                            callback(null);
                        });
                    }
                });
            });
        });
    });
};

/*  Funcion listaractividades(callback)
    - Necesita crear la conexión con la base de datos, en base a las credenciales hechas
    - Se realiza la consulta con una consulta y una función que maneja tanto el error, como la consulta
    - Se cierra la conexión con la DB
    - Se hace el renderizado con la vista: actividades.jade, mandandole la consulta: rows

*/

var listaractividades = function (callback) {
    var db = mysql.createConnection(credenciales);
    db.connect();
    db.query('Select * from Actividades where activo = 1', function (err, rows) {
        db.end();
        if (err) {
            callback(err);
            return;
        }
        callback(null, rows);
    });
};


var modifica = function (req, callback) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var id = fields.idModActividad;
        var nombre = fields.nombreModActividad;
        var descripcion = fields.descripcionModActividad;
        var nombreoriginal = files.imaMod[0].originalFilename;
        var ext = path.extname(nombreoriginal);

        var bd = mysql.createConnection(credenciales);   
        var sql = 'UPDATE Actividades SET nombre = ?, descripcion = ? WHERE idActividad = ?';
		var params = [nombre, descripcion, id];

		sql = mysql.format(sql, params);

        bd.connect();
        bd.query(sql, function (err, resultado) {
            if (err) {
                bd.end();
                callback(err);
                return;
            }
            var img = files.imaMod[0];
            fs.readFile(img.path, function (err, data) {
                var idAc = id + ext;
                var path = "./public/images/actividades/" + idAc;
                fs.writeFile(path, data, function (err) {
                    if (err) {
                        callback(err);
                    } else {

                        sql = 'UPDATE Imagenes SET ruta = "' + idAc + '" WHERE idImagenes =' + id + ';';

                        bd.query(sql, function (err) {
                            console.log(sql);
                            bd.end();
                            if (err) {
                                console.log(err);
                            }
                            callback(null);
                        });
                    }
                });
            });
        });
    });
};

var elimina = function (req, callback) {
    var idAct = req.body.id;

    var bd = mysql.createConnection(credenciales);
    var sql = 'UPDATE Actividades SET activo = 0 WHERE idActividad = ?';
	var params = [idAct];

	sql = mysql.format(sql, params);

    bd.connect();
    sql = mysql.format(sql);
    bd.query(sql, function (err, resultado) {
        if (err) {
            bd.end();
            callback(err);
        } else {
            bd.end();
            callback(null);
        }
    });
};

module.exports = {
    'agrega' : agrega,
    'elimina': elimina,
    'listaractividades' : listaractividades,
    'modifica' : modifica
};
