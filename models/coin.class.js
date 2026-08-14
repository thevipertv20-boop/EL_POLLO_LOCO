class Coin extends MovableObject {

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor() {
        super();
        this.x = 300;
        this.y = 350;
        this.width = 100;
        this.height = 100;
        this.offset = {
            top: 40,
            bottom: 40,
            left: 40,
            right: 40
        };
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 200);
    }
}