class Level {
    enemies
    clouds
    coins
    backgroundObjects
    bottles
    level_end_x = 3200;

    constructor(enemies, clouds, coins, backgroundObjects, bottles = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
    }
}