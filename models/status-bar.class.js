class StatusBar extends DrawableObject {
    percentage = 100;

    constructor() {
        super();

        this.x = 20;
        this.y = 20;
        this.width = 150;
        this.height = 45;

        this.img = new Image();

        this.img.onload = () => {
            this.imageLoaded = true;
        };

        this.img.src =
            "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png";
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        console.log("StatusBar Prozent:", this.percentage);
    }

    draw(ctx) {
        if (!this.imageLoaded) {
            return;
        }

        // Hintergrund der Leiste
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

        // Blaue Füllung
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