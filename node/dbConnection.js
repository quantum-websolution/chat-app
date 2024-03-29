const Pool = require('pg-pool');

// 環境変数を使用してセキュアに設定
const dbConfig = {
  database: process.env.DB_NAME || 'chat_app_db',
  user: process.env.DB_USER || 'tatsuya',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
};

// コネクションプールの作成
const pool = new Pool(dbConfig);

// コネクションがエラーを発生させた場合のハンドリング
pool.on('error', (err) => {
  console.error('Unexpected error on idle clients', err);
  process.exit(-1); // アプリケーションの異常終了
});

module.exports = pool;
