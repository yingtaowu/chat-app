require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)


/*-------------新增配置------------*/
var mongoose = require('mongoose')
var bodyParser = require('body-parser') //是一个非常常用的express中间件,对post请求的请求体进行解析
var cookieParser = require('cookie-parser') //用于获取web浏览器发送的cookie中的内容
var session = require('cookie-session')
mongoose.Promise = require('bluebird') //bluebird提供了一个非常有用的功能来promise化不返回promise的模块
global.db = mongoose.connect("mongodb://localhost:27017/vuechat")

app.use(bodyParser.json()) //服务器提交的数据json化
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser()) //sesstion 存储
app.use(session({
  secret: 'vuechat',
  resave: false,
  saveUninitialized: true
}))

var env = process.env.NODE_ENV || 'development'
if ('development' === app.get('env')) {
  app.set('showStackError', true)
  app.locals.pretty = true
  mongoose.set('debug', true)
}

require('../config/routes')(app)
/*-------------结束------------*/


var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => { }
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)


/*------------socket配置-------------*/
var io = require('socket.io')(server); //利用socketIo创建io对象然后通过io的on方法监听connection事件
var Message = require('../models/message')
global.users = {}

io.on('connection', function (socket) {

  socket.on('enterChat', function (obj) { //用于监听用户进入聊天室
    console.log("-----enter----------");
    socket.name = obj.name
    socket.room = obj.roomid
    if (!global.users[obj.roomid]) {
      global.users[obj.roomid] = {}
    }
    global.users[obj.roomid][obj.name] = obj
    socket.join(obj.roomid) //加入某个分组

    io.to(obj.roomid).emit('enterChat', global.users[obj.roomid]) //向某个分组发送消息
    console.log(obj.name + '加入了' + obj.roomid)
  })


  socket.on('message', function (obj) { //监听用户发布聊天内容
    var mess = {
      username: obj.username,
      src: obj.src,
      msg: obj.msg,
      img: obj.img,
      roomid: obj.room
    }

    io.to(mess.roomid).emit('message', mess)  //向所有客户端广播发布的消息
    console.log(obj.username + '对房' + mess.roomid + '说：' + mess.msg)
    var message = new Message(mess)
    message.save(function (err, mess) { //将发送过来的消息进行储存
      if (err) {
        console.log(err)
      }
    })
  })


  socket.on('logout', function (obj) { //用于监听用户退出聊天室
    console.log("global.users--", global.users);
    delete global.users[obj.roomid][obj.name]
    console.log(obj.name + '退出了' + obj.roomid)

    io.to(obj.roomid).emit('logout', global.users[obj.roomid])
  })

})
/*---------------结束------------*/


module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
