window.onload = function () {
    // Element
    var scoreLabel = document.getElementById("score-label");
    var timeLabel = document.getElementById("time-label");
    var startButton = document.getElementById("start-button");
    var modeButton = document.getElementById("mode-button");
    var moleHole = document.getElementById("mole-hole");

    // Status
    var gameBegin = false;
    var time = 0;
    var score = 0;


    function initHole() {
        for (var i = 0; i < 15 * 15; ++i) {
            var hole = document.createElement("div");
            hole.className = "hole";
            hole.onclick = wrongClick;
            moleHole.appendChild(hole);
        }
    }

    function selectHole() {
        var holes = document.getElementsByClassName("hole");
        var index = Math.floor(Math.random() * holes.length);

        console.log("select new hole! ", index);
        holes[index].onclick = function () {
            console.log("hole click!");
            rightClick();
            this.onclick = wrongClick;
            this.className = "hole";
            selectHole();
        }
        holes[index].className = "hole-active";

        console.log(index, " Finish!");
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
        timeLabel.textContent = "Time: " + time;
    }

    function refreshScore(score) {
        scoreLabel.textContent = "Score: " + score;
    }

    function startGame() {
        console.log("startGame()");
        gameBegin = true;
        time = 29;
        refreshTime(time);
        score = 0;
        startButton.textContent = "Stop Game";
        startButton.style.color = "darkred";
        setTimeout(function () {
            selectHole();
            timer = setTimeout(function () {
                console.log("timer setTimeout()")
                stopGame();
            }, 30000);
            clocker = setInterval(function () {
                console.log("clocker down!");
                updateTime();
            }, 1000);
            startButton.onclick = function () {
                console.log("Stop Button Clicked!");
                stopGame();
            }
        }, 100);
    }

    function stopGame() {
        console.log("stopGame()");
        clearTimeout(timer);
        clearInterval(clocker);
        refreshScore(0);
        refreshTime(0);
        alert("You've got " + score + " score!");
        resetHole();
        gameBegin = false;
        startButton.textContent = "Start Game";
        startButton.style.color = "dodgerblue";
        startButton.onclick = function () {
            console.log("click start!");
            startGame();
        }
    }

    function updateTime() {
        --time;
        refreshTime(time);
    }

    function resetHole() {
        var holes = document.getElementsByClassName("hole-active");
        while (holes.length) {
            holes[0].className = "hole";
        }
    }

    initHole()
    // startButton.addEventListener("click", startGame);
    startButton.onclick = function () {
        console.log("click start!");
        startGame();
    }
}