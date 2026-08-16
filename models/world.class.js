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
    gamePaused = false;
    bossIntroPlayed = false;
    gameOverImage = new Image();
    winImage = new Image();
    bottleCounter;
    coinCounter;
    healthBar;
    bossHealthBar;

    // NEU: sammelt alle setInterval-IDs, damit destroy() sie stoppen kann.
    intervalIds = [];
    destroyed = false;

    // NEU: Cooldown-Timestamp fürs Flaschenwerfen (ersetzt den 200ms-Poll).
    lastThrowTime = 0;

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

    // NEU: räumt alle laufenden Intervals auf. Wird bei jedem Neustart /
    // Rückkehr zum Menü aufgerufen, BEVOR eine neue World erzeugt wird.
    // Ohne das würden bei jedem Neustart (ohne Seiten-Reload) zusätzliche
    // Kollisions-/Coin-/Boss-Loops im Hintergrund weiterlaufen.
    destroy() {
        this.destroyed = true;
        this.intervalIds.forEach(id => clearInterval(id));
        this.intervalIds = [];
        if (this.character) {
            this.character.destroy();
        }
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            if (enemy) enemy.world = this;
        });
        this.bottleCounter = new Counter(
            'img/7_statusbars/3_icons/icon_salsa_bottle.png',
            120, 80, 0
        );
        this.coinCounter = new Counter(
            'img/8_coin/coin_1.png',
            20, 80, 0
        );
        this.healthBar = new StatusBar();
        this.bossHealthBar = new StatusBar(true);
        this.bossHealthBar.x = 500;
        this.bossHealthBar.y = 20;
    }

    draw() {
        // NEU: sobald destroy() aufgerufen wurde, keine weiteren Frames
        // mehr zeichnen (verhindert, dass eine alte World nach dem
        // Neustart im Hintergrund weiterzeichnet).
        if (this.destroyed) return;

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
        if (this.bossIntroPlayed && !this.gameOver && !this.gameWon) {
            this.addToMap(this.bossHealthBar);
        }
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
            image, 0, 0,
            this.canvas.width, this.canvas.height
        );
        document.body.classList.add('game-ended');
        let touchControls = document.getElementById('touchControls');
        let restartButton = document.getElementById('restartButton');
        let menuButton = document.getElementById('menuButton');
        if (touchControls) {
            touchControls.style.display = 'none';
        }
        if (restartButton) {
            restartButton.style.setProperty('display', 'block', 'important');
        }
        if (menuButton) {
            menuButton.style.setProperty('display', 'block', 'important');
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
        if (object.otherDirection && object instanceof MovableObject) {
            this.flipImage(object);
        }
        object.draw(this.ctx);
        if (object.otherDirection && object instanceof MovableObject) {
            this.flipImageBack(object);
        }
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
        const id = setInterval(() => {
            if (this.destroyed) return;
            if (this.gameOver || this.gameWon || this.gamePaused) return;
            this.level.enemies.forEach(enemy => {
                if (!enemy) return;
                if (this.isChicken(enemy)) {
                    this.handleChicken(enemy);
                    return;
                }
                if (
                    enemy instanceof Endboss &&
                    this.character.isColliding(enemy)
                ) {
                    this.handleBoss(enemy);
                }
            });
        }, 1000 / 60);
        this.intervalIds.push(id);
    }

    /**
 * Prüft die Kollision zwischen Pepe und einem Chicken.
 *
 * Pepe bekommt nur Schaden bei einer seitlichen Kollision.
 * Wenn Pepe von oben auf das Chicken trifft, wird das Chicken
 * getötet und Pepe bekommt keinen Schaden.
 */
