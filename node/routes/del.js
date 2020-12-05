var express = require('express');
var router = express.Router();
var pool = require('../dbConnection');

router.post('/', function (req, res, next) {
    var boardId = req.body.id
    var query = "DELETE FROM board WHERE board_id = " + boardId
    pool.connect(function (err, client) {
        client.query(query, function (err) {
            res.redirect('/');
        })
    })
});

module.exports = router;