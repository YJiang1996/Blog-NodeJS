#### 设计路由

| 路径      | 请求方法 | GET参数 | POST参数                  | 备注         | 权限 |
| --------- | -------- | ------- | ------------------------- | ------------ | ---- |
| /         | GET      |         |                           | 首页         |      |
| /login    | GET      |         |                           | 登录         |      |
| /login    | POST     |         | email、nickname、password | 处理登录请求 |      |
| /register | GET      |         |                           | 注册         |      |
| /register | POST     |         | email、nickname、password | 处理注册请求 |      |
| /logout   | GET      |         |                           | 处理推出请求 |      |



````javascript
var a = abc;
````

