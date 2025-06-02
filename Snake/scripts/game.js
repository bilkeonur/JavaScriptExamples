const pixel = document.getElementById("pixel");
const canvas = document.getElementById("canvas");

const canvasContext = canvas.getContext("2d");

let inputXDirection = 0;
let inputYDirection = 0;

let snake = new Snake(0,0,3);

setInterval(drawGame, 1000 / speed);

let clearScreen = () => {
    canvasContext.fillStyle = "#92d182";
    canvasContext.fillRect(tileOffset, tileOffset, screenWidth, screenHeight);
}

function drawGame() {
    
    if(!snake.checkCollision()) {
        snake.xDirection = inputXDirection;
        snake.yDirection = inputYDirection;

        snake.changeSnakePosition();
        clearScreen();
        snake.drawSnake();
    }
}
  
window.addEventListener("keydown", (event) => {
    let key = event.key;
    
    if (key == "ArrowRight" || key == "d" || key == "D") {
        if (inputXDirection == -1) return;
        inputXDirection = 1;
        inputYDirection = 0;
    }
    else if (key == "ArrowLeft" || key == "a" || key == "A") {
        if (inputXDirection == 1) return;
        inputXDirection = -1;
        inputYDirection = 0;
    }
    else if (key == "ArrowUp" || key == "w" || key == "W") {
        if (inputYDirection == 1) return;
        inputXDirection = 0;
        inputYDirection = -1;
    }
    else if (key == "ArrowDown" || key == "s" || key == "S") {
        if (inputYDirection == -1) return;
        inputXDirection = 0;
        inputYDirection = 1;
    }
});