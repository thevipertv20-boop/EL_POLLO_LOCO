let canvas;
let world;
let keyboard = new Keyboard();
let musicOn = true;
let gameStarted = false;
let musicVolume = 1;
let startMusic = new Audio("audio/StartGame.mp3");
let gameMusic = new Audio("audio/SpielGame.mp3");

function init() {
    canvas = document.getElementById("canvas");
    setupVolumeControls();

    if (sessionStorage.getItem('restartGame') === 'true') {
        sessionStorage.removeItem('restartGame');
        startGame();
    }
}

startMusic.loop = true;
startMusic.volume = 0.2 * musicVolume;

gameMusic.loop = true;
gameMusic.volume = 0.2 * musicVolume;

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


function toggleMusic() {
    musicOn = !musicOn;
    updateMusic();
}

function updateMusic() {
    let icon = document.getElementById('musicIcon');
    icon.src = musicOn
        ? 'img/El_pollo_Loco_Icon/SoundAn.jpg'
        : 'img/El_pollo_Loco_Icon/SoundAus.jpg';
    if (musicOn) playCurrentMusic();
    else stopMusic();
}

function playCurrentMusic() {
    if (gameStarted) gameMusic.play();
    else startMusic.play();
}

function stopMusic() {
    startMusic.pause();
    gameMusic.pause();
}

function setupVolumeControls() {
    let master = document.getElementById('masterVolume');
    let music = document.getElementById('musicVolume');
    let effects = document.getElementById('effectsVolume');

    master.oninput = () => {
        AudioHub.masterVolume = master.value;
        updateMusicVolume();
    };

    music.oninput = () => {
        musicVolume = music.value;
        updateMusicVolume();
    };

    effects.oninput = () => {
        AudioHub.effectsVolume = effects.value;
    };
}

function updateMusicVolume() {
    let volume = musicVolume * AudioHub.masterVolume;
    startMusic.volume = volume * 0.2;
    gameMusic.volume = volume * 0.2;
}

function restartGame() {
    sessionStorage.setItem('restartGame', 'true');
    location.reload();
}

function backToMenu() {
    location.reload();
}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 68) keyboard.D = false;
});

function openInstructions() {
    document.getElementById('instructionsOverlay').style.display = 'flex';
}

function closeInstructions() {
    document.getElementById('instructionsOverlay').style.display = 'none';
}

function openControls() {
    document.getElementById('controlsOverlay').style.display = 'flex';
}

function closeControls() {
    document.getElementById('controlsOverlay').style.display = 'none';
}

function openImprint() {
    document.getElementById('imprintOverlay').style.display = 'flex';
}

function closeImprint() {
    document.getElementById('imprintOverlay').style.display = 'none';
}

function openSoundSettings() {
    document.getElementById('soundOverlay').style.display = 'flex';
}

function closeSoundSettings() {
    document.getElementById('soundOverlay').style.display = 'none';
}

