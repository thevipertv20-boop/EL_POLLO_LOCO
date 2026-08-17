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
    intervalIds = [];
    destroyed = false;
    lastThrowTime = 0;

    /**
     * Creates the world and starts all game systems.
     * @param {HTMLCanvasElement} canvas - Game canvas.
     * @param {Keyboard} keyboard - Keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.loadEndScreenImages();
        this.setWorld();
        this.startGameSystems();
    }

    /**
     * Loads the game over and win screen images.
     */
    loadEndScreenImages() {
        this.gameOverImage.src = 'img/You won, you lost/Game Over.png';
        this.winImage.src = 'img/You won, you lost/You Win A.png';
    }

    /**
     * Starts drawing and all collision and gameplay checks.
     */
    startGameSystems() {
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

    /**
     * Destroys the world and clears running intervals.
     */
    destroy() {
        this.destroyed = true;
        this.clearIntervals();
        if (this.character) {
            this.character.destroy();
        }
    }

    /**
     * Clears all registered world intervals.
     */
    clearIntervals() {
        this.intervalIds.forEach(id => clearInterval(id));
        this.intervalIds = [];
    }

    /**
     * Connects the character and enemies to this world.
     */
    setWorld() {
        this.character.world = this;
        this.connectEnemies();
        this.createStatusBars();
    }

    /**
     * Connects all enemies to the current world.
     */
    connectEnemies() {
        this.level.enemies.forEach(enemy => {
            if (enemy) {
                enemy.world = this;
            }
        });
    }

    /**
 * Creates all counters and status bars.
 */
    createStatusBars() {
        this.createCounters();
        this.createHealthBars();
    }

    /**
     * Creates the bottle and coin counters.
     */
    createCounters() {
        this.bottleCounter = new Counter(
            'img/7_statusbars/3_icons/icon_salsa_bottle.png',
            120,
            80,
            0
        );
        this.coinCounter = new Counter(
            'img/8_coin/coin_1.png',
            20,
            80,
            0
        );
    }

    /**
     * Creates the player and boss health bars.
     */
    createHealthBars() {
        this.healthBar = new StatusBar();
        this.bossHealthBar = new StatusBar(true);
        this.bossHealthBar.x = 500;
        this.bossHealthBar.y = 20;
    }

    /**
     * Draws the current game state.
     */
    draw() {
        if (this.destroyed) return;
        this.prepareCanvas();
        this.drawWorldObjects();
        this.drawStatusBars();
        if (this.showGameEnd()) return;
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Prepares the canvas for the next frame.
     */
    prepareCanvas() {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        this.ctx.translate(this.camera_x, 0);
    }

    /**
     * Draws all game objects.
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.birds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws all status bars and counters.
     */
    drawStatusBars() {
        this.addToMap(this.healthBar);
        this.addToMap(this.bottleCounter);
        this.addToMap(this.coinCounter);
        if (this.bossIntroPlayed && !this.gameOver && !this.gameWon) {
            this.addToMap(this.bossHealthBar);
        }
    }

    /**
     * Shows the game end screen when the game is finished.
     * @returns {boolean} True when an end screen is shown.
     */
    showGameEnd() {
        if (this.gameOver) {
            this.showEndScreen(this.gameOverImage);
            return true;
        }
        if (this.gameWon) {
            this.showEndScreen(this.winImage);
            return true;
        }
        return false;
    }

    /**
 * Shows the selected end screen.
 * @param {HTMLImageElement} image - Image to display.
 */
    showEndScreen(image) {
        this.ctx.drawImage(
            image,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        document.body.classList.add('game-ended');
        this.showEndButtons();
        this.hideTouchControls();
    }

    /**
 * Shows the buttons of the end screen.
 */
    showEndButtons() {
        const restartButton =
            document.getElementById('restartButton');
        const menuButton =
            document.getElementById('menuButton');
        if (restartButton) {
            restartButton.style.display = 'block';
        }
        if (menuButton) {
            menuButton.style.display = 'block';
        }
    }

    /**
     * Hides the mobile touch controls.
     */
    hideTouchControls() {
        const touchControls = document.getElementById('touchControls');
        if (touchControls) {
            touchControls.style.display = 'none';
        }
    }

    /**
     * Adds multiple objects to the game map.
     * @param {DrawableObject[]} objects - Objects to draw.
     */
    addObjectsToMap(objects) {
        if (!objects) return;
        objects.forEach(object => {
            if (object) {
                this.addToMap(object);
            }
        });
    }

    /**
     * Draws one object and handles its direction.
     * @param {DrawableObject} object - Object to draw.
     */
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

    /**
     * Flips a moving object horizontally.
     * @param {MovableObject} object - Object to flip.
     */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x *= -1;
    }

    /**
     * Restores the object position after flipping.
     * @param {MovableObject} object - Object to restore.
     */
    flipImageBack(object) {
        object.x *= -1;
        this.ctx.restore();
    }

    /**
     * Checks collisions between the character and enemies.
     */
    checkCollisions() {
        const id = setInterval(() => {
            if (this.isGameInactive()) return;
            this.level.enemies.forEach(enemy => {
                if (!enemy) return;
                this.handleEnemyCollision(enemy);
            });
        }, 1000 / 60);
        this.intervalIds.push(id);
    }

    /**
     * Checks whether collision systems should pause.
     * @returns {boolean} True when collision processing is inactive.
     */
    isGameInactive() {
        return (
            this.destroyed ||
            this.gameOver ||
            this.gameWon ||
            this.gamePaused
        );
    }

    /**
     * Handles collision with one enemy.
     * @param {MovableObject} enemy - Enemy to check.
     */
    handleEnemyCollision(enemy) {
        if (this.isChicken(enemy)) {
            this.handleChicken(enemy);
            return;
        }
        this.handleBossCollision(enemy);
    }

    /**
 * Checks whether an enemy is a chicken.
 * @param {MovableObject} enemy - Enemy to check.
 * @returns {boolean} True when the enemy is a chicken.
 */
    isChicken(enemy) {
        return enemy instanceof Chicken;
    }

    /**
     * Handles a boss collision.
     * @param {MovableObject} enemy - Enemy to check.
     */
    handleBossCollision(enemy) {
        if (!(enemy instanceof Endboss)) return;
        if (this.character.isColliding(enemy)) {
            this.handleBoss(enemy);
        }
    }

    /**
     * Handles collision with a chicken.
     * @param {Chicken} enemy - Chicken to check.
     */
    handleChicken(enemy) {
        if (enemy.isDead()) return;
        if (!this.isChickenCollision(enemy)) return;
        if (this.isCharacterAboveChicken(enemy)) {
            this.defeatChicken(enemy);
            return;
        }
        this.damageCharacter();
    }

    /**
     * Checks whether the character collides with a chicken.
     * @param {Chicken} enemy - Chicken to check.
     * @returns {boolean} True when a collision occurs.
     */
    isChickenCollision(enemy) {
        const character = this.getCharacterBounds();
        const chicken = this.getChickenBounds(enemy);
        return (
            character.right > chicken.left &&
            character.left < chicken.right &&
            character.bottom > chicken.top &&
            character.top < chicken.bottom
        );
    }

    /**
     * Gets the character collision boundaries.
     * @returns {Object} Character collision boundaries.
     */
    getCharacterBounds() {
        return {
            left: this.character.x + 35,
            right: this.character.x + this.character.width - 35,
            top: this.character.y + 10,
            bottom: this.character.y + this.character.height
        };
    }

    /**
     * Gets the chicken collision boundaries.
     * @param {Chicken} enemy - Chicken to measure.
     * @returns {Object} Chicken collision boundaries.
     */
    getChickenBounds(enemy) {
        return {
            left: enemy.x + 10,
            right: enemy.x + enemy.width - 10,
            top: enemy.y,
            bottom: enemy.y + enemy.height
        };
    }

    /**
     * Checks whether the character lands on a chicken.
     * @param {Chicken} enemy - Chicken being jumped on.
     * @returns {boolean} True when the character is falling onto the chicken.
     */
    isCharacterAboveChicken(enemy) {
        const bounds = this.getCharacterBounds();
        return (
            this.character.speedY < 0 &&
            bounds.bottom <= enemy.y + 50
        );
    }

    /**
     * Defeats a chicken and plays the death sound.
     * @param {Chicken} enemy - Chicken to defeat.
     */
    defeatChicken(enemy) {
        enemy.hit();
        if (enemy.isDead()) {
            AudioHub.playOne(AudioHub.CHICKEN_DEAD);
        }
    }

    /**
     * Damages the character after an enemy collision.
     */
    damageCharacter() {
        if (this.character.isHurt()) return;
        this.character.hit();
        this.healthBar.setPercentage(this.character.energy);
        this.checkPlayerDeath();
    }

    /**
     * Handles collision damage from the boss.
     * @param {Endboss} enemy - Boss causing the damage.
     */
    handleBoss(enemy) {
        if (enemy.isDeadAnimation || !enemy.isAttacking) return;
        if (this.character.isHurt()) return;
        this.damageBossCollision(enemy);
        this.pushCharacterFromBoss(enemy);
        this.checkPlayerDeath();
    }

    /**
     * Applies damage while the boss attacks.
     * @param {Endboss} enemy - Boss causing damage.
     */
    damageBossCollision(enemy) {
        this.character.hit();
        this.healthBar.setPercentage(this.character.energy);
    }

    /**
     * Pushes the character away from the boss.
     * @param {Endboss} enemy - Boss causing the push.
     */
    pushCharacterFromBoss(enemy) {
        if (this.character.x < enemy.x) {
            this.character.x -= 80;
        } else {
            this.character.x += 80;
        }
        this.limitCharacterPosition();
        this.character.speedY = 15;
    }

    /**
     * Keeps the character inside the game level boundaries.
     */
    limitCharacterPosition() {
        if (this.character.x < 0) {
            this.character.x = 0;
        }
        const maxX = this.level.level_end_x - this.character.width;
        if (this.character.x > maxX) {
            this.character.x = maxX;
        }
    }

    /**
     * Checks and collects coins.
     */
    checkCoins() {
        const id = setInterval(() => {
            if (this.isGameInactive()) return;
            this.level.coins.forEach(coin => {
                if (coin && this.character.isColliding(coin)) {
                    this.collectCoin(coin);
                }
            });
        }, 1000 / 60);
        this.intervalIds.push(id);
    }

    /**
     * Collects one coin and updates the counter.
     * @param {Coin} coin - Coin to collect.
     */
    collectCoin(coin) {
        const index = this.level.coins.indexOf(coin);
        if (index === -1) return;
        this.level.coins.splice(index, 1);
        this.coinCounter.increase();
        AudioHub.playOne(AudioHub.COIN);
    }

    /**
     * Checks and collects bottles.
     */
    checkBottlePickups() {
        const id = setInterval(() => {
            if (this.isGameInactive()) return;
            this.level.bottles.forEach(bottle => {
                if (bottle && this.character.isColliding(bottle)) {
                    this.collectBottle(bottle);
                }
            });
        }, 1000 / 60);
        this.intervalIds.push(id);
    }

    /**
     * Collects one bottle and updates the counter.
     * @param {Bottle} bottle - Bottle to collect.
     */
    collectBottle(bottle) {
        const index = this.level.bottles.indexOf(bottle);
        if (index === -1) return;
        this.level.bottles.splice(index, 1);
        this.bottleCounter.increase();
        AudioHub.playOne(AudioHub.BOTTLE);
    }

    /**
     * Checks input for throwing bottles.
     */
    checkThrowObjects() {
        const id = setInterval(() => {
            if (this.isGameInactive()) return;
            if (!this.canThrowBottle()) return;
            this.throwBottle();
        }, 1000 / 60);
        this.intervalIds.push(id);
    }

    /**
     * Checks whether the player can throw a bottle.
     * @returns {boolean} True when a bottle can be thrown.
     */
    canThrowBottle() {
        if (!this.keyboard.D) return false;
        if (this.bottleCounter.count <= 0) return false;
        const now = Date.now();
        return now - this.lastThrowTime >= 400;
    }

    /**
     * Creates and throws a new bottle.
     */
    throwBottle() {
        this.lastThrowTime = Date.now();
        const bottle = new ThrowableObject(
            this.character.x + 100,
            this.character.y + 100
        );
        bottle.otherDirection = this.character.otherDirection;
        this.throwableObjects.push(bottle);
        this.bottleCounter.decrease();
    }

    /**
     * Checks collisions between thrown bottles and enemies.
     */
    checkBottleCollisions() {
        const id = setInterval(() => {
            if (this.isGameInactive()) return;
            this.throwableObjects.forEach(bottle => {
                if (!bottle) return;
                this.checkBottleAgainstEnemies(bottle);
            });
        }, 1000 / 60);
        this.intervalIds.push(id);
    }

    /**
     * Checks one thrown bottle against all enemies.
     * @param {ThrowableObject} bottle - Bottle to check.
     */
    checkBottleAgainstEnemies(bottle) {
        this.level.enemies.forEach(enemy => {
            if (bottle.isColliding(enemy)) {
                this.hitEnemy(enemy, bottle);
            }
        });
    }

    /**
     * Applies bottle damage to an enemy.
     * @param {MovableObject} enemy - Enemy hit by bottle.
     * @param {ThrowableObject} bottle - Bottle causing the hit.
     */
    hitEnemy(enemy, bottle) {
        enemy.hit();
        this.removeBottle(bottle);
        this.updateBossAfterHit(enemy);
    }

    /**
     * Updates the boss health and death handling.
     * @param {MovableObject} enemy - Enemy hit by bottle.
     */
    updateBossAfterHit(enemy) {
        if (!(enemy instanceof Endboss)) return;
        this.bossHealthBar.setPercentage(enemy.energy);
        if (enemy.isDead()) {
            this.waitForBossDeath(enemy);
        }
    }

    /**
     * Removes a thrown bottle from the game.
     * @param {ThrowableObject} bottle - Bottle to remove.
     */
    removeBottle(bottle) {
        const index = this.throwableObjects.indexOf(bottle);
        if (index !== -1) {
            this.throwableObjects.splice(index, 1);
        }
    }

    /**
     * Waits until the boss death animation is finished.
     * @param {Endboss} boss - Boss that was defeated.
     */
    waitForBossDeath(boss) {
        const wait = setInterval(() => {
            if (this.destroyed) {
                clearInterval(wait);
                return;
            }
            if (!boss.deadAnimationFinished) return;
            clearInterval(wait);
            this.finishBossWin();
        }, 50);
        this.intervalIds.push(wait);
    }

    /**
     * Finishes the boss victory sequence after the death animation.
     */
    finishBossWin() {
        setTimeout(() => {
            if (this.destroyed) return;

            AudioHub.playOne(AudioHub.BOSS_WIN);
            this.gameWon = true;
        }, 5000);
    }

    /**
     * Checks whether the boss should appear.
     */
    checkBossAppearance() {
        const id = setInterval(() => {
            if (this.destroyed) return;
            if (this.gameOver || this.gameWon) return;
            const boss = this.getBoss();
            if (!boss || this.character.x <= 2500) return;
            if (this.bossIntroPlayed) return;
            this.bossIntroPlayed = true;
            AudioHub.playOne(AudioHub.BOSS_APPEAR);
        }, 100);
        this.intervalIds.push(id);
    }

    /**
     * Returns the endboss from the current level.
     * @returns {Endboss|undefined} Current endboss.
     */
    getBoss() {
        return this.level.enemies.find(
            enemy => enemy instanceof Endboss
        );
    }

    /**
     * Checks and starts the boss attack.
     */
    checkBossAttack() {
        const id = setInterval(() => {
            if (this.destroyed) return;
            if (this.gameOver || this.gameWon) return;
            const boss = this.getBoss();
            if (!boss || boss.isDeadAnimation) return;
            if (this.isBossInAttackRange(boss)) {
                boss.attack(this.character);
                return;
            }
            this.moveBoss(boss);
        }, 100);
        this.intervalIds.push(id);
    }

    /**
     * Checks whether the character is in boss attack range.
     * @param {Endboss} boss - Boss to check.
     * @returns {boolean} True when the character is close enough.
     */
    isBossInAttackRange(boss) {
        const distance = Math.abs(
            this.character.x - boss.x
        );
        return distance <= 350 && !boss.isAttacking;
    }

    /**
     * Moves the boss inside its patrol area.
     * @param {Endboss} boss - Boss to move.
     */
    moveBoss(boss) {
        if (boss.patrolDirection === 'left') {
            this.moveBossLeft(boss);
            return;
        }
        this.moveBossRight(boss);
    }

    /**
     * Moves the boss to the left.
     * @param {Endboss} boss - Boss to move.
     */
    moveBossLeft(boss) {
        boss.moveLeft(5);
        if (boss.x <= boss.minX) {
            boss.patrolDirection = 'right';
        }
    }

    /**
     * Moves the boss to the right.
     * @param {Endboss} boss - Boss to move.
     */
    moveBossRight(boss) {
        boss.moveRight(5);
        if (boss.x >= boss.maxX) {
            boss.patrolDirection = 'left';
        }
    }

    /**
     * Checks whether the character has lost all energy.
     */
    checkPlayerDeath() {
        if (this.character.isDead()) {
            this.handlePlayerDeath();
        }
    }

    /**
     * Ends the game after the character dies.
     */
    handlePlayerDeath() {
        if (this.gameOver || this.gameWon) return;
        this.gameOver = true;
        this.character.walking_sound.pause();
        AudioHub.playOne(AudioHub.GAME_OVER);
    }
}