const mongoose = require('../db/db.js'), 
Schema = mongoose.Schema; 
const article = new Schema({ 
    title:{type: String}, //标题
    content:{type: String}, //内容
    category:{type: String}, //分类
    createUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },//创建人
    createTime:{ type: Date}, //创建日期
    updateTime: {type:Date}//修改日期

});
module.exports = mongoose.model('Article',article,'article');

// path
// 　类型：String或Object。
// 　　String类型的时， 指定要填充的关联字段，要填充多个关联字段可以以空格分隔。
// 　　Object类型的时，就是把 populate 的参数封装到一个对象里。当然也可以是个数组。下面的例子中将会实现。
// select
// 类型：Object或String，可选，指定填充 document 中的哪些字段。
// 　　Object类型的时，格式如:{name: 1, _id: 0},为0表示不填充，为1时表示填充。
// 　　String类型的时，格式如:”name -_id”，用空格分隔字段，在字段名前加上-表示不填充。详细语法介绍 query-select
// model
// 类型：Model，可选，指定关联字段的 model，如果没有指定就会使用Schema的ref。
// match
// 类型：Object，可选，指定附加的查询条件。
// options
// 类型：Object，可选，指定附加的其他查询选项，如排序以及条数限制等等。