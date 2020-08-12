
const app = require('express');
const Article = require("../schema/article.js");
const router = app.Router();
const async = require('async');

router.get('/list',function(req,res,next){
    var pageSize = req.query.pageSize*1||10; //分页参数
    var currentPage = req.query.currentPage*1||1; //当前页码
    var title = req.query.title;

    var _filter = {};
    if(title){
      _filter = {
        $or: [  // 多字段同时匹配
          {cn: {$regex: title}},
          {key: {$regex: title, $options: '$i'}}, //  $options: '$i' 忽略大小写
          {en: {$regex: title, $options: '$i'}}
        ]
      }
    }
    var start = (currentPage - 1) * pageSize;
    var $page = {};
    async.parallel({
      count: function (done) { // 查询数量
        Article.count(null).exec(function (err, count) {
          done(err, count);
        });
      },
      records: function (done) { // 查询一页的记录
        Article.find(_filter).skip(start).limit(pageSize).sort({"_id":1}).exec(function (err, doc) {
          done(err, doc);
        });
      }
    },function (err, results) {
      var count = results.count;
      $page.total = count;
      $page.data = results.records;
      res.send($page);
    });

  router.get('/save',function(req,res,next){
    var title = req.query.title;
    var content = req.query.content;

    var articleData = new Article({
      "title":title,
      "content":content,
      "createUser":"fys",
      "createTime":new Date(),
      "updateTime":new Date()
    });

    articleData.save(function(err,data){
      res.send(data);
    });
  })

  router.get('/deleteOne',function(req,res,next){
    var id = req.query.id;
    Article.deleteOne({"_id":id},function(err,data){
      res.send(data);
    });
  })

    // let params = {
    //     //条件查询参数
    //     city:req.query.city,
    //     education:req.query.education,
    //     keyword:req.query.keyword
    // };
    // let mp = {};
    // for (let i in params){
    //     if (params[i] !== undefined){
    //         mp[i] = params[i]
    //     }
    // }
    // if (currentPage < 1) {
    //     currentPage = 1;
    // }
    // Article.find({...mp}).skip((parseInt(currentPage)-1)*parseInt(limit)).limit(parseInt(limit)).exec(function (err,data){
    //     if (err) {res.send(err)}
    //     var returnDate = new ReturnData(data);
    //     res.send(data);
    // });
    // var queryParams = new QueryParams(currentPage, limit, Article, null, null, null, null);
    // Article.pageQuery(queryParams,function(err,data){
    //     res.send(data);
    // });
});
module.exports = router
