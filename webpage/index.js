var nickname = "";
var number = "";
var currentBrowser = null;

if (
    navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    ) && navigator.userAgent.toLowerCase().indexOf('micromessenger') == -1
) {
    // console.log("tip:正在通过手机浏览器访问当前页面")
    // document.querySelector(".test").innerHTML = "mobile"
    currentBrowser = "mobile";
} else if (navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) && navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1) {
    // console.log("tip:正在通过手机微信内置浏览器访问当前页面")
    // document.querySelector(".test").innerHTML = "wechat"
    currentBrowser = "wechat";
}
else {
    // console.log("tip:正在通过电脑浏览器或者电脑微信内置浏览器正在访问当前页面")
    // document.querySelector(".test").innerHTML = "PC"
    currentBrowser = "PC";
}

console.log(navigator.userAgent)

function select() {
    var show = document.querySelector(".show");
    show.src = "";

    var loading = document.querySelector(".loading");
    loading.classList.remove("hidden");

    var btn_save = document.querySelector(".btn_save");
    btn_save.classList.add("hidden");

    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");

    var bg = document.createElement("img");
    bg.crossOrigin = "Anonymous";
    bg.src = "https://cdn.jsdelivr.net/gh/Fanvins030/KarRoyIDCardWebpage/static/images/bg.png";

    var homepage = document.querySelector("input").value;

    bg.onload = function () {
        get(MY_BASEURL + `getList?homepage=${homepage}`, function (res) {
            var { nickname, gender, attribute, number } = res.result;
            this.nickname = nickname;
            this.number = number;

            canvas.width = bg.width;    // 宽度
            canvas.height = bg.height;  // 高度
            ctx.drawImage(bg, 0, 0, bg.width, bg.height);   // 背景模板
            ctx.fillStyle = "#104f54";

            if (currentBrowser == "PC" || currentBrowser == "wechat") {
                canvas.style.letterSpacing = 8 + 'px';  // PC端字间距
                btn_save.classList.remove("hidden")
            } else {
                canvas.style.letterSpacing = 3 + 'px';  // 移动端字间距
            }
            ctx.font = "66px w9,pop";
            ctx.fillText(nickname, 390, 235);   // 姓名
            ctx.fillText(gender, 390, 370);     // 性别
            ctx.fillText(attribute, 890, 370);  // 属性

            if (currentBrowser == "PC" || currentBrowser == "wechat") {
                canvas.style.letterSpacing = 16 + 'px';  // PC端字间距
            } else {
                canvas.style.letterSpacing = 6 + 'px';  // 移动端字间距
            }
            ctx.font = "66px pop";
            ctx.fillText(number, 1488, 1085);   // 岛民身份号码

            loading.classList.add("hidden");
            show.src = canvas.toDataURL();
        })
    }
}

function save() {
    const el = document.createElement('a');
    // 设置 href 为图片经过 base64 编码后的字符串，默认为 png 格式
    el.href = document.querySelector(".show").src;
    el.download = `【${this.number}】${this.nickname}`;
    el.click();
}