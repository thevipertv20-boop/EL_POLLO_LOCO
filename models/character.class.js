class Character extends MovableObject {

    height = 250;
    y = 80;
    speed = 5;
    currentImage = 0;
    jumpImage = 0;
    jumpAnimationActive = false;
    jumpAnimationSpeed = 3;
    jumpAnimationCounter = 0;
    isWalking = false;
    lastActionTime = Date.now();

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    world;

    walking_sound = new Audio(
        'audio/freesound_community-sand-walk-106366.mp3'
    );

    /**
     * Creates the character and initializes its animations and gravity.
     */
    constructor() {
        super();

        this.offset = {
            top: 80,
            bottom: 20,
            left: 35,
            right: 35
        };

        this.loadCharacterImages();
        this.setupWalkingSound();
        this.applyGravity();
        this.animate();
    }

    /**
     * Loads all character animation images.
     */
    loadCharacterImages() {
        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
    }

    /**
     * Configures the walking sound.
     */
    setupWalkingSound() {
        this.walking_sound.volume = 0.2;
        this.walking_sound.loop = true;
    }

    /**
     * Starts the movement and animation intervals.
     */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 50);
    }

    /**
     * Updates movement, sound, jumping and camera.
     */
    updateMovement() {
        if (this.isGameInactive()) return;
        this.handleMovement();
        this.handleWalkingSound();
        this.handleJump();
        this.updateCamera();
    }

    /**
     * Checks whether the character cannot be controlled.
     * @returns {boolean} True when the game is inactive.
     */
    isGameInactive() {
        return !this.world || this.world.gamePaused || this.isDead();
    }

    /**
     * Handles left and right movement input.
     */
    handleMovement() {
        let walking = false;
        if (this.world.keyboard.RIGHT) walking = this.moveRightIfPossible();
        if (this.world.keyboard.LEFT) walking = this.moveLeftIfPossible() || walking;
        this.isWalking = walking;
        if (walking) this.resetIdleTimer();
    }

    /**
     * Moves right when the level boundary allows it.
     * @returns {boolean} True when the character moved.
     */
    moveRightIfPossible() {
        if (this.x >= this.world.level.level_end_x - this.width) return false;
        this.moveRight();
        this.otherDirection = false;
        return true;
    }

    /**
     * Moves left when the level boundary allows it.
     * @returns {boolean} True when the character moved.
     */
    moveLeftIfPossible() {
        if (this.x <= 0) return false;
        this.moveLeft();
        this.otherDirection = true;
        return true;
    }

    /**
     * Starts or stops the walking sound.
     */
    handleWalkingSound() {
        if (this.isWalking && !AudioHub.muted) {
            this.startWalkingSound();
        } else {
            this.stopWalkingSound();
        }
    }

    /**
     * Starts the walking sound.
     */
    startWalkingSound() {
        if (this.walking_sound.paused) this.walking_sound.play();
    }

    /**
     * Stops the walking sound.
     */
    stopWalkingSound() {
        this.walking_sound.pause();
    }

    /**
     * Checks jump input and starts a jump.
     */
    handleJump() {
        if (!this.world.keyboard.SPACE || this.isAboveGround()) return;
        this.jump();
        this.world.keyboard.SPACE = false;
    }

    /**
     * Updates the camera position.
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Selects the correct animation for the character state.
     */
    updateAnimation() {
        if (!this.world || this.world.gamePaused) return;
        if (this.isDead()) return this.playAnimation(this.IMAGES_DEAD);
        if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
        if (this.isAboveGround()) return this.playJumpAnimation();
        this.finishJumpAnimation();
        this.playGroundAnimation();
    }

    /**
     * Plays the correct ground animation.
     */
    playGroundAnimation() {
        if (this.isWalking) {
            this.playAnimation(this.IMAGES_WALKING);
            return;
        }
        this.playIdleAnimation();
    }

    /**
 * Plays normal or long idle animation.
 */
    playIdleAnimation() {
        const idleTime = Date.now() - this.lastActionTime;
        if (idleTime > 5000) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
            return;
        }
        this.playSlowIdleAnimation();
    }

    /**
 * Plays the idle animation at a slower speed.
 */
    playSlowIdleAnimation() {
        const idleImage = Math.floor(Date.now() / 150) % this.IMAGES_IDLE.length;
        const path = this.IMAGES_IDLE[idleImage];
        this.img = this.imageCache[path];
    }

    /**
     * Plays the jump animation from first to last image.
     */
    playJumpAnimation() {
        if (!this.jumpAnimationActive) {
            this.jumpAnimationActive = true;
            this.jumpImage = 0;
        }
        this.showJumpImage();
    }

    /**
 * Displays the current jump image at a slower speed.
 */
    showJumpImage() {
        if (this.jumpAnimationCounter < this.jumpAnimationSpeed) {
            this.jumpAnimationCounter++;
            return;
        }
        this.jumpAnimationCounter = 2.5;
        const path = this.IMAGES_JUMPING[this.jumpImage];
        this.img = this.imageCache[path];
        this.advanceJumpImage();
    }

    /**
     * Advances the jump animation to the next image.
     */
    advanceJumpImage() {
        if (this.jumpImage < this.IMAGES_JUMPING.length - 1) {
            this.jumpImage++;
        }
    }

    /**
     * Finishes the jump animation after landing.
     */
    finishJumpAnimation() {
        if (!this.jumpAnimationActive) return;
        this.resetJumpAnimation();
        this.resetIdleTimer();
    }

    /**
 * Resets the jump animation.
 */
    resetJumpAnimation() {
        this.jumpAnimationActive = false;
        this.jumpImage = 0;
        this.jumpAnimationCounter = 0;
    }

    /**
     * Resets the timer used for the long idle animation.
     */
    resetIdleTimer() {
        this.lastActionTime = Date.now();
    }

    /**
     * Starts a jump and resets the idle timer.
     */
    jump() {
        this.speedY = 23;
        this.resetIdleTimer();
        this.resetJumpAnimation();
    }
}