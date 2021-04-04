// 封装原生AJAX
// export default (function () {
//     var xhr = new XMLHttpRequest();

//     if (!xhr) {
//         throw new Error("您的浏览器不支持异步发起HTTP请求")
//     }

//     function formatData(obj) {
//         var str = "";
//         for (var key in obj) {
//             str += key + "=" + obj[key] + "&"
//         }
//         return str.slice(0, -1);
//     }

//     function ajax(opt) {
//         if(!opt){
//             throw new Error("您没有填写AJAX选项")
//         }

//         var type = (opt.type || "GET").toUpperCase(),
//             async = opt.type || true,
//             url = opt.url,
//             data = opt.data || null,
//             error = opt.error || function () { },
//             success = opt.success || function () { },
//             complete = opt.complete || function () { };

//         if (!url) {
//             throw new Error("您没有填写URL")
//         }

//         xhr.open(type, url, async);
//         type === "POST" && xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//         xhr.send(type == "Get" ? null : formatData(data));
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === 4 && xhr.status === 200) {
//                 success(JSON.parse(xhr.responseText));
//             }
//             else if (xhr.status === 404) {
//                 error();
//             }
//             complete();
//         }
//     }

//     function post(url, data, callback) {
//         ajax({
//             type: "POST",
//             url: url,
//             data: data,
//             success: callback
//         })
//     }

//     function get(url, callback) {
//         ajax({
//             type: "GET",
//             url: url,
//             success: callback
//         })
//     }

//     return {
//         ajax,
//         post,
//         get
//     }
// })()

var xhr = new XMLHttpRequest();

if (!xhr) {
    throw new Error("您的浏览器不支持异步发起HTTP请求")
}

function formatData(obj) {
    var str = "";
    for (var key in obj) {
        str += key + "=" + obj[key] + "&"
    }
    return str.slice(0, -1);
}

function ajax(opt) {
    if (!opt) {
        throw new Error("您没有填写AJAX选项")
    }

    var type = (opt.type || "GET").toUpperCase(),
        async = opt.type || true,
        url = opt.url,
        data = opt.data || null,
        error = opt.error || function () { },
        success = opt.success || function () { },
        complete = opt.complete || function () { };

    if (!url) {
        throw new Error("您没有填写URL")
    }

    xhr.open(type, url, async);
    type === "POST" && xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(type == "Get" ? null : formatData(data));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            success(JSON.parse(xhr.responseText));
        }
        else if (xhr.status === 404) {
            error();
        }
        complete();
    }
}

function post(url, data, callback) {
    ajax({
        type: "POST",
        url: url,
        data: data,
        success: callback
    })
}

function get(url, callback) {
    ajax({
        type: "GET",
        url: url,
        success: callback
    })
}