const express = require('express');
const router = express.Router();
const pool = require('../dbConnection');

router.post('/', async (req, res, next) => {
  try {
    const channelId = req.body.id;
    const query = 'DELETE FROM channel WHERE channel_id = $1';

    await pool.query(query, [channelId]);
    res.redirect('/');

  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

module.exports = router;