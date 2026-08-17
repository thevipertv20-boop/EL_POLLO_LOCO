class Bird extends MovableObject {

    width = 80;
    height = 60;
    y = 100;

    IMAGES_FLYING = [
        'img/El_pollo_Loco_Icon/red_bird_1.png',
        'img/El_pollo_Loco_Icon/red_bird_2.png',
        'img/El_pollo_Loco_Icon/red_bird_3.png',
        'img/El_pollo_Loco_Icon/red_bird_4.png',
        'img/El_pollo_Loco_Icon/red_bird_5.png'
    ];

    /**
     * Creates the bird and starts its animations.
     */
    constructor() {
        super();

        this.loadImage(this.IMAGES_FLYING[0]);
        this.loadImages(this.IMAGES_FLYING);

        this.x = 800;
        this.y = 80;

        this.animate();
    }

    /**
     * Starts the bird animation and movement.
     */
    animate() {
        this.animateFlying();
        this.moveBird();
    }

    /**
     * Changes the bird image during flight.
     */
    animateFlying() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_FLYING);
        }, 150);
    }

    /**
     * Moves the bird continuously to the right.
     */
    moveBird() {
        setInterval(() => {
            this.x += 1;
        }, 1000 / 60);
    }
}