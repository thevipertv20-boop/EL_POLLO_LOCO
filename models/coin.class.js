class Coin extends MovableObject {

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates a coin and initializes its position, size and animation.
     */
    constructor() {
        super();
        this.x = 300;
        this.y = 350;
        this.width = 100;
        this.height = 100;
        this.offset = {
            top: 45,
            bottom: 45,
            left: 45,
            right: 45
        };
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.animate();
    }

    /**
     * Starts the coin animation.
     */
    animate() {
        setInterval(() => {
            if (world?.gamePaused) return;
            this.playAnimation(this.IMAGES);
        }, 200);
    }
}