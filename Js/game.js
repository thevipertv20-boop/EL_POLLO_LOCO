let canvas;
let world;
let keyboard = new Keyboard();
let musicOn = true;
let gameStarted = false;
let startMusic = new Audio("audio/StartGame.mp3");
let gameMusic = new Audio("audio/SpielGame.mp3");

function init() {
    canvas = document.getElementById("canvas");
}

startMusic.loop = true;
startMusic.volume = 0.2;

gameMusic.loop = true;
gameMusic.volume = 0.2;

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    gameStarted = true;
    startMusic.pause();
    startMusic.currentTime = 0;
    gameMusic.pause();
    gameMusic.currentTime = 0;
    if (musicOn) {
        gameMusic.play();
    }
    world = new World(canvas, keyboard);
}

function playStartMusic() {
    if (gameStarted) return;
    if (musicOn && startMusic.paused) {
        startMusic.play();
    }
}

function toggleMusic() {
    let icon = document.getElementById("musicIcon");
    musicOn = !musicOn;
    if (musicOn) {
        icon.src = "img/El pollo Loco Icon/SoundAn.jpg";
        if (
            document.getElementById("startScreen").style.display !== "none" &&
            startMusic.paused
        ) {
            startMusic.play();
        }
    } else {
        startMusic.pause();
        gameMusic.pause();
        icon.src = "img/El pollo Loco Icon/SoundAus.jpg";
    }
}

function restartGame() {
    location.reload();
}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode == 68) {
        keyboard.D = true;
    }
})

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode == 68) {
        keyboard.D = false;
    }
})