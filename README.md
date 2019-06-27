### 一、设计路由

| 路径              | 请求方法 | GET参数 | POST参数                                | 备注                 |
| ----------------- | -------- | ------- | :-------------------------------------- | -------------------- |
| /                 | GET      |         |                                         | 首页                 |
| /login            | GET      |         |                                         | 登录                 |
| /login            | POST     |         | email、nickname、password               | 处理登录请求         |
| /register         | GET      |         |                                         | 注册                 |
| /register         | POST     |         | email、nickname、password               | 处理注册请求         |
| /logout           | GET      |         |                                         | 处理退出出请求       |
| /settings/profile | GET      |         |                                         | 个人信息             |
| /settings/profile | POST     |         | nickname、bio、gender、birthday、avatar | 处理编辑个人信息请求 |
| /topic/new        | GET      |         |                                         | 新建话题             |
| /topic/new        | POST     |         | model、title、content                   | 处理话题             |

##### 主要代码：

````javascript
router.get('/', function (req, res) {
})

router.get('/login', function (req, res) {
})

router.post('/login', async function (req, res) {
})

router.get('/register', function (req, res) {
})

router.post('/register', async function (req, res) {
})

router.get('/logout', function (req, res) {
})

router.get('/settings/profile', function (req, res) {
})

router.post('/settings/profile',async function (req, res){
})

router.get('/topic/new',function(req,res){
})

router.post('/topic/new',async function(req,res){
})
````

### 二、设计```Schema``` 规定 ```MongoDB``` 中 ```Collections```

##### 1.User collection:

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

##### 2.User collection:

