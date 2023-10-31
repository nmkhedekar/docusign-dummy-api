const homeController = (req, res) => {
    res.render('index', { title: 'Express' });
}

module.exports = {
    homeController
}