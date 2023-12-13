class Shape {
    constructor(type) {
        this.type = type;  
        this.templates = templates;
        this.shape = this.templates[this.type];
        this.shapeSize = this.shape[0].length;
        this.xPos = 4;
        this.yPos = -1;
    }

    //Mode 1=Draw, 0=Clear
    draw(mode) {
        for(let i=this.shapeSize-1; i>=0; i--) {
            let yOffset = this.yPos + i - this.shapeSize + 1;
            if(yOffset<0) return;
            for(let j=0; j<this.shapeSize; j++) {
                if(!this.shape[i][j]) continue;
                let xOffset = this.xPos + j;
                let operation = mode ? this.shape[i][j] : 0;
                gameScreen[yOffset][xOffset] = operation;
            }
        }
    }

    checkRotation() {
        let rotatedShape = this.shape[0].map((val, index) => this.shape.map(row => row[index]).reverse());
        this.draw(0);
    
        let rotatedIndex = 0;
        
        loopI:for(let i=0; i<this.shapeSize; i++) {
            for(let j=this.shapeSize-1; j>=0; j--) {
                let shpPart = this.shape[j][i];
                if(!shpPart) continue;
                rotatedIndex = i;
                break loopI;
            }
        }

        let rotatedPos = this.xPos + rotatedIndex;
        
        if(rotatedPos < 0) return false;
        if(this.xPos + this.shapeSize > screenWidth) return false;

        for(let i=this.shapeSize-1; i>=0; i--) {
            for(let j=0; j<this.shapeSize; j++) {
                let shpPart = rotatedShape[i][j]
                let yOffset = i + this.yPos - this.shapeSize + 1;
                let xOffset = this.xPos + j;
                if(yOffset < 0 || yOffset > screenHeight - 1) return false; 
                let screenPart = gameScreen[yOffset][xOffset];
                if(shpPart & screenPart) return false;
            }
        }

        this.shape = [...rotatedShape];
        return true;
    }

    checkLeftFrame() {
        for(let i=0; i<this.shapeSize; i++) {
            for(let j=this.shapeSize - 1; j>=0; j--) {
                if(!this.shape[j][i]) continue;
                return (this.xPos + i) > 0;
            }
        }
    }

    checkRightFrame() {
        for(let i=this.shapeSize-1; i>=0; i--) {
            for(let j=this.shapeSize - 1; j>=0; j--) {
                if(!this.shape[j][i]) continue;
                return (this.xPos + i) < screenWidth - 1;
            }
        }
    }

    checkBottomFrame() {
        for(let i=this.shapeSize-1; i>=0; i--) {
            for(let j=0; j<this.shapeSize; j++) {
                if(!this.shape[i][j]) continue;
                let bottomOffset = this.yPos - (this.shapeSize - 1) + i;
                return bottomOffset < screenHeight - 1;
            }
        }
    }

    checkLeftMovement() {
        if(!this.checkLeftFrame()) return false;
        loopI:for(let i=this.shapeSize-1; i>=0; i--) {
            for(let j=0; j<this.shapeSize; j++) {
                let shpPart = this.shape[i][j];
                if(!shpPart) continue;
                let xOffset = this.xPos + j - 1;
                let yOffset = this.yPos - (this.shapeSize - 1) + i;
                if(yOffset < 0) break;
                if(gameScreen[yOffset][xOffset]) {return false;}
                else {continue loopI;}
            }
        }

        return true;
    }

    checkRightMovement() {
        if(!this.checkRightFrame()) return false;
        loopI:for(let i=this.shapeSize-1; i>=0; i--) {
            for(let j=this.shapeSize-1; j>=0; j--) {
                let shpPart = this.shape[i][j];
                if(!shpPart) continue;
                let xOffset = this.xPos + j + 1;
                let yOffset = this.yPos - (this.shapeSize - 1) + i;
                if(yOffset < 0) break;
                if(gameScreen[yOffset][xOffset]) {return false;}
                else {continue loopI;}
            }
        }

        return true;
    }

    checkBottomMovement() {
        if(!this.checkBottomFrame()) return false;
        loopI:for(let i=0; i<this.shapeSize; i++) {
            for(let j=this.shapeSize-1; j>=0; j--) {
                let shpPart = this.shape[j][i];
                if(!shpPart) continue;
                let xOffset = this.xPos + i;
                let yOffset = this.yPos - (this.shapeSize - 1) + j + 1;
                if(yOffset < 0) break;
                if(gameScreen[yOffset][xOffset]) {return false;}
                else {continue loopI};
            }
        }

        return true;
    }

    moveLeft() {
        if(this.checkLeftMovement()) {
            this.draw(0);
            this.xPos--;
            this.draw(1);
        }
    }

    moveRight() {
        if(this.checkRightMovement()) {
            this.draw(0);
            this.xPos++;
            this.draw(1);
        }
    }

    moveBottom() {
        if(this.checkBottomMovement()) {
            this.draw(0);
            this.yPos++;
            this.draw(1);
            return true;
        }
        else {
            return false;
        }
    }

    rotate() {
        this.checkRotation();
        this.draw(1);
    }
}