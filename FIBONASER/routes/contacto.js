const express = require('express');
const router = express.Router();
const contacto = require('../controllers/contacto');
const catchAsync = require('../utils/catchAsync');

router.get('/', catchAsync(contacto.contacto));

router.put('/', catchAsync(contacto.putContacto));

module.exports = router;