var express = require("express");
var server = express();
var { conn, connect } = require("./module/sqlConn.js");
var { MY_PORT } = require("./secret.config.js");
var { user } = require("./module/sqlMap.js");
var { resSend, deepCopy } = require("./module/assist.js");

//设置允许跨域访问该服务.
server.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

// 终端输入:> node index.js 访问
server.listen(MY_PORT);
console.log("已成功监听服务器端口");

var bodyParser = require("body-parser");
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// 获取用户列表
server.post("/getList", function (req, res) {
    var { homepage } = req.body;

    conn.query(user.getInfo(homepage), function (err, result) {
        if (err) {
            console.log(err);
            connect();
        }
        if (result.length == 1) {
            console.log(result)
            resSend(res, {
                nickname: result[0].nickname,
                attribute: result[0].attribute,
                gender: result[0].gender,
                number: result[0].number
            })
        } else {
            console.log(result)
            resSend(res, 'error')
        }
    })
})

// 上传留言
server.post("/uploadComment", function (req, res) {
    var { content } = req.body
    conn.query(user.addComment(content), function (err, result) {
        if (err) {
            console.log(err);
            connect();
        }
        if (result) {
            resSend(res)
        }
    })
})