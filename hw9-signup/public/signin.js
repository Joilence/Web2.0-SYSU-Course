var checkCases = {
    name: {
        'should only contain alphabet, number and underline': /^\w*$/,
        'should begin with alphabet': /^[a-z]/i,
        'should have a length of 6~18 digits': /^\w{6,18}$/
    },
    id: {
        'should only contain numbers': /^\d*$/,
        'should begin with non-zero number': /^[1-9]/,
        'should have a length of 8 numbers': /^\d{8}$/
    },
    tel: {
        'should only contain numbers': /^\d*$/,
        'should begin with non-zero number': /^[1-9]/,
        'should have a length of 11 numbers': /^\d{11}$/
    },
    email: {
        "should only contain alphabet, number, '.', '_', '-' and '@'": /^(\w|\.|-|@)*$/i,
        'should have exactly one @': /^(\w|\.|-)*@(\w|\.|-)*$/i,
        "'@' should be between alphabets and numbers": /\w@\w/,
        'should begin with alphabet or number': /^[a-z0-9]/i,
        'should end with alphabet': /[a-z]$/i,
        "'-' or '.' should not appear continuously": /^[a-z0-9]([\-\.]?\w+)*@(\w+[\-\.]?)*[a-z]$/i,
        'Server postfix is invalid': /\.[a-z]{2,4}$/i
    }
}

//  Input Check
function checkValid(input) {
    checkDelay(input.name, function () {
        if (input.value) {
            inputCheck(input);
        }
    }, 300);
}

function inputCheck(input) {
    for (var checkCase in checkCases[input.name]) {
        if (!checkCases[input.name][checkCase].test(input.value)) {
            showError(input, checkCase);
            return;
        }
    }
    $.post('/dataCheck', input.name + '=' + input.value, function (data) {
        if (data) {
            showError(input, data);
        } else {
            $(input).removeClass('error-state').addClass("pass-state");
            checkAllValid();
        }
    })
}

var timer = {};
function checkDelay(id, fn, wait) {
    if (timer[id]) {
        window.clearTimeout(timer[id]);
        delete timer[id];
    }
    return timer[id] = window.setTimeout(function () {
        fn();
        delete timer[id];
    }, wait);
}

function checkAllValid() {
    var flag = true;
    $(".textfield").each(function () {
        if (!$(this).hasClass('pass-state')) flag = false;
    });
    if (flag) {
        $("#submit").removeAttr("disabled");
    } else {
        $("#submit").attr("disabled", "disabled");
    }
}

// Error Handle
function hideError(input, wait) {
    $(input).removeClass("error-state pass-state");
    $(input).siblings(".error-msg").animate({"opacity": 0}, wait);
}

function showError(input, message) {
    hideError(input, 0);
    $(input).addClass("error-state").removeClass("pass-state");
    $(input).siblings(".error-msg").text(message).animate({"opacity": 1}, 100);
}


window.onload  = function () {
    $(".textfield").each(function () {
        this.oninput = function () {
            hideError(this, 100)
            checkValid(this);
        }
    });

    $("#reset").on("click", function () {
        $(".textfield").each(function () {
            hideError(this, 100);
        })
    });
}