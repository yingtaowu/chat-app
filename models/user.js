var mongoose = require('mongoose')
var UserSchema = require('../schemas/user')
var User = mongoose.model('User', UserSchema)/*定义模型User，注意数据库存的是users*/

module.exports = User