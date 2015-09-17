/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();

/* GET pantalla de inicio de sesión. */
router.get('/sesiones', function (req, res, next) {
    res.render('index', { title: 'Express' });
    // Pantalla de inicio de sesión.
});

/* GET datos de inicio de sesión. */
router.post('/sesiones', function (req, res, next) {
    res.render('index', { title: 'Express' });
    console.log('Recibido un POST.');
    console.log(req.body.nombreUsuario);
    console.log(req.body.contrasenia);
    // Pantalla de inicio de sesión.
});

module.exports = router;