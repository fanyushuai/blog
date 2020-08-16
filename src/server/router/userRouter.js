const app = require('express');
const User = require("../schema/user");
const jwtUtil = require("../util/jwtUtil")
const router = app.Router();
const async = require('async');

/**
 * 用户列表
 */
router.post('/list', function (req, res) {
    var pageSize = req.body.pageSize * 1 || 10; //分页参数
    var currentPage = req.body.currentPage * 1 || 1; //当前页码
    var username = req.body.username;

    var _filter = new RegExp(username);
    var query = {};
    if (title) {
        query = { "username": _filter };
    }
    var start = (currentPage - 1) * pageSize;
    var $page = {};
    async.parallel({
        count: function (done) { // 查询数量
            User.count(query).exec(function (err, count) {
                done(err, count);
            });
        },
        records: function (done) { // 查询一页的记录
            User.find(query).skip(start).limit(pageSize).sort({
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
    var username = req.body.username;
    var password = req.body.password;
    var id = req.body._id;

    var userData = new Article({
        "username": title,
        "password": content,
        "createUser": "fys",
        "createTime": new Date(),
        "updateTime": new Date()
    });

    if (!id) {
        userData.save(function (err, data) {
            res.send(data);
        });
    } else {
        User.findByIdAndUpdate(id, { "username": username, "password": password }, function (err, data) {
            if (err) {
                console.error(err);
            }
            res.send(data);
        })
    }
})

/**
 * 登录
 */
router.post("/login",function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    var results = "";
    var token = jwtUtil.generateToken(username);

    User.findOne({
        "username": username
    }, function (err, data) {
        if(data && data._doc){
            if(password != data._doc.password){
                results = {"success":false,"message":"用户名或者密码错误"};
            }else{
                results = {"success":true,"message":"登录成功",token:token,"username":username}; 
            }
        }else{
            results = {"success":false,"message":"用户名或者密码错误"};
        }
        res.send(results);
    });
})

/**
 * 查询单条记录
 */
router.post("/findOne", function (req, res) {
    var id = req.body.id
    User.findById({
        "_id": id
    }, function (err, data) {
        if(data._doc){

        }
        res.send(data._doc);
    });
})


/**
 * 删除
 */
router.post('/deleteOne', function (req, res) {
    var id = req.body.id;
    User.deleteOne({
        "_id": id
    }, function (err, data) {
        res.send(data);
    });
})
module.exports = router
