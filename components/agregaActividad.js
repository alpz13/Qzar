/*jslint
    indent: 4, unparam: true
*/
// crea variable para la base de datos
var mysql = require('mysql');
/* incluye el archivo que contiene las credenciales de la conexión a la BD: credencialesdb.json */
var credenciales = require('../database/credencialesbd.json');
/* crea la referencia al caso de uso listar actividades*/
var listar = require('../components/listarActividades.js');

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
var agrega = function (req, res) {
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
                console.log(err);
            }
            bd.end();
            nombreId = resultado.insertId + ext;
            var img = files.ima[0];
            fs.readFile(img.path, function (err, data) {
                var path = "./public/images/actividades/" + nombreId;
                fs.writeFile(path, data, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("upload success");
                        bd = mysql.createConnection(credenciales);
                        sql = 'INSERT INTO Imagenes(ruta) VALUES(?);';
                        params = [nombreId];
                        bd.connect();
                        sql = mysql.format(sql, params);
                        bd.query(sql, function (err) {
                            if (err) {
                                bd.end();
                                console.log(err);
                            }
                            bd.end();
                            listar.listar(res);
                        });
                    }
                });
            });
        });
    });
};

module.exports = {
    'agrega' : agrega
};



