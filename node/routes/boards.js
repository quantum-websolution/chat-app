const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const pool = require('../dbConnection');

router.get('/:board_id', async (req, res, next) => {
  try {
    const boardId = req.params.board_id;

    const getBoardQuery = 'SELECT * FROM board WHERE board_id = $1';
    const getMessagesQuery = 'SELECT M.message, COALESCE(U.user_name, \'名無し\') AS user_name, TO_CHAR(M.created_at, \'YYYY年MM月DD日 HH24時MI分SS秒\') AS created_at FROM messages M LEFT OUTER JOIN users U ON M.user_id = U.user_id WHERE M.board_id = $1 ORDER BY M.created_at ASC';

    const boardResult = await pool.query(getBoardQuery, [boardId]);
    const messagesResult = await pool.query(getMessagesQuery, [boardId]);

    if (boardResult.rows.length === 0) {
      return res.status(404).send('ボードが見つかりません');
    }

    res.render('boards', {
      title: boardResult.rows[0].title,
      board: boardResult.rows[0],
      messageList: messagesResult.rows
    });


  } catch (error) {
    res.status(500).send('内部サーバーエラー');
  }
});

router.post('/:board_id', async (req, res, next) => {
  try {
    const message = req.body.message;
    const boardId = req.params.board_id;
    const userId = req.session.user_id || 0;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    const insertQuery = 'INSERT INTO messages (message, board_id, user_id, created_at) VALUES ($1, $2, $3, $4)';
    await pool.query(insertQuery, [message, boardId, userId, createdAt]);

    res.redirect('/boards/' + boardId);

  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send('内部サーバーエラー');
  }
});

module.exports = router;