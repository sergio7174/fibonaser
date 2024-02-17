const leccion = require('../models/asignaturas');
const Capitulo = require('../models/capitulo');
const SubCapitulo = require('../models/subcapitulo');
const Contenido = require('../models/contenido');

module.exports.index = async (req, res) => {
    const lecciones = await leccion.find({tipo: "leccion"});
    const examenes = await leccion.find({tipo: "examen"});
    res.render('asignaturas/index', {
        lecciones,
        examenes,
        user: req.user
    });
}

module.exports.show = async(req, res) => {
    const leccion = await leccion.findOne({query: req.params.query});
    const capitulos = await Capitulo.find({query: req.params.query});
    res.render('asignaturas/show', {
        leccion,
        capitulos,
        user: req.user
    });
}

module.exports.showBelajar = async(req, res) => {
    const capitulos = await Capitulo.findOne({queryCapitulo: req.params.queryCapitulo});
    const subcapitulos = await SubCapitulo.find({queryCapitulo: req.params.queryCapitulo});
    const Contenidos = await Contenido.find({queryCapitulo: req.params.queryCapitulo});
    res.render('asignaturas/show-estudiar', {
        capitulos,
        subcapitulos,
        Contenidos,
        user: req.user
    });
}

module.exports.modal = async(req, res) => {
    const video = await Contenido.findOne({querytitulo: req.params.querytitulo});
    res.render('asignaturas/modal', {
        video,
        user: req.user
    });
}