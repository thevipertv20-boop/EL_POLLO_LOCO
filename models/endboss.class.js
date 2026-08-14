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

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 700;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isDeadAnimation || this.isAttacking) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    attack(character) {
        if (this.isDeadAnimation || this.isAttacking) return;
        this.isAttacking = true;
        this.currentImage = 0;
        this.attackAnimation = setInterval(() => {
            if (this.currentImage >= this.IMAGES_ATTACK.length) {
                clearInterval(this.attackAnimation);
                this.isAttacking = false;
                return;
            }
            this.img = this.imageCache[
                this.IMAGES_ATTACK[this.currentImage]
            ];
            this.currentImage++;
        }, 100);
    }

    hit() {
        if (this.energy <= 0) return;
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        }
        AudioHub.playOne(AudioHub.BOSS_HIT);
        if (this.energy <= 0) {
            this.die();
        }
    }

    die() {
        if (this.isDeadAnimation) return;
        this.isDeadAnimation = true;
        this.isAttacking = false;
        if (this.attackAnimation) {
            clearInterval(this.attackAnimation);
        }
        this.currentImage = 0;
        let animation = setInterval(() => {
            if (this.currentImage >= this.IMAGES_DEAD.length) {
                clearInterval(animation);
                this.deadAnimationFinished = true;
                return;
            }
            this.img = this.imageCache[
                this.IMAGES_DEAD[this.currentImage]
            ];
            this.currentImage++;
        }, 500);
    }
}