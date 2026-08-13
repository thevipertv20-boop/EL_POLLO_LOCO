class CoinBar extends DrawableObject {
    percentage = 0;

    constructor() {
        super();
        this.x = 20;
        this.y = 90;
        this.width = 150;
        this.height = 45;
        this.img = new Image();
        this.img.onload = () => {
            this.imageLoaded = true;
        };
        this.img.src =
            "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png";
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        console.log("CoinBar Prozent:", this.percentage); 
    }

    draw(ctx) {
    if (!this.imageLoaded) {
        return;
    }

    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.drawImage(
        this.img,
        this.x,
        this.y,
        this.width,
        this.height
    );
    ctx.restore();
    if (this.percentage > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(
            this.x,
            this.y,
            this.width * (this.percentage / 100),
            this.height
        );
        ctx.clip();
        ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height
        );
        ctx.restore();
    }
}
}