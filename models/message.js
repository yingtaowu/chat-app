//models(存放mongoose对象)
var mongoose = require('mongoose')
var MessageSchema = require('../schemas/message')
var Message = mongoose.model('Message', MessageSchema)/*定义模型Message，注意数据库存的是messages*/

//删除数据库
var del = {roomid: 'group1'}
Message.remove(del,function(err,result){
 if(err){
 console.log(err);
 }else{
 console.log("update");
 }
});

module.exports = Message