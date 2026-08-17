/**
 * Creates the first game level.
 * @returns {Level} Configured level with enemies, items and background.
 */
function createLevel1() {
    const enemies = createEnemies();
    const clouds = [new Cloud()];
    const birds = createBirds();
    const coins = createCoins();
    const bottles = createBottles();
    const backgroundObjects = createBackgroundObjects();

    return new Level(
        enemies,
        clouds,
        birds,
        coins,
        backgroundObjects,
        bottles
    );
}

/**
 * Creates all enemies for level one.
 * @returns {MovableObject[]} Level enemies.
 */
function createEnemies() {
    const chickens = [
        createChicken(500),
        createChicken(800),
        createChicken(1100),
        createChicken(1400),
        createChicken(1700),
        createChicken(2000),
        createChicken(2300)
    ];

    const endboss = new Endboss();
    endboss.x = 3000;

    return [...chickens, endboss];
}

/**
 * Creates one chicken at the given position.
 * @param {number} x - Horizontal position.
 * @returns {Chicken} Created chicken.
 */
function createChicken(x) {
    const chicken = new Chicken();
    chicken.x = x;
    return chicken;
}

/**
 * Creates the birds for level one.
 * @returns {Bird[]} Created birds.
 */
function createBirds() {
    const bird = new Bird();
    bird.x = 700;
    bird.y = 80;

    return [bird];
}

/**
 * Creates all coins for level one.
 * @returns {Coin[]} Created coins.
 */
function createCoins() {
    const positions = [
        [350, 350],
        [400, 350],
        [450, 350],
        [600, 300],
        [650, 250],
        [700, 300],
        [850, 350],
        [900, 350],
        [950, 350],
        [1100, 300],
        [1150, 250],
        [1200, 200],
        [1250, 250],
        [1300, 300],
        [1450, 350],
        [1500, 350],
        [1550, 350],
        [1700, 300],
        [1750, 250],
        [1800, 300],
        [2000, 350],
        [2050, 350],
        [2100, 350]
    ];

    return positions.map(([x, y]) => createCoin(x, y));
}

/**
 * Creates one coin at the given position.
 * @param {number} x - Horizontal position.
 * @param {number} y - Vertical position.
 * @returns {Coin} Created coin.
 */
function createCoin(x, y) {
    const coin = new Coin();
    coin.x = x;
    coin.y = y;
    return coin;
}

/**
 * Creates all bottles for level one.
 * @returns {Bottle[]} Created bottles.
 */
function createBottles() {
    const positions = [
        250,
        550,
        850,
        1150,
        1450,
        1750,
        2050,
        2350,
        2650
    ];

    return positions.map(x => createBottle(x));
}

/**
 * Creates one bottle at the given position.
 * @param {number} x - Horizontal position.
 * @returns {Bottle} Created bottle.
 */
function createBottle(x) {
    const bottle = new Bottle();
    bottle.x = x;
    return bottle;
}

/**
 * Creates all background objects for level one.
 * @returns {BackgroundObject[]} Background objects.
 */
function createBackgroundObjects() {
    const positions = [-720, 0, 720, 1440, 2160, 2880, 3600];

    return positions.flatMap((x, index) => {
        const layer = index % 2 === 0 ? '1' : '2';
        const thirdLayer = index % 2 === 0 ? '1' : '2';
        const secondLayer = index % 2 === 0 ? '1' : '2';

        return [
            new BackgroundObject(
                'img/5_background/layers/air.png',
                x
            ),
            new BackgroundObject(
                `img/5_background/layers/3_third_layer/${thirdLayer}.png`,
                x
            ),
            new BackgroundObject(
                `img/5_background/layers/2_second_layer/${secondLayer}.png`,
                x
            ),
            new BackgroundObject(
                `img/5_background/layers/1_first_layer/${layer}.png`,
                x
            )
        ];
    });
}

