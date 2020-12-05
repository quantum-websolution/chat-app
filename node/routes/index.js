var express = require('express');
var router = express.Router();
var moment = require('moment');
var pool = require('../dbConnection');

router.get('/', function (req, res, next) {
  var query = 'SELECT B.board_id, B.user_id, B.title, coalesce(U.user_name, \'名無し\') AS user_name, to_char(B.created_at, \'YYYY年MM月DD日 HH24時MI分SS秒\') AS created_at FROM board B LEFT OUTER JOIN users U ON B.user_id = U.user_id ORDER BY B.created_at DESC';
  pool.connect(function (err, client) {
    client.query(query, function (err, result) {
      res.render('index', {
        title: 'はじめてのNode.js',
        boardList: result.rows
      });
    });
  });
});

router.post('/', function (req, res, next) {
  var id = req.body.id;
  var update = req.body.update;
  var title = req.body.title;
  var userId = req.session.user_id ? req.session.user_id : 0;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var insertQuery = "INSERT INTO board (user_id, title, created_at) VALUES ('" + userId + "','" + title + "', " + "'" + createdAt + "')";
  var updateQuery = "UPDATE board SET title = '" + title + "' WHERE board_id = " + id;

  if (!update) {
    pool.connect(function (err, client) {
      client.query(insertQuery, function (err) {
        res.redirect('/');
      });
    });
  } else {
    pool.connect(function (err, client) {
      client.query(updateQuery, function (err) {
        res.redirect('/');
      });
    });
  }
});

module.exports = router;