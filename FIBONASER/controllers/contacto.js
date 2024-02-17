const nodemailer = require('nodemailer');
const User = require('../models/user');
const util = require('util');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.contacto = async (req, res) => {
    res.render('contacto/contacto', {
        user: req.user
    })
}

module.exports.putcontacto = async (req, res) => {
    const { nombre, email, subjek, mensaje } = req.body;
    try {
        const msg = {
            from: `${nombre} <contacto-noreply@fibonacciku.com>`,
            to: 'contacto@fibonacciku.com',
            subject: `${subjek}`,
            text: `
            Mensaje de ${email}:
                ${mensaje}
                de ${nombre}
            `.replace(/            /g, ''),
            html: `
                <h3>mensaje de ${email}:</h3>
                <hr>
                <pre>${mensaje}</pre>
                <hr>
                <h3>de ${nombre}</h3>
                <hr>
                <p>contacto - FibonacciKu</p>
            `
        }
        await sgMail.send(msg);
        req.flash('success', 'mensaje ha sido enviado ..');
    } catch(e) {
        console.log(e)
        req.flash('error', 'mensaje fallido al enviar, por favor contacte a FibonaSer')
    }
    return res.redirect('/contacto')
}   

module.exports.forms = async(req, res) => {
    console.log(req.body);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fibonacciku@gmail.com',
            pass: 'Fatih16112001'
        }
    })

    
    const mailOptions = {
        from: req.body.email,
        to: "fibonacci.id21@gmail.com",
        subject: `mensaje de ${req.body.email}: ${req.body.subject}`,
        text: `${req.body.message} \n\nde: ${req.body.name}`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error);
            res.send('error')
        }else{
            console.log('Email sent')
            res.send('success')
        }
    })
}