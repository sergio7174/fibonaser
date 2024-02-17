const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contenidoSchema = new Schema ({
    query: String,
    querycapitulo: String,
    querysubcapitulo: String,
    querytitulo: String,
    asignatura: String,
    tipe: String,
    capitulo: String,
    subcapitulo: String,
    titulo: String,
    link: String
})

module.exports = mongoose.model('Contenido', contenidoSchema);