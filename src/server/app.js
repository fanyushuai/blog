const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const jwt = require("./util/jwtUtil")

// 使用 body-parser 中间
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//解决跨域
app.use(cors({
    origin: ['http://localhost:8080'],  //指定接收的地址
    methods: ['GET', 'POST', 'options'],  //指定接收的请求类型
    alloweHeaders: ['Content-Type']  //指定header
}));

//验证token
var apiRoutes = express.Router();
apiRoutes.use(function (req, res, next) {
    // 拿取token 数据 按照自己传递方式写
    var token = req.body.token || req.query.token || req.headers['token'];
    var requestUrl = req.originalUrl;
    if(requestUrl.indexOf("login") != -1){
        next();
    }else{
        if (token) {
            // 解码 token (验证 secret 和检查有效期（exp）)
            jwt.validate(token, res,next, function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: '无效的token.' });
                } else {
                    // 如果验证通过，在req中写入解密结果
                    req.decoded = decoded;
                    //console.log(decoded)  ;
                    next(); //继续下一步路由
                }
            });
        } else {
            // 没有拿到token 返回错误 
            return res.status(403).send({
                success: false,
                message: '没有找到token.'
            });
        }
    }
});


//根据不同的功能 划分模块 (动态)
app.use(apiRoutes);
app.use(bodyParser.json());
app.use('/admin/article', require('./router/articleRouter'));
app.use('/admin/user', require('./router/userRouter'));

app.listen(9090, (res, req) => {
    console.log('Node app start at port 9090');
});
