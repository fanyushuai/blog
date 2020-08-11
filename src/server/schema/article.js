const mongoose = require('../db/db.js').default, 
Schema = mongoose.Schema; 
const article = new Schema({ 
    title:{type: String}, //标题
    content:{type: String}, //内容
    createUser:{type:String},//创建人
    cereteTime:{ type: Date}, //创建日期
    updateTime: {type:Date}//修改日期
}); 
module.exports = mongoose.model('Article',article);