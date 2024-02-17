const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const Asignaturas = require('../controllers/asignaturasController');

router.get('/', isLoggedIn, catchAsync(Asignaturas.index));

router.get('/:query', isLoggedIn, catchAsync(Asignaturas.show));

router.get('/:query/:querycapitulo', isLoggedIn, catchAsync(Asignaturas.showEstudiar));

router.get('/:query/:querycapitulo/:querytitulo', isLoggedIn, catchAsync(Asignaturas.modal));

module.exports = router;