var nickname = "";
var number = "";

function select() {
    var show = document.querySelector(".show");
    var hidden = document.querySelector(".hidden");
    hidden.classList.remove("hidden")

    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");

    var bg = document.createElement("img");
    bg.crossOrigin = "Anonymous";
    bg.src = "https://cdn.jsdelivr.net/gh/Fanvins030/demo2Repository/bg.png";

    var homepage = document.querySelector("input").value;

    bg.onload = function () {
        get(MY_BASEURL + `getList?homepage=${homepage}`, function (res) {
            var { nickname, gender, attribute, number } = res.result;

            canvas.width = bg.width;
            canvas.height = bg.height;
            // 背景模板
            ctx.drawImage(bg, 0, 0, bg.width, bg.height);
            ctx.fillStyle = "#104f54";
            canvas.style.letterSpacing = 8 + 'px';
            ctx.font = "66px w9,pop";
            // 姓名
            ctx.fillText(nickname, 390, 235);
            // 性别
            ctx.fillText(gender, 390, 370);
            // 属性
            ctx.fillText(attribute, 890, 370);

            // 岛民身份号码
            canvas.style.letterSpacing = 16 + 'px';
            ctx.font = "66px pop";
            ctx.fillText(number, 1488, 1085);

            hidden.classList.add("hidden")

            show.src = canvas.toDataURL();
            document.body.removeChild(canvas)

            this.nickname = nickname;
            this.number = number;
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