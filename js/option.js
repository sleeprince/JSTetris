import { openModal,
        closeModal,
        addMouseInput,
        removeMouseInput,
        addKeyboardInput,
        removeKeyboardInput,
        findButton
    } from "./utility.js";

/** 언어 환경 목록 */
const languages = ['English', '한국어', '나랏말ᄊᆞᆷ'];
/** 조작키 코드 값 목록 */
const keyset = {
    pause: 'KeyP',
    move_left: 'ArrowLeft',
    move_right: 'ArrowRight',
    rotate_left: 'KeyZ',
    rotate_right: 'ArrowUp',
    soft_drop: 'ArrowDown',
    hard_drop: 'Space',
    hold: 'KeyC'
};
/** 조작키에서 제외할 입력 목록 */
const invalid_key = ['Escape', 'F1'];
/** 효과음, 배경음 크기 */
const sound = {
    sfx_vol: 1,
    bgm_vol: 1
};
/** 조작키 받아오기. 
 * 'pause', 'move_left' 따위 키를 입력하면 키에 해당하는 코드(string)를 돌려 주고, 
 * 입력이 없으면 조작키 객체(object)를 돌려 준다. */
export const getKeyset = (action) => {
    return (action === undefined)? keyset : keyset[action];
};
const setKeyset = (action, keyCode) => {
    keyset[action] = keyCode;
};
export const getSFXVol = () => {
    return sound.sfx_vol;
};
const setSFXVol = (vol) => {
    sound.sfx_vol = vol;
};
export const getBGMVol = () => {
    return sound.bgm_vol;
};
const setBGMVol = (vol) => {
    sound.bgm_vol = vol;
};
export const openOptionModal = () => {
    addMouseInput(openModal("option"), clickOption);
};
const closeOptionModal = () => {
    removeMouseInput(closeModal("option"), clickOption);
};
const clickOption = (event) => {
    switch(findButton(event)){
        case 'optionDone':
            closeOptionModal();
            break;
    }
};