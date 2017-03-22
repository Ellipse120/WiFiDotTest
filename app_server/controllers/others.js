/**
 * Created by lusai on 2017/3/22.
 */
/* Get Other Page */
module.exports.about = function (req, res) {
    res.render('generic-text', {title: 'About'});
};