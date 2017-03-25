var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

/*
 * POST a new review, providing a locationid
 * /api/locations/:locationid/reviews
 */
module.exports.reviewCreate = function (req, res) {

};

module.exports.reviewsReadOne = function (req, res) {
    //console.log('getting single review');
    if (req.params && req.params.locationid && req.params.reviewid) {
        Loc
            .findById(req.params.locationid)
            .select('reviews')
            .exec(
                function (err, location) {
                var response, review;
                if (!location) {
                    sendJSONresponse(res, 404, {'message': 'locationid not found'});
                    return;
                } else if (err) {
                    sendJSONresponse(res, 400, err);
                    return;
                }
                if (location.reviews && location.reviews.length > 0) {
                    review = location.reviews.id(req.params.reviewid);
                    if(!review) {
                        sendJSONresponse(res, 404, {'message': 'reviewid not found'});
                    } else {
                        response = {
                            location: {
                                name: location.name,
                                id: req.params.locationid
                            },
                            reivew: review
                        };
                        sendJSONresponse(res, 200, response);
                    }
                } else {
                    sendJSONresponse(res, 404, {'message': 'No reviews found'})
                }
            });
    } else {
        sendJSONresponse(res, 404, {'message': 'Not found, locationid and reviewid are both required'})
    }
};

module.exports.reviewUpdateOne = function (req, res) {

};

module.exports.reviewDeleteOne = function (req, res) {

};