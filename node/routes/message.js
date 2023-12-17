const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const pool = require('../dbConnection');

router.get('/:channel_id', async (req, res, next) => {
  try {
    const channelId = req.params.channel_id;

    const getChannelQuery = 'SELECT * FROM channel WHERE channel_id = $1';
    const getMessagesQuery = 'SELECT M.message, COALESCE(U.user_name, \'名無し\') AS user_name, TO_CHAR(M.created_at, \'YYYY年MM月DD日 HH24時MI分SS秒\') AS created_at FROM messages M LEFT OUTER JOIN users U ON M.user_id = U.user_id WHERE M.channel_id = $1 ORDER BY M.created_at ASC';

    const channelResult = await pool.query(getChannelQuery, [channelId]);
    const messagesResult = await pool.query(getMessagesQuery, [channelId]);

    if (channelResult.rows.length === 0) {
      return res.status(404).send('ボードが見つかりません');
    }

    res.render('message', {
      title: channelResult.rows[0].channel_title,
      channel: channelResult.rows[0],
      messageList: messagesResult.rows
    });

  } catch (error) {
    res.status(500).send('内部サーバーエラー');
  }
});

router.post('/:channel_id', async (req, res, next) => {
  try {
    const message = req.body.message;
    const channelId = req.params.channel_id;
    const userId = req.session.user_id || 0;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    const insertQuery = 'INSERT INTO messages (message, channel_id, user_id, created_at) VALUES ($1, $2, $3, $4)';
    await pool.query(insertQuery, [message, channelId, userId, createdAt]);

    res.redirect('/message/' + channelId);

  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send('内部サーバーエラー');
  }
});

module.exports = router;