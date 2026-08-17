class MovableObject extends DrawableObject {

    otherDirection = false;
    speed = 10;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    destroyed = false;

    /**
     * Applies gravity to the movable object.
     */
    applyGravity() {
        setInterval(() => {
            if (this.destroyed) return;
            if (this.world?.gamePaused || this.world?.destroyed) return;

            this.updateGravity();
        }, 1000 / 25);
    }

    /**
     * Updates the vertical movement caused by gravity.
     */
    updateGravity() {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    }

    /**
     * Checks whether the object is above the ground.
     * @returns {boolean} True when the object is above the ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) return true;

        return this.y < 180;
    }

    /**
     * Draws the collision frame for characters and chickens.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    drawFrame(ctx) {
        if (!(this instanceof Character || this instanceof Chicken)) return;

        this.drawCollisionFrame(ctx);
    }

    /**
     * Draws the collision rectangle around the object.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    drawCollisionFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    /**
     * Plays an animation using the provided image sequence.
     * @param {string[]} images - Array containing the animation image paths.
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;

        this.img = this.imageCache[images[index]];
        this.currentImage++;
    }

    /**
     * Checks whether this object collides with another object.
     * @param {MovableObject} mo - Object to check for collision.
     * @returns {boolean} True when the objects collide.
     */
    isColliding(mo) {
        const first = this.getCollisionBounds();
        const second = this.getCollisionBounds(mo);

        return (
            this.hasHorizontalCollision(first, second) &&
            this.hasVerticalCollision(first, second)
        );
    }

    /**
     * Gets the collision boundaries of an object.
     * @param {MovableObject} mo - Object whose boundaries are needed.
     * @returns {Object} Collision boundaries of the object.
     */
    getCollisionBounds(mo = this) {
        return {
            left: mo.x + (mo.offset?.left || 0),
            right: mo.x + mo.width - (mo.offset?.right || 0),
            top: mo.y + (mo.offset?.top || 0),
            bottom: mo.y + mo.height - (mo.offset?.bottom || 0)
        };
    }

    /**
     * Checks horizontal overlap between two collision areas.
     * @param {Object} first - First collision area.
     * @param {Object} second - Second collision area.
     * @returns {boolean} True when the areas overlap horizontally.
     */
    hasHorizontalCollision(first, second) {
        return first.right > second.left &&
            first.left < second.right;
    }

    /**
     * Checks vertical overlap between two collision areas.
     * @param {Object} first - First collision area.
     * @param {Object} second - Second collision area.
     * @returns {boolean} True when the areas overlap vertically.
     */
    hasVerticalCollision(first, second) {
        return first.bottom > second.top &&
            first.top < second.bottom;
    }

    /**
     * Reduces the object's energy after taking damage.
     */
    hit() {
        if (this.energy > 0) {
            this.energy -= 5;
            this.lastHit = Date.now();
        }

        this.energy = Math.max(0, this.energy);
    }

    /**
     * Checks whether the object has no remaining energy.
     * @returns {boolean} True when the object's energy is zero.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Checks whether the object was recently hit.
     * @returns {boolean} True when the object is hurt.
     */
    isHurt() {
        const timePassed = (Date.now() - this.lastHit) / 1000;

        return timePassed < 0.5;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        if (this.destroyed) return;

        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        if (this.destroyed) return;

        this.x -= this.speed;
    }

    /**
     * Makes the object jump.
     */
    jump() {
        if (this.destroyed) return;

        this.speedY = 20;
    }

    /**
     * Marks the object as destroyed and stops vertical movement.
     */
    destroy() {
        this.destroyed = true;
        this.speedY = 0;
    }
}