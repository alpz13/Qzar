var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/:id(\\d+)', function (req, res, next) {
 /* res.send('respond with a resource');*/
  var altoA = [];
  var anchoA = [];
  var alto = req.body.alto;
  var ancho = req.body.ancho;

  while (alto > 0) {
    altoA.push(alto);
    alto--;
  }
  while (ancho > 0) {
    anchoA.push(ancho);
    ancho--;
  }
  res.render('crearHuerta', {title: 'Crear huerta', alto: altoA, ancho: anchoA, usuario: req.session.usuario});
});



module.exports = router;

