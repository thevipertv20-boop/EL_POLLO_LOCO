class World {

    character = new Character();
    level = createLevel1();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    gameOver = false;
    gameWon = false;
    maxHearts = 5;
    bossIntroPlayed = false;
    gameOverImage = new Image();
    winImage = new Image();
    bottleCounter;
    coinCounter;
    healthBar;
    bossHealthCounter;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.gameOverImage = new Image();
        this.winImage = new Image();
        this.gameOverImage.src = 'img/You won, you lost/Game Over.png';
        this.winImage.src = 'img/You won, you lost/You Win A.png';
        this.setWorld();
        this.draw();
        this.checkCollisions();
        this.checkCoins();
        this.checkBottlePickups();
        this.checkThrowObjects();
        this.checkBottleCollisions();
        this.checkBossAppearance();
    }


    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            if (enemy) {
                enemy.world = this;
            }
        });
        this.bottleCounter = new Counter('img/7_statusbars/3_icons/icon_salsa_bottle.png',
            20,
            80,
            0
        );
        this.healthBar = new StatusBar();
        this.coinCounter = new Counter('img/8_coin/coin_1.png',
            240,
            20,
            0
        );
        this.bossHealthBar = new StatusBar(true);
        this.bossHealthBar.x = 500;
        this.bossHealthBar.y = 20;
    }

    draw() {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.bottleCounter);
        this.addToMap(this.coinCounter);
        this.addToMap(this.bossHealthBar);
        if (this.gameOver) {
            this.ctx.drawImage(
                this.gameOverImage,
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
            document.getElementById('restartButton').style.display = 'block';
        }
        if (this.gameWon) {
            this.ctx.drawImage(
                this.winImage,
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
            document.getElementById('restartButton').style.display = 'block';
        }

        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        if (!objects) return;
        objects.forEach(object => {
            if (object) {
                this.addToMap(object);
            }
        });
    }

    addToMap(object) {
        if (!object) return;
        if (
            object.otherDirection &&
            object instanceof MovableObject
        ) {
            this.flipImage(object);
        }
        object.draw(this.ctx);
        if (
            object instanceof MovableObject &&
            object.drawFrame
        ) {
            object.drawFrame(this.ctx);
        }
        if (
            object.otherDirection &&
            object instanceof MovableObject
        ) {
            this.flipImageBack(object);
        }
    }

    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(
            object.width,
            0
        );
        this.ctx.scale(
            -1,
            1
        );
        object.x =
            object.x * -1;
    }

    flipImageBack(object) {
        object.x =
            object.x * -1;
        this.ctx.restore();
    }

    checkCollisions() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) {
                return;
            }
            this.level.enemies.forEach(enemy => {
                if (!enemy) return;
                if (
                    !this.character.isColliding(enemy)
                ) {
                    return;
                }
                if (
                    this.isChicken(enemy)
                ) {
                    if (
                        !enemy.isDead() &&
                        this.character.speedY < 0 &&
                        this.character.y +
                        this.character.height
                        <= enemy.y + 60
                    ) {
                        enemy.hit();
                        this.character.speedY = 15;
                        setTimeout(() => {
                            let index =
                                this.level.enemies
                                    .indexOf(enemy);
                            if (index !== -1) {
                                this.level.enemies
                                    .splice(index, 1);
                            }
                        }, 1000);
                        return;
                    }
                    if (
                        !enemy.isDead() &&
                        !this.character.isHurt()
                    ) {
                        this.character.hit();
                        this.healthBar.setPercentage(
                            this.character.energy
                        );
                        this.checkPlayerDeath();
                        return;
                    }
                }
                if (
                    enemy instanceof Endboss &&
                    !enemy.isDead() &&
                    !this.character.isHurt()
                ) {
                    this.character.hit();
                    this.healthBar.setPercentage(
                        this.character.energy
                    );
                    this.checkPlayerDeath();
                    return;
                }
            });
        }, 1000 / 60);
    }

    isChicken(enemy) {
        return enemy instanceof Chicken;
    }

    checkCoins() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) {
                return;
            }
            if (!this.level.coins) return;
            this.level.coins.forEach((coin) => {
                if (!coin) return;
                if (this.character.isColliding(coin)) {
                    let index = this.level.coins.indexOf(coin);
                    if (index !== -1) {
                        this.level.coins.splice(index, 1);
                    }
                    this.coinCounter.increase();
                    if (typeof AudioHub !== 'undefined') {
                        AudioHub.playOne(AudioHub.COIN);
                    }
                }
            });
        }, 1000 / 60);
    }

    checkBottlePickups() {
        setInterval(() => {
            if (
                this.gameOver ||
                this.gameWon
            ) {
                return;
            }
            if (!this.level.bottles) return;
            this.level.bottles.forEach(bottle => {
                if (!bottle) return;
                if (
                    this.character.isColliding(bottle)
                ) {
                    let index =
                        this.level.bottles
                            .indexOf(bottle);
                    if (index !== -1) {
                        this.level.bottles
                            .splice(index, 1);
                    }
                    this.bottleCounter.increase();
                    if (
                        typeof AudioHub !== 'undefined'
                    ) {
                        AudioHub.playOne(
                            AudioHub.BOTTLE
                        );
                    }
                }
            });
        }, 1000 / 60);
    }

    checkThrowObjects() {
        setInterval(() => {
            if (
                this.gameOver ||
                this.gameWon
            ) {
                return;
            }
            if (
                this.keyboard.D &&
                this.bottleCounter
            ) {
                if (
                    this.bottleCounter.count > 0
                ) {
                    let bottle =
                        new ThrowableObject(
                            this.character.x +
                            100,
                            this.character.y +
                            100
                        );
                    bottle.otherDirection =
                        this.character.otherDirection;
                    this.throwableObjects.push(
                        bottle
                    );
                    this.bottleCounter.decrease();
                    this.keyboard.D = false;
                }
            }
        }, 200);
    }

    checkBottleCollisions() {
        setInterval(() => {
            if (
                this.gameOver ||
                this.gameWon
            ) {
                return;
            }
            this.throwableObjects.forEach(
                bottle => {
                    if (!bottle) return;
                    this.level.enemies.forEach(
                        enemy => {
                            if (!enemy) return;
                            if (
                                bottle.isColliding(
                                    enemy
                                )
                            ) {
                                if (enemy instanceof Endboss) {
                                    enemy.hit();
                                    if (this.bossHealthBar) {
                                        this.bossHealthBar.setPercentage(enemy.energy);
                                    }
                                    let index = this.throwableObjects.indexOf(bottle);
                                    if (index !== -1) {
                                        this.throwableObjects.splice(index, 1);
                                    }
                                    if (enemy.isDead()) {
                                        this.gameWon = true;
                                    }
                                } else {
                                    enemy.hit();
                                    let index =
                                        this.throwableObjects
                                            .indexOf(bottle);
                                    if (index !== -1) {
                                        this.throwableObjects
                                            .splice(index, 1);
                                    }
                                }
                            }
                        }
                    );
                }
            );
        }, 1000 / 60);
    }

    checkBossAppearance() {
        setInterval(() => {
            if (
                this.gameOver ||
                this.gameWon
            ) {
                return;
            }
            let boss =
                this.level.enemies.find(
                    enemy =>
                        enemy instanceof Endboss
                );
            if (!boss) return;
            if (
                this.character.x > 2500 &&
                !this.bossIntroPlayed
            ) {
                this.bossIntroPlayed = true;
                if (
                    typeof AudioHub !== 'undefined' &&
                    AudioHub.BOSS_APPEAR
                ) {
                    AudioHub.playOne(
                        AudioHub.BOSS_APPEAR
                    );
                }
            }
        }, 100);
    }

    checkPlayerDeath() {
        if (
            this.character.isDead()
        ) {
            if (this.gameOver) return;
            this.gameOver = true;
            this.character.walking_sound.pause();
        }
    }
}