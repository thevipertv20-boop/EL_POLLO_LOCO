class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;

    /**
     * Creates a background object at the given position.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal position of the background.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);

        this.x = x;
        this.y = 480 - this.height;
    }
}