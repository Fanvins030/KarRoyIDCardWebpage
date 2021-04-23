// 格式化响应请求
function resSend(res, result) {
    if (result === 'error') {
        res.send({
            code: 1,
            msg: '操作失败'
        })
    }
    else {
        res.send({
            code: 0,
            result: result || '操作成功'
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

module.exports = {
    resSend,
    deepCopy
}