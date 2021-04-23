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

// 切换tab
function toggleTab(tabName) {
    // 遍历所有card进行格式化处理并设置当前active
    document.querySelectorAll(".card").forEach((element) => {
        if (element.className.match(tabName)) {
            element.classList.add("active")
        } else {
            element.classList.remove("active")
        }
    })
    // 遍历所有tab进行格式化处理并设置当前active
    document.querySelectorAll(".tab>span").forEach((element) => {
        if (element.className.match(tabName)) {
            element.classList.add("active");
        } else {
            element.classList.remove("active")
        }
    })
}

// 监听输入事件
function listenInput(e, buttonName) {
    if (e.value.length > 0) {
        e.nextElementSibling.removeAttribute("hidden")
        if (buttonName) {
            document.querySelector(buttonName).classList.remove("disable")
        }
    } else {
        e.nextElementSibling.setAttribute("hidden", true)
    }
}

// 清空输入框的值
function cleanInput(e, inputName, buttonName) {
    document.querySelector(inputName).value = "";
    e.setAttribute("hidden", true)
    if (buttonName) {
        document.querySelector(buttonName).classList.add("disable")
    }
}

// -----------------蟹圆证----------------------
// 验证微博主页地址
function validatorURL(e) {
    listenInput(e)

    if (document.querySelector(".btn_select").classList.contains("disable") && e.value.match(/^https:\/\/weibo.com/)) {
        document.querySelector(".btn_select").classList.remove("disable")
    } else if (!document.querySelector(".btn_select").classList.contains("disable") && !e.value.match(/^https:\/\/weibo.com/)) {
        document.querySelector(".btn_select").classList.add("disable")
    }
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
function produce(btn_select) {
    if (!btn_select.classList.contains("disable")) {
        var show = document.querySelector(".show");
        show.src = "";

        var loading = document.querySelector(".loading");
        loading.removeAttribute("hidden")

        var btn_save = document.querySelector(".btn_save");
        btn_save.setAttribute("hidden", true);

        var canvas = document.querySelector("canvas");
        var ctx = canvas.getContext("2d");

        var bg = document.createElement("img");
        bg.crossOrigin = "Anonymous";
        bg.src = "https://cdn.jsdelivr.net/gh/Fanvins030/KarRoyIDCardWebpage/static/images/bg.png";

        var homepage = document.querySelector("input.homepage").value;

        bg.onload = function () {
            post(MY_BASEURL + 'getList', { homepage }, function (res) {
                if (res.code == 0) {
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

                    loading.setAttribute("hidden", true);
                    show.src = canvas.toDataURL();
                    document.querySelector(".displayer").removeAttribute("hidden");
                    btn_select.style.marginBottom = "10px";

                    if (this.current == "PC") {
                        btn_save.removeAttribute("hidden");
                        btn_save.style.marginBottom = "10px";
                    }
                } else if (res.code == 1) {
                    loading.setAttribute("hidden", true);
                    document.querySelector(".tip").removeAttribute("hidden");
                }
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

// -----------------登记表----------------------
// 提交登记申请
function submit(btn_submit) {
    // 提交前弹出提示框：用户输入的姓名、属性、性别、主页地址将被永久记录进数据库中，请检查信息是否正确，采用登记ID-微博主页-岛民身份号码三者关联的绑定方式，点击确认提交则视为同意授权
    if (!btn_submit.classList.contains("disable")) {
        console.log("jkjkl")
    }
}

// -----------------小纸条----------------------
// textarea高度自适应
function highlyAdaptive(e) {
    e.style.height = '50px';
    e.style.height = e.scrollHeight + 'px';
}

// 发送留言到服务器并保存在数据库中
function send(btn_send) {
    if (!btn_send.classList.contains("disable")) {
        var content = document.querySelector("textarea.comment").value
        post(MY_BASEURL + 'uploadComment', { content }, function (res) {
            if (res.code == 0) {
                cleanInput(document.querySelector(".message .clean"), ".comment", ".btn_send")
            }
        })
    }
}