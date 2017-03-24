/**
 * Created by lusai on 2017/3/22.
 */
/* Get Other Page */
module.exports.about = function (req, res) {
    res.render('generic-text', {
        title: 'About',
        content: 'WiFiDot是一个帮你找到联网工作的app。'
    });
};