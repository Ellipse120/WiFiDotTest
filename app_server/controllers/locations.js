/**
 * Created by lusai on 2017/3/22.
 */
var request = require('request');
var apiOption = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    // TODO
    apiOption.server = "https://....";
}

var _isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var _formatDistance = function (distance) {
    var numDistance, unit;
    if (distance && _isNumeric(distance)) {
        if (distance > 1) {
            numDistance = parseFloat(distance).toFixed(1);
            unit = 'km';
        } else {
            numDistance = parseInt(distance * 1000, 10);
            unit = 'm';
        }
        return numDistance + unit;
    } else {
        return "?";
    }
};

var _showError = function (req, res, status) {
    var title, content;
    if (status === 404) {
        title = "404, page not found.";
        content = "Oh dear. Looks like we can't find this page. Sorry."
    } else if (status === 500) {
        title = "500, internal server error.";
        content = "How embarrassing. There's a problem with our server.";
    } else {
        title = status + ", something's gone wrong.";
        content = "Something, somewhere, has gone just a little bit wrong."
    }
    res.status(status);
    res.render('generic-text', {
        title: title,
        content: content
    });
};

var renderHomePage = function (req, res, responseBody) {
    var message;

    if (!(responseBody instanceof Array)) {
        message = "API lookup error.";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = "No places found nearby."
        }
    }

    res.render('locations-list', {
        title: 'WiFiDot',
        pageHeader: {
            title: 'wifidot',
            strapline: '哪里有WiFi,哪里就能干活.'
        },
        sidebar: 'WiFi, nice tech.So. Pug drops the whitespace between tags, but keeps the whitespace inside them. The value here is that it gives you full control over whether tags and/or plain text should touch. It even lets you place tags in the middle of words.',
        locations: responseBody,
        message: message
    });
};

/* Get Home Page */
module.exports.homeList = function (req, res) {
    var requestOptions, path;
    path = '/api/locations';
    requestOptions = {
        url: apiOption.server + path,
        method: "GET",
        json: {},
        qs: {
            lng: -0.79925991,
            lat: 51.3780912,
            maxDistance: 9999999999999 //km
        }
    };

    request(requestOptions, function (err, response, body) {
        var i, data;
        data = body;

        if (response.statusCode === 200 && data.length) {
            for (i = 0; i < data.length; i++) {
                data[i].distance = _formatDistance(data[i].distance);
            }
        }
        renderHomePage(req, res, data);
    });
};

var getLocationInfo = function (req, res, callback) {
    var requestOptions, path;
    path = "/api/locations/" + req.params.locationid;
    requestOptions = {
        url: apiOption.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions, function (err, response, body) {
        var data = body;
        if (response.statusCode === 200) {
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            };
            callback(req, res, data);
        } else {
            _showError(req, res, response.statusCode);
        }
    });
};

var renderDetailPage = function (req, res, locationDetail) {
    res.render('location-info', {
        title: locationDetail.name,
        pageHeader: {title: locationDetail.name},
        sidebar: {
            context: 'is on WiFiDotTest because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'if you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: locationDetail
    });
};

/* Get Location info page */
module.exports.locationInfo = function (req, res) {
    getLocationInfo(req, res, function (req, res, responseData) {
        renderDetailPage(req, res, responseData);
    });
};

var renderReviewForm = function (req, res, locationDetail) {
    res.render('location-review-form', {
        title: 'Review ' + locationDetail.name + ' on WifiDotTest',
        pageHeader: {
            title: 'Review' + locationDetail.name
        },
        error: req.query.err
    });
};

/* Get 'Add Review' Page */
module.exports.addReview = function (req, res) {
    getLocationInfo(req, res, function (req, res, responseData) {
        renderReviewForm(req, res, responseData);
    });
};

/*
 * POST 'add review' page
 */
module.exports.doAddReview = function (req, res) {
    var requestOptions, path, locationid, postdata;
    locationid = req.params.locationid;
    path = "api/locations/" + locationid + "/reviews";
    postdata = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    requestOptions = {
        url: apiOption.server + path,
        method: "POST",
        json: postdata
    };
    if (!postdata.author || !postdata.rating || !postdata.reviewText) {
        res.redirect('/location/' + locationid + '/reviews/new?err=val');
    } else {
        request(requestOptions, function (err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/location/' + locationid);
            } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
                res.redirect('/location/' + locationid + '/reivews/new?err=val');
            } else {
                console.log(body);
                _showError(req, res, response.statusCode);
            }
        });
    }
};