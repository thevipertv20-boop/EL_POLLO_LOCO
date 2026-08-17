class Bottle extends MovableObject {

    /**
     * Creates a bottle and initializes its image, position, size and offset.
     */
    constructor() {
        super().loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
        this.x = 300;
        this.y = 380;
        this.width = 50;
        this.height = 60;

        this.offset = {
            top: 20,
            bottom: 20,
            left: 15,
            right: 15
        };
    }
}