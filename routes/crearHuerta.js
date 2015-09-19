var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
 /* res.send('respond with a resource');*/
  altoA = [];
  anchoA = [];
  alto = 10;
  ancho = 10;
  while(alto > 0){
    altoA.push(alto);
    alto--;
  }
  while(ancho > 0){
    anchoA.push(ancho);
    ancho--;
  }
  res.render('crearHuerta', {title:'Crear huerta', alto:altoA, ancho:anchoA});
});

module.exports = router;

