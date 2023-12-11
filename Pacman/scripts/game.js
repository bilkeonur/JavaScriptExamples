const scoreText = document.getElementById("score");
const liveText = document.getElementById("live");
const timeText = document.getElementById("time");
const canvas = document.getElementById("canvas");
const pacmanFrames = document.getElementById("pacman-frames");
const ghostFrames = document.getElementById("ghost-frames");
const gameOverScreen = document.getElementById("game-over");
const btnNewGame = document.getElementById("btn-new-game");

const canvasContext = canvas.getContext("2d");

let pacman = new Pacman(1,1);
let ghosts = [];
let gameOver = false;
let gameState = true;
let gameTime = 0;
let foodCount = 0;

let ghostCoords = [
    {"xPos": 9, "yPos": 11, "color": GHOST_RED, "range": 17},
    {"xPos": 9, "yPos": 12, "color": GHOST_PINK, "range": 10},
    {"xPos": 10, "yPos": 12, "color": GHOST_ORANGE, "range": 9},
    {"xPos": 11, "yPos": 12, "color": GHOST_BLUE, "range": 8}
];

var map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,1,1,1,2,1,2,1,1,1,2,2,2,2,2,1],
    [1,2,1,1,1,2,2,2,2,2,2,2,2,2,2,2,1,1,1,2,1],
    [1,2,2,2,2,2,1,2,1,1,1,1,1,2,1,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,2,2,2,1,2,2,2,1,2,1,1,1,1,1],
    [0,0,0,0,1,2,1,1,1,2,1,2,1,1,1,2,1,0,0,0,0],
    [0,0,0,0,1,2,1,2,2,2,2,2,2,2,1,2,1,0,0,0,0],
    [1,1,1,1,1,2,1,2,1,1,0,1,1,2,1,2,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,1,0,0,0,1,2,2,2,2,2,2,2,2],
    [1,1,1,1,1,2,1,2,1,0,0,0,1,2,1,2,1,1,1,1,1],
    [0,0,0,0,1,2,1,2,1,1,1,1,1,2,1,2,1,0,0,0,0],
    [0,0,0,0,1,2,1,2,2,2,2,2,2,2,1,2,1,0,0,0,0],
    [1,1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,2,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,1],
    [1,1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1,1],
    [1,2,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

let drawPacman = () => {
    pacman.draw(true);
}

let drawGhosts = () => {
    ghosts.forEach(ghost => {
        ghost.draw(false);
    }); 
}

let movePacman = () => {
    pacman.moveProcess();
}

let moveGhosts = () => {
    ghosts.forEach(ghost => {
        ghost.moveProcess();
    });
}

let resetGhostPos = () => {
    ghosts.forEach((ghost,index) => {
        ghost.setPos(ghostCoords[index]["xPos"],ghostCoords[index]["yPos"]);
    });
}

let newGame = () => {
    location.reload();
}

let createGhosts = () => {
    ghosts = [];

    for(let i = 0; i < ghostCoords.length; i++) {
        
        let ghost = new Ghost(
            ghostCoords[i]["xPos"],
            ghostCoords[i]["yPos"],
            ghostCoords[i]["color"],
            ghostCoords[i]["range"]
        );

        ghosts.push(ghost);
    }
}

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

let createArc = (x, y, r, color) => {
    canvasContext.beginPath();
    canvasContext.arc(x, y, r, 0, 2 * Math.PI);
    canvasContext.fillStyle = color;
    canvasContext.fill();
}

let countFoods = (x, y, r, color) => {
    for(let i=0; i<map.length; i++) {
        for(let j=0; j<map[0].length; j++) {
            if(map[i][j] == 2) { 
                foodCount++;
            }
        }
    }    
}

let gameLoop = () => {
    update();
}

let gameInterval = setInterval(gameLoop, 1000 / fps);

let timeInterval = setInterval(() => {
    if(!gameOver) {
        gameTime++;
        let minute = formatNumber(parseInt(gameTime/60));
        let second = formatNumber(gameTime % 60);
        timeText.innerText = "Time: " + minute + ":" + second;
    }
}, 1000);

let update = () => {
    if(gameState && !gameOver) {
        movePacman();
        moveGhosts();
        draw();
    }
}

let draw = () => {
    drawBackground();
    drawMap();
    drawFoods();
    drawPacman();
    drawGhosts();
}

let drawBackground = () => {
    createRect(0, 0, canvas.width, canvas.height, backColor);
}

let drawMap = () => {
    for(let i=0; i<map.length; i++) {
        for(let j=0; j<map[0].length; j++) {
            if(map[i][j] == 1) { 
                createRect(
                    j * blockSize, 
                    i * blockSize, 
                    blockSize, 
                    blockSize, 
                    wallColor);

                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * blockSize, 
                        i * blockSize + wallOffset, 
                        wallSpace + wallOffset, 
                        wallSpace, wallInnerColor);
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * blockSize + wallOffset,
                        i * blockSize + wallOffset, 
                        wallSpace + wallOffset, 
                        wallSpace, wallInnerColor);
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * blockSize + wallOffset, 
                        i * blockSize + wallOffset, 
                        wallSpace, 
                        wallSpace + wallOffset, 
                        wallInnerColor);
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * blockSize + wallOffset, 
                        i * blockSize, wallSpace, 
                        wallSpace + wallOffset, 
                        wallInnerColor);
                }
            }
        }
    }
}

let drawFoods = () => {
    for(let i=0; i<map.length; i++) {
        for(let j=0; j<map[0].length; j++) {
            if(map[i][j] == 2) {
                createArc(j * blockSize + blockSize / 2, i * blockSize + blockSize / 2, foodSize, foodColor);
            }
        }
    }
}

countFoods();
createGhosts();
draw();

btnNewGame.addEventListener("click", () => {
    newGame();
});

window.addEventListener("keydown", (event) => {
    let key = event.key;
    
    if(gameOver) return;

    if (key == "ArrowRight" || key == "d" || key == "D") {
        pacman.changeDirection(DIRECTION_RIGHT);
    }
    else if (key == "ArrowLeft" || key == "a" || key == "A") {
        pacman.changeDirection(DIRECTION_LEFT);
    }
    else if (key == "ArrowUp" || key == "w" || key == "W") {
        pacman.changeDirection(DIRECTION_UP);
    }
    else if (key == "ArrowDown" || key == "s" || key == "S") {
        pacman.changeDirection(DIRECTION_DOWN);
    }
});