window.onload = function () {
    // Globe Var
    var poorSingleBracket = 0;
    var isUserInputNumber = true;
    var endWithBracket = false;
    var exprArr = [];
    var showResult = false;
    var firstZero = false;

    // -- Display --
    // Members
    var resultView = document.getElementById("result-view");
    var expressionView = document.getElementById("expression-view");

    // Functions
    function refreshResultView(newResult) {
        resultView.value = newResult;
        // resultView.style.fontSize = Math.min(60, 532 / newResult.length) + "px";
    }

    function appendResult(num) {
        if (resultView.value.length <= 8) {
            refreshResultView(resultView.value + num)
        }
    }

    function refreshExpressionView(newExpr) {
        expressionView.value = newExpr;
    }
    // Clear all data
    function clearAll() {
        expressionView.value = "";
        endWithBracket = false;
        isUserInputNumber = false;
        exprArr.length = 0;
        poorSingleBracket = 0;
    }

    // Calculate Functions
    // TODO: make functions modify exprArr as less as possible
    function calResult() {

        if (expressionView.value.length == 1) return resultView.value;
        console.log("Now the arr is: ", exprArr);

        // Calculate bracket first
        var leftIndex = exprArr.lastIndexOf("(");
        var rightIndex = exprArr.indexOf(")");
        while (leftIndex != -1 && rightIndex != -1) {
            calInsideBracket(leftIndex, rightIndex);
            leftIndex = exprArr.lastIndexOf("(");
            rightIndex = exprArr.indexOf(")");
        }
        // console.log("Remove bracket to get: ", exprArr);

        // Calculate simple arr
        var result = calSimpleArr(exprArr);
        // console.log(result, " calculated!");

        return result;
    }

    function calInsideBracket(l, r) {
        if ((l - r) % 2 != 0) {
            console.log("Get ", l, " and ", r, " while they're invalid!\n");
        }
        var inside = [];
        for (var i = l + 1; i < r; ++i)
            inside.push(exprArr[i]);
        var insideResult = calSimpleArr(inside);

        // Why not work?
        // TODO: how to make splice work?
        // exprArr.splice(l, l - r + 1, insideResult.toString());

        // Splice Manually
        exprArr = manualSplice(exprArr, l, r, insideResult.toString()).slice();
        // console.log("Arr has been spliced to be ", exprArr);
    }

    function manualSplice(arr, begin, end, replacement) {
        var tmpArr = [];
        for (var i = 0; i < begin; ++i)
            tmpArr.push(arr[i]);
        tmpArr.push(replacement);
        for (var i = end + 1; i < arr.length; ++i)
            tmpArr.push(arr[i]);
        return tmpArr;
    }

    function binaryCal(n1, op, n2) {
        n1 = parseFloat(n1);
        n2 = parseFloat(n2);
        switch (op) {
            case "+": return n1 + n2; break;
            case "-": return n1 - n2; break;
            case "×": return n1 * n2; break;
            case "÷": return n1 / n2; break;
            default: console.log(n1, " + ", n2, " have something wrong to calculate!\n");
        }
    }

    function calSimpleArr(arr) {
        if (arr.length < 3 || arr.length % 2 != 1) {
            console.log(arr, " is not able to calculate!\n");
            return NaN;
        } else if (arr.indexOf("(") != -1 || arr.indexOf(")") != -1) {
            console.log(arr, " still has brackets!");
            return NaN;
        } else {
            // Valid Simple Arr
            if (arr.length == 3) {
                return binaryCal(arr[0], arr[1], arr[2]);
            } else {
                // Primary Cal
                // TODO: Use Math.min()
                var index = arr.indexOf("×");
                while (index != -1) {
                    var tmpResult = binaryCal(arr[index - 1], arr[index], arr[index + 1]);
                    arr = manualSplice(arr, index - 1, index + 1, tmpResult.toString()).slice();
                    console.log("After primary cal: ", arr);
                    index = arr.indexOf("×");
                }
                var index = arr.indexOf("÷");
                while (index != -1) {
                    var tmpResult = binaryCal(arr[index - 1], arr[index], arr[index + 1]);
                    arr = manualSplice(arr, index - 1, index + 1, tmpResult.toString()).slice();
                    console.log("After primary cal: ", arr);
                    index = arr.indexOf("÷");
                }


                var tmp = binaryCal(arr[0], arr[1], arr[2]);
                var i = 3;
                while (i + 1 < arr.length) {
                    tmp = binaryCal(tmp, arr[i], arr[i + 1]);
                    i = i + 2;
                }
                return tmp;
            }
        }
    }

    // -- Keyboard --
	// Number keyboard
	var numberMap = {
        "one": "1",
        "two": "2",
        "three": "3",
        "four": "4",
        "five": "5",
        "six": "6",
        "seven": "7",
        "eight": "8",
        "nine": "9"
    };

    for (var button in numberMap) {
    	document.getElementById(button).onclick = function () {
    	    showResult = false;
    	    if (!isUserInputNumber) {
    	        resultView.value = "0";
            }
    		if (resultView.value != "0") {
    		    appendResult(numberMap[this.id]);
            } else {
                refreshResultView(numberMap[this.id]);
            }
            isUserInputNumber = true;
            endWithBracket = false;
            firstZero = false;
    	}
    }

    document.getElementById("zero").onclick = function () {
        if (firstZero) return;
        if (!isUserInputNumber) {
            refreshResultView("0");
            isUserInputNumber = true;
            firstZero = true;
        } else {
            appendResult(0);
        }
    }

    document.getElementById("dot").onclick = function () {
        if (resultView.value == "0") {
            refreshResultView("0.");
            isUserInputNumber = true;
        } else {
            appendResult(".");
            isUserInputNumber = true;
        }
        firstZero = false;
    }

    // Operation keyboard
    var operationMap = {
        "divide": "÷",
        "multi": "×",
        "minus": "-",
        "add": "+"
    };

    for (var op in operationMap) {
        document.getElementById(op).onclick = function () {
            if (!isUserInputNumber) {
                alert("Every operator wants a number first!");
                return;
            }
            if (resultView.value == "0") {
                alert("Maybe you should input a valid number first?");
                return;
            } else {
                if (!endWithBracket) exprArr.push(resultView.value);
                exprArr.push(operationMap[this.id]);
                isUserInputNumber = false;
                endWithBracket = false;
                refreshExpressionView(exprArr.join(" "));
            }
            firstZero = false;
        }
    }

    // Equal
    document.getElementById("equal").onclick = function () {
        if (resultView.value == "0" && expressionView.value == "") {
            return;
        } else if (poorSingleBracket != 0) {
            alert("Some poor single left-bracket needs you to find him a Miss Right!");
            console.log()
            return;
        } else if (!isUserInputNumber) {
            alert("Every operator is afraid of being the last one!");
            return;
        } else {
            if (!endWithBracket) exprArr.push(resultView.value);
            var result = calResult(exprArr.join("") + resultView.value);
            refreshResultView(result.toString());
            showResult = true;
            stressResultView();
            isUserInputNumber = false;
            endWithBracket = false;
            clearAll();
        }
    }

    // Function keyboard
    document.getElementById("l-bracket").onclick = function () {
        // If there's no number before ...
        if (isUserInputNumber) {
            alert("Mr.Left cannot live with a number before him!");
        } else {
            exprArr.push("(");
            refreshExpressionView(exprArr.join(" "));
            endWithBracket = false;
            ++poorSingleBracket;
        }
    }

    document.getElementById("r-bracket").onclick = function () {
        if (!isUserInputNumber) {
            alert("A right-bracket is always want a number before her.");
        } else if (poorSingleBracket == 0) {
            alert("There's no single left-bracket waiting for a Miss Right!");
        } else {
            if (!endWithBracket) exprArr.push(resultView.value);
            exprArr.push(")");
            refreshExpressionView(exprArr.join(" "));
            endWithBracket = true;
            isUserInputNumber = true;
            --poorSingleBracket;
        }
    }

    document.getElementById("clear").onclick = function () {
        clearAll();
        resultView.value = "0";
        resultView.style.textShadow = "none";
    }

    document.getElementById("backspace").onclick = function () {
        var resultViewStr = resultView.value;
        if (resultViewStr != "0" && resultViewStr.length > 1) {
            refreshResultView(resultViewStr.substr(0, resultViewStr.length - 1));
            endWithBracket = false
        } else if (resultViewStr.length == 1) {
            refreshResultView("0");
            endWithBracket = false
        }
    }

    function stressResultView() {
        resultView.style.textShadow = "3px 3px 5px #888888";
    }

    document.getElementById("keyboard").onclick  = function () {
        normalizeResultView();
    }

    function normalizeResultView() {
        if (!showResult) {
            resultView.style.textShadow = "none";
        }
    }
};