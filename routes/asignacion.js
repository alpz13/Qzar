/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();

var actividadesAsignadas = require('../components/actividadesAsignadas.js');

// Checa tus prvilegios
router.get(/.*/, function(req, res, next) {
    if (req.session.usuario.idRoles !== 1) {
        /*
        err = new Error('No puedes.');
        err.status = 403;
        next(err);
        return;
        */
        // res.redirect('/');
        res.render('menu', {usuario: req.session.usuario, barraLateral: 'actividades', titulo: "###", aviso: {tipo: 'danger', icono: 'fa fa-ban', mensaje: 'No tienes suficiente permisos para hacer esta acción.'}});
        return;
    }
	next();
});

router.post('/asignaractividad', function (req, res, next) {
    //To Do
    console.log("Entrando a asignacion");
    idModulo = req.body.idModulo;
    idSector = req.body.idSector;
    idActividad = req.body.idActividad;
    fechaFin = req.body.fechaFin;
    fechaFin = fechaFin.split("/");
    fechaFin = fechaFin[2] + "-" + fechaFin[1] + "-" + fechaFin[0] + ":0:00";
    fechaIni = req.body.fechaIni;
    fechaIni = fechaIni.split("/");
    fechaIni = fechaIni[2] + "-" + fechaIni[1] + "-" + fechaIni[0] + ":0:00";
    fechaIni = new Date(fechaIni);
    fechaFin = new Date(fechaFin);
    while(fechaIni <= fechaFin){
    	console.log("asignando");
        fecha = fechaIni.getFullYear() + "-" + parseInt(fechaIni.getMonth() + 1) + "-" + fechaIni.getDate() + ":0:00";
        console.log(fecha);
	    actividadesAsignadas.asignar(idModulo, idSector, idActividad, fecha);
        //fechaIni.getTime();
    	fechaIni.setDate(fechaIni.getDate() + 1);
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify([]));
    return;
});

router.post('/verdetalles', function (req, res, next){
    console.log("Viendo detalles de asignacion");
    idAsignada = req.body.idAsignada;
    actividadesAsignadas.detalles( idAsignada, res );
    return;
});

router.post('/borrarasignacion/:id(\\d+)', function(){
    console.log("Eliminando actividades asignadas");
    idAsignada = req.body.idAsignada;
    actividadesAsignadas.eliminar( idAsignada, res );
    return;
});

router.post('/editarasignacion/:id(\\d+)', function(){

});

module.exports = router;