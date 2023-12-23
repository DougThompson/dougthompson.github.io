let game;
let gameOptions = {
    fieldSize: 4,
    gemColors: 7,
    gemSize: 128,
    swapSpeed: 100,
    fallSpeed: 100,
    destroySpeed: 200
}
const HORIZONTAL = 1;
const VERTICAL = 2;
const DEG_90 = Math.PI / 2;
const DEG_180 = Math.PI;
const DEG_270 = DEG_90 + DEG_180;

window.onload = function() {
    let gameConfig = {
        width: 512,
        height: 512,
        scene: playGame,
    }
    game = new Phaser.Game(gameConfig);
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}

class playGame extends Phaser.Scene{
    constructor() {
        super("PlayGame");
    }

    preload() {
        this.load.spritesheet("gemsAll", "assets/sprites/ftm_1.png", {
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
    }

    create() {
        this.canPick = true;
        this.dragging = false;
        this.populateGrid();
        this.scrambleGrid();
        this.drawField();
        this.selectedGem = null;
        this.input.on("pointerdown", this.gemSelect, this);
        this.input.on("pointermove", this.startSwipe, this);
        this.input.on("pointerup", this.stopSwipe, this);
    }

    populateGrid() {
        let gemColor = 0;
        this.gameArray = [];
        for(let i = 0; i < gameOptions.fieldSize; i ++) {
            this.gameArray[i] = [];
            for(let j = 0; j < gameOptions.fieldSize; j ++) {
                let x = gameOptions.gemSize * j + gameOptions.gemSize / 2;
                let y = gameOptions.gemSize * i + gameOptions.gemSize / 2;
                this.gameArray[i][j] = {
                    x: x, y: y,
                    item: {
                        gemColor: gemColor,
                        correctCells: [],
                        rotation: 0,
                        isCorrect: true,
                        gemSprite: null
                    },
                    isEmpty: false
                };
                gemColor++;
            }
        }
    }

    populateGridPattern() {
        this.gameArray = [];
        for(let i = 0; i < gameOptions.fieldSize; i ++) {
            this.gameArray[i] = [];
            for(let j = 0; j < gameOptions.fieldSize; j ++) {
                let x = gameOptions.gemSize * j + gameOptions.gemSize / 2;
                let y = gameOptions.gemSize * i + gameOptions.gemSize / 2;
                if((i == 0 || i == gameOptions.fieldSize - 1)
                    || (j == 0 || j == gameOptions.fieldSize - 1)
                ) {
                    this.gameArray[i][j] = {
                        x: x, y: y,
                        item: {
                            gemColor: 0,
                            correctCells: [],
                            rotation: 0,
                            isCorrect: true,
                            gemSprite: null
                        },
                        isEmpty: false
                    };
                }
                else if((i == 1 || i == gameOptions.fieldSize - 2)
                    || (j == 1 || j == gameOptions.fieldSize - 2)
                ) {
                    this.gameArray[i][j] = {
                        x: x, y: y,
                        item: {
                            gemColor: 1,
                            correctCells: [],
                            rotation: 0,
                            isCorrect: true,
                            gemSprite: null
                        },
                        isEmpty: false
                    };
                }
                else if((i == 2 || i == gameOptions.fieldSize - 3)
                    || (j == 2 || j == gameOptions.fieldSize - 3)
                ) {
                    this.gameArray[i][j] = {
                        x: x, y: y,
                        item: {
                            gemColor: 2,
                            correctCells: [],
                            rotation: 0,
                            isCorrect: true,
                            gemSprite: null
                        },
                        isEmpty: false
                    };
                }
                else if((i == 3 || i == gameOptions.fieldSize - 4)
                    || (j == 3 || j == gameOptions.fieldSize - 4)
                ) {
                    this.gameArray[i][j] = {
                        x: x, y: y,
                        item: {
                            gemColor: 3,
                            correctCells: [],
                            rotation: 0,
                            isCorrect: true,
                            gemSprite: null
                        },
                        isEmpty: false
                    };
                }
            }
        }
    }

    scrambleGrid() {
        let dir = 1.0;
        for(let x = 0; x < 18; x++) {
            for(let i = 0; i < gameOptions.fieldSize - 1; i ++) {
                for(let j = 0; j < gameOptions.fieldSize - 1; j ++) {
                    if(this.getRandomInt(2) == 0) {
                        console.log("i: ", i);
                        console.log("j: ", j);
                        let gem1 = this.gameArray[i][j];
                        let gem2 = this.gameArray[i][j + 1];
                        let gem3 = this.gameArray[i + 1][j + 1];
                        let gem4 = this.gameArray[i + 1][j];

                        let item1 = this.clone(gem1.item);
                        let item2 = this.clone(gem2.item);
                        let item3 = this.clone(gem3.item);
                        let item4 = this.clone(gem4.item);

                        item1.rotation += dir * DEG_90;
                        item2.rotation += dir * DEG_90;
                        item3.rotation += dir * DEG_90;
                        item4.rotation += dir * DEG_90;
                
                        this.gameArray[i][j].item = item4;
                        this.gameArray[i][j + 1].item = item1;
                        this.gameArray[i + 1][j + 1].item = item2;
                        this.gameArray[i + 1][j].item = item3;
                    }
                }
            }
        }
    }

    clone(obj) {
        //return JSON.parse(JSON.stringify(obj));
        return Phaser.Utils.Objects.Clone(obj);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    drawField() {
        this.gemGroup = this.add.group();

        for(let i = 0; i < gameOptions.fieldSize; i ++) {
            for(let j = 0; j < gameOptions.fieldSize; j ++) {
                let ga = this.gameArray[i][j];
                let gem = this.add.sprite(ga.x, ga.y, "gemsAll");
                gem.setRotation(ga.item.rotation);
                ga.item.gemSprite = gem;

                this.gemGroup.add(gem);
                gem.setFrame(ga.item.gemColor);
            }
        }
    }

    gemAt(row, col) {
        if(row < 0 || row >= gameOptions.fieldSize || col < 0 || col >= gameOptions.fieldSize) {
            return -1;
        }
        return this.gameArray[row][col];
    }

    gemSelect(pointer) {
        if(this.canPick) {
            this.dragging = true;
            let row = Math.floor(pointer.y / gameOptions.gemSize);
            let col = Math.floor(pointer.x / gameOptions.gemSize);
            let pickedGem = this.gemAt(row, col)
            if(pickedGem != -1) {
                if(this.selectedGem == null) {
                    pickedGem.item.gemSprite.setScale(1.2);
                    pickedGem.item.gemSprite.setDepth(1);
                    this.selectedGem = pickedGem;
                }
                else{
                    if(this.areTheSame(pickedGem, this.selectedGem)) {
                        this.selectedGem.item.gemSprite.setScale(1);
                        this.selectedGem = null;
                    }
                    else{
                        if(this.areNext(pickedGem, this.selectedGem)) {
                            this.selectedGem.item.gemSprite.setScale(1);
                            this.swapGems(this.selectedGem, pickedGem, true);
                        }
                        else{
                            this.selectedGem.gemSprite.setScale(1);
                            pickedGem.item.gemSprite.setScale(1.2);
                            this.selectedGem = pickedGem;
                        }
                    }
                }
            }
        }
    }

    startSwipe(pointer) {
        if(this.dragging && this.selectedGem != null) {
            let deltaX = pointer.downX - pointer.x;
            let deltaY = pointer.downY - pointer.y;
            let deltaRow = 0;
            let deltaCol = 0;
            if(deltaX > gameOptions.gemSize / 2 && Math.abs(deltaY) < gameOptions.gemSize / 4) {
                deltaCol = -1;
            }
            if(deltaX < -gameOptions.gemSize / 2 && Math.abs(deltaY) < gameOptions.gemSize / 4) {
                deltaCol = 1;
            }
            // if(deltaY > gameOptions.gemSize / 2 && Math.abs(deltaX) < gameOptions.gemSize / 4) {
            //     deltaRow = -1;
            // }
            // if(deltaY < -gameOptions.gemSize / 2 && Math.abs(deltaX) < gameOptions.gemSize / 4) {
            //     deltaRow = 1;
            // }
            if(deltaRow + deltaCol != 0) {
                let pickedGem = this.gemAt(this.getGemRow(this.selectedGem) + deltaRow, this.getGemCol(this.selectedGem) + deltaCol);
                if(pickedGem != -1) {
                    this.selectedGem.item.gemSprite.setScale(1);
                    this.swapGems(this.selectedGem, pickedGem, true);
                    this.dragging = false;
                }
            }
        }
    }

    stopSwipe() {
        this.dragging = false;
    }

    areTheSame(gem1, gem2) {
        return this.getGemRow(gem1) == this.getGemRow(gem2) && this.getGemCol(gem1) == this.getGemCol(gem2);
    }

    getGemRow(gem) {
        return Math.floor(gem.item.gemSprite.y / gameOptions.gemSize);
    }

    getGemCol(gem) {
        return Math.floor(gem.item.gemSprite.x / gameOptions.gemSize);
    }

    areNext(gem1, gem2) {
        // return Math.abs(this.getGemRow(gem1) - this.getGemRow(gem2)) + Math.abs(this.getGemCol(gem1) - this.getGemCol(gem2)) == 1;
        return this.getGemRow(gem1) == this.getGemRow(gem2);
    }

    swapGems(gem1, gem2, animate) {
        this.swappingGems = 4;
        this.canPick = false;
        let dir = 1.0;
        let gem3;
        let gem4;

        let gem1Row = this.getGemRow(gem1);
        let gem1Col = this.getGemCol(gem1);
        let gem2Row = this.getGemRow(gem2);
        let gem2Col = this.getGemCol(gem2);

        if(gem1Row == gem2Row && gem1Col < gem2Col) {
            if(gem1Row < gameOptions.fieldSize - 1) {
                gem3 = this.gemAt(gem1Row + 1, gem1Col + 1);
                gem4 = this.gemAt(gem1Row + 1, gem1Col);
            }
            else {
                gem3 = this.gemAt(gem1Row - 1, gem1Col + 1);
                gem4 = this.gemAt(gem1Row - 1, gem1Col);
            }
        }
        else if(gem1Row == gem2Row && gem1Col > gem2Col) {
            if(gem1Row < gameOptions.fieldSize - 1) {
                gem3 = this.gemAt(gem1Row + 1, gem1Col - 1);
                gem4 = this.gemAt(gem1Row + 1, gem1Col);
                }
            else {
                gem3 = this.gemAt(gem1Row - 1, gem1Col - 1);
                gem4 = this.gemAt(gem1Row - 1, gem1Col);
            }
            dir = -1.0;
        }
        else if(gem1Row < gem2Row && gem1Col == gem2Col) {
            if(gem1Col < gameOptions.fieldSize - 1) {
                gem3 = this.gemAt(gem1Row + 1, gem1Col - 1);
                gem4 = this.gemAt(gem1Row, gem1Col - 1);
            }
            else {
                gem3 = this.gemAt(gem1Row + 1, gem1Col - 1);
                gem4 = this.gemAt(gem1Row, gem1Col - 1);
            }
        }
        else if(gem1Row > gem2Row && gem1Col == gem2Col) {
            if(gem1Col < gameOptions.fieldSize - 1) {
                gem3 = this.gemAt(gem1Row - 1, gem1Col + 1);
                gem4 = this.gemAt(gem1Row, gem1Col + 1);
                }
            else {
                gem3 = this.gemAt(gem1Row - 1, gem1Col - 1);
                gem4 = this.gemAt(gem1Row, gem1Col - 1);
            }
            dir = -1.0;
        }

        let gem3Row = this.getGemRow(gem3);
        let gem3Col = this.getGemCol(gem3);
        let gem4Row = this.getGemRow(gem4);
        let gem4Col = this.getGemCol(gem4);

        let item1 = this.clone(gem1.item);
        let item2 = this.clone(gem2.item);
        let item3 = this.clone(gem3.item);
        let item4 = this.clone(gem4.item);

        item1.rotation += dir * DEG_90;
        item2.rotation += dir * DEG_90;
        item3.rotation += dir * DEG_90;
        item4.rotation += dir * DEG_90;
        item1.gemSprite.setRotation(item1.rotation);
        item2.gemSprite.setRotation(item2.rotation);
        item3.gemSprite.setRotation(item3.rotation);
        item4.gemSprite.setRotation(item4.rotation);

        this.gameArray[gem1Row][gem1Col].item = item4;
        this.gameArray[gem2Row][gem2Col].item = item1;
        this.gameArray[gem3Row][gem3Col].item = item2;
        this.gameArray[gem4Row][gem4Col].item = item3;

        if(animate) {
            this.tweenGem(gem1);
            this.tweenGem(gem2);
            this.tweenGem(gem3);
            this.tweenGem(gem4);
        }
    }

    tweenGem(gem1) {
        let row = this.getGemRow(gem1);
        let col = this.getGemCol(gem1);
        this.tweens.add({
            targets: this.gameArray[row][col].item.gemSprite,
            x: col * gameOptions.gemSize + gameOptions.gemSize / 2,
            y: row * gameOptions.gemSize + gameOptions.gemSize / 2,
            duration: gameOptions.swapSpeed,
            callbackScope: this,
            onComplete: function() {
                this.swappingGems --;
                if(this.swappingGems == 0) {
                    this.canPick = true;
                    this.selectedGem = null;
                }
            }
        });
    }
}

function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
