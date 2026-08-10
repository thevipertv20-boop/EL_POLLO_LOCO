class World {

    character = new Character();
    statusBar = new StatusBar();
    coinBar = new CoinBar();
    level = createLevel1();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    gameOver = false;
    gameWon = false;
    gameOverImage = new Image();
    winImage = new Image();
    deathAnimationStarted = false;


    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.gameOverImage.src = 'img/You won, you lost/Game Over.png';
        this.winImage.src = 'img/You won, you lost/You Win A.png';
        this.setWorld();
        this.draw();
        this.checkCollisions();
        this.checkCoins();
        this.checkThrowObjects();
        this.checkBottleCollisions();
    }


    setWorld() {
        this.character.world = this;
    }


    checkCollisions() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) return;
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                    if (this.character.isDead() && !this.deathAnimationStarted) {
                        this.deathAnimationStarted = true;
                        setTimeout(() => {
                            this.gameOver = true;
                            document.getElementById("restartButton").style.display = "block";
                        }, 1500);
                    }
                }
            });
        }, 1000 / 60);
    }


    checkCoins() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) return;
            this.level.coins.forEach((coin) => {
                if (this.character.isColliding(coin)) {
                    this.level.coins.splice(this.level.coins.indexOf(coin), 1);
                    this.coinBar.setPercentage(
                        Math.min(this.coinBar.percentage + 5, 100)
                    );
                }
            });
        }, 1000 / 60);
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        if (this.gameOver) {
            this.ctx.drawImage(
                this.gameOverImage,
                0, 0,
                this.canvas.width,
                this.canvas.height
            );
        }
        if (this.gameWon) {
            this.ctx.drawImage(
                this.winImage,
                0, 0,
                this.canvas.width,
                this.canvas.height
            );
        }
        requestAnimationFrame(() => this.draw());
    }


    addObjectsToMap(objects) {
        objects.forEach((object) => this.addToMap(object));
    }


    addToMap(object) {
        if (object.otherDirection) {
            this.ctx.save();
            this.ctx.translate(object.width, 0);
            this.ctx.scale(-1, 1);
            object.x *= -1;
        }
        object.draw(this.ctx);
        if (object.drawFrame) {
            object.drawFrame(this.ctx);
        }
        if (object.otherDirection) {
            object.x *= -1;
            this.ctx.restore();
        }
    }


    checkThrowObjects() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) return;
            if (this.keyboard.D) {
                let bottle = new ThrowableObject(
                    this.character.x + 100,
                    this.character.y + 100
                );
                this.throwableObjects.push(bottle);
            }
        }, 200);
    }


    checkBottleCollisions() {
        setInterval(() => {
            this.throwableObjects.forEach((bottle) => {
                this.level.enemies.forEach((enemy) => {
                    if (
                        bottle.isColliding(enemy) &&
                        enemy instanceof Endboss
                    ) {
                        enemy.hit();
                        this.throwableObjects.splice(
                            this.throwableObjects.indexOf(bottle),
                            1
                        );
                        if (enemy.energy <= 0) {
                            this.gameWon = true;
                            document.getElementById("restartButton").style.display = "block";
                        }
                    }
                });
            });
        }, 1000 / 60);
    }
}