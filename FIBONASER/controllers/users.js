const User = require('../models/user');
const util = require('util');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const crypto = require('crypto');

module.exports.getForgotPw = async(req, res, next) => {
    res.render('registration/forgot')
};

module.exports.putForgotPw = async(req, res, next) => {
    const token = await crypto.randomBytes(20).toString('hex');
    const { email } = req.body;
    const user = await User.findOne({ email })
    if(!user) {
        req.flash('error', 'Correo electrónico no encontrado ..');
        // req.session.error = 'Email tidak ditemukan';
        return res.redirect('/lupa-password');
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1800000;
    await user.save();

    const msg = {
        from: 'FibonaSer <reset-password@fibonacciku.com>',
        to: email,
        subject: 'FibonaSer - Reset Password',
        text: `
        ¡Hola amigos de Fibo!
        Recibiste este correo electrónico porque tú (u otra persona) deseas restablecer/cambiar tu contraseña.
        Haga clic en el enlace a continuación o copie y pegue en su navegador para restablecer la contraseña: https://www.fibonacciku.com/reset/${token}
        Si solicita un restablecimiento de contraseña que no es suyo, ignore este correo electrónico y su contraseña no se cambiará.
        `.replace(/            /g, ''),
        html: `
            <h1>¡Hola amigos de Fibo!</h1>
            <p>Recibiste este correo electrónico porque tú (u otra persona) deseas restablecer/cambiar tu contraseña.</p>
            <p>Haga clic en el enlace a continuación o copie y pegue en su navegador para restablecer la contraseña:</p>
            <a href="https://www.fibonacciku.com/reset/${token}">Reset Password</a>
            <p>Si solicita un restablecimiento de contraseña que no es suyo, ignore este correo electrónico y su contraseña no se cambiará.</p>
            <p>Sergio Moncada, </p>
            <p>FibonaSer</p>
        `
    }
    await sgMail.send(msg);
    req.flash('success', `Emailya enviado a .. ${email}`);
    // req.session.success = `Email sudah dikirim ke ${email}`;
    res.redirect('/lupa-password');
};

module.exports.getReset = async(req, res, next) => {
    const { token } = req.params;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if(!user){
        req.flash('error', 'Token reset password inválido o caduco ');
        // req.session.error = 'Token reset password tidak valid atau sudah expire';
        res.redirect('/lupa-password');
    };
    res.render('registration/reset', { token });
};

module.exports.putReset = async(req, res, next) => {
    const { token } = req.params;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if(!user){
        req.flash('error', 'El token de restablecimiento de contraseña no es válido o ha caducado.');
        // req.session.error = 'Token reset password tidak valid atau sudah tidak berlaku';
        res.redirect('/lupa-password');
    };
    if(req.body.password === req.body.confirm){
        await user.setPassword(req.body.password);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        user.isPassword = true;
        await user.save();
        const login = util.promisify(req.login.bind(req));
        await login(user);
    } else {
        req.flash('error', 'Password no adecuado');
        // req.session.error = 'Password tidak cocok';
        return res.redirect(`/reset/${token}`);
    }

    const msg = {
        from: 'FibonaSer <reset-password@fibonacciku.com>',
        to: user.email,
        subject: 'FibonaSer - Password Cambió',
        text: `
        ¡Hola amigos de Fibo!
        Este correo electrónico es para confirmar que la contraseña de su cuenta ha cambiado.
        Si no ha cambiado su contraseña, comuníquese con nosotros mediante la función de contacto en FibonaSer.


        `.replace(/            /g, ''),
        html: `
            <h1>¡Hola amigos de Fibo!</h1>
            <p>Este correo electrónico es para confirmar que la contraseña de su cuenta ha cambiado.</p>
            <p>Si no ha cambiado su contraseña, comuníquese con nosotros mediante la función de contacto en Mi FibonaSer.</p>
            <p>Sergio Moncada, </p>
            <p>FibonaSer</p>
        `
    };
    await sgMail.send(msg);
    // req.session.success = '¡La contraseña ha sido cambiada!';
    req.flash('success', '¡La contraseña ha sido cambiada!');
    res.redirect('/home')
};