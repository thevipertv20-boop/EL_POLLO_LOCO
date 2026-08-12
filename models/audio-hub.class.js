class AudioHub {
    static COIN = new Audio("audio/Coins_Sammeln.mp3");
    static BOTTLE = new Audio("audio/Flaschensammeln.mp3");
    static BOSS_HIT = new Audio("audio/Boss_hit_sound.mp3");
    static BOSS_APPEAR = new Audio("audio/Boss_ist_erschinen.mp3");

    static masterVolume = 1;
    static effectsVolume = 1;

    static allSounds = [
        AudioHub.COIN,
        AudioHub.BOTTLE,
        AudioHub.BOSS_HIT,
        AudioHub.BOSS_APPEAR
    ];

    static playOne(sound) {
        if (sound.readyState == 4) {
            sound.volume = AudioHub.masterVolume *
                AudioHub.effectsVolume * 0.5;
            sound.currentTime = 0;
            sound.play();
        }
    }

    static stopAll() {
        AudioHub.allSounds.forEach(sound => {
            sound.pause();
        });
    }
}