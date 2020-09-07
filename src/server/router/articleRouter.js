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
  var title = req.body.titleSearch;

  var _filter =new RegExp(title);
  var query = {};
  if (title) {
    query = {"title":_filter};
  }
  var start = (currentPage - 1) * pageSize;
  var $page = {};
  async.parallel({
    count: function (done) { // 查询数量
      Article.countDocuments(query).exec(function (err, count) {
        done(err, count);
      });
    },
    records: function (done) { // 查询一页的记录
      Article.find(query,{id:1,title:1,updateTime:1}).skip(start).limit(pageSize).sort({
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
  var category = req.body.category;
  var createUser = req.session.user._id;
  var id = req.body._id;
  var updateTime = new Date();

  var articleData = new Article({
    "title": title,
    "category":category,
    "content": content,
    "createUser": createUser,
    "createTime": new Date(),
    "updateTime": updateTime
  });

  if (!id) {
    articleData.save(function (err, data) {
      res.send(data);
    });
  } else {
    Article.findByIdAndUpdate(id, {"title":title,"content":content,"category":category,"updateTime":updateTime}, function (err, data) {
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
  Article.findById({"_id": id}, function (err, data) {
    res.send(data._doc);
  }).populate({path: 'createUser', select: { username: 1,headimg:1,autograph:1 }, options: {sort: { username: -1 }}});
});


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
});
module.exports = router
