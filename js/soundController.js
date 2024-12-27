export const bgm = document.getElementById("bgm");
export const sfxs = document.getElementsByClassName("sfx");
const sfx_lock = document.getElementById("sfx_lock");
const sfx_move = document.getElementById("sfx_move");
const sfx_rotation = document.getElementById("sfx_rotation");
const sfx_deletion = document.getElementById("sfx_deletion");
const bgm_list = ["Korobeiniki", "Loinska", "Bradinsky", "Kalinka", "Troika"];
const current_index = 0;

export const playBGM = () => {
    let duration = bgm.duration;
    let currentTime = bgm.currentTime;
    console.log(duration, duration - currentTime);
    // setTimeout(() => {}, duration - currentTime + 1)
    bgm.play();
};
export const pauseBGM = () => {
    bgm.pause();
};
export const resetPlayList = () => {
    current_index = 0;
    bgm.getElementsByTagName("sound");
};
export const playLockingSFX = () => {
    sfx_lock.load();
    sfx_lock.play();
};
export const playMovingSFX = () => {
    sfx_move.load();
    sfx_move.play();
};
export const playRotatingSFX = () => {
    sfx_rotation.load();
    sfx_rotation.play();
};
export const playDeletingSFX = () => {
    sfx_deletion.load();
    sfx_deletion.play();
};

const playNextBGM = () => {

};