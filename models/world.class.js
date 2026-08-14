class World {
    character = new Character();
    level = createLevel1();
    canvas; ctx; keyboard;
    camera_x = 0;
    throwableObjects = [];
    gameOver = false;
    gameWon = false;
    bossIntroPlayed = false;
    gameOverImage = new Image();
    winImage = new Image();
    bottleCounter; coinCounter;
    healthBar; bossHealthBar;

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
        this.checkBottlePickups();
        this.checkThrowObjects();
        this.checkBottleCollisions();
        this.checkBossAppearance();
        this.checkBossAttack();
        this.checkPlayerDeath();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(e => {
            if (e) e.world = this;
        });
        this.bottleCounter = new Counter(
            'img/7_statusbars/3_icons/icon_salsa_bottle.png',
            120, 80, 0
        );
        this.coinCounter = new Counter(
            'img/8_coin/coin_1.png', 20, 80, 0
        );
        this.healthBar = new StatusBar();
        this.bossHealthBar = new StatusBar(true);
        this.bossHealthBar.x = 500;
        this.bossHealthBar.y = 20;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.birds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.bottleCounter);
        this.addToMap(this.coinCounter);

        if (this.bossIntroPlayed && !this.gameOver && !this.gameWon)
            this.addToMap(this.bossHealthBar);
        if (this.gameOver) {
            this.showEndScreen(this.gameOverImage);
            return;
        }
        if (this.gameWon) {
            this.showEndScreen(this.winImage);
            return;
        }
        requestAnimationFrame(() => this.draw());
    }

    showEndScreen(image) {
        this.ctx.drawImage(
            image,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        document.body.classList.add('game-ended');
        const touchControls =
            document.getElementById('touchControls');
        const restartButton =
            document.getElementById('restartButton');
        const menuButton =
            document.getElementById('menuButton');
        if (touchControls) {
            touchControls.style.display = 'none';
        }
        if (restartButton) {
            restartButton.style.setProperty(
                'display',
                'block',
                'important'
            );
        }
        if (menuButton) {
            menuButton.style.setProperty(
                'display',
                'block',
                'important'
            );
        }
    }

    addObjectsToMap(objects) {
        if (!objects) return;
        objects.forEach(object => {
            if (object) this.addToMap(object);
        });
    }

    addToMap(object) {
        if (!object) return;
        if (object.otherDirection && object instanceof MovableObject)
            this.flipImage(object);
        object.draw(this.ctx);
        if (object instanceof MovableObject && object.drawFrame)
            object.drawFrame(this.ctx);
        if (object.otherDirection && object instanceof MovableObject)
            this.flipImageBack(object);
    }

    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x *= -1;
    }

    flipImageBack(object) {
        object.x *= -1;
        this.ctx.restore();
    }

    checkCollisions() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) return;
            this.level.enemies.forEach(enemy => {
                if (!enemy || !this.character.isColliding(enemy)) return;
                if (this.isChicken(enemy)) this.handleChicken(enemy);
                if (enemy instanceof Endboss) this.handleBoss(enemy);
            });
        }, 1000 / 60);
    }

    handleChicken(enemy) {
        if (enemy.isDead()) return;
        if (this.character.speedY < 0 &&
            this.character.y + this.character.height <= enemy.y + 60) {
            enemy.hit();
            AudioHub.playOne(AudioHub.CHICKEN_DEAD);
            this.character.speedY = 15;
            return;
        }
        if (!this.character.isHurt()) {
            this.character.hit();
            this.healthBar.setPercentage(this.character.energy);
            this.checkPlayerDeath();
        }
    }

    handleBoss(enemy) {
        if (enemy.isDeadAnimation || !enemy.isAttacking) return;
        if (this.character.isHurt()) return;
        this.character.hit();
        this.healthBar.setPercentage(this.character.energy);
        this.character.x += this.character.x < enemy.x ? -80 : 80;
        this.character.speedY = 15;
        this.checkPlayerDeath();
    }

    isChicken(enemy) {
        return enemy instanceof Chicken;
    }

    checkCoins() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) return;
            this.level.coins.forEach(coin => {
                if (!coin || !this.character.isColliding(coin)) return;
                this.level.coins.splice(
                    this.level.coins.indexOf(coin), 1
                );
                this.coinCounter.increase();
                AudioHub.playOne(AudioHub.COIN);
            });
        }, 1000 / 60);
    }

    checkBottlePickups() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) return;
            this.level.bottles.forEach(bottle => {
                if (!bottle || !this.character.isColliding(bottle)) return;
                this.level.bottles.splice(
                    this.level.bottles.indexOf(bottle), 1
                );
                this.bottleCounter.increase();
                AudioHub.playOne(AudioHub.BOTTLE);
            });
        }, 1000 / 60);
    }

    checkThrowObjects() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) return;
            if (!this.keyboard.D || this.bottleCounter.count <= 0) return;
            let bottle = new ThrowableObject(
                this.character.x + 100,
                this.character.y + 100
            );
            bottle.otherDirection = this.character.otherDirection;
            this.throwableObjects.push(bottle);
            this.bottleCounter.decrease();
            this.keyboard.D = false;
        }, 200);
    }

    checkBottleCollisions() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) return;
            this.throwableObjects.forEach(bottle => {
                if (!bottle) return;
                this.level.enemies.forEach(enemy => {
                    if (bottle.isColliding(enemy))
                        this.hitEnemy(enemy, bottle);
                });
            });
        }, 1000 / 60);
    }

    hitEnemy(enemy, bottle) {
        enemy.hit();
        this.removeBottle(bottle);
        if (enemy instanceof Endboss) {
            this.bossHealthBar.setPercentage(enemy.energy);
            if (enemy.isDead())
                this.waitForBossDeath(enemy);
        }
    }

    removeBottle(bottle) {
        let index = this.throwableObjects.indexOf(bottle);
        if (index !== -1)
            this.throwableObjects.splice(index, 1);
    }

    waitForBossDeath(boss) {
        let wait = setInterval(() => {
            if (!boss.deadAnimationFinished) return;
            clearInterval(wait);
            setTimeout(() => {
                AudioHub.playOne(AudioHub.BOSS_WIN);
                this.gameWon = true;
            }, 1500);
        }, 50);
    }

    checkBossAppearance() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) return;
            let boss = this.getBoss();
            if (!boss || this.character.x <= 2500) return;
            if (this.bossIntroPlayed) return;
            this.bossIntroPlayed = true;
            AudioHub.playOne(AudioHub.BOSS_APPEAR);
        }, 100);
    }

    getBoss() {
        return this.level.enemies.find(
            enemy => enemy instanceof Endboss
        );
    }

    checkBossAttack() {
        setInterval(() => {
            if (this.gameOver || this.gameWon) return;
            let boss = this.getBoss();
            if (!boss || boss.isDeadAnimation) return;
            let distance = Math.abs(this.character.x - boss.x);
            if (distance <= 350 && !boss.isAttacking) {
                boss.attack(this.character);
                return;
            }
            this.moveBoss(boss);
        }, 100);
    }

    moveBoss(boss) {
        if (boss.patrolDirection === 'left') {
            boss.moveLeft(3);
            if (boss.x <= boss.minX)
                boss.patrolDirection = 'right';
            return;
        }
        boss.moveRight(3);
        if (boss.x >= boss.maxX)
            boss.patrolDirection = 'left';
    }

    checkPlayerDeath() {
        if (!this.character.isDead() ||
            this.gameOver || this.gameWon) return;
        this.gameOver = true;
        this.character.walking_sound.pause();
        AudioHub.playOne(AudioHub.GAME_OVER);
    }
}