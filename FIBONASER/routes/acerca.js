const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Acerca = require('../controllers/acerca');

router.get('/', catchAsync(Acerca.acerca));

module.exports = router;