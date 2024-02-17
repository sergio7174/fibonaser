const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Users = require('../controllers/users');
const { isLoggedOut, isNotVerified } = require('../middleware');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const crypto = require('crypto');

router.get('/registrar', isLoggedOut, (req, res) => {
    console.log("Estoy en user - routes - line 13 - voy hacia registration/registrar")
    res.render('registration/registrar', {
        user: req.user
    });
});

router.post('/registrar', catchAsync(async(req, res) => {
    const newUser = new User({
        email: req.body.email,
        nombre: req.body.nombre,
        username: req.body.username.toLowerCase(),
        emailToken: crypto.randomBytes(64).toString('hex'),
        isVerified: true,
        isPassword: true,
    });

    User.register(newUser, req.body.password, async(err, user) => {

                  console.log("Estoy en users - routes - line 30 - user: "+ user)

        if(err) {
            req.flash('error', 'Correo electrónico usado o existente, Use Otro ..!');
            return res.redirect('/registrar');
        }

        const msg = {
            from: 'FibonacciKu <no-reply@fibonacciku.com>',
            to: user.email,
            subject: 'FibonacciKu - Verifikasi Email',
            text: `
            ¡Hola amigos de Fibo! Gracias por registrarse en FibonaSer.
            Copie y pegue el siguiente enlace para verificar su cuenta.
                https://www.fibonacciku.com/verify-email?token=${user.emailToken}
                `.replace(/                /g, ''),
            html: `
                <h1>¡Hola amigos de Fibo!</h1>
                <p>Gracias por registrarse en FibonaSer.</p>
                <p>Haga clic en el enlace a continuación para verificar su cuenta.</p>
                <a href="https://www.fibonacciku.com/verify-email?token=${user.emailToken}">Verificación de cuenta</a>
                <p>Este correo electrónico de verificación solo se envía una vez, no pierda este correo electrónico. Si se pierde, debe esperar 3 días para volver a crear la cuenta Mi FibonaSer con el mismo correo electrónico.</p>
                <p>Sergio Moncada, </p>
                <p>FibonaSer</p>
                `
        }
        try {
            await sgMail.send(msg);
            req.flash('success', 'Gracias por registrarse en FibonacciKu, verifique su bandeja de entrada de correo electrónico y spam para verificar');
            res.redirect('/');
        } catch(e) {
            req.flash('error', '¡Aparece un error! por favor contáctenos con la función Mis contactos de FibonaSer');
            //res.redirect('/');
            return;
         }
    });
    req.flash('success', 'Gracias por registrarse en FibonaSer... !!');
    res.redirect('/');
}));

router.get('/verify-email', catchAsync(async(req, res) => {
    try {
        const user = await User.findOne({ emailToken: req.query.token });
        if(!user) {
            req.flash('error', '¡Fichas no válidas! por favor contacte a Mi FibonaSer para asistencia')
            res.redirect('/');
        }
        user.emailToken = null,
        user.isVerified = true,
        await user.save();
        await req.login(user, async(err) => {
            if(err) return next(err);
            req.flash('success', `Welcome to FibonaSer, ${user.nombre}!`);
            const redirectUrl = req.session.returnTo || '/home';
            delete req.session.returnTo;
            res.redirect(redirectUrl);
        })
    } catch(e) {
        req.flash('error', '¡Aparece un error! Por favor contáctenos para asistencia');
        res.redirect('/');
    }
}));

router.get('/ingresar', isLoggedOut, (req, res) => {
    res.render('registration/ingresar', {
        user: req.user
    });
});

router.post('/ingresar', passport.authenticate('local', {
    failureFlash: '¡Nombre de usuario o contraseña incorrecta!',
    failureRedirect: '/ingresar'
    }),
    (req, res) => {
        req.flash('success', 'Welcome to FibonaSer!');
        const redirectUrl = req.session.returnTo || '/home';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
});

router.get('/auth/google', passport.authenticate('google', {
    scope: [
        'email',
        'profile'
    ]
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureFlash: 'Error al iniciar sesión con Google', 
    failureRedirect: '/registrar',
    }),
    (req, res) => {
        req.flash('success', `Welcome to FibonaSer, ${req.user.nombre}!`);
        const redirectUrl = req.session.returnTo || '/home';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
});

router.get('/auth/github', passport.authenticate('github', { 
    scope: [ 'user:email' ],
}));

router.get('/auth/github/callback', passport.authenticate('github', {
    failureFlash: 'Error al iniciar sesión con GitHub', 
    failureRedirect: '/registrar',
    }),
    (req, res) => {
        req.flash('success', `Welcome to FibonaSer, ${req.user.nombre}!`);
        const redirectUrl = req.session.returnTo || '/home';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
});


router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureFlash: 'Error al iniciar sesión con Facebook', 
    failureRedirect: '/registrar',
    }),
    (req, res) => {
        req.flash('success', `Welcome to FibonaSer, ${req.user.nombre}!`);
        const redirectUrl = req.session.returnTo || '/home';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
});

router.get('/lupa-password', isLoggedOut, catchAsync(Users.getForgotPw));

router.put('/lupa-password', isLoggedOut, catchAsync(Users.putForgotPw));

router.get('/reset/:token', isLoggedOut, catchAsync(Users.getReset));

router.put('/reset/:token', isLoggedOut, catchAsync(Users.putReset));

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Nos vemos de nuevo amigo Fibo!");
    res.redirect('/ingresar');
});

module.exports = router;