class SnakePart {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
}

class Snake {
  constructor(headX,headY,tailLength) {
    this.snakeParts = [];
    this.headX = headX;
    this.headY = headY;
    this.xDirection = 0;
    this.yDirection = 0;
    this.tailLength = tailLength;
  }

  drawBlock = (x,y) => {
    canvasContext.drawImage(pixel, tileOffset + x * (tileSize - 1), tileOffset + y * (tileSize - 1));
  }

  changeSnakePosition() {
    this.headX = this.headX + this.xDirection;
    this.headY = this.headY + this.yDirection;
  }

  drawSnake() {
    for (let i = 0; i < this.snakeParts.length; i++) {
      let part = this.snakeParts[i];
      this.drawBlock(part.x, part.y);
    }
  
    this.snakeParts.push(new SnakePart(this.headX, this.headY));

    while (this.snakeParts.length > this.tailLength) {
      this.snakeParts.shift(); 
    }
    
    this.drawBlock(this.headX, this.headY);
  }

  checkCollision() {
          
    if (this.yDirection == 0 && this.xDirection == 0) {
      return false;
    }

    if (this.headX < 0 || this.headY < 0 || this.headX == tileCountX || this.headY == tileCountY) {
        return true;
    }
    
    /*for (let i = 0; i < snakeParts.length; i++) {
      let part = snakeParts[i];
      
      if (part.x == headX && part.y == headY) {
        return true;
      }
    }*/
 
    return false;
}
}