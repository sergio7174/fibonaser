const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const asignaturaSchema = new Schema ({
    tipo: String,
    query: String,
    asignatura: String,
    icon: String
});

module.exports = mongoose.model('Asignatura', asignaturaSchema);