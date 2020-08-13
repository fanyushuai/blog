const app = require('express');
const Article = require("../schema/article.js");
const router = app.Router();
const async = require('async');

/**
 * 文章列表
 */
router.post('/list', function (req, res) {
  var pageSize = req.body.pageSize * 1 || 10; //分页参数
  var currentPage = req.body.currentPage * 1 || 1; //当前页码
  var title = req.body.title;

  var _filter = {};
  if (title) {
    _filter = {
      $or: [ // 多字段同时匹配
        {
          cn: {
            $regex: title
          }
        },
        {
          key: {
            $regex: title,
            $options: '$i'
          }
        }, //  $options: '$i' 忽略大小写
        {
          en: {
            $regex: title,
            $options: '$i'
          }
        }
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
      Article.find(_filter).skip(start).limit(pageSize).sort({
        "_id": 1
      }).exec(function (err, doc) {
        done(err, doc);
      });
    }
  }, function (err, results) {
    var count = results.count;
    $page.total = count;
    $page.data = results.records;
    res.send($page);
  });
});

/**
 * 新增/保存
 */
router.post('/save', function (req, res) {
  var title = req.body.title;
  var content = req.body.content;
  var id = req.body.id;

  var articleData = new Article({
    "title": title,
    "content": content,
    "createUser": "fys",
    "createTime": new Date(),
    "updateTime": new Date()
  });

  if (!id) {
    articleData.save(function (err, data) {
      res.send(data);
    });
  } else {
    Article.findByIdAndUpdate(id, {"title":title,"content":content}, function (err, data) {
      if(err){
        console.error(err);
      }
      res.send(data);
    })
  }
})

/**
 * 查询单条记录
 */
router.post("/findOne",function(req,res){
  var id = req.body.id
  Article.findById({
    "_id": id
  }, function (err, data) {
    res.send(data);
  });
})


/**
 * 删除
 */
router.post('/deleteOne', function (req, res) {
  var id = req.body.id;
  Article.deleteOne({
    "_id": id
  }, function (err, data) {
    res.send(data);
  });
})
module.exports = router
