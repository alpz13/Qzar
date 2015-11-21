var express = require('express');
var router = express.Router();


var sector = require('../components/sector.js');



//Pagina Principal
router.get('/', function (req, res, next) {
	if (req.session.usuario.permisos.indexOf("ver sector") < 0) {
		var err = new Error();
		err.status = 403;
		next(err);
		return;
	}

    sector.listar(function (err, resultados) {
        if (err) {
            console.log(err);
        }else{
        	console.log(resultados);
        	res.render('sector', {usuario: req.session.usuario, barraLateral: 'sector', resultados: resultados});
        }
    });
});


//Agregar sectores
router.post('/agregar', function (req, res, next) {
	if (req.session.usuario.permisos.indexOf("crear sector") < 0) {
		var err = new Error();
		err.status = 403;
		next(err);
		return;
	}

    var nuevoSector = {
    	"nombre" : req.body.nombre,
    	"escogerColor" : req.body.cuadrosColor
    };

    sector.crear(nuevoSector, function (err) {
        if (err) {
            console.log(err);
            if (err.code === 'ER_DUP_ENTRY') {
                res.send('Ya esxiste');
            } else {
                res.send('Hubo un error al crear un nuevo sector. Inténtelo más tarde');
            }
        } else {
            console.log("sector creado con exito");
            res.redirect("/sector");
        }
    });
});

//Eliminar sector
router.post('/eliminar/', function (req, res, next) {
	if (req.session.usuario.permisos.indexOf("crear sector") < 0) {
		var err = new Error();
		err.status = 403;
		next(err);
		return;
	}

    var idContenidoCuadritos = req.body.idContenido;

    sector.eliminar(idContenidoCuadritos, res);
});

//Modificar sector
router.post('/modificar', function (req, res, next) {
	if (req.session.usuario.permisos.indexOf("crear sector") < 0) {
		var err = new Error();
		err.status = 403;
		next(err);
		return;
	}

    var nuevoSector = {
        "nombre" : req.body.nombre,
        "escogerColor" : req.body.cuadrosColor,
        "idContenidoCuadritos" : req.body.idContenidoCuadritos
    };

    sector.modificar(nuevoSector, function (err) {
        if (err) {
            console.log(err);
            if (err.code === 'ER_DUP_ENTRY') {
                res.send('Ya esxiste');
            } else {
                res.send('Hubo un error al crear un nuevo sector. Inténtelo más tarde');
            }
        } else {
            console.log("sector modificado con exito");
            res.redirect("/sector");
        }
    });
});




module.exports = router;
