class ThrowableObject extends MovableObject {

    /**
     * Creates a throwable bottle at the given position.
     * @param {number} x - Horizontal starting position.
     * @param {number} y - Vertical starting position.
     */
    constructor(x, y) {
        super();

        this.loadImage(
            'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png'
        );

        this.x = x;
        this.y = y;
        this.throw();
    }

    /**
     * Starts the bottle throw.
     */
    throw() {
        this.speedY = 20;
        this.applyGravity();
        this.startHorizontalMovement();
    }

    /**
     * Moves the bottle according to its direction.
     */
    startHorizontalMovement() {
        setInterval(() => {
            if (this.otherDirection) {
                this.x -= 10;
                return;
            }

            this.x += 10;
        }, 28);
    }
}