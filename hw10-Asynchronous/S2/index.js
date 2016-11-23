window.onload = function () {
    $("#at-plus-container").on("mouseenter", init);

    $(".button").on("click", buttonClicked);
    $("#info-bar").on("click", infoBarClicked);

    $(".apb").click(function () {
        $("#button").trigger("mouseenter");
        robotActive();
    })
}

function robotActive() {
    var buttons = $(".button");
    var triggerQueue = [];
    var i, length;
    for (i = 0, length = buttons.length; i < length; ++i) {
        (function(i) {
            triggerQueue[i] = function () {
                $(buttons[i]).triggerHandler("click", function () {
                    triggerQueue[i + 1]();
                })
            }
        })(i)
    }
    triggerQueue[buttons.length] = function () {
        tryEnableInfoBar();
        $("#info-bar").trigger("click");
    }
    triggerQueue[0]();
}

function init() {
    $(".num").hide();
    $(".button").removeClass("disabled");
    $("#result").text("");
    $("#info-bar").addClass("disabled");
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
    console.log("try enable info bar");
    if (!$(".button:not(.disabled),.button:has(.num:hidden)").length) {
        $("#info-bar").removeClass("disabled");
    }
}