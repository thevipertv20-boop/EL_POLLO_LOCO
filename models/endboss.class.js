class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 50;
    energy = 100;
    currentImage = 0;
    isAttacking = false;
    isDeadAnimation = false;
    deadAnimationFinished = false;
    patrolDirection = 'left';
    minX = 2600;
    maxX = 3300;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Creates the endboss and initializes its images and collision offset.
     */
    constructor() {
        super();
        this.offset = {
            top: 100,
            bottom: 40,
            left: 40,
            right: 40
        };
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 700;
        this.animate();
    }

    /**
     * Starts the walking animation of the endboss.
     */
    animate() {
        setInterval(() => {
            if (this.isDeadAnimation || this.isAttacking) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    /**
     * Checks whether another boss animation is currently active.
     * @returns {boolean} True when walking animation should be blocked.
     */
    isAnimationBlocked() {
        return (
            this.isDeadAnimation ||
            this.isAttacking ||
            this.isHurtAnimation
        );
    }

    /**
     * Starts the attack animation of the endboss.
     * @param {Character} character - Character targeted by the attack.
     */
    attack(character) {
        if (this.isDeadAnimation || this.isAttacking) return;
        this.isAttacking = true;
        this.currentImage = 0;
        this.startAttackAnimation();
    }

    /**
     * Plays the attack animation from first to last image.
     */
    startAttackAnimation() {
        this.attackAnimation = setInterval(() => {
            if (this.isAttackFinished()) {
                this.stopAttackAnimation();
                return;
            }
            this.showAttackImage();
        }, 100);
    }

    /**
     * Checks whether the attack animation has finished.
     * @returns {boolean} True when all attack images were shown.
     */
    isAttackFinished() {
        return this.currentImage >= this.IMAGES_ATTACK.length;
    }

    /**
     * Displays the current attack animation image.
     */
    showAttackImage() {
        const path = this.IMAGES_ATTACK[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Stops the attack animation.
     */
    stopAttackAnimation() {
        clearInterval(this.attackAnimation);
        this.isAttacking = false;
        this.currentImage = 0;
    }

    /**
 * Reduces the endboss energy.
 */
    hit() {
        if (this.energy <= 0) return;

        this.energy -= 20;
        this.energy = Math.max(0, this.energy);

        AudioHub.playOne(AudioHub.BOSS_HIT);

        if (this.energy <= 0) {
            this.die();
        }
    }

    /**
     * Starts the boss death animation.
     */
    die() {
        if (this.isDeadAnimation) return;
        this.isDeadAnimation = true;
        this.isAttacking = false;
        this.isHurtAnimation = false;
        this.deadAnimationFinished = false;
        this.clearActiveAnimations();
        this.startDeathAnimation();
    }

    /**
     * Stops attack and hurt animations.
     */
    clearActiveAnimations() {
        if (this.attackAnimation) {
            clearInterval(this.attackAnimation);
        }
        if (this.hurtAnimation) {
            clearInterval(this.hurtAnimation);
        }
    }

    /**
 * Starts the boss death animation sequence.
 */
    startDeathAnimation() {
        let deathImage = 0;

        const deathOffsets = [
            0,
            15,
            25
        ];

        this.deathAnimation = setInterval(() => {
            if (deathImage >= this.IMAGES_DEAD.length) {
                clearInterval(this.deathAnimation);
                this.deadAnimationFinished = true;
                return;
            }

            const path = this.IMAGES_DEAD[deathImage];
            this.img = this.imageCache[path];

            this.y = 50 + deathOffsets[deathImage];

            deathImage++;
        }, 500);
    }
}