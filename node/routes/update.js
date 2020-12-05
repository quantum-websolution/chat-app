var express = require('express');
var router = express.Router();
var pool = require('../dbConnection');

router.post('/', function (req, res, next) {
    var boardId = req.body.id;
    var query = 'SELECT board_id, title FROM board WHERE board_id = ' + boardId;
    pool.connect(function (err, client) {
        client.query(query, function (err, board) {
            res.render('update', {
                id: board.rows[0].board_id,
                title: board.rows[0].title,
            })
        })
    })
});

module.exports = router;