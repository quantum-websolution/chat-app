const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
const pool = require('../dbConnection');

router.get('/', (req, res, next) => {
  res.render('signup', {
    title: '新規会員登録'
  });
});

router.post('/', async (req, res, next) => {
  try {
    const userName = req.body.user_name;
    const email = req.body.email;
    const password = req.body.password;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    const signupQuery = 'INSERT INTO users (user_name, user_email, user_password, created_at) VALUES ($1, $2, $3, $4)';

    // 既に登録されているメールアドレスかどうかを確認
    const emailExists = await pool.query(emailExistsQuery, [email]);
    const emailExistsQuery = 'SELECT * FROM users WHERE user_email = $1 LIMIT 1';

    if (emailExists.rows.length) {
      res.render('signup', {
        title: '新規会員登録',
        emailExists: '既に登録されているメールアドレスです'
      });
    } else {
      // パスワードのハッシュ化
      const hashedPassword = await bcrypt.hash(password, 10);

      // ユーザーの新規登録
      await pool.query(signupQuery, [userName, email, hashedPassword, createdAt]);

      res.redirect('/login');
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

module.exports = router;
