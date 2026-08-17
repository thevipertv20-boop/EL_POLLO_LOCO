class DrawableObject {

    img;
    imageCache = {};
    currentImage = 0;

    x = 120;
    y = 330;
    width = 100;
    height = 100;

    /**
     * Loads a single image.
     * @param {string} path - Path to the image.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images into the image cache.
     * @param {string[]} arr - Array containing image paths.
     */
    loadImages(arr) {
        arr.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the current image on the canvas.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    draw(ctx) {
        ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}