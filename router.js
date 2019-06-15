var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/', function (req, res) {
    // console.log(req.session.user)
    res.render('index.html', {
        user: req.session.user
    })
})

router.get('/login', function (req, res) {
    res.render('login.html')
})

router.post('/login', async function (req, res) {
    var body = req.body
    try {
        var user = await User.findOne({
            email: body.email,
            password: md5(md5(body.password))
        })

        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: '邮箱或者密码错误'
            })
        }
        console.log(!null)

        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: '登录'
        })
    } catch (error) {
        return res.status(500).json({
            err_code: 500,
            message: error.message
        })
    }
})

router.get('/register', function (req, res) {
    res.render('register.html')
})

router.post('/register', async function (req, res) {
    var body = req.body
    try {
        if (await User.findOne({ email: body.email })) {
            return res.status(200).json({
                err_code: 1,
                message: '邮箱已存在'
            })
        }
        if (await User.findOne({ nickname: body.nickname })) {
            return res.status(200).json({
                err_code: 2,
                message: '昵称已存在'
            })
        }
        body.password = md5(md5(body.password))

        var user = await new User(body).save()

        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: '注册成功'
        })

    } catch (error) {
        res.status(500).json({
            err_code: 500,
            message: error.message
        })
    }
})

router.get('/logout',function(req,res){
    req.session.user = null
    res.redirect('/login')
})

module.exports = router