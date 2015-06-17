# 美食趣闻
module.exports = (router)->
  router.get("/article/:_id", (req, res, next) ->
    # 获取趣闻
    models.article.findOneAsync _id: req.params._id
    .then (article) ->
      res.json article
    , next
  ).get("/articles", (req, res, next) ->
    # 获取所有趣闻
    models.article.findAsync {}
    .then (articles) ->
      res.json articles
    , next
  )
