class Level {
    enemies
    clouds
    birds
    coins
    backgroundObjects
    bottles

    level_end_x = 3800;

    constructor(enemies, clouds, birds, coins, backgroundObjects, bottles = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.birds = birds;
        this.coins = coins;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
    }
}