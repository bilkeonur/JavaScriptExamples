const emptyBlock = document.getElementById("empty-block");
const fullBlock = document.getElementById("full-block");
const gameCanvas = document.getElementById("game-canvas");
const nextShapeCanvas = document.getElementById("next-shape-canvas");
const scoreText = document.getElementById("score");
const hiScoreText = document.getElementById("hi-score");
const playTimeText = document.getElementById("play-time");
const clearSound = document.getElementById("audio-clear");
const endSound = document.getElementById("audio-end");

const gameCanvasContext = gameCanvas.getContext("2d");
const nextShapeCanvasContext = nextShapeCanvas.getContext("2d");

let gameInterval = null;
let timeInterval = null;

let shape = null;
let nextShape = null;
let isGamePaused = false;
let isGameOver = false;
let gameScore = 0;
let playTime = 0;
let isAnimating = false;

let gameScreen = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];

let nextShapeScreen = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
]

let checkGameOver = () => {
    for(let i=0; i<gameScreen[0].length; i++) {
        if(gameScreen[0][i]) {
            isGameOver=true;
            return;
        }
    }
}

let checkCompletedRow = () => {
    for(let i=0; i<gameScreen.length; i++) {    
        
        let rowSum = 0;
        
        for(let j=0; j<gameScreen[i].length; j++) {
            rowSum += gameScreen[i][j];
        }

        if(rowSum == screenWidth) {
            gameScreen.splice(i, 1);
            gameScreen.splice(0,0,[0,0,0,0,0,0,0,0,0,0]);
            gameScore+=100;
            scoreText.innerText = String(gameScore).padStart(6,'0');
            clearSound.play();
        }
    }
}

let drawBlock = (canvas,x,y,image) => {
    let blockImage = image == 0 ? emptyBlock : fullBlock;
    canvas.drawImage(blockImage,x,y);
}

let drawNextShapeScreen = () => {
    for(let i=0; i < nextShapeScreen.length; i++) {
        for(let j=0; j < nextShapeScreen[0].length; j++) {
            drawBlock(
                nextShapeCanvasContext, 
                j * shapeSize + shapeOffset, 
                i * shapeSize + shapeOffset, 
                nextShapeScreen[i][j]);
        }
    }
}

let cleanNextShapeScreen = () => {
    for(let i=0; i < nextShapeScreen[0].length; i++) {
        for(let j=0; j < nextShapeScreen.length; j++) {
            nextShapeScreen[j][i] = 0;
        }
    }
}

let drawNextShape = () => {
    for(let i=0; i < nextShape.shape[0].length; i++) {
        for(let j=0; j < nextShape.shape.length; j++) {
            nextShapeScreen[j][i] = nextShape.shape[j][i];
        }
    }
}

let cleanGameScreen = () => {
    for(let i=0; i < gameScreen[0].length; i++) {
        for(let j=0; j < gameScreen.length; j++) {
            gameScreen[j][i] = 0;
        }
    }
}

let drawGameScreen = () => {
    for(let i=0; i<gameScreen.length; i++) {
        for(let j=0; j<gameScreen[i].length; j++) {
            drawBlock(
                gameCanvasContext, 
                j * shapeSize + shapeOffset, 
                i * shapeSize + shapeOffset, 
                gameScreen[i][j]);
        }
    }
}

let generateRandomShape = () => {
    return Math.floor(Math.random() * 9);
}

let createNewShape = () => {
    cleanNextShapeScreen();
    if(!shape) {
        shape = new Shape(generateRandomShape());
        nextShape = new Shape(generateRandomShape());
    }
    else {
        shape = nextShape;
        nextShape = new Shape(generateRandomShape());
    }

    shape.draw();
    drawNextShape();
}

let update = () => {
    if(!isGamePaused) {
        if(!isGameOver) {
            drawGameScreen();
            drawNextShapeScreen();
            if(!shape.moveBottom()) {
                checkGameOver();
                checkCompletedRow();
                createNewShape();
            }
        }
        else {
            if(!isAnimating) {
                setHighScore(gameScore);
                endSound.play();
                gameOverAnimation();
            }
        }
    }
}

let gameLoop = () => {
    update();
}

let getHighScore = () => {
    let highScore = localStorage.getItem("tetris_hi_score");
    highScore = highScore !=null ? highScore : 0;
    hiScoreText.innerText = String(highScore).padStart(6,'0');
    return highScore;
}

let setHighScore = (score) => {
    let highScore = getHighScore();
    if(score>highScore) {
        localStorage.setItem("tetris_hi_score",score);
    }
}

let updateTime = () => {
    playTime++;
    let hour = formatNumber(parseInt(playTime/3600));
    let minute = formatNumber(parseInt((playTime - (hour * 60)) / 60));
    let second = formatNumber(playTime % 60);
    playTimeText.innerText = hour + ":" + minute + ":" + second;
}

let newGame = () => {
    shape = null;
    nextShape = null;
    isGamePaused = false;
    isGameOver = false;
    gameScore = 0;
    playTime = 0;
    isAnimating = false;

    cleanGameScreen();
    cleanNextShapeScreen();
    getHighScore();
    createNewShape();

    if(gameInterval != null) clearInterval(gameInterval);
    if(!timeInterval != null) clearInterval(timeInterval);

    gameInterval = setInterval(gameLoop, 1000 / fps);
    timeInterval = setInterval(updateTime, 1000);
}

let gameOverAnimation = () => {
    isAnimating = true;
    
    for(let i=0; i<gameScreen.length; i++) {
        setTimeout(() => { 
            for(let j=0; j<gameScreen[0].length; j++) {
                setTimeout(() => {
                    gameScreen[i][j] = 1;
                    drawGameScreen();
                    if(
                        i == gameScreen.length-1 && 
                        j == gameScreen[0].length - 1) {
                        newGame();
                    }
                }, 10 * j);
            }
        }, 100 * i);
    }
}

newGame();

window.addEventListener("keydown", (event) => {
    let key = event.key;
    
    if(isGamePaused || isGameOver) {
        return;
    }

    if (key == "ArrowRight" || key == "d" || key == "D") {
        shape.moveRight();
    }
    else if (key == "ArrowLeft" || key == "a" || key == "A") {
        shape.moveLeft();
    }
    else if (key == "ArrowUp" || key == "w" || key == "W") {
        shape.rotate();
    }
    else if (key == "ArrowDown" || key == "s" || key == "S") {
        shape.moveBottom();
    }

    drawGameScreen();
});

