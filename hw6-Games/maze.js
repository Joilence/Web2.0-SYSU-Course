window.onload = function () {
    // Element
    var message = document.getElementById("message");

    var walls = document.getElementsByClassName("wall-normal");
    var start = document.getElementById("start");
    var checkZone = document.getElementById("check-zone");
    var end = document.getElementById("end");
    
    // Status
    var gameBegin = false;
    var overCheckZone = false;

    // Status Function
    for (var i = 0; i < walls.length; ++i) {
        walls[i].onmouseover = function () {
            console.log("gameBegin:", gameBegin);
            console.log("Hit the wall.");
            if (gameBegin) {
                crashWall();
                gameBegin = false;
                overCheckZone = false;
                message.className = "message-alert";
                message.textContent = "Failed! You hit the wall!";
            }
        }
    }
    
    start.onmouseover = function () {
        gameReset();
        gameBegin = true;
        console.log("Start!");
        console.log("gameBegin:", gameBegin);
        message.className = "message-normal";
        message.textContent = "Be careful! don't touch the walls!";
    }

    checkZone.onmouseover = function () {
        if (gameBegin) {
            console.log("Checked!");
            overCheckZone = true;
        }
    }

    end.onmouseover = function () {
        console.log("End!");
        if (gameBegin) {
            if (overCheckZone) {
                message.className = "message-normal";
                message.textContent = "Congratulations! You WIN!";
            } else {
                message.className = "message-alert";
                message.textContent = "Don't cheat! You should go to 'E' inside the maze.";
            }
            gameReset();
            gameBegin = false;
        }
    }

    // Event
    function crashWall() {
        console.log("Crashed!");
        var _walls = document.getElementsByClassName("wall-normal");
        console.log("CrashWall(): walls length: ", _walls.length);
        while (_walls.length) {
            _walls[0].className = "wall-alert";
        }
    }

    function gameReset() {
        gameBegin = false;
        overCheckZone = false;
        var _walls = document.getElementsByClassName("wall-alert");
        console.log("Game Reset(): walls length: ", _walls.length);
        while (_walls.length) {
            _walls[0].className = "wall-normal";
        }
    }
}