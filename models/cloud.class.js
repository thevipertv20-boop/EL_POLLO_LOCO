class Cloud extends MovableObject {

    y = 50;
    width = 500;
    height = 250;
    speed = 0.5;

    /**
     * Creates a cloud and starts its movement.
     */
    constructor() {
        super().loadImage(
            'img/5_background/layers/4_clouds/1.png'
        );

        this.x = Math.random() * 3000;
        this.animate();
    }

    /**
     * Starts the cloud movement.
     */
    animate() {
        this.moveLeft();
    }

    /**
     * Moves the cloud to the left continuously.
     */
    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;

            if (this.x + this.width < 0) {
                this.resetPosition();
            }
        }, 1000 / 60);
    }

    /**
     * Places the cloud back at the right side of the level.
     */
    resetPosition() {
        this.x = 3000 + Math.random() * 1000;
    }
}