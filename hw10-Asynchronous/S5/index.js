window.onload = function () {
    $("#at-plus-container").on("mouseenter", init);

    $(".button").on("click", buttonClicked);
    $("#info-bar").on("click", infoBarClicked);

    $(".apb").click(function () {
        $("#button").trigger("mouseenter");
        ultimateActive();
    })
}

function ultimateActive() {
    var handlers = randomization([aHandler, bHandler, cHandler, dHandler, eHandler])
    var triggerQueue = [];
    showOrderString(handlers);
    for (var i = 0; i < handlers.length; ++i) {
        (function (i) {
            triggerQueue[i] = function (curSum) {
                handlers[i](curSum, function (err, message, curSum) {
                    if (err) {
                        showMessage(err.message);
                        triggerQueue[i](err.curSum);
                    } else {
                        showMessage(message);
                        triggerQueue[i + 1](curSum);
                    }
                })
            }
        })(i);
    }
    triggerQueue[handlers.length] = function () {
        $("#info-bar").trigger('click', function () {
            showMessage("楼主异步调用战斗力感人，目测不超过 " + $("#info-bar").text());
        });
    };
    triggerQueue[0](0);
}

function showOrderString(handlers) {
    var order = "";
    handlers.forEach(function (element) {
        order += element.toString()[9].toUpperCase();
    });
    showMessage(order);
}

function init() {
    $(".num").hide();
    $(".button").removeClass("disabled");
    $("#result").text("");
    $("#info-bar").addClass("disabled");
    $("#msg").text("");
}

function buttonClicked(event, callback) {
    if (!$(this).hasClass("disabled") && $(this).children(".num:hidden").length) {
        $(this).children(".num").text("...").show();
        $(this).siblings().addClass("disabled");
        var button = this;
        $.get('/' + this.id, function (data) {
            if (!$(button).children(".num:hidden").length && !$(button).hasClass("disabled")) {
                $(button).children(".num").text(data);
                $(button).addClass("disabled");
                $(button).siblings(":has(.num:hidden)").removeClass("disabled");
                tryEnableInfoBar();
                callback.call(button);
            }
        });
    }
}


function infoBarClicked(event, callback) {
    if (!$(this).hasClass("disabled")) {
        var number = 0;
        $(".num").each(function () {
            number += parseInt($(this).text());
        });
        $("#result").text(number);
        $(this).addClass("disabled");
        if ($.isFunction(callback)) callback.call(this);
    }
}

function tryEnableInfoBar() {
    if (!$(".button:not(.disabled),.button:has(.num:hidden)").length) {
        $("#info-bar").removeClass("disabled");
    }
}

function aHandler(curSum, callback) {
    buttonHandler($("#A"), 0.7, curSum, "A: 这是一个天大的秘密", "A: 这不是一个天大的秘密", callback);
}

function bHandler(curSum, callback) {
    buttonHandler($("#B"), 0.7, curSum, "B: 我不知道", "B: 我知道", callback);
}

function cHandler(curSum, callback) {
    buttonHandler($("#C"), 0.7, curSum, "C: 你不知道", "C: 你知道", callback);
}

function dHandler(curSum, callback) {
    buttonHandler($("#D"), 0.7, curSum, "D: 他不知道", "D: 他知道", callback);
}

function eHandler(curSum, callback) {
    buttonHandler($("#E"), 0.7, curSum, "E: 才怪", "E: 才不怪", callback);
}

function buttonHandler(button, failrate, curSum, succeedMsg, failMsg, callback) {
    $(button).trigger("click", function () {
        if (Math.random() < failrate) {
            tryEnableInfoBar();
            callback(null, succeedMsg, curSum + parseInt($(button).children(".num").text()));
        } else {
            $(button).removeClass("disabled");
            $(button).children(".num").hide();
            callback({ message: failMsg, curSum: curSum }, null, null);
        }
    });
}

function showMessage(message) {
    $("#msg").text(message);
}

function randomization(src) {
    var random = [];
    while (src.length) {
        var select = Math.floor(Math.random() * src.length);
        random.push(src[select]);
        src.splice(select, 1);
    }
    return random;
}