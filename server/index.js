// var express = require('express')

// var mongoose = require('mongoose')
// var bodyParser = require('body-parser') //是一个非常常用的express中间件,对post请求的请求体进行解析
// var cookieParser = require('cookie-parser') //用于获取web浏览器发送的cookie中的内容
// var session = require('cookie-session')
// mongoose.Promise = require('bluebird') //bluebird提供了一个非常有用的功能来promise化不返回promise的模块
// global.db = mongoose.connect("mongodb://localhost:27017/vuechat")

// var app = express()

// app.use(bodyParser.json()) //服务器提交的数据json化
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(cookieParser()) //sesstion 存储
// app.use(session({
//   secret: 'vuechat',
//   resave: false,
//   saveUninitialized: true
// }))

// var env = process.env.NODE_ENV || 'development'
// if ('development' === app.get('env')) {
//   app.set('showStackError', true)
//   app.locals.pretty = true
//   mongoose.set('debug', true)
// }

// require('../config/routes')(app)

// /*------------socket配置-------------*/
// var io = require('socket.io')(server); //利用socketIo创建io对象然后通过io的on方法监听connection事件
// var Message = require('../models/message')
// global.users = {}

// io.on('connection', function (socket) {
  
//   socket.on('enterChat', function (obj) { //用于监听用户进入聊天室
//     console.log("-----enter----------");
//     socket.name = obj.name
//     socket.room = obj.roomid
//     if (!global.users[obj.roomid]) {
//       global.users[obj.roomid] = {}
//     }
//     global.users[obj.roomid][obj.name] = obj
//     socket.join(obj.roomid) //加入某个分组

//     io.to(obj.roomid).emit('enterChat', global.users[obj.roomid]) //向某个分组发送消息
//     console.log(obj.name + '加入了' + obj.roomid)
//   })

  
//   socket.on('message', function (obj) { //监听用户发布聊天内容
//     console.log("1111--", obj)
//     var mess = {
//       username: obj.username,
//       src: obj.src,
//       msg: obj.msg,
//       img: obj.img,
//       roomid: obj.room
//     }
   
//     io.to(mess.roomid).emit('message', mess)  //向所有客户端广播发布的消息
//     console.log(obj.username + '对房' + mess.roomid + '说：' + mess.msg)
//     if (obj.img === '') {
//       var message = new Message(mess)
//       message.save(function (err, mess) { //将发送过来的消息进行储存
//         if (err) {
//           console.log(err)
//         }
//         console.log(mess)
//       })
//     }
//   })

  
//   socket.on('logout', function (obj) { //用于监听用户退出聊天室
//     console.log("global.users--", global.users);
//     delete global.users[obj.roomid][obj.name]
//     console.log(obj.name + '退出了' + obj.roomid)

//     io.to(obj.roomid).emit('logout', global.users[obj.roomid])
//   })

// })
// /*---------------结束------------*/