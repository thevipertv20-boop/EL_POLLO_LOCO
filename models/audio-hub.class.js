class AudioHub {

    static COIN = new Audio("audio/Coins_Sammeln.mp3");
    static BOTTLE = new Audio("audio/Flaschensammeln.mp3");
    static BOSS_HIT = new Audio("audio/Boss_hit_sound.mp3");
    static BOSS_APPEAR = new Audio("audio/Boss_ist_erschinen.mp3");
    static CHICKEN_DEAD = new Audio("audio/Chicken_tot.mp3");
    static BOSS_WIN = new Audio("audio/Boss_sieg_ende.mp3");
    static GAME_OVER = new Audio("audio/Game_Over.mp3");

    static masterVolume = 1;
    static effectsVolume = 1;

    // NEU: zentraler Mute-Schalter, den game.js setzt.
    // Vorher hat der Mute-Button NUR die Musik (startMusic/gameMusic)
    // gestoppt - alle AudioHub-Sounds (Coin, Flasche, Chicken, Boss ...)
    // liefen unabhängig davon einfach weiter.
    static muted = false;

    static allSounds = [
        AudioHub.COIN,
        AudioHub.BOTTLE,
        AudioHub.BOSS_HIT,
        AudioHub.BOSS_APPEAR,
        AudioHub.CHICKEN_DEAD,
        AudioHub.BOSS_WIN,
        AudioHub.GAME_OVER
    ];

    static playOne(sound) {
        if (AudioHub.muted) return;

        const audio = sound.cloneNode();

        audio.volume = AudioHub.masterVolume *
            AudioHub.effectsVolume * 0.5;

        audio.currentTime = 0;
        audio.play();
    }

    static stopAll() {
        AudioHub.allSounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}