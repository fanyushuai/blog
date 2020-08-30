/**
 * mongoose操作类(封装mongodb)
 */

var mongoose = require('mongoose');
var logger = require('pomelo-logger').getLogger('mongodb-log');

var options = {
  db_user: "blog",
  db_pwd: "123456",//blog 123456
  db_host: "localhost",//45.8.158.227 localhost
  db_port: 27017,
  db_name: "blog"
};

var dbURL = "mongodb://" + options.db_user + ":" + options.db_pwd + "@" + options.db_host + ":" + options.db_port + "/" + options.db_name;
mongoose.Promise = global.Promise;
mongoose.connect(dbURL, {
  connectTimeoutMS: 1000,
  promiseLibrary: require('bluebird')
});

mongoose.connection.on('connected', function (err) {
  if (err) logger.error('Database connection failure');
});

mongoose.connection.on('error', function (err) {
  logger.error('Mongoose connected error ' + err);
});

mongoose.connection.on('disconnected', function () {
  logger.error('Mongoose disconnected');
});

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    logger.info('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

/**

* 分页查询，该方法依赖`mongoose`组件
* @param page 页数，如第1页，就传1
* @param pageSize 每页大小，如一页展示10条，就传10
* @param Model mongoose的指定Model对象，是一个schema对象
* @param fieldJson 查询字段
* @param populate 关联查询
* @param queryParams 查询条件
* @param sortParams 排序
* @param callback 回调函数
*/
// mongoose.pageQuery = function(QueryParams, callback) {
//     var start = (QueryParams.pageNum - 1) * QueryParams.pageSize;
//     var $page = {};
//     async.parallel({
//       count: function (done) { // 查询数量
//         Model.count(QueryParams.queryParams).exec(function (err, count) {
//           done(err, count);
//         });
//       },

//       records: function (done) { // 查询一页的记录
//         Model.find(QueryParams.queryParams, QueryParams.fieldJson).skip(start).limit(QueryParams.pageSize).populate(QueryParams.populate).sort(QueryParams.sortParams).exec(function (err, doc) {
//           done(err, doc);
//         });
//       }
//     }, function (err, results) {
//       var count = results.count;
//       $page.total = count;
//       $page.data = results.records;
//       callback(err, $page);
//     });
//   }

  module.exports = mongoose;
