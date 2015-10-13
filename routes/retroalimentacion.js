/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	if (req.session.usuario.idRoles !== 1) {
        res.redirect('/retroalimentacion/' + req.session.usuario.idModulo);
        return;
    }
    else{
        console.log(req.session.usuario);
        res.render('menu', {usuario: req.session.usuario, modulo: });
    }
  // next();
});


module.exports = router;