var express = require("express");
var server = express();
var mysql = require("mysql");
var { MY_PORT, MY_SQL } = require("./secret.config.js");

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

// 格式化响应请求
function resSend(res, result) {
    if (typeof result === 'undefined') {
        res.send({
            code: '1',
            msg: '操作失败'
        })
    }
    else if (typeof result === "object") {
        res.send(result)
    }
    else {
        res.send({
            code: '0',
            result: result
        })
    }
}

// 判断是否为正确的JSON格式
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}

// 深拷贝（主要用于JSON格式化）
function deepCopy(data) {
    // 去除RowDataPacket
    data = JSON.parse(JSON.stringify(data));
    var newData = Array.isArray(data) ? [] : {};
    for (var k in data) {
        // 判断是否为对象类型
        if (typeof (data[k]) == "object") {
            newData[k] = deepCopy(data[k])
        }
        // 判断是否为正确的JSON格式
        else if (isJSON(data[k])) {
            newData[k] = JSON.parse(data[k])
        }
        // 普通类型
        else {
            newData[k] = data[k];
        }
    }
    return newData;
}

// 获取用户列表
server.get("/getList", function (req, res) {
    var transData = req.query.homepage;

    conn.query(`SELECT id,homepage FROM tb_user`, function (err, result) {
        if (err) {
            console.log(err);
            connect();
        }
        if (result) {
            result = deepCopy(result);
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < result[i].homepage.length; j++) {
                    if (transData == result[i].homepage[j]) {
                        conn.query(`SELECT * FROM tb_user WHERE id = ${result[i].id}`, function (err, result2) {
                            if (err) {
                                console.log(err);
                                connect();
                            }
                            if (result2) {
                                result2 = deepCopy(result2);
                                console.log(result2)

                                resSend(res, {
                                    result: {
                                        nickname: result2[0].nickname,
                                        attribute: result2[0].attribute,
                                        gender: result2[0].gender,
                                        number: result2[0].number
                                    }
                                })
                            }
                        })
                    } else {
                        // console.log("夏秋岛岛民人口登记表中没有你的记录")
                    }
                }
            }
        }
    })
})