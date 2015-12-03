
var routes = function(app) {

    // 页面渲染
    app.get("/", render('pc/index.nunj', render.index));
    app.get("/sign", function (req, res) {
        res.render('pc/sign.html')
    })
};

/**
 * 把path暴露出来,方便查看模板
 * @param path 模版所在路径, 相对views目录
 * @param fn 在获取数据后,需要调用res.render(path, data)
 */
function render(path, fn) {
    return function (req, res, next) {
        fn(req, res, next, path)
    }
}

render.index = function renderIndex(req, res, next, path) {
    models.dish.find({
        sideDishType: 'main',
        isPublished: true
    }).sort("-sortId").sort("-createdAt").execAsync()
        .then(function (dishes) {
            var data = {
                cooks: dishes.filter(function (dish) {
                    return dish.cookingType == 'ready to cook'
                }).slice(0, 3),
                eats: dishes.filter(function (dish) {
                    return dish.cookingType == 'ready to eat'
                }).slice(0, 3)
            };
            res.render(path, data)
        }).catch(function (err) {
            next(err)
        })
};


module.exports = routes;

// render(path, render.index)

