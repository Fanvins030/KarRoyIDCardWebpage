var mysql = require("mysql");
var { MY_SQL } = require("../secret.config.js");

var conn;
// 连接数据库
function connect() {
    conn = mysql.createConnection(MY_SQL);
    conn.connect(handleError);  // 连接异常，自动重连
    conn.on("error", handleError)   // 监听错误，2秒后重试
}

// 处理错误
function handleError(err) {
    if (err) {
        console.log('err code:' + err.code);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' || err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
            connect();
        }
        else {
            setTimeout(connect, 2000);
        }
    }
}
connect();

module.exports = {
    conn,
    connect
}