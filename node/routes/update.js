const express = require('express');
const router = express.Router();
const pool = require('../dbConnection');

router.post('/', async function (req, res, next) {
  try {
    const channelId = req.body.id;
    const query = 'SELECT channel_id, channel_title FROM channel WHERE channel_id = $1';

    const result = await pool.query(query, [channelId]);

    if (result.rows.length > 0) {
      const channel = result.rows[0];
      res.render('update', {
        id: channel.channel_id,
        title: channel.channel_title,
      });
    } else {
      res.status(404).send('ボードが見つかりません');
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

module.exports = router;
