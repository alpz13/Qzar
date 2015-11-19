/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();
var categoria = require('../components/categoria.js');

router.get(/.*/, function(req, res, next) {
	if (req.session.usuario.permisos.indexOf("crear actividad") < 0) {
		var err = new Error();
		err.status = 403;
		next(err);
	} else {
		next();
	}
});
router.post(/.*/, function(req, res, next) {
	if (req.session.usuario.permisos.indexOf("crear actividad") < 0) {
		var err = new Error();
		err.status = 403;
		next(err);
	} else {
		next();
	}
});

router.get('/', function(req, res){
	categoria.listar(function (err, resCategorias) {
		if (err) {
			console.log(err);
		}
		res.render('categoria',{ titulo: 'Categorias', usuario: req.session.usuario, barraLateral: 'categorias', categorias:resCategorias});
	});
});

router.post('/agregacategoria', function(req, res) {
	var nuevaCategoria = req.body.nuevaCategoria;
	categoria.agregar(nuevaCategoria, function (err) {
		if (err) {
			console.log(err);
			if(err.code === 'ER_DUP_ENTRY') {
				res.send('Ya existe una categoria con ese nombre');
			} else {
				res.send('Hubo un error al crear una nueva categoria');
			}
		} else {
			console.log("Categoria creada con exito");
			res.redirect("/categoria");
		}
	});
});

router.post('/modificarcategoria', function(req, res) {
	var infomodificar = {
		"nombre" : req.body.modificaCategoria,
		"id" : req.body.idCategoriaModif
	};
	categoria.modificar(infomodificar, function (err) {
		if(err) {
			console.log(err);
			if(err.code === 'ER_DUP_ENTRY') {
			    res.send('Ya existe una categoria con ese nombre');
			} else {
			    res.send('Hubo un error al modificar esta categoria');
			} 
		} else {
			console.log("Categoria Modificada");
			res.redirect("/categoria");
		}
	});
});

module.exports = router;
