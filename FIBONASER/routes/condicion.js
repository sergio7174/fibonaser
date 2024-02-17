const express = require('express');
const router = express.Router();
const condicion = require('../controllers/condicion');
const catchAsync = require('../utils/catchAsync');

router.get('/', catchAsync(condicion.condicion));

module.exports = router;