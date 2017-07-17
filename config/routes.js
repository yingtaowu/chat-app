var User = require('../models/user')
var Message = require('../models/message')
var superagent = require('superagent')
var fs = require('fs')
var multiparty = require('multiparty'); //用于上传文件

module.exports = function (app) {
  app.use(function (req, res, next) {
    var _user = req.session.user

    app.locals.user = _user

    next()
  })

  // 注册
  app.post('/user/signup', function (req, res) {
    var _user = req.body
    console.log("_user--", _user)
    User.findOne({ name: _user.name }, function (err, user) {
      if (err) {
        console.log(err)
      }
      if (user) {
        res.json({
          errno: 1,
          data: '用户名已存在'
        })
      } else {
        var user = new User(_user)
        user.save(function (err, user) {
          if (err) {
            console.log(err)
          }
          res.json({
            errno: 0,
            data: '注册成功'
          })
        })
      }
    })
  }),

    // 登录
    app.post('/user/signin', function (req, res) {
      console.log(req.body)
      var _user = req.body
      var name = _user.name
      var password = _user.password
      console.log(password)
      User.findOne({ name: name }, function (err, user) {
        if (err) {
          console.log(err);
        }
        console.log(user)
        if (!user) {
          res.json({
            errno: 1,
            data: '用户不存在'
          })
        } else {
          if (!!password) {
            user.comparePassword(password, function (err, isMatch) {
              if (err) {
                console.log(err);
              }
              if (isMatch) {
                req.session.user = user;
                console.log('success');
                res.json({
                  errno: 0,
                  data: '登录成功',
                  name: name,
                  src: user.src
                })
              } else {
                res.json({
                  errno: 1,
                  data: '密码不正确'
                })
                console.log('password is not meached');
              }
            })
          } else {
            res.json({
              errno: 1,
              data: '登录失败'
            })
          }
        }

      })
    })

  // 信息
  app.get('/message', function (req, res) {
    var id = req.query.roomid
    // console.log(id)
    Message.find({ roomid: id }, function (err, message) {
      if (err) {
        console.log(err)
      } else {
        // console.log(message)
        res.json({
          errno: 0,
          data: message
        })
      }
    })
  }),

    // 机器人消息
    app.get('/robotapi', function (req, res) {
      var response = res
      var info = req.query.info
      var name = req.query.name
      var key = 'fde7f8d0b3c9471cbf787ea0fb0ca043'

      //superagent是nodejs里一个非常方便的客户端请求代理模块，当你想处理get,post,put,delete,head请求时,你就应该想起该用它了
      //superagent是一个轻量的,渐进式的ajax api,可读性好,学习曲线低,内部依赖nodejs原生的请求api,适用于nodejs环境下.
      superagent.post('http://www.tuling123.com/openapi/api')
        .send({ info, name, key })
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          response.json({
            data: res.text
          })
        })
    })

  //发送图片
  app.post('/file/uploadimg', function (req, res, next) {
    // 生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form()
    // 设置编辑
    form.encoding = 'utf-8'
    // 设置文件存储路径
    form.uploadDir = "./static/files/"
    // 设置单文件大小限制
    form.maxFilesSize = 2 * 1024 * 1024
    // form.maxFields = 1000;  设置所以文件的大小总和
    // 上传完成后处理
    form.parse(req, function (err, fields, files) {
      console.log(fields)
      var filesTmp = JSON.stringify(files, null, 2)
      console.log(filesTmp)
      if (err) {
        console.log('parse error: ' + err)
        res.json({
          errno: 1
        })
      } else {
        var inputFile = files.file[0];
        var uploadedPath = inputFile.path
        var array = inputFile.originalFilename.split('.')
        var imgtype = array[array.length - 1]
        var dstPath = './static/files/' + new Date().getTime() + '.' + imgtype
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function (err) { //fs node的文件系统
          if (err) {
            console.log('rename error: ' + err)
            res.json({
              errno: 1
            })
          } else {
            var mess = {
              username: fields.username,
              src: fields.src,
              img: dstPath,
              roomid: fields.roomid
            }
            var message = new Message(mess)
            message.save(function (err, mess) {
              if (err) {
                console.log(err)
              }
              console.log(mess)
            })

            res.json({
              errno: 0
            })
          }
        })
      }
    })
  })
}