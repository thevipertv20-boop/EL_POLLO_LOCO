function createLevel1() {

    let bird1 = new Bird();
    bird1.x = 700;
    bird1.y = 80;

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

    let coins = [];

    coins.push(new Coin());
    coins[coins.length - 1].x = 350;
    coins[coins.length - 1].y = 350;

    coins.push(new Coin());
    coins[coins.length - 1].x = 400;
    coins[coins.length - 1].y = 350;

    coins.push(new Coin());
    coins[coins.length - 1].x = 450;
    coins[coins.length - 1].y = 350;

    coins.push(new Coin());
    coins[coins.length - 1].x = 600;
    coins[coins.length - 1].y = 300;

    coins.push(new Coin());
    coins[coins.length - 1].x = 650;
    coins[coins.length - 1].y = 250;

    coins.push(new Coin());
    coins[coins.length - 1].x = 700;
    coins[coins.length - 1].y = 300;

    coins.push(new Coin());
    coins[coins.length - 1].x = 850;
    coins[coins.length - 1].y = 350;

    coins.push(new Coin());
    coins[coins.length - 1].x = 900;
    coins[coins.length - 1].y = 350;

    coins.push(new Coin());
    coins[coins.length - 1].x = 950;
    coins[coins.length - 1].y = 350;


    coins.push(new Coin());
    coins[coins.length - 1].x = 1100;
    coins[coins.length - 1].y = 300;

    coins.push(new Coin());
    coins[coins.length - 1].x = 1150;
    coins[coins.length - 1].y = 250;

    coins.push(new Coin());
    coins[coins.length - 1].x = 1200;
    coins[coins.length - 1].y = 200;

    coins.push(new Coin());
    coins[coins.length - 1].x = 1250;
    coins[coins.length - 1].y = 250;

    coins.push(new Coin());
    coins[coins.length - 1].x = 1300;
    coins[coins.length - 1].y = 300;


    coins.push(new Coin());
    coins[coins.length - 1].x = 1450;
    coins[coins.length - 1].y = 350;

    coins.push(new Coin());
    coins[coins.length - 1].x = 1500;
    coins[coins.length - 1].y = 350;

    coins.push(new Coin());
    coins[coins.length - 1].x = 1550;
    coins[coins.length - 1].y = 350;


    coins.push(new Coin());
    coins[coins.length - 1].x = 1700;
    coins[coins.length - 1].y = 300;

    coins.push(new Coin());
    coins[coins.length - 1].x = 1750;
    coins[coins.length - 1].y = 250;

    coins.push(new Coin());
    coins[coins.length - 1].x = 1800;
    coins[coins.length - 1].y = 300;

    coins.push(new Coin());
    coins[coins.length - 1].x = 2000;
    coins[coins.length - 1].y = 350;

    coins.push(new Coin());
    coins[coins.length - 1].x = 2050;
    coins[coins.length - 1].y = 350;

    coins.push(new Coin());
    coins[coins.length - 1].x = 2100;
    coins[coins.length - 1].y = 350;

    let bottle1 = new Bottle();
    bottle1.x = 250;

    let bottle2 = new Bottle();
    bottle2.x = 550;

    let bottle3 = new Bottle();
    bottle3.x = 850;

    let bottle4 = new Bottle();
    bottle4.x = 1150;

    let bottle5 = new Bottle();
    bottle5.x = 1450;

    let bottle6 = new Bottle();
    bottle6.x = 1750;

    let bottle7 = new Bottle();
    bottle7.x = 2050;

    let bottle8 = new Bottle();
    bottle8.x = 2350;

    let bottle9 = new Bottle();
    bottle9.x = 2650;
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
        [
            bird1
        ],
        coins,
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
            bottle5,
            bottle6,
            bottle7,
            bottle8,
            bottle9
        ]
    );
}

