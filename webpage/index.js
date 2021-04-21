var nickname = "";
var number = "";
var current = null;

//资源加载完毕后执行
window.onload = function () {
    document.querySelector(".welcome").style.display = "none";
    document.querySelector(".header").removeAttribute("hidden");
    document.querySelector(".main").removeAttribute("hidden");
    document.querySelector(".footer").removeAttribute("hidden");
}

// 判断当前设备是否是PC端
if (navigator.userAgent.match(/Windows/i) || navigator.userAgent.match(/Mac/i)) {
    current = "PC";
    document.querySelector(".btn_select").classList.add("pc");
    document.querySelector(".btn_save").classList.add("pc");
}

// 监听输入事件
function validatorURL(e) {
    if (e.value.length > 0) {
        document.querySelector(".clean").removeAttribute("hidden")
    } else {
        document.querySelector(".clean").setAttribute("hidden", true)
    }

    if (document.querySelector(".btn_select").classList.contains("disable") && e.value.match(/^https:\/\/weibo.com/)) {
        document.querySelector(".btn_select").classList.remove("disable")
    } else if (!document.querySelector(".btn_select").classList.contains("disable") && !e.value.match(/^https:\/\/weibo.com/)) {
        document.querySelector(".btn_select").classList.add("disable")
    }
}

// 清空输入值
function cleanInputValue(name) {
    document.querySelector(`input${name ? "." + name : ""}`).value = "";
    document.querySelector(".clean").setAttribute("hidden", true)
    document.querySelector(".btn_select").classList.add("disable")
}

// 自定义context对象的原型方法  可设置字间距的填充文本
CanvasRenderingContext2D.prototype.letterSpacingText = function (text, x, y, letterSpacing) {
    var ctx = this;

    // 文本逐字分割成数组
    var arrText = text.split('');
    // 文本左对齐
    ctx.textAlign = 'left';
    // 逐字绘制
    arrText.forEach((letter) => {
        var letterWidth = ctx.measureText(letter).width;
        ctx.fillText(letter, x, y);
        // 下一个字符的横坐标
        x = x + letterWidth + letterSpacing;
    });
};

// canvas绘制蟹圆身份证并将生成的DataURL设置为img的src
function select() {
    if (!document.querySelector(".btn_select").classList.contains("disable")) {
        var show = document.querySelector(".show");
        show.src = "";

        var loading = document.querySelector(".loading");
        loading.removeAttribute("hidden")

        var btn_save = document.querySelector(".btn_save");
        btn_save.setAttribute("hidden", true)

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
                ctx.fillStyle = "#104f54";  // 文本颜色

                ctx.font = "66px w9,pop";
                // 显示设备的物理像素分辨率与CSS像素分辨率的比率window.devicePixelRatio
                ctx.letterSpacingText(nickname, 390, 235, 1 * window.devicePixelRatio);   // 姓名
                ctx.letterSpacingText(gender, 390, 370, 1 * window.devicePixelRatio);     // 性别
                ctx.letterSpacingText(attribute, 890, 370, 1 * window.devicePixelRatio);  // 属性

                ctx.font = "66px pop";
                ctx.letterSpacingText(number, 1485, 1085, 4 * window.devicePixelRatio);   // 岛民身份号码

                loading.setAttribute("hidden", true)
                show.src = canvas.toDataURL();
                this.current == "PC" && btn_save.removeAttribute("hidden")
            })
        }
    }
}

// 保存生成的图片
function save() {
    const el = document.createElement('a');
    // 设置 href 为图片经过 base64 编码后的字符串，默认为 png 格式
    el.href = document.querySelector(".show").src;
    el.download = `【${this.number}】${this.nickname}`;
    el.click();
}