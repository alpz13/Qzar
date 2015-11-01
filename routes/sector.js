var express = require('express');
var router = express.Router();


var sector = require('../components/sector.js');



//Pagina Principal
router.get('/', function (req, res, next) {
    
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
router.get('/eliminar/:id(\\d+)', function (req, res, next) {
    var idContenidoCuadritos = req.params.id;

    sector.eliminar(idContenidoCuadritos, function (err, modulos) {
        res.redirect('/sector');
    });
});





module.exports = router;
