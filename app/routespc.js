
// 是否需要放到conf.coffee中
var routes = function(app) {
    var publicPrefix = conf.pcPrefix
    var viewsPrefix = '';
    if (process.env.NODE_ENV == 'production' || process.env.PREVIEW == 'true') {
        // views dir: /views/  .see app.coffee
        viewsPrefix = 'pc/'
    } else {
        // views dir: /public/
        viewsPrefix = 'pc/src/html/'
    }
    
    // 页面渲染
    app.get(publicPrefix + "/", render(viewsPrefix + 'index.nunj', render.index));
    app.get(publicPrefix + "/eat", render(viewsPrefix + 'eat-list.nunj', render.eatList))
    app.get(publicPrefix + "/cook/:id", render(viewsPrefix + 'cook.nunj', render.cook))
    app.get(publicPrefix + "/cook", render(viewsPrefix + 'cook-list.nunj', render.cookList))
    app.get(publicPrefix + "/me", function (req, res) {
        res.render(viewsPrefix + 'me.nunj')
    })
    app.get(publicPrefix + "/sign", function (req, res) {
        res.render(viewsPrefix + 'sign.nunj')
    })
    app.get(publicPrefix + "/cart", function (req, res) {
        res.render(viewsPrefix + 'cart.nunj')
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

    var promiseList = [
        models.dish.find({
            sideDishType: 'main',
            isPublished: true
        }).sort("-sortId").sort("-createdAt").execAsync(),

        models.promotionposition.find99({position: models.promotionposition.constantPosition().index1})
    ];


    Promise.all(promiseList).spread(function(dishes, promotionPostions){
        console.log(promotionPostions)
        var data = {
            // 识别为首页的头部
            indexHeader: true,

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
                // 表示当前页为便当列表,使相应nav为激活状态
                curNav: 'eat',

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
                // for html, see above
                curNav: 'cook',

                cooks: dishes
            })
        }).catch(function (err) {
            next(err)
        })
}

render.static = function (req, res, next, path) {
    res.render(path)
}

module.exports = routes;

// render(path, render.index)
