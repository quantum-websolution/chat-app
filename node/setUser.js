const pool = require('./dbConnection');

module.exports = async (req, res, next) => {
  const userId = req.session.user_id;

  if (userId) {
    try {
      const query = 'SELECT user_id, user_name FROM users WHERE user_id = $1';
      const result = await pool.query(query, [userId]);

      if (result.rows.length) {
        res.locals.user = result.rows[0];
      }
    } catch (error) {
      console.error(error);
    }
  }

  next();
};