var puzzle = {
    map: new Array(),
    blocks: new Array(),
    // game status
    gameStart: false,
    // game utility
    gameTime: 0,
    gameTimer: 0,
    gameMoves: 0,
    // puzzle funtion
    resetData: function () {
        puzzle.gameTime = 0;
        puzzle.gameMoves = 0;
        $("#time-counter").html("Time: 0");
        $("#move-counter").html("Moves: 0");
    },
    startGame: function () {
        puzzle.gameStart = true;
        puzzle.gameTimer = setInterval(function () {
            ++puzzle.gameTime;
            $("#time-counter").html("Time: " + puzzle.gameTime);
        }, 1000);
    },
    winGame: function () {
        puzzle.stopGame();
        showMessage("You Win!")
        $("#hover-message").click(hideMessage);
    },
    stopGame: function () {
        puzzle.gameStart = false;
        clearInterval(puzzle.gameTimer);
        puzzle.resetData();
    },
    addMove: function () {
        ++puzzle.gameMoves;
        $("#move-counter").html("Moves: " + puzzle.gameMoves);
    },
    stepStack: new Array()
}

function showMessage(message) {
    $("#message").html(message);
    $("#hover-message").show();
    $("#main-content").addClass("blur");
}

function hideMessage() {
    $("#hover-message").hide();
    $("#main-content").removeClass("blur");
}

function getNeighbour(position) {
    var dx = [-1, 0, 1, 0], dy = [0, -1, 0, 1];
    var neighbour = new Array(), x, y;
    for (var i = 0; i < 4; ++i) {
        x = position % 4 + dx[i], y = Math.floor(position / 4) + dy[i];
        if (x >= 0 && x < 4 && y >= 0 && y < 4) neighbour.push(x + 4 * y);
    }
    return neighbour;
}

function updatePosition(newPosition) {
    this.position = newPosition;
    $(this).css("left", ((this.position % 4) * 25).toString() + "%");
    $(this).css("top", (Math.floor(this.position / 4)* 25).toString() + "%");
}

function moveTo(newPosition) {
    // Update data
    puzzle.blocks[puzzle.map[newPosition]].updatePosition(this.position);
    puzzle.map[this.position] = puzzle.map[newPosition];
    puzzle.map[newPosition] = parseInt(this.id);
    // Update Image
    this.updatePosition(newPosition);
}

function createBlock(_id) {
    var newBlock = document.createElement("canvas");
    newBlock.className = "puzzle-block";
    newBlock.position = newBlock.id = _id;
    newBlock.moveTo = moveTo;
    newBlock.updatePosition = updatePosition;
    newBlock.getNeighbour = function () { return getNeighbour(this.position); };
    newBlock.onclick = blockClick;
    return newBlock;
}

function initPuzzle() {
    for (var i = 0; i < 16; ++i) {
        var newBlock = createBlock(i);
        newBlock.updatePosition(i);
        puzzle.map[i] = i;
        puzzle.blocks[i] = newBlock;
        $("#puzzle-content").append(newBlock);
    }
}

function drawPuzzleBlock(imagePath) {
    var image = new Image();
    image.src = imagePath;
    image.onload = function () {
        for (var i = 1; i < 16; ++i) {
            var canvas = document.getElementById(i);
            canvas.getContext("2d").drawImage(image, (image.width / 4) * (i % 4), (image.height / 4) * Math.floor(i / 4), image.width / 4, image.height / 4, 0, 0, canvas.width, canvas.height);
        }
    }
    image.onload();
}

function blockClick(event) {
    if (puzzle.gameStart) {
        var neighbours = this.getNeighbour();
        for (var index in neighbours) {
            if (puzzle.map[neighbours[index]] == "0") {
                puzzle.addMove();
                this.moveTo(neighbours[index]);
                if (checkWin()) puzzle.winGame();
                event.stopPropagation();
                break;
            }
        }
    }
}

function checkWin() {
    for (var i = 0; i < 16; ++i) {
        if (puzzle.blocks[i].position != i) return false;
    }
    return true;
}

function breakPuzzleBlock() {
    if (puzzle.gameStart) puzzle.stopGame();
    var blankPosition = puzzle.map.indexOf(0);
    randomMoveBlock(blankPosition, blankPosition, 50);
}

function randomMoveBlock(cur, pre, times) {
    if (times) {
        // Get blocks able to move around the blank block
        var possibleBlockPosition = puzzle.blocks[0].getNeighbour();
        // Remove previous position to prevent going back
        possibleBlockPosition.splice(possibleBlockPosition.indexOf(pre), 1);
        // Randomly choose a block to move
        var targetBlockPosition = possibleBlockPosition[Math.floor(Math.random() * possibleBlockPosition.length)];
        // Move block
        puzzle.blocks[puzzle.map[targetBlockPosition]].moveTo(cur);
        setTimeout(function () {
            randomMoveBlock(targetBlockPosition, cur, times - 1);
        }, 10);
    } else {
        puzzle.startGame();
    }
}


function resetPuzzleBlockDirectly() {
    if (puzzle.gameStart) {
        for (var i = 0; i < 16; ++i) {
            puzzle.blocks[i].updatePosition(i);
            puzzle.map[i] = i;
        }
    }
    puzzle.stopGame();
}

// function resetPuzzleWithProcessAnimation() {
//     // Use StepStack to recover
// }

function fileSelect(event) {
    event = event.originalEvent;
    event.stopPropagation();
    event.preventDefault();
    var files = event.dataTransfer.files;
    if (files.length && files[0].type.indexOf("image") != -1) {
        var img = window.URL.createObjectURL(files[0]);
        if (puzzle.gameStart) {
            resetPuzzleBlockDirectly();
            setTimeout(function() {
                drawPuzzleBlock(img);
            }, 500);
            setTimeout(breakPuzzleBlock, 1000);
        } else {
            drawPuzzleBlock(img);
        }
    }
    $("#drop-zone").removeClass("drag-over");
}

function dragOver(event) {
    event = event.originalEvent;
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    $("#drop-zone").addClass("drag-over");
}

function dragOut(event) {
    event = event.originalEvent;
    event.stopPropagation();
    event.preventDefault();
    $("#drop-zone").removeClass("drag-over");
}



window.onload = function () {
    $("#start").click(breakPuzzleBlock);
    $("#reset").click(resetPuzzleBlockDirectly);
    $("#drop-zone, #puzzle-content").bind({ "drop": fileSelect, "dragover": dragOver, "dragleave": dragOut });
    initPuzzle();
    drawPuzzleBlock("Images/panda.jpg");
    hideMessage();
}