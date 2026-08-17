let canvas;
let world;
let keyboard = new Keyboard();
let touchControls;

let musicOn = false;
let gameStarted = false;
let gamePaused = false;

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

/**
 * Initializes the game and loads the saved sound settings.
 */
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

/**
 * Starts a new game.
 */
function startGame() {
    hideEndButtons();
    prepareGameScreen();
    resetGameState();
    startGameMusic();
    createWorld();
}

/**
 * Hides the end screen buttons.
 */
function hideEndButtons() {
    const restartButton =
        document.getElementById("restartButton");

    const menuButton =
        document.getElementById("menuButton");

    if (restartButton) {
        restartButton.style.display = "none";
    }

    if (menuButton) {
        menuButton.style.display = "none";
    }
}

/**
 * Prepares the game screen for a new game.
 */
function prepareGameScreen() {
    document.getElementById("startScreen").style.display = "none";

    document.body.classList.remove("game-ended");
    document.body.classList.add("game-started");

    if (canvas) {
        canvas.style.visibility = "visible";
    }

    hideOverlay("pauseOverlay");
}

/**
 * Resets the game state before starting.
 */
function resetGameState() {
    gameStarted = true;
    gamePaused = false;

    if (world) {
        world.destroy();
    }
}

/**
 * Starts the game music when music is enabled.
 */
function startGameMusic() {
    stopMusic();
    gameMusic.currentTime = 0;

    if (musicOn) {
        gameMusic.play();
    }
}

/**
 * Creates a new game world.
 */
function createWorld() {
    world = new World(canvas, keyboard);
    world.gamePaused = false;
}

/**
 * Toggles the game pause state.
 */
function togglePause() {
    if (!canTogglePause()) return;

    gamePaused = !gamePaused;

    updateWorldPauseState();
    updatePauseOverlay();

    if (gamePaused) {
        resetKeyboardState();
    }
}

/**
 * Checks whether the game can be paused.
 * @returns {boolean} True when the game can be paused.
 */
function canTogglePause() {
    return (
        gameStarted &&
        !document.body.classList.contains("game-ended")
    );
}

/**
 * Updates the pause state of the world.
 */
function updateWorldPauseState() {
    if (world) {
        world.gamePaused = gamePaused;
    }
}

/**
 * Shows or hides the pause overlay.
 */
function updatePauseOverlay() {
    const display = gamePaused ? "flex" : "none";
    const overlay = document.getElementById("pauseOverlay");

    if (overlay) {
        overlay.style.display = display;
    }
}

/**
 * Resets all keyboard inputs.
 */
function resetKeyboardState() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
}

/**
 * Loads the saved sound settings.
 */
function loadSoundSettings() {
    AudioHub.masterVolume = masterVolume;
    AudioHub.effectsVolume = effectsVolume;

    updateMusicVolume();
    setVolumeInputValues();
}

/**
 * Sets the saved values on the volume controls.
 */
function setVolumeInputValues() {
    const master =
        document.getElementById("masterVolume");

    const music =
        document.getElementById("musicVolume");

    const effects =
        document.getElementById("effectsVolume");

    if (master) master.value = masterVolume;
    if (music) music.value = musicVolume;
    if (effects) effects.value = effectsVolume;
}

/**
 * Toggles game music and sound effects.
 */
function toggleMusic() {
    musicOn = !musicOn;

    localStorage.setItem("musicOn", musicOn);
    AudioHub.muted = !musicOn;

    updateMusicIcon();

    if (musicOn) {
        playCurrentMusic();
        return;
    }

    stopMusic();
}

/**
 * Updates the music and sound icons.
 */
function updateMusicIcon() {
    const icon =
        document.getElementById("musicIcon");

    const soundButton =
        document.getElementById("soundToggleButton");

    const menuButton =
        document.querySelector(
            '#startScreen button[onclick="openSoundSettings()"]'
        );

    updateMusicImage(icon);
    updateSoundButton(soundButton);
    updateMenuSoundButton(menuButton);
}

