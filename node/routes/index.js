var express = require('express');
var router = express.Router();
var moment = require('moment');
var pool = require('../dbConnection');

router.get('/', function (req, res, next) {
  var query = 'SELECT *, to_char(created_at, \'YYYY年MM月DD日 HH24時MI分SS秒\') AS created_at FROM board';
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
  var title = req.body.title;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var query = "INSERT INTO board (title, created_at) VALUES ('" + title + "', " + "'" + createdAt + "')";

  pool.connect(function (err, client) {
    client.query(query, function (err) {
      res.redirect('/');
    });
  });
});

module.exports = router;