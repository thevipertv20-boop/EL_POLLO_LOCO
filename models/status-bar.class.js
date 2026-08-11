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

    constructor(isBoss = false) {
        super();
        this.x = 20;
        this.y = 20;
        this.width = 200;
        this.height = 50;
        if (isBoss) {
            this.IMAGES = [
                'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
                'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
                'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
                'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
                'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
                'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
            ];
        }
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }
    setPercentage(percentage) {
        this.percentage = percentage;
    }
    draw(ctx) {
        let index = 0;
        if (this.percentage >= 100) {
            index = 5;
        } else if (this.percentage >= 80) {
            index = 4;
        } else if (this.percentage >= 60) {
            index = 3;
        } else if (this.percentage >= 40) {
            index = 2;
        } else if (this.percentage >= 20) {
            index = 1;
        } else {
            index = 0;
        }
        let path = this.IMAGES[index];
        let image = this.imageCache[path];
        if (!image || !image.complete || image.naturalWidth === 0) {
            return;
        }
        ctx.drawImage(
            image,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}