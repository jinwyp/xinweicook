crypto = require "crypto"

module.exports = Crypto =
  md5: (str)->
    crypto.createHash("md5").update(str.toString()).digest("hex")

  hmacSha1: (salt, str)->
    crypto.createHmac("sha1", salt.toString()).update(str.toString()).digest("hex")

  hmacMd5: (str)->
    crypto.createHmac("md5", str.toString()).digest("hex")

  random: (length=64)->
    crypto.randomBytes(length).toString("base64")

  gencode : (length = 8) ->
    chars = 'ABCDEFGHJKMNPQRSTUVWXWZ'.split('');
    str = ""
    for i in [1..length]
      str += chars[Math.floor(Math.random() * chars.length)];
    str