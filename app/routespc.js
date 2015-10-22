
var routes = function(app) {

    app.get("/", function (req, res) {
        res.render('pc/index.nunj');
    });
};


module.exports = routes;