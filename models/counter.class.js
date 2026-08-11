class Counter extends DrawableObject {

    count = 0;

    constructor(iconSrc, x, y, startCount = 0) {
        super();
        this.x = x;
        this.y = y;
        this.width = 45;
        this.height = 45;
        this.count = startCount;
        this.img = new Image();
        this.img.onload = () => {
            this.imageLoaded = true;
        };
        this.img.src = iconSrc;
    }

    setCount(count) {
        this.count = count;
    }
    increase(amount = 1) {
        this.count += amount;
    }
    decrease(amount = 1) {
        this.count -= amount;
    }
    draw(ctx) {
        if (!this.imageLoaded) {
            return;
        }

        ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height
        );

        ctx.font = 'bold 26px sans-serif';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        const textX = this.x + this.width + 6;
        const textY = this.y + this.height * 0.72;
        ctx.strokeText(this.count, textX, textY);
        ctx.fillText(this.count, textX, textY);
    }
}