var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://localhost/WiFiDot2';

// mpromise 过时问题
mongoose.Promise = global.Promise;

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose 连接到 ' + dbURI);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

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
