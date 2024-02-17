const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Acuerdo = require('../controllers/acuerdo');
const { isLoggedIn, isValidPassword, changePassword } = require('../middleware');

router.get('/cuenta', isLoggedIn, catchAsync(Acuerdo.cuenta));

router.put('/cuenta', isLoggedIn, catchAsync(Acuerdo.updateProfile));

router.get('/password', isLoggedIn, catchAsync(Acuerdo.password));

router.put('/password', isLoggedIn, 
    catchAsync(isValidPassword),
    catchAsync(changePassword),
);

module.exports = router;