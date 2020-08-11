/**
 * mongoose操作类(封装mongodb)
 */

import mongoose, { Promise, connect, connection } from 'mongoose';
var logger = require('pomelo-logger').getLogger('mongodb-log');

var options = {
    db_user: "blog",
    db_pwd: "123456",
    db_host: "localhost",
    db_port: 27017,
    db_name: "blog"
};

var dbURL = "mongodb://" + options.db_user + ":" + options.db_pwd + "@" + options.db_host + ":" + options.db_port + "/" + options.db_name;
Promise = global.Promise; 
connect(dbURL,{
	connectTimeoutMS: 1000,
	promiseLibrary: require('bluebird')
});

connection.on('connected', function (err) {
    if (err) logger.error('Database connection failure');
});

connection.on('error', function (err) {
    logger.error('Mongoose connected error ' + err);
});

connection.on('disconnected', function () {
    logger.error('Mongoose disconnected');
});

process.on('SIGINT', function () {
    connection.close(function () {
        logger.info('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

export default mongoose;