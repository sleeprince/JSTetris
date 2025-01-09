import { getSFXVol, getBGMVol } from "./option.js";
const bgm = document.getElementById("bgm");
const bgm_list = ["Korobeiniki", "Loginska", "Bradinsky", "Kalinka", "Troika"];
const bgm_root = './sound/bgm/';
const sfx_root = './sound/sfx/';
var timerId;
var current_index = 0;

export const playBGM = async () => {
    let state = await new Promise(resolve => {
            setTimeout(()=>{
                resolve(bgm.networkState);
            }, 50);
        });
    if(state === 1){
        let duration = bgm.duration;
        let currentTime = bgm.currentTime;        
        timerId = setTimeout(() => {
            setNextBGM();
            playBGM();
        }, (duration - currentTime) * 1000);
        bgm.play();
    }else{
        setNextBGM();
        playBGM();
    }
};
export const pauseBGM = () => {
    bgm.pause();
    clearTimeout(timerId);
};
export const resetPlayList = () => {
    current_index = 0;
    setBGMSource(current_index);
};
const setNextBGM = () => {
    current_index++;
    current_index %= bgm_list.length;
    setBGMSource(current_index);
};
const setBGMSource = (index) => {
    let sources = bgm.getElementsByTagName("source");
    sources[0].src = bgm_root + bgm_list[index] + '.mp3';
    sources[1].src = bgm_root + bgm_list[index] + '.ogg';
    bgm.volume = getBGMVol();
    bgm.load();
};
export const playLockingSFX = () => {
    playSFX("locking");
};
export const playMovingSFX = () => {
    playSFX("move");
};
export const playRotatingSFX = () => {
    playSFX("rotation");
};
export const playDeletingSFX = () => {
    playSFX("deletion");
};
export const playHoldSFX = () => {
    playSFX("hold");
};
const playSFX = (type) => {
    let ingame = document.getElementById("ingame");
    let audio = document.createElement("audio");
    let fileNm = "sfx_" + type;
    let src_mpeg = createSourceNode(sfx_root, fileNm + ".mp3");
    let src_ogg = createSourceNode(sfx_root, fileNm + ".ogg");
    audio.appendChild(src_mpeg);
    audio.appendChild(src_ogg);
    ingame.appendChild(audio);
    audio.volume = getBGMVol();
    audio.play();
    setTimeout(function removeSFX(){
        if(isNaN(audio.duration))
            setTimeout(removeSFX, 20);
        else if(audio.duration > audio.currentTime)
            setTimeout(removeSFX, (audio.duration - audio.currentTime) * 1000);
        else
            audio.remove();
    }, 20);
};
const createSourceNode = (root, fileNm) => {
    let source = document.createElement("source");
    let type = '';
    switch(fileNm.slice(-4)){
        case '.mp3':
            type = "audio/mpeg";
            break;
        case '.ogg':
            type = "audio/ogg";
            break;
        case '.wav':
            type = "audio/wav";
            break;
        default:
            return null;
    }
    source.type = type;
    source.src = root + fileNm;
    return source;
};