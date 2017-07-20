var mysql = new require("mysql");
var config=new require("./db_config");

var db_config = {
  host: config.host,
  user:  config.user,
  password:  config.password,
  database:  config.database
};
// 資料庫連線
var connection;
// 處理資料庫斷線
function handleDisconnect() {
    // 與資料庫連線
    connection = mysql.createConnection(db_config);

    // 資料庫連線發生錯誤處理
    connection.connect(function(err) {
        if(err) {
          console.log('error when connecting to db:', err);
          // 10秒後重新連線
          setTimeout(handleDisconnect, 10000);
        }
    });

    // 連線發生錯誤處理
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            // 連線失效處理
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();





module.exports = connection;
