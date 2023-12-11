class Pacman extends Entity {
    constructor(xPos, yPos) {
        super(pacmanFrames, xPos, yPos, 8);
        this.tempDirection = DIRECTION_RIGHT;
        this.score = 0;
        this.lives = 3;

        liveText.innerText = "Lives: " + this.lives;
    }

    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount - 1 ? 0 : this.currentFrame + 1;
    }

    changeDirection(direction) {
        this.tempDirection = direction;
    }

    checkGameCompletion() {
        if(this.score == foodCount) {
            gameOver = true;
            gameOverScreen.style.display = "block";
        }
    }

    checkGameOver() {
        if(this.lives == 0) {
            gameOver = true;
            gameOverScreen.style.display = "block";
        }
        else {
            this.direction = DIRECTION_RIGHT;
            this.tempDirection = DIRECTION_RIGHT;
            this.setPos(1,1);
            resetGhostPos();
            gameState = true;
        }
    }

    checkGhostCollision() {
        ghosts.forEach(ghost => {
            if(this.xPos == ghost.xPos && this.yPos == ghost.yPos) {
                this.lives--;
                liveText.innerText = "Lives: " + this.lives;
                gameState = false;
                this.checkGameOver();
            }
        });
    }

    eat() {
        if(this.xRem == 0 && this.yRem == 0) {
            if(map[this.yPos][this.xPos] == 2) {
                map[this.yPos][this.xPos] = 0;
                this.score++;
                scoreText.innerText = "Score: " + this.score;
                this.checkGameCompletion();
            }
        }
    }

    moveProcess() {

        this.calculatePosition();
        this.checkGhostCollision();
        this.eat();
    
        if(this.tempDirection != this.direction) {
            if(this.xRem == 0 && this.yRem == 0 && !this.checkCollisions(this.tempDirection)) {
                this.direction = this.tempDirection;
            }
        }

        switch(this.direction) {
            case DIRECTION_RIGHT:
                this.moveRight();
                break;
            case DIRECTION_LEFT:
                this.moveLeft();
                break;
            case DIRECTION_UP:
                this.moveUp();
                break;
            case DIRECTION_DOWN:
                this.moveDown();
                break;
        }

        this.draw(true);
    }
}