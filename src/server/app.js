const express = require('express');
const bodyParser = require('body-parser');
const app = express();
 

app.all("*", (req, res, next) => {
	// 允许跨域的白名单, 跨域时会报错 ，* 代表任意域
	res.header('Access-Control-Allow-Origin', '*')
	// 允许携带Cookie, 不设置的时候， 跨域时会报错
	res.header('Access-Control-Allow-Credentials', 'true')
	// 允许跨域的方法
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS') 
	// 设置允许跨域的请求头
	// res.header("Access-Control-Allow-Headers", "X-Requested-With")
	// 设置响应编码
	res.header("Content-Type", "application/json;charset=utf-8")
	next() // 继续下一个中间件
})

//根据不同的功能 划分模块 (动态)
app.use(bodyParser.json());
app.use('/admin',require('./router/articleRouter.js'));
 
app.listen(9090,(res,req)=>{
    console.log('Node app start at port 9090');
});
