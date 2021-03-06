ENV = process.env
port = ENV.PORT or 3003
host = ENV.HOST or "127.0.0.1"


conf =
  debug: true
  level:
    console: ENV.LEVEL or "info"
    db: "warn"
  port: port
  host: host
  db: ENV.DB or "mongodb://127.0.0.1/cook-api"
  redis: if ENV.REDIS then JSON.parse ENV.REDIS else [
    { host: "127.0.0.1", port: "6379" }
    { host: "127.0.0.1", port: "6379" }
  ]
  pcPrefix: '/pc'
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
    apikey: "4aba5d380c442c3729c1bbc5035527dd"  # https://www.yunpian.com/api/sms.html
    url: "http://yunpian.com/v1/sms/send.json"

  alipay :
    key : "iilt312jb1ijgct5ocpxiehw0yyodic0"

  weixinpay :
    appid: "wx37a1323e488cef84"
    mch_id: "1231161502"
    secret: "5e21fb82b13330f462bcf4a008a3670c"
    key: "Gothicjk1129xinwei789tencentsbsb"
    notify_url : "/api/orders/payment/weixinpay/notify"

  weixinAppPay :
      appid: "wxc31508f4ded1402b"
      mch_id: "1260182401" # WXPartnerID
      secret: "8ade6dca11118541ffae1ef4e5a19160"  # APP secret
      key: "xinweicook201507272147xinweicook"  # WXPartner secret
      notify_url : "/api/orders/payment/weixinpay/notify"

  xingePush :
    accessId : 2200130690
    secretKey : "f2d9db2a6a5b30bbd0a1009de079ca80"

  qiniu :
    access_key : "244idmCB2Lsc-R3ylxEmbh97hKBfRXO6cUm1QJJp"
    secret_key : "ktbOSuZrHbGbFl-Zdo06SEAhRC4DLT9oQ2eqv-QR"

  code:
    trys: 5
    sends: 9
    expire: 30 # mins

  token:
    expires_in: 3600 * 24 * 60 # 7 Day
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
  db: ENV.DB or "mongodb://cook-api-test:9wvpfcm7tZ&j.WBX6ZAGH&eRk@10.4.21.97/cook-api-test"
  redis: if ENV.REDIS then JSON.parse ENV.REDIS else [
    { host: "10.4.3.142", port: "6379" }
    { host: "10.4.3.101", port: "6379" }
  ]
  url:
    base: ENV.BASE or "https://xinweicook.com"



resultConf = conf

if ENV.NODE_ENV is "production"
  resultConf = _.assign(conf, production)

if ENV.NODE_ENV is "production2"
  resultConf = _.assign(conf, {db:"mongodb://127.0.0.1/cookapinew"})

console.log("NODE_ENV:", ENV.NODE_ENV, " ", "Database Default Url:", ENV.DB, resultConf.db)


module.exports = resultConf