/**
 * Updates the main music icon.
 * @param {HTMLImageElement} icon - Music icon.
 */
function updateMusicImage(icon) {
    if (!icon) return;

    icon.src = musicOn
        ? "img/El_pollo_Loco_Icon/SoundAn.jpg"
        : "img/El_pollo_Loco_Icon/SoundAus.jpg";
}

/**
 * Updates the sound settings button.
 * @param {HTMLElement} button - Sound button.
 */
function updateSoundButton(button) {
    if (!button) return;

    button.textContent =
        musicOn ? "MUSIK: AN" : "MUSIK: AUS";
}

/**
 * Updates the start screen sound button.
 * @param {HTMLElement} button - Sound button.
 */
function updateMenuSoundButton(button) {
    if (!button) return;

    button.textContent =
        musicOn ? "SOUND: AN" : "SOUND: AUS";
}

/**
 * Updates the current music state.
 */
function updateMusic() {
    updateMusicIcon();

    if (musicOn) {
        playCurrentMusic();
        return;
    }

    stopMusic();
}

/**
 * Plays the currently selected background music.
 */
function playCurrentMusic() {
    if (!musicOn || gamePaused) return;

    if (gameStarted) {
        gameMusic.play();
        return;
    }

    startMusic.play();
}

/**
 * Stops all background music.
 */
function stopMusic() {
    startMusic.pause();
    gameMusic.pause();
}

/**
 * Connects the volume sliders with the sound settings.
 */
function setupVolumeControls() {
    setupMasterVolume();
    setupMusicVolume();
    setupEffectsVolume();
}

/**
 * Connects the master volume slider.
 */
function setupMasterVolume() {
    const master =
        document.getElementById("masterVolume");

    if (!master) return;

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

/**
 * Connects the music volume slider.
 */
function setupMusicVolume() {
    const music =
        document.getElementById("musicVolume");

    if (!music) return;

    music.oninput = () => {
        musicVolume = parseFloat(music.value);

        localStorage.setItem(
            "musicVolume",
            musicVolume
        );

        updateMusicVolume();
    };
}

/**
 * Connects the effects volume slider.
 */
function setupEffectsVolume() {
    const effects =
        document.getElementById("effectsVolume");

    if (!effects) return;

    effects.oninput = () => {
        effectsVolume = parseFloat(effects.value);

        localStorage.setItem(
            "effectsVolume",
            effectsVolume
        );

        AudioHub.effectsVolume = effectsVolume;
    };
}

/**
 * Updates the volume of the background music.
 */
function updateMusicVolume() {
    const volume =
        musicVolume * masterVolume;

    startMusic.volume = volume * 0.2;
    gameMusic.volume = volume * 0.2;
}

/**
 * Restarts the current game.
 */
function restartGame() {
    if (world) {
        world.destroy();
    }

    startGame();
}

/**
 * Returns to the main menu.
 */
function backToMenu() {
    resetMenuState();
    hideEndButtons();
    stopMusic();

    destroyWorld();
    showStartScreen();
}

/**
 * Resets the menu and game state.
 */
function resetMenuState() {
    gamePaused = false;
    gameStarted = false;

    document.body.classList.remove(
        "game-ended",
        "game-started"
    );

    hideOverlay("pauseOverlay");
}

/**
 * Destroys the current game world.
 */
function destroyWorld() {
    if (!world) return;

    world.destroy();
    world = null;
}

/**
 * Shows the start screen.
 */
function showStartScreen() {
    document.getElementById(
        "startScreen"
    ).style.display = "flex";

    if (canvas) {
        canvas.style.visibility = "hidden";
    }
}

/**
 * Handles keyboard input.
 */
window.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        event.preventDefault();
        handleEscape();
        return;
    }

    if (event.keyCode === 32) {
        handleSpaceKey(event);
        return;
    }

    setKeyState(event.keyCode, true);
});

