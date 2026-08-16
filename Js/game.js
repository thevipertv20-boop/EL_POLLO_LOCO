let canvas;
let world;
let keyboard = new Keyboard();
let touchControls;

let musicOn = false;
let gameStarted = false;
let gamePaused = false;

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
    musicOn = false;
    localStorage.setItem("musicOn", "false");
    loadSoundSettings();
    setupVolumeControls();
    updateMusicIcon();
    AudioHub.muted = true;
}

function startGame() {

    let restartButton = document.getElementById("restartButton");
    let menuButton = document.getElementById("menuButton");
    if (restartButton) restartButton.style.display = "none";
    if (menuButton) menuButton.style.display = "none";
    document.getElementById("startScreen").style.display = "none";
    document.body.classList.remove("game-ended");
    document.body.classList.add("game-started");
    gameStarted = true;
    gamePaused = false;
    hideOverlay("pauseOverlay");
    if (canvas) canvas.style.visibility = "visible";
    stopMusic();
    gameMusic.currentTime = 0;
    if (musicOn) gameMusic.play();
    if (world) world.destroy();
    world = new World(canvas, keyboard);
    world.gamePaused = false;
}

function togglePause() {
    if (!gameStarted || document.body.classList.contains("game-ended")) return;

    gamePaused = !gamePaused;

    if (world) world.gamePaused = gamePaused;

    let overlay = document.getElementById("pauseOverlay");

    if (overlay) {
        overlay.style.display = gamePaused ? "flex" : "none";
    }

    if (gamePaused) {
        keyboard.LEFT = false;
        keyboard.RIGHT = false;
        keyboard.UP = false;
        keyboard.DOWN = false;
        keyboard.SPACE = false;
        keyboard.D = false;
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

function toggleMusic() {
    musicOn = !musicOn;
    localStorage.setItem("musicOn", musicOn);
    AudioHub.muted = !musicOn;
    updateMusicIcon();

    if (musicOn) {
        gameStarted ? gameMusic.play() : startMusic.play();
    } else {
        stopMusic();
    }
}

function updateMusicIcon() {
    let icon = document.getElementById("musicIcon");
    let soundButton = document.getElementById("soundToggleButton");
    let menuButton = document.querySelector(
        '#startScreen button[onclick="openSoundSettings()"]'
    );

    if (icon) {
        icon.src = musicOn
            ? "img/El_pollo_Loco_Icon/SoundAn.jpg"
            : "img/El_pollo_Loco_Icon/SoundAus.jpg";
    }

    if (soundButton) {
        soundButton.textContent = musicOn ? "MUSIK: AN" : "MUSIK: AUS";
    }

    if (menuButton) {
        menuButton.textContent = musicOn ? "SOUND: AN" : "SOUND: AUS";
    }
}

function updateMusic() {
    updateMusicIcon();
    musicOn ? playCurrentMusic() : stopMusic();
}

function playCurrentMusic() {
    if (!musicOn || gamePaused) return;
    gameStarted ? gameMusic.play() : startMusic.play();
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
    if (world) world.destroy();
    startGame();
}

function backToMenu() {
    gamePaused = false;
    gameStarted = false;

    document.body.classList.remove("game-ended", "game-started");
    hideOverlay("pauseOverlay");

    let restartButton = document.getElementById("restartButton");
    let menuButton = document.getElementById("menuButton");

    if (restartButton) restartButton.style.display = "none";
    if (menuButton) menuButton.style.display = "none";

    stopMusic();

    if (world) {
        world.destroy();
        world = null;
    }

    document.getElementById("startScreen").style.display = "flex";

    if (canvas) canvas.style.visibility = "hidden";
}

window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        e.preventDefault();
        handleEscape();
        return;
    }

    if (e.keyCode === 32) {
        e.preventDefault();
        if (e.repeat) return;
        keyboard.SPACE = true;
        return;
    }

    setKeyState(e.keyCode, true);
});

window.addEventListener("keyup", e => {
    setKeyState(e.keyCode, false);

    if (e.keyCode === 32) {
        e.preventDefault();
    }
});

function setKeyState(keyCode, pressed) {
    if (keyCode === 39) keyboard.RIGHT = pressed;
    if (keyCode === 37) keyboard.LEFT = pressed;
    if (keyCode === 38) keyboard.UP = pressed;
    if (keyCode === 40) keyboard.DOWN = pressed;
    if (keyCode === 32) keyboard.SPACE = pressed;
    if (keyCode === 68) keyboard.D = pressed;
}

function handleEscape() {
    if (isOverlayOpen("instructionsOverlay")) return closeInstructions();
    if (isOverlayOpen("controlsOverlay")) return closeControls();
    if (isOverlayOpen("imprintOverlay")) return closeImprint();
    if (isOverlayOpen("soundOverlay")) return closeSoundSettings();
    if (gameStarted) togglePause();
}

function isOverlayOpen(id) {
    let overlay = document.getElementById(id);
    return overlay && overlay.style.display === "flex";
}

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
    if (gamePaused) showOverlay("pauseOverlay");
}

function openSoundSettings() {
    showOverlay("soundOverlay");
}

function closeSoundSettings() {
    hideOverlay("soundOverlay");
    if (gamePaused) showOverlay("pauseOverlay");
}

function openPauseControls() {
    hideOverlay("pauseOverlay");
    showOverlay("controlsOverlay");
}

function openPauseSound() {
    hideOverlay("pauseOverlay");
    showOverlay("soundOverlay");
}

function openImprint() {
    showOverlay("imprintOverlay");
}

function closeImprint() {
    hideOverlay("imprintOverlay");
}

function showOverlay(id) {
    let overlay = document.getElementById(id);
    if (overlay) overlay.style.display = "flex";
}

function hideOverlay(id) {
    let overlay = document.getElementById(id);
    if (overlay) overlay.style.display = "none";
}
