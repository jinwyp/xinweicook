var routes = function(app) {

    // 页面渲染
    app.get("/", render('pc/index.nunj', render.index));
    app.get("/sign", function (req, res) {
        res.render('pc/sign.html')
    })
    app.get("/cart", function (req, res) {
        res.render('pc/cart.html')
    })
    app.get("/eat", render('pc/eat-list.nunj', render.eatList))
    app.get("/cook/:id", render('pc/cook.nunj', render.cook))
    app.get("/cook", render('pc/cook-list.nunj', render.cookList))
    app.get("/me", render('pc/me.nunj', render.me))
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

render.eatList = function (req, res, next, path) {
    models.dish.find({
        sideDishType: {$in: ["main", "drink"]},
        isPublished: true,
        cookingType: 'ready to eat'
    }).execAsync()
        .then(function (dishes) {
            res.render(path, {
                dishes: dishes.filter(function (dish) {
                    return dish.sideDishType == 'main'
                }),
                drinks: dishes.filter(function (dish) {
                    return dish.sideDishType == 'drink'
                })
            })
        }).catch(function (err) {
            next(err)
        })
}

render.cook = function (req, res, next, path) {
    models.dish.findOne({
        _id: req.params.id
    }).execAsync()
        .then(function (dish) {
            res.render(path, {
                dish: dish
            })
        }).catch(function (err) {
            next(err)
        })
}

render.cookList = function (req, res, next, path) {
    models.dish.find({
        sideDishType: "main",
        isPublished: true,
        cookingType: 'ready to cook'
    }).execAsync()
        .then(function (dishes) {
            res.render(path, {
                cooks: dishes
            })
        }).catch(function (err) {
            next(err)
        })
}

render.me = function (req, res, next, path) {
    res.render(path)
}


module.exports = routes;

// render(path, render.index)

