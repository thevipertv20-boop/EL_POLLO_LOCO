class ThrowableObject extends MovableObject {

    constructor(x, y) {
    super();
    console.log("Flasche erstellt", x, y);
    this.loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
    this.x = x;
    this.y = y;
    this.throw();
}

    throw() {
        this.speedY = 20;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 28);
    }

}