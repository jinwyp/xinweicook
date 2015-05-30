{ name } = require "../../package.json"

module.exports = Talk =
  create: (opts) ->
    # return false if conf.debug
    { url, body } = opts
    opts =
      method: "POST"
      timeout: 5000
      url: url
      body: body
      json: true
    request(opts)
    .bind({})
    .spread((resp, body)->
      # logger.debug "talk", resp.statusCode
      # logger.debug "talk", body
      @statusCode = resp.statusCode
      @body = body
      @statusCode.should.eql 200
      # body.should.have.property "_id"
    ).catch (e)->
      @err = e
      logger.warn "talk", @

  alert: (title, text) ->
    @create
      url: conf.talk.alert
      body:
        authorName: name
        title: title
        text: libs.stringify.html text
        # redirectUrl: chance.url()
        # imageUrl: "http://ww3.sinaimg.cn/large/4c7128e3jw1el9sw7mvcoj20ca0gojv2.jpg"