/**
 * Handles keyboard release.
 */
window.addEventListener("keyup", event => {
    setKeyState(event.keyCode, false);

    if (event.keyCode === 32) {
        event.preventDefault();
    }
});

/**
 * Handles the space key.
 * @param {KeyboardEvent} event - Keyboard event.
 */
function handleSpaceKey(event) {
    event.preventDefault();

    if (event.repeat) return;

    keyboard.SPACE = true;
}

/**
 * Sets the state of a keyboard key.
 * @param {number} keyCode - Keyboard key code.
 * @param {boolean} pressed - Whether the key is pressed.
 */
function setKeyState(keyCode, pressed) {
    if (keyCode === 39) {
        keyboard.RIGHT = pressed;
    }

    if (keyCode === 37) {
        keyboard.LEFT = pressed;
    }

    if (keyCode === 38) {
        keyboard.UP = pressed;
    }

    if (keyCode === 40) {
        keyboard.DOWN = pressed;
    }

    if (keyCode === 32) {
        keyboard.SPACE = pressed;
    }

    if (keyCode === 68) {
        keyboard.D = pressed;
    }
}

/**
 * Handles the Escape key.
 */
function handleEscape() {
    if (isOverlayOpen("instructionsOverlay")) {
        closeInstructions();
        return;
    }

    if (isOverlayOpen("controlsOverlay")) {
        closeControls();
        return;
    }

    if (isOverlayOpen("imprintOverlay")) {
        closeImprint();
        return;
    }

    if (isOverlayOpen("soundOverlay")) {
        closeSoundSettings();
        return;
    }

    if (gameStarted) {
        togglePause();
    }
}

/**
 * Checks whether an overlay is open.
 * @param {string} id - Overlay element ID.
 * @returns {boolean} True when the overlay is open.
 */
function isOverlayOpen(id) {
    const overlay =
        document.getElementById(id);

    return (
        overlay &&
        overlay.style.display === "flex"
    );
}

/**
 * Opens the instructions overlay.
 */
function openInstructions() {
    showOverlay("instructionsOverlay");
}

/**
 * Closes the instructions overlay.
 */
function closeInstructions() {
    hideOverlay("instructionsOverlay");
}

/**
 * Opens the controls overlay.
 */
function openControls() {
    showOverlay("controlsOverlay");
}

/**
 * Closes the controls overlay.
 */
function closeControls() {
    hideOverlay("controlsOverlay");

    if (gamePaused) {
        showOverlay("pauseOverlay");
    }
}

/**
 * Opens the sound settings overlay.
 */
function openSoundSettings() {
    showOverlay("soundOverlay");
}

/**
 * Closes the sound settings overlay.
 */
function closeSoundSettings() {
    hideOverlay("soundOverlay");

    if (gamePaused) {
        showOverlay("pauseOverlay");
    }
}

/**
 * Opens the pause controls.
 */
function openPauseControls() {
    hideOverlay("pauseOverlay");
    showOverlay("controlsOverlay");
}

/**
 * Opens the pause sound settings.
 */
function openPauseSound() {
    hideOverlay("pauseOverlay");
    showOverlay("soundOverlay");
}

/**
 * Opens the imprint overlay.
 */
function openImprint() {
    showOverlay("imprintOverlay");
}

/**
 * Closes the imprint overlay.
 */
function closeImprint() {
    hideOverlay("imprintOverlay");
}

/**
 * Shows an overlay.
 * @param {string} id - Overlay element ID.
 */
function showOverlay(id) {
    const overlay =
        document.getElementById(id);

    if (overlay) {
        overlay.style.display = "flex";
    }
}

/**
 * Hides an overlay.
 * @param {string} id - Overlay element ID.
 */
function hideOverlay(id) {
    const overlay =
        document.getElementById(id);

    if (overlay) {
        overlay.style.display = "none";
    }
}