class Ghost extends Entity {
    constructor(xPos, yPos, color, range) {
        super(ghostFrames, xPos, yPos, 2);
        this.color = color;
        this.currentFrame = color * 2;
        this.frameTimer = 0;
        this.speed = 4;
        this.range = range;
    }
    
    changeAnimation() {
        this.currentFrame = this.currentFrame % this.frameCount == 0 ? this.color * this.frameCount + 1 : this.color * this.frameCount;
    }

    handeleMovement() {
        
        if(this.frameTimer % (blockSize / this.speed) == 0) {
            
            let allowedMoveDirections = [0,0,0,0];

            for(let i=0; i<4; i++) {
                //Down Left Top Right
                allowedMoveDirections[i] = !this.checkCollisions(i);
            }

            this.frameTimer = 0;
            this.findNearestDistance2Target(allowedMoveDirections);
        }

        this.frameTimer++;
    }

    findNearestDistance2Target(allowedMoveDirections) {
        
        let distanceDown = this.calculateDistance(this.xPos,this.yPos+1);
        let distanceLeft = this.calculateDistance(this.xPos-1,this.yPos);
        let distanceUp = this.calculateDistance(this.xPos,this.yPos-1);
        let distanceRight = this.calculateDistance(this.xPos+1,this.yPos);
        
        let distances = [distanceDown,distanceLeft,distanceUp,distanceRight];

        let nearestDistance = 50;
        let tempDirection = DIRECTION_RIGHT;

        for(let i=0; i<allowedMoveDirections.length; i++) {
            if(allowedMoveDirections[i]) {
                if(distances[i] <= nearestDistance) {
                    nearestDistance = distances[i];
                    tempDirection = i;
                }
            }
        }

        if(nearestDistance <= this.range) {
            this.direction = tempDirection;
        }
        else {
            this.direction = this.generateRandomDirection();
        }
    }

    generateRandomDirection() {
        let randDirection = Math.floor(Math.random() * 4);
        
        while(this.checkCollisions(randDirection)) {
            randDirection = Math.floor(Math.random() * 4);
        }
        
        return randDirection;
    }
    
    calculateDistance(x,y) {
        let xDist = Math.abs(pacman.xPos - x);
        let yDist = Math.abs(pacman.yPos - y);
        let dist = Math.sqrt(xDist * xDist + yDist * yDist);
        return dist;
    }

    moveProcess() {

        this.calculatePosition();
        this.handeleMovement();
        
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

        this.draw(false);
    }
}