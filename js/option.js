import { openModal,
        closeModal,
        addMouseInput,
        removeMouseInput,
        addKeyboardInput,
        removeKeyboardInput,
        findButton
    } from "./utility.js";

/** 언어 환경 목록
 * @readonly
 * @constant languages
 * @type {string[]} */
const languages = ['English', '한국어', '나랏말ᄊᆞᆷ'];
/** 조작키의 코드 값 목록
 * @namespace keyset
 * @property {string} pause — 일시 정지
 * @property {string} move_left — 왼쪽으로 옮김
 * @property {string} move_right — 오른쪽으로 옮김
 * @property {string} rotate_left — 왼쪽으로 돌림
 * @property {string} rotate_right — 오른쪽으로 돌림
 * @property {string} soft_drop — 아래로 내림
 * @property {string} hard_drop — 땅으로 떨어뜨림
 * @property {string} hold — 한쪽에 쟁여 둠
 * @description 저마다 KeyboardEvent의 code 값을 가리킨다.
 */
const keyset = {
    /** 일시 정지
     * @type {string} KeyboardEvent의 code 값*/
    pause: 'KeyP',
    /** 왼쪽으로 옮김
     * @type {string} KeyboardEvent의 code 값*/
    move_left: 'ArrowLeft',
    /** 오른쪽으로 옮김
     * @type {string} KeyboardEvent의 code 값*/
    move_right: 'ArrowRight',
    /** 왼쪽으로 돌림
     * @type {string} KeyboardEvent의 code 값*/
    rotate_left: 'KeyZ',
    /** 오른쪽으로 돌림
     * @type {string} KeyboardEvent의 code 값*/
    rotate_right: 'ArrowUp',
    /** 아래로 내림
     * @type {string} KeyboardEvent의 code 값*/
    soft_drop: 'ArrowDown',
    /** 땅으로 떨어뜨림
     * @type {string} KeyboardEvent의 code 값*/
    hard_drop: 'Space',
    /** 한쪽에 쟁여 둠
     * @type {string} KeyboardEvent의 code 값*/
    hold: 'KeyC'
};
/** 조작키의 기초 설정값 목록
 * @readonly
 * @constant defaultKeyset
 * @namespace defaultKeyset
 * @property {string} pause — 일시 정지
 * @property {string} move_left — 왼쪽으로 옮김
 * @property {string} move_right — 오른쪽으로 옮김
 * @property {string} rotate_left — 왼쪽으로 돌림
 * @property {string} rotate_right — 오른쪽으로 돌림
 * @property {string} soft_drop — 아래로 내림
 * @property {string} hard_drop — 땅으로 떨어뜨림
 * @property {string} hold — 한쪽에 쟁여 둠
 * @description 저마다 KeyboardEvent의 code 값을 가리킨다.
 */
const defaultKeyset = {
    /** 일시 정지
     * @type {string} KeyboardEvent의 code 값*/
    pause: 'KeyP',
    /** 왼쪽으로 옮김
     * @type {string} KeyboardEvent의 code 값*/
    move_left: 'ArrowLeft',
    /** 오른쪽으로 옮김
     * @type {string} KeyboardEvent의 code 값*/
    move_right: 'ArrowRight',
    /** 왼쪽으로 돌림
     * @type {string} KeyboardEvent의 code 값*/
    rotate_left: 'KeyZ',
    /** 오른쪽으로 돌림
     * @type {string} KeyboardEvent의 code 값*/
    rotate_right: 'ArrowUp',
    /** 아래로 내림
     * @type {string} KeyboardEvent의 code 값*/
    soft_drop: 'ArrowDown',
    /** 땅으로 떨어뜨림
     * @type {string} KeyboardEvent의 code 값*/
    hard_drop: 'Space',
    /** 한쪽에 쟁여 둠
     * @type {string} KeyboardEvent의 code 값*/
    hold: 'KeyC'
};
/** 조작키에서 제외할 입력 목록
 * @readonly
 * @constant invalid_key
 * @type {string[]} */
const invalid_key = ['Escape', 'F1'];
/** 효과음, 배경음 크기
 * @namespace soundVol
 * @property {number} sfx_vol 효과음 크기 (0–1)
 * @property {number} bgm_vol 배경음 크기 (0–1) */
const soundVol = {
    /** 효과음 크기
     * @type {number} 0부터 1까지 */
    sfx_vol: 1,
    /** 배경음 크기
     * @type {number} 0부터 1까지 */
    bgm_vol: 1
};
/** 조작키 코드 가져오기
 * @function getKeyset
 * @param {keyof keyset} [action] 동작 이름
 * @returns {string|keyset|undefined} 매개변수가 있으면 그에 맞는 코드(string)를 돌려 주고, 없으면 조작키 목록 객체(object)를 돌려 준다. */
export const getKeyset = (action) => {
    return (action === undefined)? keyset : keyset[action];
};
/** 조작키 코드 바꾸기
 * @function setKeyset
 * @param {keyof keyset} action 동작 이름
 * @param {string} keyCode 동작을 조작할 KeyboardEvent의 code 값 */
const setKeyset = (action, keyCode) => {
    if(keyset[action] !== undefined)
        keyset[action] = keyCode;
};
/** 효과음 크기 가져오기
 * @function getSFXVol
 * @returns {number} 0부터 1까지 */
export const getSFXVol = () => {
    return soundVol.sfx_vol;
};
/** 효과음 크기 바꾸기
 * @function setSFXVol
 * @param {number} vol 0부터 1까지 */
const setSFXVol = (vol) => {
    soundVol.sfx_vol = vol;
};
/** 배경음 크기 가져오기
 * @function getBGMVol
 * @returns {number} 0부터 1까지 */
export const getBGMVol = () => {
    return soundVol.bgm_vol;
};
/** 배경음 크기 바꾸기
 * @function setBGMVol
 * @param {number} vol 0부터 1까지 */
const setBGMVol = (vol) => {
    soundVol.bgm_vol = vol;
};
/** 옵션 모달 열기
 * @function openOptionModal */
export const openOptionModal = () => {
    addMouseInput(openModal("option"), clickOption);
};
/** 옵션 모달 닫기
 * @function closeOptionModal */
const closeOptionModal = () => {
    removeMouseInput(closeModal("option"), clickOption);
};
/** 옵션 모달 마우스클릭 콜백 함수
 * @function clickOption
 * @param {MouseEvent} event 
 * @description Done 버튼을 누르면 옵션 모달이 닫힌다. */
const clickOption = (event) => {
    switch(findButton(event)){
        case 'optionDone':
            closeOptionModal();
            break;
    }
};