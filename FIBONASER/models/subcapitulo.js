const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcapituloSchema = new Schema ({
    query: String,
    querycapitulo: String,
    querysubcapitulo: String,
    asignatura: String,
    capitulo: String,
    subcapitulo: String,
    titulo: String,
    link: String
});

module.exports = mongoose.model('SubCapitulo', subcapituloSchema);