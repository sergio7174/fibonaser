module.exports.acerca = async (req, res) => {
    res.render('acerca/acerca', {
        user: req.user
    });
}