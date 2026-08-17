class Level {

    enemies;
    clouds;
    birds;
    coins;
    backgroundObjects;
    bottles;

    level_end_x = 3800;

    /**
     * Creates a game level with all required objects.
     * @param {MovableObject[]} enemies - Enemies in the level.
     * @param {Cloud[]} clouds - Clouds in the level.
     * @param {Bird[]} birds - Birds in the level.
     * @param {Coin[]} coins - Coins in the level.
     * @param {BackgroundObject[]} backgroundObjects - Background objects.
     * @param {Bottle[]} bottles - Bottles in the level.
     */
    constructor(
        enemies,
        clouds,
        birds,
        coins,
        backgroundObjects,
        bottles = []
    ) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.birds = birds;
        this.coins = coins;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
    }
}