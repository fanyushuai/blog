const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// 使用 body-parser 中间
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//解决跨域
app.use(cors({
    origin:['http://localhost:8080'],  //指定接收的地址
    methods:['GET','POST','options'],  //指定接收的请求类型
    alloweHeaders:['Content-Type']  //指定header
}))

//根据不同的功能 划分模块 (动态)
app.use(bodyParser.json());
app.use('/admin',require('./router/articleRouter.js'));
 
app.listen(9090,(res,req)=>{
    console.log('Node app start at port 9090');
});
