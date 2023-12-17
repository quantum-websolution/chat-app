installしたモジュール

bcrypt
　passwordをhush化する奴

dayjs
  日付取得する奴

express-session
  ログイン機能を実装するのに使う

nodemo
  コードを監視してくれるやつ

pg pg-pool
  postgressに接続するために使用する


アプリケーションの起動方法

前提
node、postgressのインストールが完了していること

1. dbメモのsqlを実行する

2. dbConnection.jsのuserとpasswordを変更する
  ※ \dt;を実行してownerのところがuserに入ります

3. npm install

4. nodemon 

5. localhost:3000 へアクセス
