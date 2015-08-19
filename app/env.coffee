Error.stackTraceLimit = 1
GLOBAL.requireLocalizations = require "./localizations/output/all.js"
GLOBAL.l = requireLocalizations "zh-CN"
GLOBAL.chai     = require "chai"
chaiAsPromised  = require "chai-as-promised"
chai.use chaiAsPromised
chai.should()

GLOBAL._       = require "lodash"
GLOBAL.Base62  = require "base62"
GLOBAL.bcrypt  = require "bcryptjs"
GLOBAL.chance  = new require("chance")()
GLOBAL.express = require "express"
GLOBAL.fs      = require "fs"
GLOBAL.moment  = require "moment"
GLOBAL.path    = require "path"
GLOBAL.hooker  = require "hooker"

GLOBAL.Promise  = require "bluebird"
Promise.longStackTraces()
GLOBAL.request  = Promise.promisify(require("request"))
GLOBAL.mongoose = Promise.promisifyAll(require("mongoose"))
GLOBAL.Schema   = mongoose.Schema
GLOBAL.ObjectId = mongoose.Types.ObjectId

GLOBAL.conf   = require "./conf"
GLOBAL.libs   = require "./libs"
GLOBAL.Err    = libs.err.Err()
GLOBAL.logger = libs.logger.logger()
#GLOBAL.redis  = libs.redis()
GLOBAL.models = require "./models"
