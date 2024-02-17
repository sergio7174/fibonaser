const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const capituloSchema = new Schema ({
    query: String,
    querycapitulo: String,
    asignatura: String,
    icon: String,
    capitulo: String,
    titulo: String,
    link: String
})

module.exports = mongoose.model('Capitulo', capituloSchema);

