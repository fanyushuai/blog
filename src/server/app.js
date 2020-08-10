const express = require('express');
const bodyParser = require('body-parser');
const app = express();
 
//根据不同的功能 划分模块 (动态)
app.use(bodyParser.json());
app.use('/admin',require('./router/articleRouter.js'));
 
app.listen(9090,(res,req)=>{
    console.log('Node app start at port 9090');
});
