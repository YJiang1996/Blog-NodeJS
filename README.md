### 一、设计路由

| 路径      | 请求方法 | GET参数 | POST参数                  | 备注         | 权限 |
| --------- | -------- | ------- | ------------------------- | ------------ | ---- |
| /         | GET      |         |                           | 首页         |      |
| /login    | GET      |         |                           | 登录         |      |
| /login    | POST     |         | email、nickname、password | 处理登录请求 |      |
| /register | GET      |         |                           | 注册         |      |
| /register | POST     |         | email、nickname、password | 处理注册请求 |      |
| /logout   | GET      |         |                           | 处理推出请求 |      |

##### 主要代码：

````javascript
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
````

### 二、设计```Schema``` 规定 ```MongoDB``` 中 ```Collection```

##### User 集合

````javascript
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true });

var Schema = mongoose.Schema

var userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: '/public/img/avatar-default.png'
    },
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: Number,
        enum: [-1, 0, 1],
        default: -1
    },
    brithday: {
        type: Date
    },
    status: {
        type: Number,
        enum: [0, 1, 2],
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema)
````

### 

