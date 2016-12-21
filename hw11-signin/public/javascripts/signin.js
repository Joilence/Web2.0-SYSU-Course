function showError(input, messageBar) {
    $(input).addClass('error');
    $(".error-msg").animate({"opacity": 1}, 0);
}

function hideError(input) {
    $(input).removeClass('error');
    $(".error-msg").text("").animate({"opacity": 0}, 100);
}

window.onload = function () {
    $('.form:has(.error)').each(function () {
        showError($(this).find('.textfield'), $(this).find('.error').hide());
    });
    $('.textfield').each(function () {
        $(this).blur(function() {
            hideError(this);
        });
    });
}