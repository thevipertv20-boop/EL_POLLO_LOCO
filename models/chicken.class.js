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

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.otherDirection = false;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.dead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!this.dead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    hit() {
        if (this.dead) {
            return;
        }
        this.dead = true;
        this.loadImage(
            'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
        );
        this.width = 100;
        this.height = 50;
        this.y += 50;
    }


    isDead() {
        return this.dead;
    }
}













