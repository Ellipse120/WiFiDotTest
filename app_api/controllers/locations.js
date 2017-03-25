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

};

module.exports.locationsReadOne = function (req, res) {
    if (req.params && req.params.locationid) {
        var locationid = req.params.locationid;
        console.log(locationid);
        Loc
            // .findOne({ _id: locationid })
            .findById(locationid)
            .exec(function (err, location) {
                if (!location) {
                    sendJsonResponse(res, 404, {"message": "locationid not found."});
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, location);
            });
    } else {
        sendJsonResponse(res, 404, {"message": "No locationid in request."});
    }

};

module.exports.locationsUpdateOne = function (req, res) {

};

module.exports.locationsDeleteOne = function (req, res) {

};
