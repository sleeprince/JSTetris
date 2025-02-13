import { getIniLevel } from "./home.js";
import { getSFXVol, getBGMVol, getLanguage } from "./option.js";

/********************************** 배 경 음 **********************************/
/** 배경 음악을 재생할 HTMLAudio요소 
 * @constant bgm
 * @type {HTMLAudioElement} */
const bgm = document.getElementById("bgm");
/** 배경 음악 목록
 * @readonly
 * @constant bgm_list
 * @type {string[]} */
const bgm_list = ["Korobeiniki", "Loginska", "Bradinsky", "Kalinka", "Troika"];
const bgm_korean = ["코로베이니키", "로긴스카", "브랜딘스키", "칼린카", "트로이카"];
const bgm_old_korean = ["코로베니키", "로낀ᄸᅡ", "ᄈᆞ란띤ᄸᅵ", "칼린카", "ᄐᆞ뢰카"];
/** 배경 음악 파일 경로
 * @readonly
 * @constant bgm_root
 * @type {string} */
const bgm_root = './sound/bgm/';
/** 효과음 파일 경로
 * @readonly
 * @constant sfx_root
 * @type {string} */
const sfx_root = './sound/sfx/';
/** 다음 배경 음악의 재생을 예약하는 setTimeout()의 ID를 가리킨다.
 * @type {number} */
var timerId = 0;
/** 재생 중인 배경 음악의 인덱스
 * @type {number} */
var current_index = 0;
/** 재생 속도 */
var playbackRate = 1.0;
/** 배경 음악 재생
 * @async
 * @function playBGM
 * @description 재생 중인 음악이 끝나면 다음 배경 음악이 이어서 재생된다. */
export const playBGM = async () => {
    // 재생할 음악의 정보 받아오기
    let state = await new Promise(resolve => {
            setTimeout(()=>{
                resolve(bgm.networkState);
            }, 100);
        });
    // 다음 음악을 예약하고 현재 배경 음악을 재생하기
    if(state === 1){
        let duration = bgm.duration;
        let currentTime = bgm.currentTime;  
        let BGM_Volume = getBGMVol();
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            setNextBGM();
            playBGM();
        }, (duration - currentTime) * 1000 * (2.0 - playbackRate) + 1000);
        if(BGM_Volume !== 0){
            bgm.volume = BGM_Volume;
            bgm.playbackRate = playbackRate;
            bgm.play();
            showCurrentBGM();
        }
    }else{
        // 음악을 가져올 수 없는 때에 다음 음악 바로 재생
        setNextBGM();
        playBGM();
    }
};
/** 배경 음악 일시 정지
 * @function pauseBGM */
export const pauseBGM = () => {
    bgm.pause();
    clearTimeout(timerId);
    hideCurrentBGM();
};
/** 배경 음악 초기화
 * @function resetPlayList
 * @description 배경 음악 목록의 처음으로 돌아간다. */
export const resetPlayList = () => {
    current_index = 0;
    updatePlaybackRate(getIniLevel());
    setBGMSource(current_index);
};
/** 다음 배경 음악 틀기
 * @function playNextBGM  */
export const playNextBGM = () => {
    clearTimeout(timerId);
    setNextBGM();
    playBGM();
};
/** 이전 배경 음악 틀기
 * @function playPrevBGM */
export const playPrevBGM = () => {
    clearTimeout(timerId);
    setPrevBGM();
    playBGM();
};
/** 다음 배경 음악으로 넘어가기
 * @function setNextBGM */
const setNextBGM = () => {
    current_index++;
    current_index %= bgm_list.length;
    setBGMSource(current_index);
};
/** 이전 배경 음악으로 넘어가기
 * @function setPrevBGM */
const setPrevBGM = () => {
    current_index = --current_index + bgm_list.length;
    current_index %= bgm_list.length;
    setBGMSource(current_index);
};
/** 목록 번호로 배경 음악 불러오기
 * @function setBGMSource
 * @param {number} index 배경 음악 목록 번호 */
const setBGMSource = (index) => {
    let sources = bgm.getElementsByTagName("source");
    sources[0].src = bgm_root + bgm_list[index] + '.mp3';
    sources[1].src = bgm_root + bgm_list[index] + '.ogg';
    bgm.load();
};
/** 현재 배경 음악 띄우기
 * @function showCurrentBGM */
