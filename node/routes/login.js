var express = require('express');
var router = express.Router();
var pool = require('../dbConnection');

router.get('/', function (req, res, next) {
    if (req.session.user_id) {
        res.redirect('/');
    } else {
        res.render('login', {
            title: 'ログイン'
        });
    }
});

router.post('/', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var query = "SELECT user_id FROM users WHERE email = '" + email + "' AND password = '" + password + "' LIMIT 1";
    pool.connect(function (err, client) {
        client.query(query, function (err, user) {
            var userId = user.rows.length ? user.rows[0].user_id : false;
            if (userId) {
                req.session.user_id = userId;
                res.redirect('/');
            } else {
                res.render('login', {
                    title: 'ログイン',
                    noUser: 'メールアドレスとパスワードが一致するユーザーはいません'
                });
            }
        });
    });
});

module.exports = router;