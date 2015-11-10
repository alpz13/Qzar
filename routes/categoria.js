/*jslint
    indent: 4, unparam: true
*/
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	console.log("Entro aqui");
})

module.exports = router;