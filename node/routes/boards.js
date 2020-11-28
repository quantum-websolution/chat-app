var express = require('express');
var router = express.Router();
var moment = require('moment');
var pool = require('../dbConnection');


router.get('/:board_id', function (req, res, next) {
    var boardId = req.params.board_id;
    var getBoardQuery = 'SELECT * FROM board WHERE board_id = ' + boardId;
    var getMessagesQuery = 'SELECT *, to_char(created_at, \'YYYY年MM月DD日 HH24時MI分SS秒\') AS created_at FROM messages WHERE board_id = ' + boardId;
    pool.connect(function (err, client) {
        client.query(getBoardQuery, function (err, board) {
            client.query(getMessagesQuery, function (err, messages) {
                res.render('boards', {
                    title: board.rows[0].title,
                    board: board.rows[0],
                    messageList: messages.rows
                });
            });
        });
    });
});

router.post('/:board_id', function (req, res, next) {
    var message = req.body.message;
    var boardId = req.params.board_id;
    var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    var query = "INSERT INTO messages (message, board_id, created_at) VALUES ('" + message + "', " + "'" + boardId + "', " + "'" + createdAt + "')";
    pool.connect(function (err, client) {
        client.query(query, function (err, rows) {
            res.redirect('/boards/' + boardId);
        });
    });
});

module.exports = router;