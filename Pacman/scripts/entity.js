class Entity {
    constructor(frames, xPos, yPos, frameCount) {
        this.frames = frames;
        this.x = xPos * blockSize;
        this.y = yPos * blockSize;
        this.xPos = xPos;
        this.yPos = yPos;
        this.xRem = 0;
        this.yRem = 0;
        this.width = blockSize;
        this.height = blockSize;
        this.direction = DIRECTION_RIGHT;
        this.frameCount = frameCount;
        this.currentFrame = 0;
        this.speed = 5;
        setInterval(() => {this.changeAnimation();}, parseInt(800 / this.frameCount));
    }
    
    calculatePosition() {
        
        if(this.x < 0) this.x = map[0].length * blockSize;
        if(this.x > map[0].length * blockSize) this.x = 0;

        this.xPos = parseInt(this.x / blockSize);
        this.yPos = parseInt(this.y / blockSize);
        this.xRem = this.x % blockSize;
        this.yRem = this.y % blockSize;
    }

    setPos(xPos,yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.x = xPos * blockSize;
        this.y = yPos * blockSize;
    }

    draw(rotation) {
        
        if(rotation) {
            canvasContext.save();
            canvasContext.translate(this.x + blockSize / 2, this.y + blockSize / 2);
            canvasContext.rotate(((this.direction + 1) * 90 * Math.PI) / 180);
            canvasContext.translate(-this.x - blockSize / 2, -this.y - blockSize / 2);
        }
        
        canvasContext.drawImage(
            this.frames,
            this.currentFrame * blockSize,
            0,
            blockSize,
            blockSize,
            this.x,
            this.y,
            this.width,
            this.height
        );
        
        canvasContext.restore();
    }

    checkCollisions(direction) {
        if(this.xRem == 0 && this.yRem == 0) {
            if(direction == DIRECTION_RIGHT) {
                if(map[this.yPos][this.xPos + 1] == 1) return true;
            }
            else if(direction == DIRECTION_LEFT) {
                if(map[this.yPos][this.xPos - 1] == 1) return true;
            }
            else if(direction == DIRECTION_UP) {
                if(map[this.yPos-1][this.xPos] == 1) return true;
            }
            else if(direction == DIRECTION_DOWN) {
                if(map[this.yPos+1][this.xPos] == 1) return true;
            }
        }

        return false;
    }

    moveRight() {
        if(!this.checkCollisions(DIRECTION_RIGHT)) {
            this.x += this.speed;
        }
    }

    moveLeft() {
        if(!this.checkCollisions(DIRECTION_LEFT)) {
            this.x -= this.speed;
        }
    }

    moveUp() {
        if(!this.checkCollisions(DIRECTION_UP)) {
            this.y -= this.speed;
        }
    }

    moveDown() {
        if(!this.checkCollisions(DIRECTION_DOWN)) {
            this.y += this.speed;
        }
    }

    moveProcess() {}
}