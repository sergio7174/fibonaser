const express = require('express');
const router = express.Router();
const politica = require('../controllers/politica');
const catchAsync = require('../utils/catchAsync');

router.get('/', catchAsync(politica.politica));

module.exports = router;