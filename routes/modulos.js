/* globals require: true, console: true, module: true */
'use strict';

var express = require('express');
var router = express.Router();

var modulos = require('../components/modulos.js');
var huertas = require('../components/huertas.js');
var usuarios = require('../components/usuarios.js');
var asignaciones = require('../components/asignaciones.js');

// Página principal de módulos.
router.get('/', function (req, res, next) {
    if (req.session.usuario.idRoles !== 1) {
        res.redirect('/modulos/' + req.session.usuario.idModulo);
        return;
    }
    modulos.listar(function (err, modulos) {
        if (err) {
            console.log(err);
        }
        res.render('modulos', { titulo: 'Módulos', modulos: modulos, usuario: req.session.usuario, barraLateral: 'modulos' });
    });
});

// Petición de crear nuevo módulo.
router.post('/nuevo', function (req, res, next) {
    var moduloNuevo = {
        "nombre": req.body.nombre,
        "numeroModulo": req.body.numero
    };

    // Valida permisos para crear módulo.
    if (req.session.usuario.idRoles !== 1) {
        res.send(JSON.stringify({error: "No tienes permiso para crear un módulo."}));
        return;
    }

    // Verifica que el nombre y el número de módulo no sean vacíos.
    if (moduloNuevo.nombre.match(/^\s*$/) || !moduloNuevo.numeroModulo.match(/^\d{1,3}$/)) {
        res.send(JSON.stringify({error: "Hubo un error: Verifique que el nombre no sea vacío y el número sea de 3 dígitos."}));
        return;
    }

    // Intenta crear módulo.
    modulos.crear(moduloNuevo, function (err, idModulo) {
        // Si hubo error, regresa al formulario de nuevo módulo con el mensaje de error correspondiente.
        if (err) {
            console.log(err);
            res.send(JSON.stringify({error: "Hubo un error al crear el nuevo módulo. Inténtelo más tarde."}));
			return;
        }
        
        // Módulo creado exitosamente.
        res.send(JSON.stringify({idModulo: idModulo}));
    });
});

// Página ver módulo
router.get('/:id(\\d+)', function (req, res, next) {
    var modulo = { idModulo: req.params.id };
     
    modulos.mostrar(modulo.idModulo, function (err, resultados) {
        if (err) {
            console.log(err);
            err = new Error("Hubo un error interno.");
            err.status = 500;
            next(err);
            return;
        } else if (!resultados[0]) {
            err = new Error("Módulo no encontrado. Es posible que el módulo no exista o que haya sido dado de baja del sistema.");
            err.status = 404;
            next(err);
            return;
        }

        modulo = resultados[0];

        if (req.session.usuario.idRoles !== 1 && req.session.usuario.idModulo !== modulo.idModulo) {
            err = new Error("No tienes permisos para acceder a este módulo.");
            err.status = 403;
            next(err);
            return;
        }

        var alto = [];
        var ancho = [];
        while (modulo.alto > 0) {
            alto.push(modulo.alto);
            modulo.alto--;
        }
        while (modulo.ancho > 0) {
            ancho.push(modulo.ancho);
            modulo.ancho--;
        }

        huertas.cuadritos(modulo.idModulo, function (err, cuadritos) {
            if (err) {
                console.log(err);
            }
            else{
                res.render('vermodulos', { titulo: 'Módulo ' + modulo.nombre, modulo: modulo, usuario: req.session.usuario, barraLateral: 'modulos', alto: alto, ancho: ancho, cuadritos: cuadritos});
            }
        });
    });
});

// Actualizar módulo.
router.post('/:id(\\d+)/actualizar', function (req, res, next) {

    var moduloActualizado = {
        "idModulo": req.params.id,
        "nombre": req.body.nombre,
        "numeroModulo": req.body.numero
    };

    // Valida permisos para actualizar módulo.
    if (req.session.usuario.idRoles !== 1) {
        res.send(JSON.stringify({error: "No tienes permiso para actualizar módulo."}));
        return;
    }

    // Verifica que el nombre y el número de módulo no sean vacíos.
    if (moduloActualizado.nombre.match(/^\s*$/) || !moduloActualizado.numeroModulo.match(/^\d{1,3}$/)) {
        res.send(JSON.stringify({error: "Hubo un error: Verifique que el nombre no sea vacío y el número sea de 3 dígitos."}));
        return;
    }

    // Intenta actualizar módulo.
    modulos.actualizar(moduloActualizado, function (err) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({error: "Hubo un error al actualizar el módulo. Inténtelo más tarde."}));
        } else {
            res.send(JSON.stringify({mensaje: "Correcto"}));
        }
    });
});

