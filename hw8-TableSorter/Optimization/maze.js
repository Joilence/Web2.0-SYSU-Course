window.onload = function () {
    // Status
    var gameBegin = false;
    var overCheckZone = false;

    // Status Function
    $(".wall-normal").mouseover(function () {
        console.log("gameBegin:", gameBegin);
        console.log("Hit the wall.");
        if (gameBegin) {
            crashWall();
            gameBegin = false;
            overCheckZone = false;
            $("#message").addClass("message-alert").removeClass("message-normal").text("Failed! You hit the wall!");
        }
    })

    $("#start").mouseover(function () {
        gameReset();
        gameBegin = true;
        console.log("Start!");
        console.log("gameBegin:", gameBegin);
        $("#message").addClass("message-normal").removeClass("message-alert").text("Be careful! don't touch the walls!");
    })

    $("#check-zone").mouseover(function () {
        if (gameBegin) {
            console.log("Checked!");
            overCheckZone = true;
        }
    })

    $("#end").mouseover(function () {
        console.log("End!");
        if (gameBegin) {
            if (overCheckZone) {
                $("#message").addClass("message-normal").removeClass("message-alert").text("Congratulations! You WIN!");
            } else {
                $("#message").addClass("message-alert").removeClass("message-normal").text("Don't cheat! You should go to 'E' inside the maze.");
            }
            gameReset();
            gameBegin = false;
        }
    })

    // Event
    function crashWall() {
        console.log("Crashed!");
        $(".wall-normal").addClass("wall-alert").removeClass("wall-normal");
    }

    function gameReset() {
        gameBegin = false;
        overCheckZone = false;
        $(".wall-alert").addClass("wall-normal").removeClass("wall-alert");
    }
}