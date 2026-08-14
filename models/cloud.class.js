class Cloud extends MovableObject {
    y = 50;
    width = 500;
    height = 250;
    speed = 0.5;

    constructor() {
        super().loadImage(
            'img/5_background/layers/4_clouds/1.png'
        );
        this.x = Math.random() * 3000;
        this.animate();
    }

    animate() {
        this.moveLeft();
    }
    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
            if (this.x + this.width < 0) {
                this.x = 3000 + Math.random() * 1000;
            }
        }, 1000 / 60);
    }
}