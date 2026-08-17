class Counter extends DrawableObject {

    count = 0;
    imageLoaded = false;

    /**
     * Creates a counter with an icon and starting value.
     * @param {string} iconSrc - Path to the counter icon.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     * @param {number} startCount - Initial counter value.
     */
    constructor(iconSrc, x, y, startCount = 0) {
        super();

        this.x = x;
        this.y = y;
        this.width = 45;
        this.height = 45;
        this.count = startCount;

        this.loadCounterImage(iconSrc);
    }

    /**
     * Loads the counter icon.
     * @param {string} iconSrc - Path to the counter icon.
     */
    loadCounterImage(iconSrc) {
        this.img = new Image();

        this.img.onload = () => {
            this.imageLoaded = true;
        };

        this.img.src = iconSrc;
    }

    /**
     * Sets the counter value.
     * @param {number} count - New counter value.
     */
    setCount(count) {
        this.count = count;
    }

    /**
     * Increases the counter.
     * @param {number} amount - Amount to add.
     */
    increase(amount = 1) {
        this.count += amount;
    }

    /**
     * Decreases the counter.
     * @param {number} amount - Amount to subtract.
     */
    decrease(amount = 1) {
        this.count -= amount;
    }

    /**
     * Draws the counter icon and value.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    draw(ctx) {
        if (!this.imageLoaded) return;

        this.drawIcon(ctx);
        this.drawCount(ctx);
    }

    /**
     * Draws the counter icon.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    drawIcon(ctx) {
        ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    /**
     * Draws the counter value.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    drawCount(ctx) {
        const textX = this.x + this.width + 6;
        const textY = this.y + this.height * 0.72;

        ctx.font = 'bold 26px sans-serif';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;

        ctx.strokeText(this.count, textX, textY);
        ctx.fillText(this.count, textX, textY);
    }
}