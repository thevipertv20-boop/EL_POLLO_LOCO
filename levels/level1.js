function createLevel1() {

    let chicken1 = new Chicken();
    chicken1.x = 500;

    let chicken2 = new Chicken();
    chicken2.x = 800;

    let chicken3 = new Chicken();
    chicken3.x = 1100;

    let chicken4 = new Chicken();
    chicken4.x = 1400;

    let chicken5 = new Chicken();
    chicken5.x = 1700;

    let chicken6 = new Chicken();
    chicken6.x = 2000;

    let chicken7 = new Chicken();
    chicken7.x = 2300;

    let endboss = new Endboss();
    endboss.x = 3000;

    // Coins zufällig über die Karte verteilt - bei jedem Spielstart anders,
    // aber gleichmäßig verteilt (kein Zufalls-Klumpen an einer Stelle)
    let coins = [];
    let coinCount = 25;
    let coinsAreaStart = 250;
    let coinsAreaEnd = 2900;
    let sectionWidth = (coinsAreaEnd - coinsAreaStart) / coinCount;

    for (let i = 0; i < coinCount; i++) {
        let coin = new Coin();

        // x liegt in einem eigenen Abschnitt der Karte, damit die
        // Coins nicht alle an derselben Stelle zufällig landen
        coin.x = coinsAreaStart + (i * sectionWidth) +
            (Math.random() * sectionWidth * 0.6);

        // y zufällig zwischen 20 und 90 -> immer nur per Sprung erreichbar
        coin.y = 20 + Math.random() * 70;

        coins.push(coin);
    }

    // Flaschen im Level verteilt (zum Einsammeln)
    let bottle1 = new Bottle();
    bottle1.x = 250;

    let bottle2 = new Bottle();
    bottle2.x = 650;

    let bottle3 = new Bottle();
    bottle3.x = 1050;

    let bottle4 = new Bottle();
    bottle4.x = 1450;

    let bottle5 = new Bottle();
    bottle5.x = 1850;

    return new Level(
        [
            chicken1,
            chicken2,
            chicken3,
            chicken4,
            chicken5,
            chicken6,
            chicken7,
            endboss
        ],

        [
            new Cloud()
        ],

        coins,

        // dein kompletter Hintergrund bleibt hier
        [
            new BackgroundObject("img/5_background/layers/air.png", -720),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),

            new BackgroundObject("img/5_background/layers/air.png", 0),
            new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
            new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
            new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

            new BackgroundObject("img/5_background/layers/air.png", 720),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),

            new BackgroundObject("img/5_background/layers/air.png", 1440),
            new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 1440),
            new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 1440),
            new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 1440),

            new BackgroundObject("img/5_background/layers/air.png", 2160),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 2160),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 2160),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 2160),

            new BackgroundObject("img/5_background/layers/air.png", 2880),
            new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 2880),
            new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 2880),
            new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 2880)
        ],

        [
            bottle1,
            bottle2,
            bottle3,
            bottle4,
            bottle5
        ]
    );
}

