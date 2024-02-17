const ExpressError = require('./utils/ExpressError');
const User = require('./models/user');
const util = require('util');
const { cloudinary } = require('./cloudinary');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', '¡Debes ingresar primero!');
        return res.redirect('/ingresar');
    }
    next();
}

module.exports.isLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        // req.flash('error', 'You must be signed out first!');
        return res.redirect('/home');
    }
    next();
}

module.exports.isNotVerified = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (user.isVerified) {
            return next();
        }
        req.flash('error', 'Su cuenta no ha sido verificada, verifique su bandeja de entrada y el correo no deseado (SPAN)');
        return res.redirect('/');
    } catch(e){
        // console.log(req.body)
        // req.flash('error', 'Muncul error! tolong kontak kita FibonacciKu untuk bantuan');
        // res.redirect('/')
        return next();
    }
}

module.exports.isValidPassword = async (req, res, next) => {
    const users = await User.findOne({ username: req.user.username })
    const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);

    if(users.isPassword) {
        if(user) {
            res.locals.user = user;
            return next();
        }
        else if(!user) {
            req.flash('error', '¡La contraseña anterior es incorrecta!')
            return res.redirect('/acuerdo/password')
        }
    }
    else {
        if(!req.body.currentPassword) {
            if(users) {
                res.locals.user = users;
                return next();
            }
            else {
                req.flash('error', 'No se pudo cambiar la contraseña!');
                return res.redirect('/acuerdo/password');
            }
        }
    }
}

module.exports.changePassword = async (req, res, next) => {
    const {
        newPassword,
        passwordConfirmation
    } = req.body;

    if (newPassword && passwordConfirmation) {
        const { user } = res.locals;
        if (newPassword === passwordConfirmation) {
            await user.setPassword(newPassword);
            user.isPassword = true;
            await user.save();
            const login = util.promisify(req.login.bind(req));
            await login(user)
        }
        else {
            req.flash('error', '¡La nueva contraseña debe ser la misma!');
            return res.redirect('/acuerdo/password');
        }
    }
    else {
        req.flash('¡Error al cambiar la contraseña!')
        return res.redirect('/acuerdo/password')
    }
    req.flash('success', '¡La contraseña ha sido cambiada!');
    return res.redirect('/acuerdo/password')
}

module.exports.deleteProfileImage = async (req, res) => {
    if (req.file) await cloudinary.uploader.destroy(req.file.public_id);
}