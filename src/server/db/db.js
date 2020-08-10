/**
 * mongoose操作类(封装mongodb)
 */

var mongoose = require('mongoose');
var logger = require('pomelo-logger').getLogger('mongodb-log');

var options = {
    db_user: "blog",
    db_pwd: "123456",
    db_host: "localhost",
    db_port: 27017,
    db_name: "blog"
};

var dbURL = "mongodb://" + options.db_user + ":" + options.db_pwd + "@" + options.db_host + ":" + options.db_port + "/" + options.db_name;
mongoose.Promise = global.Promise; 
mongoose.connect(dbURL,{
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

module.exports = mongoose;