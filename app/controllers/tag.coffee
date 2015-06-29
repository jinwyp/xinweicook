# Tag



exports.tagFilterList = (req, res, next) ->
  # 获取所有TagFilter
  models.tag.findAsync {"isFilter" : true}
  .then (cooks) ->
    res.json cooks
  , next



exports.tagSingleInfo = (req, res, next) ->
  # 获取Tag
  models.tag.findOneAsync _id: req.params._id
  .then (cook) ->
    res.json cook
  , next




exports.addNewTag = (req, res, next) ->
  # 新建Tag

  createTag = _.assign createTag, req.body

  models.tag.createAsync createTag
  .then (resultTag) ->
    res.json resultTag
  , next




