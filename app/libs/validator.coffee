validator = require "validator"

validator.extend 'isCnPhone', (mobile) ->
  validator.isMobilePhone mobile, "zh-CN"

module.exports = validator
