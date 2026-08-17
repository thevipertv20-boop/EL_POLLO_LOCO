class Chicken extends MovableObject {

    y = 340;
    height = 100;
    width = 70;
    currentImage = 0;
    dead = false;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    /**
     * Creates a chicken and initializes its images, position and movement.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.otherDirection = false;
        this.animate();
    }

    /**
     * Starts the chicken movement and walking animation.
     */
    animate() {
        setInterval(() => {
            if (this.world?.gamePaused || this.dead) return;
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (this.world?.gamePaused || this.dead) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    /**
     * Marks the chicken as dead and changes its size and image.
     */
    hit() {
        if (this.dead) return;
        this.dead = true;
        this.loadImage(
            'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
        );
        this.width = 100;
        this.height = 50;
        this.y += 50;
    }

    /**
     * Checks whether the chicken is dead.
     * @returns {boolean} True when the chicken is dead.
     */
    isDead() {
        return this.dead;
    }
}













