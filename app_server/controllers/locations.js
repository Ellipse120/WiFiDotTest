/**
 * Created by lusai on 2017/3/22.
 */
/* Get Home Page */
module.exports.homeList = function (req, res) {
    res.render('locations-list', {
        title: 'WiFiDot',
        pageHeader: {
            title: 'wifidot',
            strapline: '哪里有WiFi,哪里就能干活.'
        },
        sidebar:'WiFi, nice tech.So. Pug drops the whitespace between tags, but keeps the whitespace inside them. The value here is that it gives you full control over whether tags and/or plain text should touch. It even lets you place tags in the middle of words.',
        locations: [{
            name: 'Starcups',
            rating: 3,
            distance: '100m',
            address: '联航路1588号',
            facilities: ['Drinks', 'Food', 'WiFi']
        },{
            name: 'Coffee',
            rating: 5,
            distance: '120m',
            address: '联航路1511号',
            facilities: ['Drinks', 'Food', 'WiFi']
        },{
            name: '如海超市',
            rating: 4,
            distance: '100m',
            address: '联航路1288号',
            facilities: ['WiFi']
        }]
    });
};

/* Get Location info page */
module.exports.locationInfo = function (req, res) {
    res.render('location-info', {
        title: 'Starcups',
        pageHeader: {
            title: 'wifidot1',
            strapline: 'WiFi,好东西.'
        },
        sidebar: {
            context: 'good',
            callToAction: 'nice!!!!@###'
        },
        location:{
            name: 'Starcups',
            address: '联航路123',
            rating: 3,
            facilities: ['Drink','Food','WiFi'],
            coords:{
                lat: 123,
                lng: 123,
            },
            openingTimes: [{
                days: '星期一 - 星期五',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
            },{
                days: '星期六',
                opening: '8:00am',
                closing: '5:00pm',
                closed: false
            },{
                days: '星期天',
                closed: true
            }],
            reviews: [{
                author: 'lusai',
                rating: 4,
                timestamp: '2016-08-09',
                reviewText: 'What a greate place!!!'
            },{
                author: 'wade',
                rating: 5,
                timestamp: '2016-07-09',
                reviewText: 'nice place...'
            }]
        }
    });
};

/* Get 'Add Review' Page */
module.exports.addReview = function (req, res) {
    res.render('location-review-form', {title: 'add review'});
};