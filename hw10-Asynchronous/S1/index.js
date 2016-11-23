window.onload = function () {
    $("#at-plus-container").on("mouseenter", init);
    $(".button").on("click", buttonClicked);
    $("#info-bar").on("click", infoBarClicked);
}

function init() {
    $(".num").hide();
    $(".button").removeClass("disabled");
    $("#result").text("");
    $("#info-bar").addClass("disabled");
}

function buttonClicked() {
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