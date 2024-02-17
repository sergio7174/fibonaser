module.exports.politica = async (req, res) => {
    res.render('politica/politica', {
        user: req.user
    })
}