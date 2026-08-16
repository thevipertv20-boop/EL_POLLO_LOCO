class MovableObject extends DrawableObject {

    otherDirection = false;
    speed = 10;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    destroyed = false;

    applyGravity() {
        setInterval(() => {

            if (this.destroyed) return;

            if (this.world?.gamePaused || this.world?.destroyed) {
                return;
            }

            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }

        }, 1000 / 25);
    }


    isAboveGround() {

        if (this instanceof ThrowableObject) {
            return true;
        }

        return this.y < 180;
    }


    drawFrame(ctx) {

        if (this instanceof Character || this instanceof Chicken) {

            ctx.beginPath();

            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';

            ctx.rect(
                this.x,
                this.y,
                this.width,
                this.height
            );

            ctx.stroke();
        }
    }


    playAnimation(images) {

        let i = this.currentImage % images.length;
        let path = images[i];

        this.img = this.imageCache[path];

        this.currentImage++;
    }


    isColliding(mo) {

        const thisLeft = this.x;
        const thisRight = this.x + this.width;
        const thisTop = this.y;
        const thisBottom = this.y + this.height;

        const moLeft =
            mo.x + (mo.offset?.left || 0);

        const moRight =
            mo.x +
            mo.width -
            (mo.offset?.right || 0);

        const moTop =
            mo.y + (mo.offset?.top || 0);

        const moBottom =
            mo.y +
            mo.height -
            (mo.offset?.bottom || 0);

        return (
            thisRight > moLeft &&
            thisBottom > moTop &&
            thisLeft < moRight &&
            thisTop < moBottom
        );
    }


    hit() {

        if (this.energy > 0) {

            this.energy -= 5;

            this.lastHit = new Date().getTime();
        }

        if (this.energy < 0) {
            this.energy = 0;
        }
    }


    isDead() {
        return this.energy == 0;
    }


    isHurt() {

        let timePassed =
            (new Date().getTime() - this.lastHit) / 1000;

        return timePassed < 0.5;
    }


    moveRight() {

        if (this.destroyed) return;

        this.x += this.speed;
    }


    moveLeft() {

        if (this.destroyed) return;

        this.x -= this.speed;
    }


    jump() {

        if (this.destroyed) return;

        this.speedY = 20;
    }


    destroy() {

        this.destroyed = true;

        this.speedY = 0;
    }
}