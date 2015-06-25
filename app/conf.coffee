ENV = process.env
port = ENV.PORT or 3003
host = ENV.HOST or "127.0.0.1"

conf =
  debug: true
  level:
    console: ENV.LEVEL or "info"
    db: "info"
  port: port
  host: host
  db: ENV.DB or "mongodb://127.0.0.1/cook-api"
  redis: if ENV.REDIS then JSON.parse ENV.REDIS else [
    { host: "127.0.0.1", port: "6379" }
    { host: "127.0.0.1", port: "6379" }
  ]
  url:
    base: ENV.BASE or "http://#{host}:#{port}"
  talk:
    alert: "https://talk.ai/v1/services/webhook/77599e8402709dbbcf3ce697b69a517c97c9890d"
    order:
      ready: "https://talk.ai/v1/services/webhook/77b0b7d2b06f7ca161f6457b88f466f17b28ff2a"
  mailgun:
    url: "https://api.mailgun.net/v2/xinweicook.com"
    key: "key-7jcwxbtr22ffdx75jpw23i7zxokth693"
    from:
      "zh-CN": "新味食材包 <no-reply@xinweicook.com>"
      "en-US": "XinweiCook <no-reply@xinweicook.com>"
    code:
      subject:
        "en-US": "Verification Code - XinweiCook"
        "zh-CN": "验证码 - 新味食材包"
      text:
        "en-US": "Verification Code: "
        "zh-CN": "验证码: "
  yunpian:
    apikey: "4aba5d380c442c3729c1bbc5035527dd"
    url: "http://yunpian.com/v1/sms/send.json"
    text: (lang, code) ->
      if lang is "en-US"
        "【新味食材包】Your verification code is #{code}."
      else
        "【新味食材包】您的验证码为 #{code}。"
  code:
    trys: 5
    sends: 10
    expire: 5 # mins
    type:["signUp", "resetPassword", "verifyMobile"]
  token:
    expires_in: 3600 * 48 #hours
    sso: true
  default:
    avatar: "http://ww2.sinaimg.cn/large/7112dac1gw1esc9njt3ijj20e80e83yv.jpg"
    limit: 20
    skip: 20
production =
  debug: false
  level:
    console: ENV.LEVEL or "warn"
    db: "warn"
  db: ENV.DB or "mongodb://cook-api:9wvpfcm7tZ&j.WBX6ZAGH&eRk@10.4.21.97/cook-api"
  redis: if ENV.REDIS then JSON.parse ENV.REDIS else [
    { host: "10.4.3.142", port: "6379" }
    { host: "10.4.3.101", port: "6379" }
  ]
  url:
    base: ENV.BASE or "https://xinweicook.com"

module.exports = if ENV.NODE_ENV is "production" then _.assign(conf, production) else conf
