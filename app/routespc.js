
var publicPrefix = conf.pcPrefix
var viewsPrefix = '';
if (process.env.NODE_ENV == 'production' || process.env.PREVIEW == 'true') {
    // views dir: /views/  .see app.coffee
    viewsPrefix = 'pc/'
} else {
    // views dir: /public/
    viewsPrefix = 'pc/src/html/'
}
// 是否需要放到conf.coffee中
var routes = function(app) {
    // 页面渲染
    app.get(publicPrefix + "/", render(viewsPrefix + 'index.nunj', render.index));
    app.get(publicPrefix + "/eat", render(viewsPrefix + 'eat-list.nunj', render.eatList))
    app.get(publicPrefix + "/eat/:id", render(viewsPrefix + 'eat.nunj', render.eat))
    app.get(publicPrefix + "/cook", render(viewsPrefix + 'cook-list.nunj', render.cookList))
    app.get(publicPrefix + "/cook/:id", render(viewsPrefix + 'cook.nunj', render.cook))
    app.get(publicPrefix + "/me", function (req, res) {
        res.render(viewsPrefix + 'me.nunj')
    })
    app.get(publicPrefix + "/sign", function (req, res) {
        res.render(viewsPrefix + 'sign.nunj')
    })
    app.get(publicPrefix + "/cart", function (req, res) {
        res.render(viewsPrefix + 'cart.nunj')
    })
    app.get(publicPrefix + "/whyus", function (req, res) {
        res.render(viewsPrefix + 'why-choose-us.nunj', {curNav: 'whyus'})
    })
    app.get(publicPrefix + "/paymentresult", function (req, res) {
        res.render(viewsPrefix + 'pay-notify.nunj')
    })




    // 老网站重定向
    app.get('/front/product/:id', function (req, res, next) {
        models.dish.findOne({
            idOldWebsite: req.params.id,
            sideDishType: 'main',
            isPublished: true
        }).execAsync().then(function (result) {
            if (result && result._id) {
                res.redirect(publicPrefix + '/cook/' + result._id)
            } else {
                res.redirect(publicPrefix + '/404?oldid=' + req.params.id)
            }
        })
    })

    app.get('/mobile/product/:id', function (req, res, next) {
        models.dish.findOne({
            idOldWebsite: req.params.id,
            sideDishType: 'main',
            isPublished: true
        }).execAsync().then(function (result) {
            if (result && result._id) {
                res.redirect('/mobile/cook/' + result._id)
            } else {
                res.redirect(publicPrefix + '/404?oldid=' + req.params.id)
            }
        })
    })

    app.get('/front/products', function (req, res) {
        res.redirect(publicPrefix + '/cook/')
    })

    app.get('/front/products/Ready%20to%20Cook', function (req, res) {
        res.redirect(publicPrefix + '/cook/')
    })

    app.get('/front/products/Ready%20to%20Eat', function (req, res) {
        res.redirect(publicPrefix + '/eat/')
    })

    app.get('/front/contact', function (req, res) {
        res.redirect(publicPrefix + '/cook/')
    })

    app.get('/front/howitworks', function (req, res) {
        res.redirect(publicPrefix + '/cook/')
    })

    app.get('/nsign', function (req, res) {
        res.redirect(publicPrefix + '/sign/')
    })


    app.get('/app', function (req, res) {
        res.redirect(publicPrefix + '/')
    })

    app.get('/mobile/products', function (req, res) {
        res.redirect( '/mobile')
    })

    app.get('/mobile/index', function (req, res) {
        res.redirect('/mobile')
    })

    app.get('/mobile/nsign', function (req, res) {
        res.redirect('/mobile')
    })


    // 切换语言
    app.get(publicPrefix + '/locale', function (req, res) {
        var lang = 'zh',
            referer = req.get('referer');

        lang = req.cookies.lang !== 'en' ? 'en' : lang;

        referer = (!referer || referer.indexOf('locale') != -1) ?  publicPrefix + '/' : referer;
        res.cookie('lang', lang, {maxAge: 365 * 24 * 60 * 60 * 1000});
        res.redirect(referer);
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
    var query = [
        models.promotionposition.constantPosition().index1,
        models.promotionposition.constantPosition().index2,
        models.promotionposition.constantPosition().index3
    ]

    var promiseList = [
        models.dish.find({
            sideDishType: 'main',
            isPublished: true
        }).sort("-sortId").sort("-createdAt").execAsync(),

        models.promotionposition.find99({position: {$in: query}})
    ];


    Promise.all(promiseList).spread(function(dishes, promotionposition){
        var bannerType = models.promotionposition.constantPosition().index1
        var eatType = models.promotionposition.constantPosition().index3

        var data = {
            // 识别为首页的头部
            indexHeader: true,
            // 识别为可选择便当的页面
            eatExist: true,

            cooks: dishes.filter(function (dish) {
                return dish.cookingType == 'ready to cook'
            }).slice(0, 3),
            //eats: dishes.filter(function (dish) {
            //    return dish.cookingType == 'ready to eat'
            //}).slice(0, 3),
            promotions: promotionposition.filter(function (el) {
                return el.position == bannerType
            }),
            eats: promotionposition.filter(function (el) {
                return el.position == eatType
            }).map(function (el) {
                return el.dish
            })

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
    }).populate('tagFilter').execAsync()
        .then(function (dishes) {
            var drinks = dishes.filter(function (dish) {
                return dish.sideDishType == 'drink'
            })
            var drinkTags = {}
            drinks.forEach(function (el) {
                if (!el.tagFilter || !el.tagFilter.length) return
                // todo: 这里假设`饮料`的tag只有一个,且只是用来做分类
                var name = el.tagFilter[0].name.en
                if (!drinkTags[name]) {
                    drinkTags[name] = [el]
                } else {
                    drinkTags[name].push(el)
                }
            })
            // 没有nunjucks的对象迭代方法, 考虑到以后万一要调整数组中元素的顺序比较方便
            drinkTags = Object.keys(drinkTags).map(function (key) {
                return drinkTags[key]
            })
            res.render(path, {
                // 表示当前页为便当列表,使相应nav为激活状态
                curNav: 'eat',
                // 识别为可选择便当的页面
                eatExist: true,

                dishes: dishes.filter(function (dish) {
                    return dish.sideDishType == 'main'
                }),
                drinkTags: drinkTags
            })
        }).catch(function (err) {
            next(err)
        })
}

render.cook = function (req, res, next, path) {
    models.dish.findOne({
        _id: req.params.id
    }).populate('recommendSet.dish').execAsync().then(function(dish){
        res.render(path, {
            dish: dish
        })
    }).catch(function (err) {
        next(err)
    })
}

render.eat = function (req, res, next, path) {
    models.dish.findOne({
        _id: req.params.id
    }).execAsync()
        .then(function (dish) {
            res.render(path, {
                // 识别为可选择便当的页面
                eatExist: true,

                dish: dish
            })
        }).catch(function (err) {
            next(err)
        })
}

var sortObj = {
    // 价格生序
    '01': {priceOriginal: 1},
    // 价格降序
    '02': {priceOriginal: -1},
    // 点赞降序
    '12': {statisticLike: -1}
}
var ID_RE = /^[\dA-Za-z]{24}$/
render.cookList = function (req, res, next, path) {
    var options = {}
    var query = {
        sideDishType: "main",
        isPublished: true,
        cookingType: 'ready to cook'
    }
    var tags

    if (sortObj[req.query.sort]) {
        options.sort = sortObj[req.query.sort]
    }

    if (req.query.t) {
        tags = typeof req.query.t == 'string' ? [req.query.t] : req.query.t
        tags = tags.filter(function (id) {
            return ID_RE.test(id)
        })
        if (tags.length) {
            query.tagFilter = {
                $all: tags
            }
        }
    }
    var promiseList = [
        models.dish.find(query, null, options).execAsync(),
        models.tag.find({"isFilter" : true}).execAsync()
    ]

    Promise.all(promiseList).spread(function(dishes, tags){
        var tagGroupsMap = {}
        tags.forEach(function (tag) {
            var groupName = tag.group.en
            if (!tagGroupsMap[groupName]) {
                tagGroupsMap[groupName] = [tag]
            } else {
                tagGroupsMap[groupName].push(tag)
            }
        })

        res.render(path, {
            // for html, see above
            curNav: 'cook',
            cooks: dishes,
            tagGroups: Object.keys(tagGroupsMap).map(function (key) {
                return tagGroupsMap[key]
            })
        })
    }).catch(function (err) {
        next(err)
    })
}

render.static = function (req, res, next, path) {
    res.render(path)
}

routes.pageNotFound = function (req, res) {
    if (req.path.indexOf(publicPrefix) == 0) {
        res.status(404).render(viewsPrefix + '404.nunj')
        return true
    }
}

module.exports = routes;

// render(path, render.index)

