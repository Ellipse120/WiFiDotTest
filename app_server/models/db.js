/**
 * Created by Lusai on 3/23/17.
 */
var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/WifiDot2';

var gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose 连接到 ' + dbURI);
});

mongoose.connection.on('error', function () {
    console.log('Mongoose connection error: ' + dbURI);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    })
});

process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    })
});

// 传入schema & model.
require('./locations');