// Eliminar módulo.
router.get('/:id(\\d+)/eliminar', function (req, res, next) {
    var idModulo = req.params.id;

    // Valida permisos para eliminar módulo.
    if (req.session.usuario.idRoles !== 1) {
        res.sendStatus(403);
        return;
    }

    modulos.eliminar(idModulo, function (err, modulos) {
        res.redirect('/modulos');
    });
});

/*
var desplegarCuadritos = function (req, res, next) {
    huertas.cuadritos(function (err, cuadritos) {
        if (err) {
            console.log(err);
            return;
        }
        res.render('modulos', { titulo: 'Módulos', modulos: modulos, usuario: req.session.usuario, barraLateral: 'modulos' });    
    });
}
*/

// Formulario para crear huerta.
router.get('/:id(\\d+)/huerta/nueva', function (req, res, next) {
  var altoA = [];
  var anchoA = [];
  var alto = req.query.alto;
  var ancho = req.query.ancho;
  var cuadritos = req.query.cuadritos;
  console.log(cuadritos);
  while (alto > 0) {
    altoA.push(alto);
    alto--;
  }
  while (ancho > 0) {
    anchoA.push(ancho);
    ancho--;
  }
  res.render('crearHuerta', {titulo: 'Crear huerta', alto: altoA, ancho: anchoA, usuario: req.session.usuario, cuadritos: cuadritos});
});

// Petición para guardar huerta.
router.post('/:id(\\d+)/huerta/nueva', function (req, res, next) {
  
  var cuadritos = JSON.parse(req.body.cuadritos);
  var idModulo = req.params.id;
  //Ver si existe el sector, si no crearlo
  var renglones = cuadritos.length;
  //Alto y ancho
  var ancho = req.body.ancho;
  var alto = req.body.alto;

  res.setHeader('Content-Type', 'application/json');

  huertas.tamHuerta(idModulo, alto, ancho, function(err) {
    if (err) {
		console.log(err);
		res.send(JSON.stringify({error: "Error"}));
		return;
	}
	console.log("No hay error, soy de España");
  });
  console.log("ALto:"+ alto);
  console.log("ancho: "+ ancho);
  //Existe el sector ¿?
  huertas.selectSector(idModulo, cuadritos, 0);
  //Termina la conexion
  //Redirecciona a una URL
  //response.redirect('/contador');
  res.send(JSON.stringify(idModulo));

});


router.get('/editar/:id(\\d+)', function (req, res, next) {
 /* res.send('respond with a resource');*/
  var idModulo = req.params.id;
  modulos.mostrar(idModulo, function (err, modulos) {
    if(err) {
      console.log(err);
    } else {
      var altoA = [];
      var anchoA = [];
      var alto = modulos[0].alto;
      var ancho = modulos[0].ancho;
      while (alto > 0) {
        altoA.push(alto);
        alto--;
      }
      while (ancho > 0) {
        anchoA.push(ancho);
        ancho--;
      }
      huertas.cuadritos(idModulo, function (err, cuadritos) {
        if (err) {
          console.log(err);
        }
        else {
          res.render('crearHuerta', {titulo: 'Editar Huerta', alto: altoA, ancho: anchoA, usuario: req.session.usuario, cuadritos: cuadritos});
        }    
      });
    }
 });
});

//Elimina la Huerta
router.get('/eliminar/:id(\\d+)',function (req, res, next) {

  var idModulo = req.params.id;
  var al = cuadritos.alto;
  var an = cuadritos.ancho;
  eliminaHuerta(idModulo);
  modulos.borraHuerta(idModulo, al, an, function (err, cuadritos) {
        if (err) {
          console.log(err);
        }
        else {
          res.redirect('/modulos/'+idModulo+'');
        }    
      });

});

// Ver itinerario.
router.post('/itinerario', function (req, res, next) {
    /*
    if (req.session.usuario.idRoles != 1) {
        res.redirect('/modulos/' + req.session.usuario.idModulo);
        return;
    }*/
    asignaciones.listarAsignaciones(req.body.modulo, res, function(rows) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows));
    });
});

module.exports = router;
