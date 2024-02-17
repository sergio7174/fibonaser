module.exports.index = async (req, res) => {
    res.render('home/home', {
        user: req.user
    })
}