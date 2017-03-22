/**
 * Created by lusai on 2017/3/22.
 */
/* Get Home Page */
module.exports.homeList = function (req, res) {
    res.render('locations-list', { title :　'home'});
};

/* Get Location info page */
module.exports.locationInfo = function (req, res) {
    res.render('location-info', { title: 'location info' });
};

/* Get 'Add Review' Page */
module.exports.addReview = function (req, res) {
    res.render('location-review-form', { title: 'add review' });
};