var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');

/* Get Location pages. */
router.get('/', ctrlLocations.homeList);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/:locationid/review/new', ctrlLocations.addReview);
router.post('location/:locationid/review/new', ctrlLocations.doAddReview);

/* Get Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router;
