class StatusBar extends DrawableObject {

    percentage = 100;

    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    /**
     * Creates a health or boss status bar.
     * @param {boolean} isBoss - Determines whether the boss bar images are used.
     */
    constructor(isBoss = false) {
        super();

        this.x = 20;
        this.y = 20;
        this.width = 200;
        this.height = 50;

        this.setImages(isBoss);
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }

    /**
     * Sets the image set for the status bar.
     * @param {boolean} isBoss - Determines whether boss images are used.
     */
    setImages(isBoss) {
        if (!isBoss) return;

        this.IMAGES = [
            'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
        ];
    }

    /**
     * Sets the current status percentage.
     * @param {number} percentage - Current percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
    }

    /**
     * Draws the current status bar image.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    draw(ctx) {
        const image = this.getStatusImage();

        if (!this.isImageReady(image)) return;

        this.drawStatusImage(ctx, image);
    }

    /**
     * Gets the status bar image for the current percentage.
     * @returns {HTMLImageElement} Image matching the current percentage.
     */
    getStatusImage() {
        const index = this.getImageIndex();
        return this.imageCache[this.IMAGES[index]];
    }

    /**
     * Determines the image index from the current percentage.
     * @returns {number} Image index.
     */
    getImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;

        return 0;
    }

    /**
     * Checks whether a status bar image is ready to draw.
     * @param {HTMLImageElement} image - Image to check.
     * @returns {boolean} True when the image is ready.
     */
    isImageReady(image) {
        return Boolean(
            image &&
            image.complete &&
            image.naturalWidth > 0
        );
    }

    /**
     * Draws the status bar image.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     * @param {HTMLImageElement} image - Image to draw.
     */
    drawStatusImage(ctx, image) {
        ctx.drawImage(
            image,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}