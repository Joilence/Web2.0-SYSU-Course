window.onload = function () {
    // Status
    var gameBegin = false;
    var time = 0;
    var score = 0;

    function initHole() {
        for (var i = 0; i < 15 * 15; ++i) {
            var hole = document.createElement("div");
            hole.className = "hole";
            $("#mole-hole").append(hole);
        }
    }

    function selectHole() {
        var index = Math.floor(Math.random() * 15 * 15);
        $(".hole").eq(index).addClass("hole-active").removeClass("hole").off().on("click", function () {
            rightClick();
            $(this).removeClass("hole-active").addClass("hole").off().on("click", wrongClick);
            selectHole();
        });
    }

    function wrongClick() {
        if (gameBegin) {
            --score;
            refreshScore(score);
        }
    }

    function rightClick() {
        if (gameBegin) {
            ++score;
            refreshScore(score);
        }
    }

    function refreshTime(time) {
        $("#time-label").text("Time: " + time);
    }

    function refreshScore(score) {
        $("#score-label").text("Score: " + score)
    }

    function startGame() {
        $(".hole").on("click", wrongClick);
        gameBegin = true;
        time = 29;
        refreshTime(time);
        score = 0;
        $("#start-button").text("Stop Game").css("color", "darkred");
        setTimeout(function () {
            selectHole();
            timer = setTimeout(function () {
                stopGame();
            }, 30000);
            clocker = setInterval(function () {
                updateTime();
            }, 1000);
            $("#start-button").one("click", stopGame);
        }, 100);
    }

    function stopGame() {
        clearTimeout(timer);
        clearInterval(clocker);
        refreshScore(0);
        refreshTime(0);
        alert("You've got " + score + " score!");
        resetHole();
        gameBegin = false;
        $("#start-button").text("Start Game").css("color", "dodgerblue");
        $("#start-button").one("click", startGame);
    }

    function updateTime() {
        --time;
        refreshTime(time);
    }

    function resetHole() {
        $(".hole-active").addClass("hole").removeClass("hole-active");
        $(".hole").off();
    }

    initHole()
    $("#start-button").one("click", startGame);
}