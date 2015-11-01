var express = require('express');
var router = express.Router();


var sector = require('../components/sector.js');



//Pagina principal
/*router.get("/", function(req, res, next) {
	res.render('sector', {usuario: req.session.usuario, barraLateral: 'sector'});
});*/



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




module.exports = router;
