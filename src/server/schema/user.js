const mongoose = require('../db/db.js'),
Schema = mongoose.Schema;
const user = new Schema({
    username: { type: String }, //用户名
    password: { type: String }, //密码
    headimg: { type: String },//头像
    createUser: { type: String },//创建人
    cereteTime: { type: Date }, //创建日期
    updateTime: { type: Date }//修改日期
});
module.exports = mongoose.model('User', user, 'user');