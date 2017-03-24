/**
 * Created by Lusai on 3/24/17.
 */
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.locationsListByDistance = function (req, res) {

};

module.exports.locationsCreate = function (req, res) {
    sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.locationsReadOne = function (req, res) {
    var locationid = req.params.locationid;
    console.log(locationid);
    Loc
        .findOne({_id : locationid})
        .exec(function (err, location) {
            console.log(location);
            sendJsonResponse(res, 200, location);
        });
};

module.exports.locationsUpdateOne = function (req, res) {

};

module.exports.locationsDeleteOne = function (req, res) {

};

module.exports.reviewCreate = function (req, res) {

};

module.exports.reviewReadOne = function (req, res) {

};

module.exports.reviewUpdateOne = function (req, res) {

};

module.exports.reviewDeleteOne = function (req, res) {

};