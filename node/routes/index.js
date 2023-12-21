const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const pool = require('../dbConnection');

router.get('/', async (req, res, next) => {
  try {
    const query =
      `SELECT
        C.channel_id,
        C.user_id,
        C.channel_title,
        COALESCE(U.user_name, '名無し') AS user_name,
        TO_CHAR(C.created_at, 'YYYY年MM月DD日 HH24時MI分SS秒') AS created_at
      FROM
        channel C
      LEFT OUTER JOIN
        users U ON C.user_id = U.user_id
      ORDER BY
        C.created_at DESC;`;

    const result = await pool.query(query);

    res.render('index', {
      title: 'はじめてのNode.js',
      channelList: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

router.post('/', async (req, res, next) => {
  try {
    const id = req.body.id;
    const update = req.body.update;
    const title = req.body.title;
    const userId = req.session.user_id || 0;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    const insertQuery = 'INSERT INTO channel (user_id, channel_title, created_at) VALUES ($1, $2, $3)';
    const updateQuery = 'UPDATE channel SET channel_title = $1 WHERE channel_id = $2';

    if (!update) {
      await pool.query(insertQuery, [userId, title, createdAt]);
    } else {
      await pool.query(updateQuery, [title, id]);
    }
    res.redirect('/');

  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

module.exports = router;