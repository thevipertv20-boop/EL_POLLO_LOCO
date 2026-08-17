class CoinBar extends DrawableObject {

    percentage = 0;
    imageLoaded = false;

    /**
     * Creates the coin bar.
     */
    constructor() {
        super();

        this.x = 20;
        this.y = 90;
        this.width = 150;
        this.height = 45;

        this.loadCoinBarImage();
    }

    /**
     * Loads the coin bar image.
     */
    loadCoinBarImage() {
        this.img = new Image();

        this.img.onload = () => {
            this.imageLoaded = true;
        };

        this.img.src =
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png';
    }

    /**
     * Sets the current coin percentage.
     * @param {number} percentage - Current percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
    }

    /**
     * Draws the coin bar.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    draw(ctx) {
        if (!this.imageLoaded) return;

        this.drawBackground(ctx);

        if (this.percentage <= 0) return;

        this.drawPercentage(ctx);
    }

    /**
     * Draws the transparent background of the coin bar.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    drawBackground(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        this.drawImage(ctx);
        ctx.restore();
    }

    /**
     * Draws the current percentage of the coin bar.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    drawPercentage(ctx) {
        ctx.save();

        ctx.beginPath();
        ctx.rect(
            this.x,
            this.y,
            this.width * (this.percentage / 100),
            this.height
        );

        ctx.clip();
        this.drawImage(ctx);

        ctx.restore();
    }

    /**
     * Draws the coin bar image.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    drawImage(ctx) {
        ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}