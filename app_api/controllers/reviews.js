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
module.exports.reviewsCreate = function (req, res) {
    if (req.params.locationid) {
        Loc
            .findById(req.params.locationid)
            .select('reviews')
            .exec(function (err, location) {
                if (err) {
                    sendJSONresponse(res, 400, err);
                } else {
                    doAddReview(req, res, location);
                }
            });
    } else {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationid required."
        });
    }
};

var doAddReivew = function (req, res, location) {
    if (!location) {
        sendJSONresponse(res, 404, "locationid not found.");
    } else {
        location.reviews.push({
            author: req.body.author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });
        location.save(function (err, location) {
            var thisReview;
            if (err) {
                sendJSONresponse(res, 400, err);
            } else {
                updateAverageRating(location._id);
                thisReview = location.reviews[location.reviews.length - 1];
                sendJSONresponse(res, 201, thisReview);
            }
        });
    }
};

var updateAverageRating = function (locationid) {
    console.log('Update rating average for ', locationid);
    Loc
        .findById(locationid)
        .select('reviews')
        .exec(function (err, location) {
            if (!err) {
                doSetAverageRating(location);
            }
        });
};

var doSetAverageRating = function (location) {
    var i, reviewCount, ratingAverage, ratingTotal;
    if (location.reviews && location.reviews.length > 0) {
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        for (i = 0; i < reviewCount.length; i++) {
            ratingTotal = ratingTotal + location.reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal / reviewCount, 10);
        location.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Average rating updated to ', ratingAverage);
            }
        });
    }
};

module.exports.reviewsReadOne = function (req, res) {
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
                        if (!review) {
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
    if (!req.params.locationid || !req.params.reviewid) {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required."
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('reviews')
        .exec(function (err, location) {
            var thisReivew;
            if (!location) {
                sendJSONresponse(res, 404, {
                    "message": "locationid not found."
                });
                return;
            } else if (err) {
                sendJSONresponse(res, 400, err);
                return;
            }
            if (location.reviews && location.reviews.length > 0) {
                thisReivew = location.reviews.id(req.params.reivewid);
                if (!thisReivew) {
                    sendJSONresponse(res, 400, {
                        "message": "reviewid not found."
                    });
                } else {
                    thisReivew.author = req.body.author;
                    thisReivew.rating = req.body.rating;
                    thisReivew.reviewText = req.body.reviewText;
                    location.save(function (err, location) {
                        if (err) {
                            sendJSONresponse(res, 404, err);
                        } else {
                            updateAverageRating(location._id);
                            sendJSONresponse(res, 200, thisReivew);
                        }
                    });
                }
            } else {
                sendJSONresponse(res, 404, {
                    "message": "No review to update."
                });
            }
        });
};

/*
 * DELETE /api/locations/:locationid/reviews/:reviewid
 */
module.exports.reviewDeleteOne = function (req, res) {
    if (!req.params.locationid || !req.params.reivewid) {
        sendJSONresponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required."
        });
        return;
    }
    Loc
        .findById(req.params.locationid)
        .select('reviews')
        .exec(function (err, location) {
            if (!location) {
                sendJSONresponse(res, 404, {
                    "message": "locationid not found."
                });
                return;
            } else if (err) {
                sendJSONresponse(res, 404, err);
                return;
            }
            if (location.reviews && location.reviews.length > 0) {
                if (!location.reviews.id(req.params.reviewid)) {
                    sendJSONresponse(res, 404, {
                        "message": "reviewid not found."
                    });
                } else {
                    location.reviews.id(req.params.reviewid).remove();
                    location.save(function (err) {
                        if (err) {
                            sendJSONresponse(res, 404, err);
                        } else {
                            updateAverageRating(location._id);
                            sendJSONresponse(res, 204, null);
                        }
                    });
                }
            } else {
                sendJSONresponse(res, 404, {
                    "message": "No review to delete."
                });
            }
        });
};