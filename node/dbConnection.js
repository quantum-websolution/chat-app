var pg = require('pg');

var dbConfig = new pg.Pool({
    database: 'bulletin_board',
    user: 'tatsuya',
    password: '',
    host: 'localhost',
    port: 5432,
});

module.exports = dbConfig;