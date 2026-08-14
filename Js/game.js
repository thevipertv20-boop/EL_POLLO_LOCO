let canvas;
let world;
let keyboard = new Keyboard();
let touchControls;

let musicOn = localStorage.getItem("musicOn") !== "false";
let gameStarted = false;

let musicVolume = parseFloat(
    localStorage.getItem("musicVolume") || "1"
);

let masterVolume = parseFloat(
    localStorage.getItem("masterVolume") || "1"
);

let effectsVolume = parseFloat(
    localStorage.getItem("effectsVolume") || "1"
);

let startMusic = new Audio("audio/StartGame.mp3");
let gameMusic = new Audio("audio/SpielGame.mp3");

startMusic.loop = true;
gameMusic.loop = true;

function init() {
    canvas = document.getElementById("canvas");
    touchControls = new TouchControls(keyboard);
    loadSoundSettings();
    setupVolumeControls();
    updateMusicIcon();
    if (sessionStorage.getItem("restartGame") === "true") {
        sessionStorage.removeItem("restartGame");
        startGame();
    }
}

function loadSoundSettings() {
    AudioHub.masterVolume = masterVolume;
    AudioHub.effectsVolume = effectsVolume;
    startMusic.volume = masterVolume * musicVolume * 0.2;
    gameMusic.volume = masterVolume * musicVolume * 0.2;
    let master = document.getElementById("masterVolume");
    let music = document.getElementById("musicVolume");
    let effects = document.getElementById("effectsVolume")
    if (master) {
        master.value = masterVolume;
    }
    if (music) {
        music.value = musicVolume;
    }
    if (effects) {
        effects.value = effectsVolume;
    }
}

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.body.classList.remove("game-ended");
    document.body.classList.add("game-started");
    if (canvas) {
        canvas.style.visibility = "visible";
    }
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

function toggleMusic() {
    musicOn = !musicOn;
    localStorage.setItem("musicOn", musicOn);
    updateMusic();
}

function updateMusicIcon() {
    let icon = document.getElementById("musicIcon");
    if (!icon) {
        return;
    }
    icon.src = musicOn
        ? "img/El_pollo_Loco_Icon/SoundAn.jpg"
        : "img/El_pollo_Loco_Icon/SoundAus.jpg";
}

function updateMusic() {
    updateMusicIcon();
    if (musicOn) {
        playCurrentMusic();
    } else {
        stopMusic();
    }
}

function playCurrentMusic() {
    if (!musicOn) {
        return;
    }
    if (gameStarted) {
        gameMusic.play();
    } else {
        startMusic.play();
    }
}

function stopMusic() {
    startMusic.pause();
    gameMusic.pause();
}

function setupVolumeControls() {
    let master = document.getElementById("masterVolume");
    let music = document.getElementById("musicVolume");
    let effects = document.getElementById("effectsVolume");


    if (master) {
        master.oninput = () => {
            masterVolume = parseFloat(master.value);
            localStorage.setItem(
                "masterVolume",
                masterVolume
            );
            AudioHub.masterVolume = masterVolume;
            updateMusicVolume();
        };
    }


    if (music) {
        music.oninput = () => {
            musicVolume = parseFloat(music.value);
            localStorage.setItem(
                "musicVolume",
                musicVolume
            );
            updateMusicVolume();
        };
    }

    if (effects) {
        effects.oninput = () => {
            effectsVolume = parseFloat(effects.value);
            localStorage.setItem(
                "effectsVolume",
                effectsVolume
            );
            AudioHub.effectsVolume = effectsVolume;
        };
    }
}

function updateMusicVolume() {
    let volume = musicVolume * masterVolume;
    startMusic.volume = volume * 0.2;
    gameMusic.volume = volume * 0.2;
}

function restartGame() {
    sessionStorage.setItem("restartGame", "true");
    location.reload();
}

function backToMenu() {
    document.body.classList.remove("game-ended");
    document.body.classList.remove("game-started");
    let restartButton = document.getElementById("restartButton");
    let menuButton = document.getElementById("menuButton");
    if (restartButton) {
        restartButton.style.display = "none";
    }
    if (menuButton) {
        menuButton.style.display = "none";
    }
    gameStarted = false;
    stopMusic();
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
});

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
});

function openInstructions() {
    document.getElementById("instructionsOverlay").style.display = "flex";
}

function closeInstructions() {
    document.getElementById("instructionsOverlay").style.display = "none";
}

function openControls() {
    document.getElementById("controlsOverlay").style.display = "flex";
}

function closeControls() {
    document.getElementById("controlsOverlay").style.display = "none";
}

function openImprint() {
    document.getElementById("imprintOverlay").style.display = "flex";
}

function closeImprint() {
    document.getElementById("imprintOverlay").style.display = "none";
}

function openSoundSettings() {
    document.getElementById("soundOverlay").style.display = "flex";
}

function closeSoundSettings() {
    document.getElementById("soundOverlay").style.display = "none";
}

