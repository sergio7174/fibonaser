const express = require('express');
const router = express.Router();
const home = require('../controllers/homeController');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');

router.get('/', isLoggedIn, catchAsync(home.index));

module.exports = router;