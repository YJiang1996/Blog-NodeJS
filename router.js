var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/', function (req, res) {
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

router.get('/logout', function (req, res) {
    req.session.user = null
    res.redirect('/login')
})

router.get('/settings/profile', function (req, res) {
    res.render('settings/profile.html', {
        user: req.session.user
    })
})

router.post('/settings/profile', async function (req, res) {
    var body = req.body
    body.last_modified_time = Date()
    try {
        await User.updateOne({ _id: body._id }, body)

        var user = await User.findById(body._id)

        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'ok'
        })

    } catch (error) {
        return res.status(500).json({
            err_code: 500,
            message: error.message
        })
    }
})

router.get('/settings/admin', function (req, res) {
    res.render('settings/admin.html', {
        user: req.session.user
    })
})

router.post('/settings/admin', async function (req, res) {
    var body = req.body,
        oldPassword = md5(md5(body.oldpassword)),
        newPassword1 = md5(md5(body.newPassword1)),
        newPassword2 = md5(md5(body.newPassword2)),
        user = req.session.user
    console.log(oldPassword, body, user)
    if (oldPassword !== user.password) {
        res.status(200).json({
            err_code: 1,
            message: '密码错误'
        })
    } else if (oldPassword === user.password && newPassword1 !== newPassword2) {
        res.status(200).json({
            err_code: 2,
            message: '两次密码不相同'
        })
    } else if (oldPassword === user.password && newPassword1 === newPassword2) {
        await User.updateOne({_id:user._id},{password:newPassword1}).then(
            res.status(200).json({
                err_code: 0,
                message: '修改成功'
            })
        )
        
    } else {
        res.status(500).json({
            err_code: 500,
            message: 'server error'
        })
    }

})

router.get('/topic/new', function (req, res) {
    res.render('topic/new.html')
})

router.post('/topic/new', async function (req, res) {
    res.render('topic/new.html')
})

module.exports = router