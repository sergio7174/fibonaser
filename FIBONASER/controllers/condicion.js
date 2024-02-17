module.exports.condicion = async (req, res) => {
    res.render('condicion/condicion', {
        user: req.user
    })
}