handleChicken(enemy) {
    if (enemy.isDead()) return;

    // ==========================================
    // PEPE-HITBOX
    // ==========================================

    const characterLeft =
        this.character.x + 35;

    const characterRight =
        this.character.x +
        this.character.width - 35;

    const characterTop =
        this.character.y + 10;

    const characterBottom =
        this.character.y +
        this.character.height;


    // ==========================================
    // HUHN-HITBOX
    // ==========================================

    const chickenLeft =
        enemy.x + 10;

    const chickenRight =
        enemy.x +
        enemy.width - 10;

    const chickenTop =
        enemy.y;

    const chickenBottom =
        enemy.y +
        enemy.height;


    // ==========================================
    // ECHTE KOLLISION X + Y
    // ==========================================

    const horizontalCollision =
        characterRight > chickenLeft &&
        characterLeft < chickenRight;

    const verticalCollision =
        characterBottom > chickenTop &&
        characterTop < chickenBottom;

    if (
        !horizontalCollision ||
        !verticalCollision
    ) {
        return;
    }


    // ==========================================
    // PEPE KOMMT VON OBEN
    // ==========================================

    const isFalling =
        this.character.speedY < 0;

    const isAboveChicken =
        characterBottom <=
        chickenTop + 50;

    if (
        isFalling &&
        isAboveChicken
    ) {

        enemy.hit();

        if (enemy.isDead()) {
            AudioHub.playOne(
                AudioHub.CHICKEN_DEAD
            );
        }

        // KEIN automatischer Sprung
        // KEIN speedY = 15
        // KEIN Verschieben von Pepe

        return;
    }


    // ==========================================
    // SEITLICHE KOLLISION
    // ==========================================

    if (!this.character.isHurt()) {

        this.character.hit();

        this.healthBar.setPercentage(
            this.character.energy
        );

        this.checkPlayerDeath();
    }
}

    handleBoss(enemy) {
    if (enemy.isDeadAnimation || !enemy.isAttacking) return;
    if (this.character.isHurt()) return;

    this.character.hit();

    this.healthBar.setPercentage(
        this.character.energy
    );

    // Rückstoß durch den Boss
    if (this.character.x < enemy.x) {
        this.character.x -= 80;
    } else {
        this.character.x += 80;
    }

    // Linke Levelgrenze
    if (this.character.x < 0) {
        this.character.x = 0;
    }

    // Rechte Levelgrenze
    const maxX =
        this.level.level_end_x -
        this.character.width;

    if (this.character.x > maxX) {
        this.character.x = maxX;
    }

    this.character.speedY = 15;

    this.checkPlayerDeath();
}

    isChicken(enemy) {
        return enemy instanceof Chicken;
    }

    checkCoins() {
        const id = setInterval(() => {
            if (this.destroyed) return;
            if (this.gameOver || this.gameWon || this.gamePaused) return;
            this.level.coins.forEach(coin => {
                if (!coin || !this.character.isColliding(coin)) return;
                this.level.coins.splice(
                    this.level.coins.indexOf(coin), 1
                );
                this.coinCounter.increase();
                AudioHub.playOne(AudioHub.COIN);
            });
        }, 1000 / 60);
        this.intervalIds.push(id);
    }

    checkBottlePickups() {
        const id = setInterval(() => {
            if (this.destroyed) return;
            if (this.gameOver || this.gameWon || this.gamePaused) return;
            this.level.bottles.forEach(bottle => {
                if (!bottle) return;
                const characterX = this.character.x + 35;
                const characterY = this.character.y + 80;
                const characterWidth = this.character.width - 70;
                const characterHeight = this.character.height - 80;
                const colliding =
                    characterX + characterWidth > bottle.x &&
                    characterX < bottle.x + bottle.width &&
                    characterY + characterHeight > bottle.y &&
                    characterY < bottle.y + bottle.height;
                if (!colliding) return;
                this.level.bottles.splice(
                    this.level.bottles.indexOf(bottle),
                    1
                );
                this.bottleCounter.increase();
                AudioHub.playOne(AudioHub.BOTTLE);
            });
        }, 1000 / 60);
        this.intervalIds.push(id);
    }

    /**
     * Fix: lief vorher nur alle 200ms. Ein kurzer Touch-Tap (< 200ms
     * gehalten) konnte dadurch komplett übersehen werden, weil keyboard.D
     * schon wieder auf false stand, bevor der Poll überhaupt lief -
     * daher musste man auf Mobilgeräten mehrfach drücken.
     * Jetzt: Poll im 60fps-Takt wie die anderen Checks, Mehrfachwürfe
     * werden stattdessen über einen Zeit-Cooldown verhindert.
     */
    checkThrowObjects() {
        const id = setInterval(() => {
            if (this.destroyed) return;
            if (this.gameOver || this.gameWon || this.gamePaused) return;
            if (!this.keyboard.D || this.bottleCounter.count <= 0) return;

            const now = Date.now();
            if (now - this.lastThrowTime < 400) return;
            this.lastThrowTime = now;

            let bottle = new ThrowableObject(
                this.character.x + 100,
                this.character.y + 100
            );
            bottle.otherDirection = this.character.otherDirection;
            this.throwableObjects.push(bottle);
            this.bottleCounter.decrease();
        }, 1000 / 60);
        this.intervalIds.push(id);
    }

    checkBottleCollisions() {
        const id = setInterval(() => {
            if (this.destroyed) return;
            if (this.gameOver || this.gameWon || this.gamePaused) return;
            this.throwableObjects.forEach(bottle => {
                if (!bottle) return;
                this.level.enemies.forEach(enemy => {
                    if (bottle.isColliding(enemy)) {
                        this.hitEnemy(enemy, bottle);
                    }
                });
            });
        }, 1000 / 60);
        this.intervalIds.push(id);
    }

    hitEnemy(enemy, bottle) {
        enemy.hit();
        this.removeBottle(bottle);
        if (enemy instanceof Endboss) {
            this.bossHealthBar.setPercentage(enemy.energy);
            if (enemy.isDead()) {
                this.waitForBossDeath(enemy);
            }
        }
    }

    removeBottle(bottle) {
        let index = this.throwableObjects.indexOf(bottle);
        if (index !== -1) {
            this.throwableObjects.splice(index, 1);
        }
    }

    waitForBossDeath(boss) {
        let wait = setInterval(() => {
            if (this.destroyed) {
                clearInterval(wait);
                return;
            }
            if (!boss.deadAnimationFinished) return;
            clearInterval(wait);
            setTimeout(() => {
                if (this.destroyed) return;
                AudioHub.playOne(AudioHub.BOSS_WIN);
                this.gameWon = true;
            }, 1500);
        }, 50);
        this.intervalIds.push(wait);
    }

    checkBossAppearance() {
        const id = setInterval(() => {
            if (this.destroyed) return;
            if (this.gameOver || this.gameWon) return;
            let boss = this.getBoss();
            if (!boss || this.character.x <= 2500) return;
            if (this.bossIntroPlayed) return;
            this.bossIntroPlayed = true;
            AudioHub.playOne(AudioHub.BOSS_APPEAR);
        }, 100);
        this.intervalIds.push(id);
    }

    getBoss() {
        return this.level.enemies.find(
            enemy => enemy instanceof Endboss
        );
    }

    checkBossAttack() {
        const id = setInterval(() => {
            if (this.destroyed) return;
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
        this.intervalIds.push(id);
    }

    moveBoss(boss) {
        if (boss.patrolDirection === 'left') {
            boss.moveLeft(3);
            if (boss.x <= boss.minX) {
                boss.patrolDirection = 'right';
            }
            return;
        }

        boss.moveRight(3);
        if (boss.x >= boss.maxX) {
            boss.patrolDirection = 'left';
        }
    }

    checkPlayerDeath() {
        if (!this.character.isDead() || this.gameOver || this.gameWon) {
            return;
        }
        this.gameOver = true;
        this.character.walking_sound.pause();
        AudioHub.playOne(AudioHub.GAME_OVER);
    }
}