const showCurrentBGM = () => {
    document.getElementById("prevMusic").innerHTML = '◀';
    document.getElementById("nextMusic").innerHTML = '▶';
    let element = document.getElementById("bgm_title");
    switch(getLanguage()){
        case 'english':
            element.innerHTML = bgm_list[current_index] + '&nbsp;';
            break;
        case 'korean':
            element.innerHTML = bgm_korean[current_index] + '&nbsp;';
            break;
        case 'old_korean':
            element.innerHTML = bgm_old_korean[current_index] + '&nbsp;';
            break;
    }
    adjustCSSAnimation();
};
/** 현재 배경 음악 숨기기
 * @function hideCurrentBGM */
const hideCurrentBGM = () => {
    document.getElementById("prevMusic").innerHTML = '';
    document.getElementById("nextMusic").innerHTML = '';
    document.getElementById("bgm_title").innerHTML = '';
};
/** 배경음악 css 애니메이션의 너비 조정
 * @function adjustCSSAnimation */
const adjustCSSAnimation = () => {
    let title_width = document.getElementById("bgm_title").getBoundingClientRect().width;
    let container_width = document.getElementById("nowPlaying").getBoundingClientRect().width;
    let amplitude = (title_width + container_width)/2
    let done = false;
    for(let sheet of document.styleSheets){
        for(let rule of sheet.cssRules){
            if("bgmAnimation" === rule.name){
                rule.deleteRule('to');
                rule.deleteRule('from');
                rule.appendRule(`from {left: -${amplitude}px;}`);
                rule.appendRule(`to {left: ${amplitude}px;}`);
                done = true;
                break;
            }
        }
        if(done) break;
    }
};
/** 레벨에 따라 재생 속도 늘리기
 * @function updatePlaybackRate
 * @param {number} level */
export const updatePlaybackRate = (level) => {
    // 새 재생 속도
    let tmp_rate = 1.0;
    if(level <= 1){
        tmp_rate = 1.0;
    }else if(level >= 20){
        tmp_rate = 1.5;
    }else{
        tmp_rate = 1.0 + Math.log10((9 * level + 10) / 19) / 2;
    }
    // 원래 재생 속도와 견주어 갱신
    if(playbackRate === tmp_rate)
        return false;
    else
        playbackRate = tmp_rate;
    
    // 다음 배경 음악 재생 예약 갱신
    if(bgm.networkState === 1){
        bgm.playbackRate = playbackRate;
        let duration = bgm.duration;
        let currentTime = bgm.currentTime;
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            setNextBGM();
            playBGM();
        }, (duration - currentTime) * 1000 * (2.0 - playbackRate) + 1000);
    }else{
        // 네트워크 지연시 다시 시도
        setTimeout(() => {
            updatePlaybackRate(level);
        }, 20)
    }
    
    return true;
};
/********************************** 효 과 음 **********************************/
/** 테트로미노가 땅으로 굳는 효과음 재생
 * @function playLockingSFX */
export const playLockingSFX = () => {
    playSFX("locking");
};
/** 테트로미노를 옆으로 옮기는 효과음 재생
 * @function playMovingSFX */
export const playMovingSFX = () => {
    playSFX("move");
};
/** 테트로미노를 돌리는 효과음 재생
 * @function playRotatingSFX */
export const playRotatingSFX = () => {
    playSFX("rotation");
};
/** 꽉 찬 줄이 지워지는 효과음 재생
 * @function playDeletingSFX */
export const playDeletingSFX = () => {
    playSFX("deletion");
};
/** 테트로미노를 쟁여 두고 꺼내는 효과음 재생
 * @function playHoldSFX */
export const playHoldSFX = () => {
    playSFX("hold");
};
/** 효과음 재생 공통 기본 함수
 * @function playSFX
 * @param {"locking"|"move"|"rotation"|"deletion"|"hold"} keyword */
const playSFX = (keyword) => {
    let ingame = document.getElementById("ingame");
    let audio = document.createElement("audio");
    let fileNm = "sfx_" + keyword;
    let src_mpeg = createSourceNode(sfx_root, fileNm + ".mp3");
    let src_ogg = createSourceNode(sfx_root, fileNm + ".ogg");
    audio.appendChild(src_mpeg);
    audio.appendChild(src_ogg);
    ingame.appendChild(audio);
    audio.volume = getSFXVol();
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
/** 파일 소스 노드 만들기
 * @function createSourceNode
 * @param {string} root 파일이 있는 곳의 폴더 경로
 * @param {string} fileNm 확장자를 포함한 파일 이름
 * @returns {HTMLSourceElement} */
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