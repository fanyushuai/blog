const mongoose = require('../db/db.js'), 
Schema = mongoose.Schema; 
const article = new Schema({ 
    title:{type: String}, //标题
    content:{type: String}, //内容
    create_user:{type:String},//创建人
    cerete_time:{ type: Date}, //创建日期
    upde_time: {type:Date}//修改日期
}); 
module.exports = mongoose.model('Article',article);