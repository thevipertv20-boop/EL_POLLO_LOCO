let canvas;
let world;
let keyboard = new Keyboard();
let touchControls;

let musicOn = localStorage.getItem("musicOn") !== "false";
let gameStarted = false;

let musicVolume = parseFloat(localStorage.getItem("musicVolume") || "1");
let masterVolume = parseFloat(localStorage.getItem("masterVolume") || "1");
let effectsVolume = parseFloat(localStorage.getItem("effectsVolume") || "1");

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

    updateMusicVolume();

    let master = document.getElementById("masterVolume");
    let music = document.getElementById("musicVolume");
    let effects = document.getElementById("effectsVolume");

    if (master) master.value = masterVolume;
    if (music) music.value = musicVolume;
    if (effects) effects.value = effectsVolume;
}


function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.body.classList.remove("game-ended");
    document.body.classList.add("game-started");

    if (canvas) {
        canvas.style.visibility = "visible";
    }

    gameStarted = true;

    stopMusic();
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

    if (!icon) return;

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
    if (!musicOn) return;

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
            localStorage.setItem("masterVolume", masterVolume);
            AudioHub.masterVolume = masterVolume;
            updateMusicVolume();
        };
    }

    if (music) {
        music.oninput = () => {
            musicVolume = parseFloat(music.value);
            localStorage.setItem("musicVolume", musicVolume);
            updateMusicVolume();
        };
    }

    if (effects) {
        effects.oninput = () => {
            effectsVolume = parseFloat(effects.value);
            localStorage.setItem("effectsVolume", effectsVolume);
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
    document.body.classList.remove("game-ended", "game-started");

    document.getElementById("restartButton").style.display = "none";
    document.getElementById("menuButton").style.display = "none";

    gameStarted = false;
    stopMusic();
    location.reload();
}



window.addEventListener("keydown", (e) => {
    setKeyState(e.keyCode, true);

    if (e.keyCode == 32) {
        e.preventDefault();
    }
});


window.addEventListener("keyup", (e) => {
    setKeyState(e.keyCode, false);

    if (e.keyCode == 32) {
        e.preventDefault();
    }
});


function setKeyState(keyCode, pressed) {
    if (keyCode == 39) keyboard.RIGHT = pressed;
    if (keyCode == 37) keyboard.LEFT = pressed;
    if (keyCode == 38) keyboard.UP = pressed;
    if (keyCode == 40) keyboard.DOWN = pressed;
    if (keyCode == 32) keyboard.SPACE = pressed;
    if (keyCode == 68) keyboard.D = pressed;
}


// Overlays
function openInstructions() {
    showOverlay("instructionsOverlay");
}

function closeInstructions() {
    hideOverlay("instructionsOverlay");
}

function openControls() {
    showOverlay("controlsOverlay");
}

function closeControls() {
    hideOverlay("controlsOverlay");
}

function openImprint() {
    showOverlay("imprintOverlay");
}

function closeImprint() {
    hideOverlay("imprintOverlay");
}

function openSoundSettings() {
    showOverlay("soundOverlay");
}

function closeSoundSettings() {
    hideOverlay("soundOverlay");
}


function showOverlay(id) {
    document.getElementById(id).style.display = "flex";
}


function hideOverlay(id) {
    document.getElementById(id).style.display = "none";
}

