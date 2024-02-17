const User = require('../models/user');
const util = require('util');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');

module.exports.cuenta = async (req, res) => {
    res.render('profil/cuenta', {
        user: req.user
    });
}

module.exports.password = async (req, res) => {
    res.render('profil/password', {
        user: req.user
    });
}

module.exports.updateProfile = async (req, res) => {
    const user = req.user
    const emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const letterformat = /[a-zA-Z]/;
    const { nombre, username, email, bio, web, instagram, github, twitter } = req.body
    if(!nombre) {
        req.flash('error', '¡Introduce tu numero!')
        return res.redirect('/acuerdo/cuenta')
    }
    if (!username) {
        req.flash('error', '¡Ingrese su nombre de usuario!')
        return res.redirect('/acuerdo/cuenta')
    }
    if (!email) {
        req.flash('error', '¡Introduce tu correo electrónico!')
        return res.redirect('/acuerdo/cuenta')
    }
    try {
        if (nombre.match(letterformat)) user.nombre = nombre;
        if (username) user.username = username;
        if (email.match(emailformat)) user.email = email;
        user.bio = bio;
        user.website = web;
        user.instagram = instagram;
        user.github = github;
        user.twitter = twitter;
        await user.save();
    } catch(e) {
        if(e.toString().includes('username')) {
            req.flash('error', '¡El nombre de usuario ya esta en Uso .!')
        }
        if(e.toString().includes('email')) {
            req.flash('error', 'Email ya esta en Uso .!')
        }
        return res.redirect('/acuerdo/cuenta')
    }
    const login = util.promisify(req.login.bind(req));
    await login(user);
    req.flash('success', 'Profil ya esta en Uso .!')
    res.redirect('/acuerdo/cuenta')
}