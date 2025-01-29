import { deepCopy, 
        openModal,
        closeModal,
        addMouseInput,
        removeMouseInput,
        addKeyboardInput,
        removeKeyboardInput,
        findButton,
        pseudoEncryptText,
        pseudoDecryptText,
        testObjectStructure,
        addMouseClick,
        removeMouseClick
    } from "./utility.js";
import { playMovingSFX, playHoldSFX } from "./soundController.js";
/** 언어 환경 목록
 * @readonly
 * @constant languages */
const languages = {
    english: 'ENGLISH', 
    korean: '한국어',
    old_korean: '나랏말ᄊᆞᆷ'
};
/** 언어 설정
 * @type {keyof languages} */
var language = '';
/** 기초 언어 설정
 * @readonly
 * @constant DEFAULT_LANGUAGE
 * @type {keyof languages} */
const DEFAULT_LANGUAGE = 'english';
/** 조작키의 코드 값 목록
 * @type {DEFAULT_KEYSET}
 * @namespace keyset 
 * @property {string} pause — 일시 정지
 * @property {string} move_left — 왼쪽으로 옮김
 * @property {string} move_right — 오른쪽으로 옮김
 * @property {string} rotate_left — 왼쪽으로 돌림
 * @property {string} rotate_right — 오른쪽으로 돌림
 * @property {string} soft_drop — 아래로 내림
 * @property {string} hard_drop — 땅으로 떨어뜨림
 * @property {string} hold — 한쪽에 쟁여 둠
 * @description 저마다 KeyboardEvent의 code 값을 가리킨다. */
const keyset = {};
/** 조작키의 기초 설정값 목록
 * @readonly
 * @constant DEFAULT_KEYSET
 * @namespace DEFAULT_KEYSET
 * @property {string} pause — 일시 정지
 * @property {string} move_left — 왼쪽으로 옮김
 * @property {string} move_right — 오른쪽으로 옮김
 * @property {string} rotate_left — 왼쪽으로 돌림
 * @property {string} rotate_right — 오른쪽으로 돌림
 * @property {string} soft_drop — 아래로 내림
 * @property {string} hard_drop — 땅으로 떨어뜨림
 * @property {string} hold — 한쪽에 쟁여 둠
 * @description 저마다 KeyboardEvent의 code 값을 가리킨다. */
const DEFAULT_KEYSET = {
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
Object.freeze(DEFAULT_KEYSET);
/** 조작키에서 제외할 입력 목록
 * @readonly
 * @constant invalid_key
 * @type {string[]} */
const invalid_key = ['Escape', 'MetaLeft', 'MetaRight', 'ContextMenu', 'MediaTrackNext', 'MediaTrackPrevious', 'VolumeMute', 'VolumeDown', 'VolumeUp', 'WakeUp', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
/** 효과음, 배경음 크기
 * @type {DEFAULT_SOUND_VOL}
 * @namespace soundVol
 * @property {number} sfx_vol 효과음 크기 (0–1)
 * @property {number} bgm_vol 배경음 크기 (0–1) */
const soundVol = {};
/** 효과음, 배경음 크기 기초 설정
 * @readonly
 * @constant DEFAULT_SOUND_VOL
 * @namespace DEFAULT_SOUND_VOL
 * @property {number} sfx_vol 효과음 크기 (0–1)
 * @property {number} bgm_vol 배경음 크기 (0–1) */
const DEFAULT_SOUND_VOL = {
    /** 효과음 크기
     * @type {number} 0부터 1까지 */
    sfx_vol: 1,
    /** 배경음 크기
     * @type {number} 0부터 1까지 */
    bgm_vol: 1
};
Object.freeze(DEFAULT_SOUND_VOL);
/** 설정을 브라우저의 로컬스토리지에 집어넣기
 * @function saveOptions */
const saveOptions = () => {
    localStorage.setItem("language", pseudoEncryptText(JSON.stringify(language)));
    localStorage.setItem("keyset", pseudoEncryptText(JSON.stringify(keyset)));
    localStorage.setItem("volume", pseudoEncryptText(JSON.stringify(soundVol)));
};
/** 브라우저의 로컬스토리지에서 설정 가져오기
 * @function loadOptions
 * @returns {{language: string, keyset: keyset, volume: soundVol}} 로컬스토리지에 저장된 설정이 없다면 디폴트 값을 돌려 준다. */
const loadOptions = () => {
    return {
        language: getItemFromLocalStorage("language", DEFAULT_LANGUAGE),
        keyset: getItemFromLocalStorage("keyset", DEFAULT_KEYSET),
        volume: getItemFromLocalStorage("volume", DEFAULT_SOUND_VOL)
    }
};
/** 로컬스토리지에서 값 가져오기
 * @function getItemFromLocalStorage
 * @param {"language"|"keyset"|"volume"} key 로컬스토리지에서 값을 받아올 키
 * @param {object} default_item 받아올 값의 보기가 되는 기초 값
 * @returns {object} 키에 따른 값이 바람직하면 그 값을 돌려 주고, 아니면 보기를 돌려 준다. */
const getItemFromLocalStorage = (key, default_item) => {
    // 값이 있는지 확인
    let item = localStorage.getItem(key);
    if(item === null) return deepCopy(default_item);
    // 바람직한 값인지 확인
    item = JSON.parse(pseudoDecryptText(item));
    if(testObjectStructure(item, default_item))
        return item;
    else
        return deepCopy(default_item);
};
/** 설정 초기화
 * @function resetOptions */
const resetOptions = () => {
    // 언어 초기화
    if(setLanguage(DEFAULT_LANGUAGE))
        changeLanguage(language);
    // 조작키 초기화
    Object.keys(DEFAULT_KEYSET).forEach(key => {
        keyset[key] = DEFAULT_KEYSET[key];
    });
    // 소리 크기 초기화
    Object.keys(DEFAULT_SOUND_VOL).forEach(key => {
        soundVol[key] = DEFAULT_SOUND_VOL[key];   
    });
};
/** 점수판 초기화
 * @function resetScores */
const resetScores = () => {
    localStorage.removeItem("record");
};
/** 사용하는 언어 가져오기
 * @function getLanguage
 * @returns {keyof languages} */
export const getLanguage = () => {
    return language;
};
/** 새 언어 설정하기
 * @function setLanguage
 * @param {keyof languages} new_lang
 * @returns {boolean} 새 언어 설정에 성공하면 True를, 실패하면 False를 돌려 준다. */
const setLanguage = (new_lang) => {
    let success = false;

    if(new_lang === language)
        return success;

    if(languages[new_lang] !== undefined){
        language = new_lang;
        success = true;
    }

    return success;
};
/** 조작키 코드 가져오기
 * @function getKeyset
 * @param {keyof DEFAULT_KEYSET} [action] 동작 이름
 * @returns {string|DEFAULT_KEYSET|undefined} 매개변수가 있으면 그에 맞는 코드(string)를 돌려 주고, 없으면 조작키 목록 객체(object)를 돌려 준다. */
export const getKeyset = (action) => {
    return (action === undefined)? keyset : keyset[action];
};
/** 조작키 코드 집어넣기
 * @function setKeyset
 * @param {keyof DEFAULT_KEYSET} action 동작 이름
 * @param {string} keyCode 동작을 조작할 KeyboardEvent의 code 값
 * @returns {boolean} 조작키 설정에 성공하면 True를, 실패하면 False를 돌려 준다.
 * @description 다른 조작키와 코드가 겹치면 다른 조작키의 코드를 지운다. */
const setKeyset = (action, keyCode) => {
    let success = false;
    if(keyset[action] !== undefined){
        keyset[action] = keyCode;
        for(let code of Object.keys(keyset)){
            if(code === action) continue;
            if(keyset[code] === keyCode) keyset[code] = '&nbsp';
        }
        success = true;
    }
    return success;
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
    addMouseInput(openModal("option"), clickOption, overOption);
    refreshOptionModal();
};
/** 옵션 모달 닫기
 * @function closeOptionModal */
const closeOptionModal = () => {
    removeMouseInput(closeModal("option"), clickOption, overOption);
};
/** 옵션 모달 새로 고침
 * @function refreshOptionModal */
const refreshOptionModal = () => {
    fillKeySet();
    fillDropdownBox();
    writeSFXVol();
    writeBGMVol();
};
/** 옵션 모달 마우스클릭 콜백 함수
 * @function clickOption
 * @param {MouseEvent} event */
const clickOption = function(event){
    let isDropdownBtn = false;
    switch(findButton(event)){
        case 'dropdownBtn':
            isDropdownBtn = true;
            playMovingSFX();
            toggleDropdownBox();
            break;
        case 'keyBtn':
            playMovingSFX();
            openKeyInputModal(event.target.id.slice(0, -4), event.target.parentElement.previousElementSibling.innerText);
            break;
        case 'lowerSFX':
            playMovingSFX();
            lowerSFXVol();
            writeSFXVol();
            break;
        case 'raiseSFX':
            playMovingSFX();
            raiseSFXVol();
            writeSFXVol();
            break;
        case 'lowerBGM':
            playMovingSFX();
            lowerBGMVol();
            writeBGMVol ();
            break;
        case 'raiseBGM':
            playMovingSFX();
            raiseBGMVol();
            writeBGMVol();
            break;
        case 'resetScores':
            playMovingSFX();
            openScoreResetModal();
            break;
        case 'resetOptions':
            playMovingSFX();
            openOptionResetModal();
            break;
        case 'optionDone':
            playMovingSFX();   
            saveOptions();
            closeOptionModal();
            break;
    }
    //dropdown 다른 데 눌러도 닫기
    if(!isDropdownBtn) closeDropdownBox();
};
let last_button ='';
/** 옵션 모달 마우스오버 콜백 함수
 * @function overOption
 * @param {MouseEvent} event */
const overOption = function(event){
    let button = findButton(event);
    switch(button){
        case last_button:
            break;
        case 'optionDone':
            playHoldSFX();
            last_button = button;
            break;
        default:
            last_button = '';
    }
};
/** 언어 환경 설정 드롭다운박스에 목록 채우기
 * @function setDropdownBox
 * @description 언어 환경 설정의 드롭다운 박스 안에 지원하는 언어 목록을 채워 넣는다. */
const fillDropdownBox = () => {    
    //드롭다운 박스 버튼(고른 값) 채우기
    let lang_node = document.getElementById('your_language');
    let lang_now = getLanguage()
    setNodeTextByLang(lang_node, wordsById['your_language'], lang_now);

    //드롭다운 박스 안에 있던 목록 지우기
    let dropdown_contents = document.getElementById('dropdown-contents');
    while(dropdown_contents.hasChildNodes())
        dropdown_contents.removeChild(dropdown_contents.firstChild);

    //드롭다운 박스 목록 채우기
    Object.keys(languages).forEach((value) => {
        let lang_option = document.createElement('a');
        lang_option.href = "#";
        lang_option.innerHTML = languages[value];
        lang_option.className = value;
        switch(value){
            case 'korean':
                lang_option.style.fontFamily = `'Noto Sans KR', sans-serif`;
                break;
            case 'old_korean':
                lang_option.style.fontFamily = `'Noto Serif KR', sans-serif`;
        }
        dropdown_contents.append(lang_option);
    });
};
/** 언어 설정 드롭다운 박스가 열려 있는지 가리킴
 * @type {boolean} 드롭다운 박스가 열려 있다면 True를, 닫혀 있다면 False를 가진다. */
var doDropdownBoxOpen = false;
/** 언어 설정 드롭다운 박스 여닫기
 * @function toggleDropdownBox
 * @description 언어 설정 드롭다운 박스가 열려 있으면 닫고, 닫혀 있으면 연다. */
const toggleDropdownBox = () => {
    if(doDropdownBoxOpen)
        closeDropdownBox();
    else
        openDropdownBox();
};
/** 언어 설정 드롭다운 박스 열기
 * @function openDropdownBox */
const openDropdownBox = () => {
    doDropdownBoxOpen = true;
    let dropdownBox = document.getElementById("dropdownBox");
    dropdownBox.style.display = 'flex';
    addMouseClick(dropdownBox, clickDropdownBox);
};
/** 언어 설정 드롭다운 박스 닫기
 * @function closeDropdownBox */
const closeDropdownBox = () => {
    doDropdownBoxOpen = false;
    let dropdownBox = document.getElementById("dropdownBox");
    dropdownBox.style.display = 'none';
    removeMouseClick(dropdownBox, clickDropdownBox);
};
/** 언어 설정 드롭다운 박스 마우스클릭 콜백 함수
 * @function clickDropdownBox
 * @param {MouseEvent} event 
 * @description Document를 한 바퀴 돌면서 wordForword 클래스로 보람된 HTMLElement의 글줄을 바꾼다. */
const clickDropdownBox = function(event){
    let button = findButton(event);
    Object.keys(languages).forEach(lang => {        
        if(button === lang)
            if(setLanguage(lang)){
                changeLanguage(lang);
                fillKeySet();
                writeSFXVol();
                writeBGMVol();                        
            }
    });
};
/** 언어 변경
 * @function changeLanguage
 * @param {keyof languages} language 바꿀 언어 */
const changeLanguage = (lang) => {
    document.querySelectorAll('.wordForWord').forEach(element => {
        setNodeTextByLang(element, wordsById[element.id], lang);
    });
    writeLevelOfHome();
};
const writeLevelOfHome = () => {
    let level_str = document.getElementById("level_num").innerText;
    let level = Number.parseInt(level_str);
    if(Number.isNaN(level))
        level = oldKoreanNumeral.interpretAsArabic(level_str);

    switch(getLanguage()){
        case 'old_korean':
            document.getElementById("level_num").innerHTML = oldKoreanNumeral.buildTheOrdinalPrenoun(level);
            break;
        default:
            document.getElementById("level_num").innerHTML = level;
    }
};
/** 자판 입력 버튼에 글쇠 채우기
 * @function fillKeySet */
const fillKeySet = () => {
    Object.keys(keyset).forEach(key => {
        document.getElementById(`${key}_key`).innerHTML = translateKeyCodeIntoText(keyset[key]);
    });
};
/** 글쇠 코드 값을 내보일 낱말로 바꿈
 * @function translateKeyCodeToText
 * @param {string} keyCode 동작을 조작할 KeyboardEvent의 code 값
 * @returns {string} */
const translateKeyCodeIntoText = (keyCode) => {
    // Left/Right/Up/Down 앞으로 옮기기
    switch(true){
        case keyCode.includes("Left"):
            keyCode = "Left".concat(keyCode.slice(0, keyCode.indexOf("Left")));
            break;
        case keyCode.includes("Right"):
            keyCode = "Right".concat(keyCode.slice(0, keyCode.indexOf("Right")));
            break;
        case keyCode.includes("Up"):
            keyCode = "Up".concat(keyCode.slice(0, keyCode.indexOf("Up")));
            break;
        case keyCode.includes("Down"):
            keyCode = "Down".concat(keyCode.slice(0, keyCode.indexOf("Down")));
            break;
    }
    // 낱말 사이 띄어쓰기
    for(let i = 0; i < keyCode.length; i++){
        if(keyCode.charCodeAt(i) < 97 || keyCode.charCodeAt(i) > 122){
            keyCode = keyCode.slice(0, i) + " " + keyCode.slice(i);
            i++;
        }
    }
    // 옛한글 옮김
    if('old_korean' === getLanguage())
        keyCode = translateKeyTextIntoOldKorean(keyCode);
    // 돌려 주기
    return keyCode;
};
/** 글쇠 입력 모달 열기
 * @function openKeyInputModal
 * @param {keyof DEFAULT_KEYSET} action 설정할 동작 이름
 * @param {string} keyText 모달에 보일 동작 이름 */
const openKeyInputModal = (action, actionText) => {
    document.getElementById("action").innerHTML = action;
    document.getElementById("actionText").innerHTML = actionText;
    addMouseInput(openModal("keyInput"), clickKeyInput, overKeyInput);
    addKeyboardInput(document, keydownKeyInput);
};
/** 글쇠 입력 모달 닫기
 * @function closeKeyInpuModal */
const closeKeyInpuModal = () => {
    document.getElementById("action").innerHTML = '';
    document.getElementById("actionText").innerHTML = '';
    removeKeyboardInput(document, keydownKeyInput);
    removeMouseInput(closeModal("keyInput"), clickKeyInput, overKeyInput);
};
/** 글쇠 입력 모달 키보드 입력 콜백 함수
 * @function keydownKeyInput
 * @param {KeyboardEvent} event */
const keydownKeyInput = function(event){
    let code = event.code;
    let update = true;
    for(let word of invalid_key)
        if(word === code)
            update = false;
    
    let action = document.getElementById("action").innerText;
    if(update){
        setKeyset(action, code);
        refreshOptionModal();
        closeKeyErrorDialogue();
        closeKeyInpuModal();
    }else if(code === 'Escape'){
        closeKeyErrorDialogue();
        closeKeyInpuModal();
    }else{
        openKeyErrorDialogue();
    }
};
/** 글쇠 입력 모달 마우스클릭 콜백 함수
 * @function clickKeyInput
 * @param {MouseEvent} event */
const clickKeyInput = function(event){
    switch(findButton(event)){
        case 'inputCancel':
            playMovingSFX();
            closeKeyErrorDialogue();
            closeKeyInpuModal();
            break;
    }
};
/** 글쇠 입력 모달 마우스오버 콜백 함수
 * @function overKeyInput
 * @param {MouseEvent} event */
const overKeyInput = function(event){
    let button = findButton(event);
    switch(button){
        case last_button:
            break;
        case 'inputCancel':
            playHoldSFX();
            last_button = button;
            break;
        default:
            last_button = '';
    }
};
/** 글쇠 입력 오류 말풍선 열기
 * @function openKeyErrorDialogue */
const openKeyErrorDialogue = () => {
    document.getElementById("invalid_key").show();
    addMouseClick(document.getElementById("closeInvalidKey"), clickCloseKeyErrorButton);
};
/** 글쇠 입력 오류 말풍선 닫기
 * @function closeKeyErrorDialogue */
const closeKeyErrorDialogue = () => {
    document.getElementById("invalid_key").close();
    removeMouseClick(document.getElementById("closeInvalidKey"), clickCloseKeyErrorButton);
};
/** 글쇠 입력 오류 말풍선 닫기 버튼 콜백 함수
 * @function clickCloseKeyErrorButton
 * @param {MouseEvent} event */
const clickCloseKeyErrorButton = function(event){
    event.preventDefault();
    closeKeyErrorDialogue();
};
/** 효과음 키우기
 * @function raiseSFXVol */
const raiseSFXVol = () => {
    let vol = getSFXVol();
    if(vol < 1){
        vol = parseFloat((vol + 0.1).toFixed(3));
        setSFXVol(vol);
    }
};
/** 효과음 줄이기
 * @function lowerSFXVol */
const lowerSFXVol = () => {
    let vol = getSFXVol();
    if(vol > 0){
        vol = parseFloat((vol - 0.1).toFixed(3));
        setSFXVol(vol);
    }
};
/** 효과음 크기 표시하기
 * @function writeSFXVol */
const writeSFXVol = () => {
    let element = document.getElementById("SFX_Vol");
    let vol = getSFXVol();
    // 문구 적기
    writeVolumeText(element, vol);
    // (+) 버튼 죽살이
    if(vol === 1)
        disableButton(element.nextElementSibling);
    else
        enableButton(element.nextElementSibling);
    // (−) 버튼 죽살이
    if(vol === 0)
        disableButton(element.previousElementSibling);
    else
        enableButton(element.previousElementSibling);
    
};
/** 배경음 키우기
 * @function raiseBGMVol */
const raiseBGMVol = () => {
    let vol = getBGMVol();
    if(vol < 1){
        vol = parseFloat((vol + 0.1).toFixed(3));
        setBGMVol(vol);
    }
};
/** 배경음 줄이기
 * @function lowerBGMVol */
const lowerBGMVol = () => {
    let vol = getBGMVol();
    if(vol > 0){
        vol = parseFloat((vol - 0.1).toFixed(3));
        setBGMVol(vol);
    }
};
/** 배경음 크기 표시하기 
 * @function writeBGMVol */
const writeBGMVol = () => {
    let element = document.getElementById("BGM_Vol");
    let vol = getBGMVol();
    // 문구 적기
    writeVolumeText(element, vol);

    // (+) 버튼 죽살이
    if(vol === 1)
        disableButton(element.nextElementSibling);
    else
        enableButton(element.nextElementSibling);
    // (−) 버튼 죽살이
    if(vol === 0)
        disableButton(element.previousElementSibling);
    else
        enableButton(element.previousElementSibling);
};
/** 버튼 죽이기
 * @function disableButton
 * @param {HTMLElement} element 죽일 버튼의 HTMLElement
 * @description (−) 또는 (+) 버튼 위에 마우스를 올렸을 때 밝아지는 효과를 죽인다. */
const disableButton = (element) => {
    if(element.classList.contains("btn-hover")){
        element.classList.replace("btn-hover", "deadBtn");
    }
};
/** 버튼 살리기
 * @function enableButton
 * @param {HTMLElement} element 살릴 버튼의 HTMLElement
 * @description (−) 또는 (+) 버튼 위에 마우스를 올렸을 때 밝아지는 효과를 살린다. */
const enableButton = (element) => {
    if(element.classList.contains("deadBtn")){
        element.classList.replace("deadBtn", "btn-hover");
    }
};
/** 소리 크기 표시하기
 * @function writeSoundVol
 * @param {HTMLElement} element
 * @param {number} volume */
const writeVolumeText = (element, volume) => {
    /* 《구급방언해》(1466) 中
        【세 돈애 믈 ᄒᆞᆫ 盞잔 半반ᄋᆞ로 닐굽 分분ᄋᆞᆯ 글혀… (서 돈에 물 한 잔 반으로 칠푼이 되도록 끓여…)】 */
    let old_korean_fraction = Array.from({length: 11}, (v, k) => {
        switch(k){
            case 0:
                return '업숨';
            case 10:
                return '오ᄋᆞ롬';
            default:
                return oldKoreanNumeral.buildThePrenoun(k, '분');
        }
    });
    switch(getLanguage()){
        case 'old_korean':
            element.innerHTML = `${old_korean_fraction[volume * 10]}`;
            break;
        default:
            element.innerHTML = `${volume * 100}%`;
    }
};
/** 순위표 초기화 모달 열기
 * @function openScoreResetModal */
const openScoreResetModal = () => {
    let score_title = document.getElementById("confirm_reset_scores");
    let option_title = document.getElementById("confirm_reset_options");
    if(score_title.classList.contains("display-none"))
        score_title.classList.remove("display-none");
    if(!option_title.classList.contains("display-none"))
        option_title.classList.add("display-none");
    addMouseInput(openModal("resetModal"), clickScoreReset, overScoreReset);
};
/** 순위표 초기화 모달 닫기
 * @function closeScoreResetModal */
const closeScoreResetModal = () => {
    removeMouseInput(closeModal("resetModal"), clickScoreReset, overScoreReset);
};
/** 순위표 초기화 모달 마우스클릭 콜백 함수
 * @function clickScoreReset
 * @param {MouseEvent} event */
const clickScoreReset = function(event){
    switch(findButton(event)){
        case 'resetOK':
            playMovingSFX();
            resetScores();
            refreshOptionModal();
        case 'resetCancel':
            playMovingSFX();
            closeScoreResetModal();
            break;
    }
};
/** 순위표 초기화 모달 마우스오버 콜백 함수
 * @function overScoreReset
 * @param {MouseEvent} event */
const overScoreReset = function(event){
    let button = findButton(event);
    switch(button){
        case last_button:
            break;
        case 'resetOK':
        case 'resetCancel':
            playHoldSFX();
            last_button = button;
            break;
        default:
            last_button = '';
    }
};
/** 설정 초기화 모달 열기
 * @function openOptionModal */
const openOptionResetModal = () => {
    let score_title = document.getElementById("confirm_reset_scores");
    let option_title = document.getElementById("confirm_reset_options");
    if(!score_title.classList.contains("display-none"))
        score_title.classList.add("display-none");
    if(option_title.classList.contains("display-none"))
        option_title.classList.remove("display-none");
    addMouseInput(openModal("resetModal"), clickOptionReset, overOptionReset);
};
/** 설정 초기화 모달 닫기
 * @function closeOptionModal */
const closeOptionResetModal = () => {
    removeMouseInput(closeModal("resetModal"), clickOptionReset, overOptionReset);
};
/** 설정 초기화 모달 마우스클릭 콜백 함수
 * @function clickOptionReset
 * @param {MouseEvent} event */
const clickOptionReset = function(event){
    switch(findButton(event)){
        case 'resetOK':
            playMovingSFX();
            resetOptions();
            refreshOptionModal();
        case 'resetCancel':
            playMovingSFX();
            closeOptionResetModal();
            break;
    }
};
/** 설정 초기화 모달 마우스오버 콜백 함수
 * @function overScoreReset
 * @param {MouseEvent} event */
const overOptionReset = function(event){
    let button = findButton(event);
    switch(button){
        case last_button:
            break;
        case 'resetOK':
        case 'resetCancel':
            playHoldSFX();
            last_button = button;
            break;
        default:
            last_button = '';
    }
};
/** HTMLElement에 글 넣기
 * @function setNodeAttribute
 * @param {HTMLElement} node 대상이 되는 HTMLElement
 * @param {object} text_property HTMLElement에 적용할 글 속성 객체
 * @param {languages} lang 적어 넣을 언어 */
const setNodeTextByLang = (node, text_property, lang) => {
    // 속성 아이디가 있는지 확인
    if(text_property == undefined)
        return false;
    // 해당 언어가 있는지 확인
    let test = false
    for(let key of Object.keys(text_property))
        if(key === lang)
            test = true;
    if(!test) return false;
    // 있다면 글 바꾸기
    for(let key of Object.keys(text_property[lang]))
        setNodeAttribute(node, text_property[lang], key);
    return true;
};
/** HTMLElement에 속성 적용하기
 * @function setNodeAttribute
 * @param {HTMLElement} node 대상이 되는 HTMLElement
 * @param {object} attribute HTMLElement에 적용할 속성 객체
 * @param {string} key HTMLElement 속성 */
const setNodeAttribute = (node, attribute, key) => {
    if(typeof attribute[key] !== 'object')
        node[key] = attribute[key];
    else
        for(let new_key of Object.keys(attribute[key]))
            setNodeAttribute(node[key], attribute[key], new_key)
};
/** 영문 자판 옛말로 옮김
 * @function translateKeyTextIntoOldKorean
 * @param {string} text
 * @description 자판 영문 이름을 옛말로 옮긴다. */
const translateKeyTextIntoOldKorean = (text) => {
    let text_list = text.split(" ");
    let old_korean_code = '';
    for(let str of text_list){
        switch(str){
            case 'Left':
                old_korean_code += '왼녃';
                break;
            case 'Right':
                old_korean_code += '올ᄒᆞᆫ녃';
                break;
            case 'Up':
                old_korean_code += '우흿';
                break;
            case 'Down':
                old_korean_code += '아랫';
                break;
            case 'Arrow':
                /* 삸밑 — 화살촉의 옛말. 8성종법에 따라 홀로 적을 때는 ㄷ받침으로 적는다.
                 《구급방언해》(1466) 中
                    【살믿 모딘 藥약이 ᄉᆞᆯ해 드러 나디 아니커든 고툐ᄃᆡ… (화살촉 모진 약이 살에 들어서 나오지 않거든 고치되)
                    …ᄒᆞᄅᆞ 세 번곰 머그면 살미티 漸쪔漸쪔 제 나ᄂᆞ니라 (하루 세 번씩 먹으면 화살촉이 점점 저절로 나오는 것이다.) */
                old_korean_code += '삸믿';
                break;
            case 'Numpad':
                old_korean_code += '혜ᇝ틄';
                break;
            case 'Num':
                old_korean_code += '혜ᇝ틀';
                break;
            case 'Scroll':
                old_korean_code += '두루마리';
                break;
            case 'Caps':                
            /* 문증되는 것은 ‘글시’이나 이는 《원각경언해》(1465년 간경도감刊)부터 각자병서를 쓰지 않으면서
                ‘쓰다(記)’를 ‘스다’로 적었기 때문이다. (글씨 = 글 + 쓰‐ + ‐이) */
                old_korean_code += '글씨';
                break;
            case 'Lock':                
            /* 《법화경언해》(1463년 간경도감刊) 中 【鍵은 ᄌᆞᄆᆞᆳ쇠라(건은 자물쇠다)】, 【鑰은 엸쇠라(약은 열쇠다)】에서
                동사의 뿌리 ‘ᄌᆞᇚ‐/ᄌᆞᄆᆞᆯ‐’, ‘열‐’에 ‘ㅅ’을 더하여 낱말을 만들었는데
                이는 관형격 조사로 보기보다는 사잇소리 현상을 나타낸 것으로 보아야 옳으며
                이하 된이응(ㆆ) 표기법으로 통일한다. */
                old_korean_code += 'ᄌᆞᄆᆞᇙ쇠';
                break;
            case 'Key':
                old_korean_code += '글ᄫᅡᆯ';
                break;
            case 'Digit':
            /* 《여훈언해》(1532년 최세진易) 中
                【ᄒᆞᆫ나 열 일ᄇᆡᆨ 일쳔이라 ᄒᆞᄂᆞᆫ 혬 혜ᄂᆞᆫ 됴목(하나, 열, 일백, 일천이라 하는 셈 세는 조목)】,
                【혬 혜ᄂᆞᆫ 글월(셈 세는 글자)】 따위에서 */
                old_korean_code += '혬혜ᇙ글ᄫᅡᆯ'; 
                break;
            case 'Pause':
                old_korean_code += '머추ᇙ쇠';
                break;
            case 'Backspace':
                old_korean_code += '므르ᇙ쇠';
                break;
            case 'Space':
                old_korean_code += 'ᄉᆞᅀᅵ두ᇙ쇠';
                break;
            case 'Tab': //Tabulator
            /* 《법화경언해》(1463년 간경도감刊) 中 
                    【ᄀᆞ조미 序쎵에 버륨 ᄀᆞᆮᄒᆞᆯᄉᆡ…(갖춘 것이 서문에 나열함과 같으므로…)】),
                《원각경언해》(1465년 간경도감刊) 中
                    【도로 앏 七치ᇙ段뙨앳 한 法법門몬 버륨 ᄀᆞᆮᄒᆞ니…(도로 앞의 칠단에의 한 법문이 나열함과 같으니…)】,
                    【請쳐ᇰ을 펴샨 中듀ᇰ엣 세토 ᄯᅩ 알ᄑᆡ 버륨 ᄀᆞᆮᄒᆞ니라(청을 펴시는 가운데의 셋도 또 앞에 나열함과 같은 것이다.)】
                ‘버륨’을 글자 그대로 새기자면 “벌여 놓음” 또는 “벌여 놓은 것”이나, 
                위 두 예문에서 ‘버륨’은 한자 歷(지날 력: e.g. 책력, 달력)을 우리말로 옮긴 것으로서 목차 또는 차례의 뜻으로 쓰이고,
                아래 예문에서는 列(벌일 렬: e.g. 나열, 배열)을 우리말로 옮긴 것이다.
                기준을 가지고 정보를 나열한다는 데에서 table을 ‘버륨’으로 옮겼다. 표(表)는 임금에게 올리는 글을 일컫는 말로 더 널리 쓰였다. */
                old_korean_code += '버륨지ᅀᅳᇙ쇠';
                break;
            case 'Enter':
                old_korean_code += '드ᇙ쇠';
                break;            
            case 'Shift':
                /* ᄀᆞᆯ다 — 갈다, 갈음하다, 대신하다 */
                old_korean_code += 'ᄀᆞᇙ쇠';
                break;
            case 'Control':
                /* 브리다 — 부리다, 조종하다 */
                old_korean_code += '브리ᇙ쇠';
                break;
            case 'Alt':
                /* ᄀᆞᆯᄒᆡ다 — 가리다, 가름하다, 선택하다 */
                old_korean_code += 'ᄀᆞᆯᄒᆡᇙ쇠';
                break;
            case 'Bracket':
                /** 괄호(括弧)의 직역 */
                old_korean_code += '뭇글활';
                break;
            case 'Quote':
                /* 인용(引用)의 직역. 
                    《월인석보》(1459년 세종作 세조編) 中 
                        【引ᄋᆞᆫ ᅘᅧᆯ씨니…(인은 끄는 것이니…)】,
                        【威ᅙᅱᆼ音ᅙᅳᆷ王ᅌᅪᇰ 日ᅀᅵᇙ月ᅌᅯᇙ燈드ᇰ 雲ᅌᅮᆫ自ᄍᆞᆼ在ᄍᆡᆼᄅᆞᆯ ᅘᅧ샨 ᄠᅳ든…(위음왕, 일월등, 운자재를 인용하신 뜻은…)】,
                        【用ᄋᆞᆫ ᄡᅳᆯ씨라(용은 쓰는 것이다.)】 */
                old_korean_code += 'ᅘᅧᄡᅳᇙ뎜';
                break;
            case 'Backquote':
                /* 갓ᄀᆞᆯ다 — 자동사. 거꾸로 되다
                cf. 갓ᄀᆞᆯ오다 — 사동사. 거꾸로 되게 하다. */
                old_korean_code += '갓ᄀᆞᆫ ᅘᅧᄡᅳᇙ뎜';
                break;
            case 'Slash':
                /* 긋 — 획(劃)의 옛말. 동사 “긋다”의 명사형 */
                old_korean_code += '빗근긋';
                break;
            case 'Backslash':
                /* 갓ᄀᆞ로 — 거꾸로, ‘갓ᄀᆞᆯ다’의 부사형
                cf. 고르다 → 골오(>고로>고루), 넘다 → 너모(> 너무), ᄌᆞᆽ다(>잦다) → 자조(> 자주) */
                old_korean_code += '갓ᄀᆞ로 빗근긋';
                break;
            case 'Decimal':
                old_korean_code += '자릿뎜';
                break;
            case 'Add':
                old_korean_code += '더을혬';
                break;
            case 'Minus':
            case 'Subtract':
                old_korean_code += '덜혬';
                break;
            case 'Multiply':
                old_korean_code += '고ᄇᆞᆯ혬';
                break;
            case 'Divide':
                old_korean_code += 'ᄂᆞᆫ홀혬';
                break;
            case 'Equal':
                old_korean_code += 'ᄀᆞᄐᆞᆯ혬';
                break;
            case 'Period':
                /* ‘온점’, ‘온몸’ 따위의 ‘온’은 일백(一百)의 ‘온’이 아니라, 온전(穩全)하다는 뜻의 형용사 ‘오ᄋᆞᆯ다’의 관형형에서 비롯한다.
                    《석보상절》(1447년 수양대군作) 中 
                        【王ᅌᅪᇰ이 病뼈ᇰ을 호ᄃᆡ 오ᄋᆞᆫ 모미 고ᄅᆞᆫ 더러ᄫᅳᆫ 내 나거늘…(왕이 병을 앓아 온몸이 고르고 더러운 냄새 나거늘…)】 */
                old_korean_code += '오ᄋᆞᆫ뎜';
                break;
            case 'Comma':
                /* 仲秋 *가ᄫᆡ(삼국사기, 1145) > 가외(역어유해, 1690) > 가위(오늘날)
                   中   가ᄫᆞᆫᄃᆡ(월인석보, 1459) > 가온ᄃᆡ(월인석보, 1459) > 가운데(오늘날)
                   半   *가ᄫᆞᆮ(15세기 추정음) > 가옫(간이벽온방언해, 1525) > 가웃(오늘날)
                   위 낱말들에서 ‘갑다’라는 동사를 찾는 설(說)이 유력하며, “절반으로 나누다”라는 뜻을 갖는다.   
                   그리하여 가온음(中音, mediant), 가온북(중간 크기의 북), 가웃금속(半金屬, semimetal), 가웃원(半圓, semicircle) 따위로
                   中, 半 또는 medi‐, semi‐를 우리말로 옮길 때 ‘갑‐’을 되살려 쓰고 있다.
                   여기에서도 반점(半點)을 다음과 같이 옮겼다. */
                old_korean_code += '가ᄫᆞᆮ뎜';
                break;
            case 'Semicolon':
                /* 어우러ᇰ — 쌍(雙)의 옛말 
                《구급방언해》(1466) 中
                    【大땡黃ᅘᅪᇰ 넉 兩랴ᇰ과 桃도ᇢ仁ᅀᅵᆫ 셜흔 나ᄎᆞᆯ 것과 부리와 어우러ᇰ ᄌᆞᅀᆞᄅᆞᆯ 앗고 ᄀᆞ라… 
                    (대황 넉 냥과 복숭아 씨 서른 낱(個)을 겉과 뿌리와 배·배젖 쌍을 앗고 갈아…)】 */
                old_korean_code += '가ᄫᆞᆮ어우러ᇰ뎜';
                break;
            default:
                old_korean_code += str;
        }
        old_korean_code += ' ';
    }
    old_korean_code.trim();
    return old_korean_code;
};
/** 수관형사(꾸미는 말) 가져오기
 * @function getTheNumeralPrenouns
 * @param {number} num 자연수, 수관형사로 바꿀 아라비아 숫자
 * @param {string} [classifier] 분류사(分類詞), 단위(單位), 하나치
 * @returns {string | number} 언어 설정에 따라 나랏말ᄊᆞᆷ을 문자열로 돌려 준다. */
export const getTheNumeralPrenouns = (num, classifier) => {
    if('old_korean' === getLanguage())
        return oldKoreanNumeral.buildThePrenoun(num, classifier);
    else
        return num;
};
/** 기수사(개수를 세는 말) 가져오기
 * @function getTheCardinalNumerals
 * @param {number} num 자연수, 기수사로 바꿀 아라비아 숫자
 * @returns {string | number} 언어 설정에 따라 나랏말ᄊᆞᆷ을 문자열로 돌려 준다. */
export const getTheCardinalNumerals = (num) => {
    if('old_korean' === getLanguage())
        return oldKoreanNumeral.buildTheCardinal(num);
    else
        return num;
};
/** 서수사(순서 세는 말) 가져오기
 * @function getTheOrdinalNumerals
 * @param {number} num 자연수, 서수사로 바꿀 아라비아 숫자
 * @returns {string | number} 언어 설정에 따라 나랏말ᄊᆞᆷ을 문자열로 돌려 준다. */
export const getTheOrdinalNumerals = (num) => {
    if('old_korean' === getLanguage())
        return oldKoreanNumeral.buildTheOrdinal(num);
    else
        return num;
};
/** 서수 관형사(순서로 꾸미는 말) 가져오기
 * @function getTheOrdinalNumeralPrenouns
 * @param {number} num 자연수, 서수 관형사로 바꿀 아라비아 숫자
 * @return {string | number} 언어 설정에 따라 나랏말ᄊᆞᆷ을 문자열로 돌려 준다. */
export const getTheOrdinalNumeralPrenouns = (num) => {
    if('old_korean' === getLanguage())
        return oldKoreanNumeral.buildTheOrdinalPrenoun(num);
    else
        return num;
};
/** 순위에 해당하는 문자열 가져오기
 * @function getRankText
 * @param {number} num 자연수, 출력할 순위
 * @returns {string} */
export const getRankText = (num) => {
    switch(getLanguage()){
        case 'old_korean':
            return (num === 1)? '읏듬' : oldKoreanNumeral.buildTheOrdinal(num);
        case 'korean':
            return num.toString() + '등';
        default:
            switch(num){
                case 1:
                    return num.toString() + 'st';
                case 2:
                    return num.toString() + 'nd';
                case 3:
                    return num.toString() + 'rd';
                default:
                    return num.toString() + 'th';
            }
    }
};
export const getDateText = (date) => {
    /* 15세기 실제로 해와 달을 나타내던 방법은 명나라의 연호 또는 간지(干支)와 아울러, 일월(一月), 이월(二月), 삼월(三月)과 같은 한자어로 나타내었는데
    아래의 보기에서와 같이 해와 달을 서수사로 나타냄 직하므로, 해와 달과 날을 우리말로 옮겨 본다.
    《석보상절》(1447년 수양대군作) 中
        【부텻 나히 셜흔다ᄉᆞ시러시니 穆목王ᅌᅪᇰ 아홉찻 ᄒᆡ 戊무ᇢ子ᄌᆞᆼㅣ라 (부처의 나이 서른다섯이시더니, 목왕 아홉째 해 무자년이다.)】,
        【부텻 나히 셜흔여스시러시니 穆목王ᅌᅪᇰ 열찻 ᄒᆡ 己긩丑튜ᇢㅣ라 (부처의 나이서른여섯이시더니, 목왕 열째 해 기축년이다.)】,
        【부텻 나히 셜흔닐구비러시니 穆목王ᅌᅪᇰ 열ᄒᆞᆫ찻 ᄒᆡ 庚ᄀᆡᇰ寅인이라 (부처의 나이서른일곱이시더니, 목왕 열한째 해 경인년이다.)】,
        【부텻 나히 셜흔여들비러시니 穆목王ᅌᅪᇰ 열둘찻 ᄒᆡ 辛신卯모ᇢㅣ라 (부처의 나이 서른여덟이시더니 목왕 열두째 해 신묘년이다)】 */
    if('old_korean' === getLanguage()){
        let date_list = date.split('-');
        return oldKoreanNumeral.buildTheOrdinalPrenoun(Number.parseInt(date_list[0])) + 'ᄒᆡ '
                + oldKoreanNumeral.buildTheOrdinalPrenoun(Number.parseInt(date_list[1])) + 'ᄃᆞᆯ '
                + oldKoreanNumeral.buildTheDate(Number.parseInt(date_list[2]));
    }else{
        return date;
    }
};
/** 자연수인지 판별
 * @function isNaturalNumber
 * @param {number} num 
 * @returns {boolean} 인수가 자연수라면 True를, 아니라면 False를 돌려 준다. */
const isNaturalNumber = (num) => {
    switch(true){
        case Number.isNaN(num):
        case !Number.isInteger(num):
        case num < 1:
            return false;
        default:
            return true;
    }
};
/** 언어 설정에 따라 점수 애니메이션에 들어갈 문구
 * @function translateScoreText
 * @param {*} str 영문 글줄 */
export const translateScoreText = (str) => {};

/** 아라비아 숫자를 옛말로 옮기는 함수 모음 */
const oldKoreanNumeral = {
    // 일의 자리 기수사 목록
    ones_digit: ['', 'ᄒᆞ나', '둘', '세', '네', '다ᄉᆞᆺ', '여슷', '닐굽', '여듧', '아홉'],
    /* 일의 자리 수관형사 목록 
    우리말의 수관형사는 뒤따르는 분류사에 따라 달라진다. */
    ones_prenouns: [
        [''],
        ['ᄒᆞᆫ'],
        ['두'],
        ['석', '서', '세'],
        ['넉', '너', '네'],
        ['대', '닷', '다ᄉᆞᆺ'],
        ['예', '엿', '여슷'],
        ['닐굽'], 
        ['여듧'],
        ['아홉']
    ],
    /* 십의 자리 목록
    15세기 ‘스믈’의 관형사는 ‘스믈’ 그대로였다. 오늘날 ‘스물’의 관형사가 ‘스무’인 것과 다르다.
    《구급방언해》(1466년) 中
        【巴방豆뚜ᇢ 스믈 나ᄎᆞᆯ 것과 소ᄇᆞᆯ 앗고 ᄀᆞ라… (파두 스무 낱(個)을 겉과 속을 앗고 갈아…)】 */
    tens_digit: ['', '열', '스믈', '셜흔', '마ᅀᆞᆫ', '쉰', '여ᄉᆔᆫ', '닐흔', '여든', '아ᄒᆞᆫ'],
    /* 백과 천의 옛말 
    숫자를 나열해 큰 수를 나타내는 방법에는 두 수를 더하는 방식이 있고, 두 수를 곱하는 방식이 있다.
    이를테면 십칠(10 + 7)은 더하는 방식이고, 칠십(7 × 10)은 곱하는 방식이다.
    우리말에서는 예부터 “열둘(10 + 2), 스믈여듧(20 + 8), 아ᄒᆞᆫ아홉(90 + 9)” 같이 100미만의 큰 수에는 더하는 방식을 썼으나
    100 또는 1,000이 넘는 큰 수는 어떻게 나타내었는지 기록이 남아 있지 않다.
    아래와 같이 “온(百, 100)”과 “즈믄(千, 1000)”이라는 낱말이 찾아질 뿐이다.
    《월인석보》(1459년 세종作 세조編) 中
        【도ᄌᆞᆨ 五ᅌᅩᆼ百ᄇᆡᆨ이 [五ᅌᅩᆼᄂᆞᆫ 다ᄉᆞ시오 百ᄇᆡᆨᄋᆞᆫ 오니라] 그윗 거슬 일버ᅀᅥ… (도적 오백이 [오는 다섯이오 백은 온이다.] 관청의 것을 훔쳐…)】,
        【이 後ᅘᅮᇢ로 千쳔年년이면 [千쳔年년은 즈믄 ᄒᆡ라]… (이 후로 천 년이면 [천 년은 즈믄 해다.])
    (※ 한자어에 우리말 주석을 단 것을 보면 “온, 즈믄”이 “백, 천”보다 널리 쓰였던 듯한다.)
    다만 옛적에도 “ᄒᆞᆫ 닐웨(1 × 7 = 7일), 두 닐웨(2 × 7 = 14일), 세 닐웨(3 × 7 = 21일)” 또는 
    “두 열흘(2 × 10 = 20일), 세 열흘(3 × 10 = 30일)”과 같이 곱하는 방식으로 수를 나타내곤 하였으므로
    100이 넘는 큰 수는 이를 빌려 “ᄒᆞᆫ온, 두온, 세온” 또는 “ᄒᆞᆫ즈믄, 두즈믄, 세즈믄”과 같이 나타내려 한다.
    《월인석보》(1459년 세종作 세조編) 中
        【ᄒᆞᆫ 닐웻 길 녀샤 무릎 틸 믈 걷나샤 두 닐웨예 목 틸 믈 걷나샤 닐웻 길 ᄯᅩ 녀샤 믈 헤여 걷나샤 세 닐웨예 바ᄅᆞᆯ애 가시니
        (한 이레 길 가시어 무릎 칠 물 건너시고, 두 이레에 목 칠 물 건너시고, 이레 길 또 가시어 믈 헤어 건너시어 세 이레에 바다에 가시니)】
    《분류두공부시언해》(1481년) 中
        【두 열흐를 向호ᄃᆡ 苣ᄂᆞᆫ 거프리 ᄩᅥ뎌 나디 아니ᄒᆞ고… (두 열흘을 향하되 상추는 꺼풀이 떨어져 나가지 아니하고…)】,
        【南녁 하ᄂᆞᆯ히 세 열흐를 심ᄒᆞᆫ 雲霧ㅣ 여니… (남녘 하늘이 세 열흘을 심한 운무가 열리니…)】
    */
    hundred: '온',
    thousand: '즈믄',    
    /* 분류사 목록 
        참고 문헌
        《석보상절》(1447년 수양대군作)
        《월인석보》(1459년 세종作 세조編)
        《구급방언해》(1466년)
        《분류두공부시언해》(1481년)
        《구급간이방언해》(1489년) */
    classifier_list: [
        [['']],
        [['']],
        [['']],
        // 오늘날과 다르게 15세기에는 “세 돈”(> 서 돈), “서 되”(> 석 되)이 더 널리 쓰였다.
        [['ᄃᆞᆯ', '달', '랴ᇰ', '냥', '자', '자'], ['근', '근', '말', '말', '모', '모', '되', '되', '분', '분', '푼', '푼', '홉', '홉'], ['']],
        [['ᄃᆞᆯ', '달', '랴ᇰ', '냥', '자', '자'], ['근', '근', '말', '말', '모', '모', '되', '되', '분', '분', '푼', '푼', '홉', '홉'], ['']],
        [['자', '자'], ['근', '근', '돈', '돈', '말', '말', '되', '랴ᇰ', '모', '모', '냥', '되', '분', '분', '푼', '푼', '홉', '홉'], ['']],
        [['자', '자'], ['근', '근', '돈', '돈', '말', '말', '되', '랴ᇰ', '모', '모', '냥', '되', '분', '분', '푼', '푼', '홉', '홉'], ['']],
        [['']],
        [['']],
        [['']]
    ],
    /* 날수 목록
    기본적인 날수의 셈은 아래와 같이 ‘닐웨(이레, 7일)’, ‘스믈ᄒᆞᄅᆞ(스물하루, 21일)’, ‘셜흔닷쇄(서른닷새, 35일)’, ‘마ᅀᆞᆫ아ᄒᆞ래(마흔아흐레, 49일)’ 따위로
    ‘ᄒᆞᄅᆞ(하루)’부터 ‘아ᄒᆞ래’에다가 ‘열흘’이 넘는 수는 ‘열ᄒᆞᄅᆞ(열하루)’, ‘열이틀’, ‘열사ᄋᆞᆯ’과 같이 기수사를 더하는 식으로 나타난다.
    《석보상절》(1447년 수양대군作) 中
        【닐웨어나 스믈ᄒᆞᆯ리어나 셜흔다쐐어나 마ᅀᆞᆫ아ᄒᆞ래어나 (이레거나 스물하루거나 서른닷새거나 마흔아흐레거나)】
    그런데 열흘 다음으로 열흘씩 떨어지는 스무째 날, 서른째 날, 마흔째 날 따위를 일컫는 낱말은 따로 없어서 다음 두 가지 방식으로 나타난다.
    첫째로는 ‘두 열흘(2 × 10 = 20일)’, ‘세 열흘(3 × 10 = 30일)’과 같이 수관형사를 써 곱하는 방식이고
    둘째로는 ‘스므날(20일)’, ‘아ᄒᆞᆫ날(90일)’과 같이 십의 자리 수관형사에 ‘날’을 붙여 쓰는 방식이다.
    《분류두공부시언해》(1481년) 中
        【두 열흐를 向호ᄃᆡ 苣ᄂᆞᆫ 거프리 ᄩᅥ뎌 나디 아니ᄒᆞ고… (두 열흘을 향하되 상추는 꺼풀이 떨어져 나가지 아니하고…)】,
        【南녁 하ᄂᆞᆯ히 세 열흐를 심ᄒᆞᆫ 雲霧ㅣ 여니… (남녘 하늘이 세 열흘을 심한 구름과 안개가 열리니…)】
    《석보상절》(1447년 수양대군作) 中
        【아ᄒᆞᆫ나ᄅᆞᆯ 잇다가 城 밧 衛致鄕이라 호ᇙ ᄯᅡ해… (아흔날을 있다가 성 밖 위치향이라 하는 땅에…)】
    《구급간이방언해》(1489년) 中
        【스므날만 ᄒᆞ면 됴ᄒᆞ리라 (스무날만 하면 나을 것이다.)】
    여기서는 둘째 방식으로 기본으로 두고, 첫째 방식을 선택으로 둔다.
    cf. 수관형사 ‘스물’의 끝소리 ‘ㄹ’이 떨어지는데, 동일한 문헌에서도 오직 날수를 셀 때만 이러한 일이 보인다.
    《구급간이방언해》(1489년) 中
        【ᄒᆞᆫᄢᅴ 열 환곰 머고ᄃᆡ 스믈 환 지히 밥 아니 머거셔… (함께 열 환씩 먹되 스무 환에 이르도록 밥을 아니 먹어서…) */
    ones_day: ['', 'ᄒᆞᄅᆞ', '이틀', '사ᄋᆞᆯ', '나ᄋᆞᆯ', '닷쇄', '엿쇄', '닐웨', '여ᄃᆞ래', '아ᄒᆞ래'],
    tens_day: ['', '열흘', '스므날', '셜흔날', '마ᅀᆞᆫ날', '쉰날', '여ᄉᆔᆫ날', '닐흔날', '여든날', '아ᄒᆞᆫ날'],
    /* 날짜 목록
    어떤 달(月)의 날짜를 집어 이야기할 때면, 무정명사의 관형격 조사 ‘ㅅ’로써 날수(ᄒᆞᄅᆞ, 이틀, …)가 ‘날’을 꾸미는 식으로 나타난다.
    ‘초ᄒᆞᄅᆞᆺ날’, ‘초이틄날’, ‘초사ᄋᆞᆳ날’과 같이 뜻을 더욱 뚜렷이 하고자 初(처음 초)를 앞에 덧붙이는 일도 흔했다.
    《석보상절》(1447년 수양대군作) 中
        【二月ㅅ 여ᄃᆞ랫 나래 四海 바ᄅᆞᆳ 믈 길유려 ᄒᆞ거시ᄂᆞᆯ… (2월의 여드렛날에 사해 바닷물을 길으려 하시거늘…)】,
        【二月 初닐웻낤 바ᄆᆡ  門 밧긔 나 ᄒᆞ니시던 ᄒᆡᆺ 二月이라 (2월 초이렛날의 밤에 문 밖에 나 움직이시던 해의 2월이다.)】,
        【四月ㅅ 열다쐣날 비르서 뎌레 드러 안ᄭᅩ 나 ᄒᆞ니디 아니ᄒᆞ야… (4월의 열닷샛날 비로소 뎔에 들어 앉고, 나 움직이지 아니하여…)】       
    《분류두공부시언해》(1481년) 中
        【七月ㅅ 엿쇗날 더운 氣運이 ᄠᅵᄂᆞᆫ ᄃᆞᆺ호미 苦ᄅᆞ외니… (7월의 엿샛날 더운 기운이 찌는 듯함이 괴로우니…)】
    열흘 다음으로 열흘씩 떨어지는 스무째 날, 서른째 날, 마흔째 날의 경우 십의 자리 수관형사에 ‘날’을 붙여 쓴다.
    《순천김씨묘 출토언간》(1550) 中
        【거월 열ᄒᆞᆯ 후브터 심증 나셔 스므날ᄭᅴ브터 누어 알호ᄃᆡ… (지난 달 10일부터 심증이 나서 20일께부터 누워 앓되…)】 */
    ones_date: ['', 'ᄒᆞᄅᆞᆺ날', '이틄날', '사ᄋᆞᆳ날', '나ᄋᆞᆳ날', '닷쇗날', '엿쇗날', '닐웻날', '여ᄃᆞ랫날', '아ᄒᆞ랫날'],
    tens_date: ['', '열흜날', '스므날', '셜흔날', '마ᅀᆞᆫ날', '쉰날', '여ᄉᆔᆫ날', '닐흔날', '여든날', '아ᄒᆞᆫ날'],
    // 1의 서수사
    first_noun: '처ᅀᅥᆷ',
    first_prenoun: '첫',
    /** 옛말 수관형사(꾸미는 말)로 바꾸기
     * @function buildThePrenoun
     * @param {number} num 자연수, 수관형사로 바꿀 아라비아 숫자
     * @param {string} [classifier] 분류사(分類詞), 단위(單位), 하나치
     * @returns {string} 단위가 있으면 단위를 붙여 문자열을 돌려 준다. */
    buildThePrenoun: (num, classifier) => {
        let prenoun = (classifier == undefined)? '' : ' ' + classifier;
        // 재귀 함수의 정지
        if(!isNaturalNumber(num)) 
            return '';
    
        let thousands_digit = Math.floor(num/1000);
        // 일의 자리 문자열
        num %= 1000;
        let len = oldKoreanNumeral.ones_prenouns[num%10].length - 1;
        let work_done = false;
        for(let i = 0; i < len; i++){
            if(oldKoreanNumeral.classifier_list[num%10][i].includes(classifier)){
                prenoun = oldKoreanNumeral.ones_prenouns[num%10][i] + prenoun;
                work_done = true;
            }
        }
        if(!work_done)
            prenoun = oldKoreanNumeral.ones_prenouns[num%10][len] + prenoun;
        
        // 십의 자리 문자열
        num = Math.floor(num/10);
        prenoun = oldKoreanNumeral.tens_digit[num%10] + prenoun;
        // 백의 자리 문자열
        num = Math.floor(num/10);
        if(num > 0)
            prenoun = (num === 1)? oldKoreanNumeral.hundred + prenoun 
                    : oldKoreanNumeral.buildThePrenoun(num) + oldKoreanNumeral.hundred + prenoun;
        // 천의 자리 문자열
        if(thousands_digit > 0)
            prenoun = (thousands_digit === 1)? oldKoreanNumeral.thousand + prenoun 
                    : oldKoreanNumeral.buildThePrenoun(thousands_digit) + oldKoreanNumeral.thousand + prenoun;
    
        return prenoun;
    },
    /** 옛말 기수사(개수를 세는 말)로 바꾸기
     * @function buildTheCardinal
     * @param {number} num 자연수, 기수사로 바꿀 아라비아 숫자
     * @returns {string} */
    buildTheCardinal: (num) => {
        let cardinal = '';
        // 예외 처리
        if(!isNaturalNumber(num)) 
            return '';
        
        let thousands_digit = Math.floor(num/1000);        
        // 일의 자리 문자열
        num %= 1000;
        cardinal = oldKoreanNumeral.ones_digit[num%10];
        // 십의 자리 문자열
        num = Math.floor(num/10);
        cardinal = oldKoreanNumeral.tens_digit[num%10] + cardinal;
        // 백의 자리 문자열
        num = Math.floor(num/10);
        if(num > 0)
            cardinal = (num === 1)? oldKoreanNumeral.hundred + cardinal 
                    : oldKoreanNumeral.buildThePrenoun(num) + oldKoreanNumeral.hundred + cardinal;
        // 천의 자리 문자열
        if(thousands_digit > 0)
            cardinal = (thousands_digit === 1)? oldKoreanNumeral.thousand + cardinal 
                    : oldKoreanNumeral.buildThePrenoun(thousands_digit) + oldKoreanNumeral.thousand + cardinal;

        return cardinal;
    },
    /** 옛말 서수사(순서 세는 말)로 바꾸기
     * @function buildTheOrdinal
     * @param {number} num 자연수, 서수사로 바꿀 아라비아 숫자
     * @param {number} [optionOfFirst] 첫째를 나타내는 말 선택, 0: 처ᅀᅥᆷ, 1: ᄒᆞ나차히, Default는 0
     * @returns {string} */
    buildTheOrdinal: (num, optionOfFirst) => {
        /* 오늘날 접미사 ‘‐째’를 붙이듯이 15세기에는 ‘‐차히’를 붙여 서수를 나타냈다.
        다만 오늘날엔 “열한째, 열두째”와 같이 수관형사에 접미사를 붙이지만, 15세기에는 “열ᄒᆞ나차이, 열둘차이”와 같이 기수사에 접미사를 붙이는 일이 더욱 흔했다.
        《월인석보》(1459년 세종作 세조編) 中
            【첫 相샤ᇰᄋᆞᆫ 머릿 뎌ᇰ바기ᄅᆞᆯ 보ᅀᆞᄫᆞ리 업스며 둘차힌 뎌ᇰ바깃(…) 세차힌 니마히(…) 네차힌 눈서비(…) 닐흔아홉차힌 손바리(…) 여든차힌 손바래 德득字ᄍᆞᆼ 겨샤미라
            (첫 상은 머리 정수리를 볼 이가 없으며 둘째는 정수리의(…) 세째는 이마가(…) 네째는 눈썹이(…) 일흔아홉째는 손발이(…) 여든째는 손발에 덕 자가 있으심이다.】
        《능엄경언해》(1462년) 中
            【大땡經겨ᇰ엣 四ᄉᆞᆼ依ᅙᅴᆼᄅᆞᆯ 頌쑈ᇰᄒᆞ야 닐오ᄃᆡ 五ᅌᅩᆼ品픔과 十씹信신이 처ᅀᅥ미오 十씹住뜡ㅣ 둘차히오 行ᅘᆡᇰ과 向햐ᇰ과 地띵왜 세히오 等드ᇰ覺각과 妙묘ᇢ覺각괘 네히라
            (대경전의 4의를 칭송하여 니르되, 5품과 10신이 처음이고, 10주가 둘째이고, ‘행’과 ‘향’과 ‘지’가 셋째이고, ‘등각’과 ‘묘각’이 넷째이다.)】
        그러나 15세기 자료에서 ‘첫째’가 들어갈 자리에는 늘 ‘첫 ○/처ᅀᅥᆷ’ 또는 ‘ᄒᆞᆫ ○/ᄒᆞ나’가 쓰여 ‘첫째’를 뜻하는 서수사 자리가 비어 있다.
        이에 16세기 자료를 보면 ‘ᄒᆞ나차히’에서 비롯했을 ‘ᄒᆞ낫재’를 찾을 수 있는데, 오히려 “첫째”와 같은 낱말이 나타나는 것은 훨씬 뒤의 일이다.
        《소학언해》(1588년) 中 
            【그 ᄒᆞ낫재ᄂᆞᆫ 스스로 편안홈을 求ᄒᆞ며 ᄆᆞᆰ고 조홈을 ᄃᆞᆯ이 너기디 아니ᄒᆞ야 져그나 몸애 利ᄒᆞ거든 사ᄅᆞᆷ의 말을 분별 아니홈이니라 
            (그 첫째는 스스로 편안함을 구하며 맑고 깨끗함을 달게 여기지 아니하여 조금만 몸에 이롭거든 사람의 말을 분별 아니함이니라.) 
            그 둘재ᄂᆞᆫ 션ᄇᆡ 일ᄋᆞᆯ 아디 몯ᄒᆞ며 녯 도리ᄅᆞᆯ 깃거 아니ᄒᆞ야 녯 經을 아ᄃᆞᆨ호ᄃᆡ 붓그리디 아니ᄒᆞ고…
            (그 둘째는 선비 일을 알지 못하며 옛 도리를 기꺼이 아니하여 옛 경전에 어둡되 부끄러워하지 아니하고…)】        
        여기서는 ‘처ᅀᅥᆷ’과 ‘ᄒᆞ나차히’를 서수사로 보아 쓰려 한다. */
        optionOfFirst = (optionOfFirst == undefined || optionOfFirst !== 1)? 0 : optionOfFirst;
        return (optionOfFirst === 0 && num === 1)? oldKoreanNumeral.first_noun : oldKoreanNumeral.buildTheCardinal(num) + '차히';
    },
    /** 옛말 서수사 관형격(순서로 꾸미는 말)으로 바꾸기
     * @function buildTheOrdinalPrenoun
     * @param {number} num 자연수, 서수사 관형격으로 바꿀 아라비아 숫자
     * @param {number} [optionOfFirst] 첫째를 나타내는 말 선택, 0: 첫, 1: ᄒᆞᆫ, Default는 0
     * @returns {string} */
    buildTheOrdinalPrenoun: (num, optionOfFirst) => {
        /* 서수사를 관형격으로 쓸 때에는 무정명사의 관형격 조사 ‘ㅅ’을 붙여 나타냈다. (cf. 유정명사의 관형격 조사 ‘ᄋᆡ/의’)
        다만 ‘‐차힛’으로는 쓰지 않고 아래처럼 ‘‐찻’으로 썼다.
        《석보상절》(1447년 수양대군作)
            【그저긔 羅랑刹차ᇙ女녕ᄃᆞᆯ히 ᄒᆞᆫ 일후믄 藍람婆빵ㅣ오 둘찻 일후믄 毗삥藍람婆빵ㅣ오 세찻 일후믄 曲콕齒칭오
            (그때의 나찰녀들이 첫째의 이름은 람바이고, 둘째의 이름은 비람바이고, 셋째의 이름은 곡치고)
            네찻 일후믄 華ᅘᅪᆼ齒칭오 다ᄉᆞᆺ찻 일후믄 黑ᅙᅳᆨ齒칭오 여슷찻 일후믄 多당髮버ᇙ이오 닐굽찻 일후믄 無뭉猒ᅙᅧᆷ足죡이오
            (넷째의 이름은 화치고, 다섯째의 이름은 흑치고, 여섯째의 이름은 다발이고, 일곱째의 이름은 무염족이고)
            여듧찻 일후믄 持띵瓔ᅙᅧᇰ珞락이오 아홉찻 일후믄 皐고ᇢ帝뎽오 열찻 일후믄 奪따ᇙ一ᅙᅵᇙ切촁衆쥬ᇰ生ᄉᆡᇰ精져ᇰ氣킝러니
            (여덟째의 이름은 지영락이고, 아홉째의 이름은 고제고, 열째의 이름은 탈일체중생정기이더니）】
        이때에도 서수사와 마찬가지로 ‘첫째의’에 해당하는 자리에 관형사 ‘첫’ 또는 ‘ᄒᆞᆫ’이 나타날 뿐이어서
        여기에서도 서수사와 같은 형식으로 ‘첫’과 ‘ᄒᆞᆫ’을 서수사의 관형격으로 본다.
        더불어 ‘열ᄒᆞ나차이’의 관형격도 ‘열ᄒᆞᆫ찻’으로만 문증되는바, ‘열ᄒᆞᆫ찻’, ‘스믈ᄒᆞᆫ찻’, ‘셜흔ᄒᆞᆫ찻’과 같이 이를 따른다.
        《석보상절》(1447년 수양대군作)
            【부텻 나히 셜흔다ᄉᆞ시러시니 穆목王ᅌᅪᇰ 아홉찻 ᄒᆡ 戊무ᇢ子ᄌᆞᆼㅣ라 (부처의 나이 서른다섯이시더니, 목왕 아홉째 해 무자년이다.)】,
            【부텻 나히 셜흔여스시러시니 穆목王ᅌᅪᇰ 열찻 ᄒᆡ 己긩丑튜ᇢㅣ라 (부처의 나이서른여섯이시더니, 목왕 열째 해 기축년이다.)】,
            【부텻 나히 셜흔닐구비러시니 穆목王ᅌᅪᇰ 열ᄒᆞᆫ찻 ᄒᆡ 庚ᄀᆡᇰ寅인이라 (부처의 나이서른일곱이시더니, 목왕 열한째 해 경인년이다.)】,
            【부텻 나히 셜흔여들비러시니 穆목王ᅌᅪᇰ 열둘찻 ᄒᆡ 辛신卯모ᇢㅣ라 (부처의 나이 서른여덟이시더니 목왕 열두째 해 신묘년이다)】 */
        optionOfFirst = (optionOfFirst == undefined || optionOfFirst !== 1)? 0 : optionOfFirst;
        if(num === 1) 
            return (optionOfFirst === 1)? oldKoreanNumeral.ones_prenouns[1][0] : oldKoreanNumeral.first_prenoun;
        else
            return (num%10 === 1)? oldKoreanNumeral.buildThePrenoun(num) + '찻' : oldKoreanNumeral.buildTheCardinal(num) + '찻';
    },
    /** 옛말 날수로 바꾸기
     * @function buildTheDay
     * @param {number} num 자연수, 날수로 바꿀 아라비아 숫자
     * @param {number} [option] 십의 자리 표현, 0: 스므날, 셜흔날 형식, 1: 두열흘, 세열흘 형식, Default는 0
     * @returns {string} */
    buildTheDay: (num, option) => {
        let day = '';
        // 예외 처리
        if(!isNaturalNumber(num))
            return '';

        option = (option == undefined || option !== 1)? 0 : option;
        let thousands_digit = Math.floor(num/1000);
        // 일의 자리
        num %= 1000;
        day = oldKoreanNumeral.ones_day[num%10];
        // 십의 자리
        num = Math.floor(num/10);
        day = (day !== '')? oldKoreanNumeral.tens_digit[num%10] + day 
            : (option === 0)? oldKoreanNumeral.tens_day[num%10]
            : (num%10 > 1)? oldKoreanNumeral.buildThePrenoun(num%10) + oldKoreanNumeral.tens_day[1]
            : (num%10 === 1)? oldKoreanNumeral.tens_day[1]
            : '';
        // 백의 자리
        num = Math.floor(num/10);
        if(num > 0){
            day = (day !== '')? oldKoreanNumeral.buildThePrenoun((num > 1)? num : 0) + oldKoreanNumeral.hundred + day
                : oldKoreanNumeral.buildThePrenoun((num > 1)? num : 0) + oldKoreanNumeral.hundred + '날';
        }
        // 천의 자리
        if(thousands_digit > 0){
            day = (day !== '')? oldKoreanNumeral.buildThePrenoun((thousands_digit > 1)? thousands_digit : 0) + oldKoreanNumeral.thousand + day
                : oldKoreanNumeral.buildThePrenoun((thousands_digit > 1)? thousands_digit : 0) +  oldKoreanNumeral.thousand + '날';
        }

        return day;
    },
    /** 옛말 날짜로 바꾸기
     * @function buildTheDate
     * @param {number} num 자연수, 날짜로 바꿀 아라비아 숫자
     * @returns {string} */
    buildTheDate: (num) => {
        let date = '';
        // 예외 처리
        if(!isNaturalNumber(num))
            return '';

        let thousands_digit = Math.floor(num/1000);
        // 일의 자리
        num %= 1000;
        date = oldKoreanNumeral.ones_date[num%10];
        // 십의 자리
        num = Math.floor(num/10);
        date = (date !== '')? oldKoreanNumeral.tens_digit[num%10] + date 
            : oldKoreanNumeral.tens_date[num%10];
        // 백의 자리
        num = Math.floor(num/10);
        if(num > 0){
            date = (date !== '')? oldKoreanNumeral.buildThePrenoun((num > 1)? num : 0) + oldKoreanNumeral.hundred + date
                : oldKoreanNumeral.buildThePrenoun((num > 1)? num : 0) + oldKoreanNumeral.hundred + '날';
        }
        // 천의 자리
        if(thousands_digit > 0){
            date = (date !== '')? oldKoreanNumeral.buildThePrenoun((thousands_digit > 1)? thousands_digit : 0) + oldKoreanNumeral.thousand + date
                : oldKoreanNumeral.buildThePrenoun((thousands_digit > 1)? thousands_digit : 0) +  oldKoreanNumeral.thousand + '날';
        }

        return date;
    },
    /** 옛말을 다시 아라비아 숫자로 바꾸기
     * @function interpretAsArabic
     * @param {string} str 숫자를 나타내는 옛말
     * @param {number} [option] 0: 숫자로 반환, 1: 문자열로 반환, Default는 0
     * @return {number | string} 문자열로 반환시 서수의 경우 1st, 2nd, 3rd, 4th 따위로 돌려 준다. */
    interpretAsArabic: (str, option) => {
        // 재귀 함수의 정지
        if(str === '') return 0;

        option = (option == undefined || option !== 1)? 0 : option;
        // 서수사 1 처리
        switch(true){
            case str.includes(oldKoreanNumeral.first_noun):
            case str.includes(oldKoreanNumeral.first_prenoun):
                if(option)
                    return '1st';
                else
                    return 1;
        }
        //천의 자리, 백의 자리를 따로 나누기
        let num = 0;
        let thsd = str.lastIndexOf(oldKoreanNumeral.thousand);
        let text = (thsd === -1)? str : str.slice(thsd + oldKoreanNumeral.thousand.length);
        let remained_text = (thsd === -1)? '' : (thsd === 0)? oldKoreanNumeral.ones_prenouns[1][0] : str.slice(0, thsd);
        let hndrd = text.indexOf(oldKoreanNumeral.hundred);
        let tens_text = (hndrd === -1)? text : text.slice(hndrd + oldKoreanNumeral.hundred.length);
        let hndrd_text = (hndrd === -1)? '' : (hndrd === 0)? oldKoreanNumeral.ones_prenouns[1][0] : text.slice(0, hndrd);
    
        let ones_done = false;
        let tens_done = false;
        let day_option = false;
        let date_option = false;
        for(let i = 1; i < oldKoreanNumeral.ones_digit.length; i++){
            switch(true){
                // 일의 자리
                case tens_text.includes(oldKoreanNumeral.ones_date[i]):
                    date_option = true;
                case tens_text.includes(oldKoreanNumeral.ones_day[i]):
                case tens_text.includes(oldKoreanNumeral.ones_digit[i]):
                    num = i;
                    ones_done = true;
                    break;
                // 십의 자리 날수, 날짜
                case tens_text.includes(oldKoreanNumeral.tens_date[i]):
                    date_option = true;
                case tens_text.includes(oldKoreanNumeral.tens_day[i]):
                    num = 10*i;
                    if(num === 10) day_option = true;
                    ones_done = true;
                    tens_done = true;
                    break;
            }
            if(ones_done) break;
        }
        // 수관형사 처리
        if(!ones_done || day_option){
            ones_done = false;
            for(let i = 1; i < oldKoreanNumeral.ones_prenouns.length; i++){
                for(let j = 0; j < oldKoreanNumeral.ones_prenouns[i].length; j++){
                    if(tens_text.includes(oldKoreanNumeral.ones_prenouns[i][j])){
                        num = (day_option)? num*i : i;
                        ones_done = true;
                        break;
                    }
                }
                if(ones_done) break;
            }
        }
        // 십의 자리
        if(!tens_done){
            for(let i = 1; i < oldKoreanNumeral.tens_digit.length; i++){
                if(tens_text.includes(oldKoreanNumeral.tens_digit[i])){
                    num += 10*i;
                }
            }
        }
        // 백의 자리
        if(hndrd_text !== ''){
            let hun_done = false
            for(let i = 1; i < oldKoreanNumeral.ones_prenouns.length; i++){
                for(let j = 0; j < oldKoreanNumeral.ones_prenouns[i].length; j++){
                    if(hndrd_text.includes(oldKoreanNumeral.ones_prenouns[i][j])){
                        num += 100*i;
                        hun_done = true;
                        break;
                    }
                }
                if(hun_done) break;
            }
        }
        //천의 자리
        num += 1000*oldKoreanNumeral.interpretAsArabic(remained_text);
        // 문자열로 변환
        if(option){
            switch(true){
                case str.includes('차히'):
                case str.includes('찻'):
                case date_option:
                    switch(num%10){
                        case 1:
                            return num.toString() + 'st';
                        case 2:
                            return num.toString() + 'nd';
                        case 3:
                            return num.toString() + 'rd';
                        default:
                            return num.toString() + 'th';
                    }
                default:
                    return num.toString();
            }
        }else{
            return num;
        }
    },
    /** ‘즈믄’ 앞에 공백 두기
     * @function spaceByThousand
     * @param {string} str 옛말 수사*/
    spaceByThousand: (str) => {
        if(str.indexOf(oldKoreanNumeral.thousand) > 0)
            return str.replaceAll(oldKoreanNumeral.thousand, ' '.concat(oldKoreanNumeral.thousand));
        else
            return str;
    }
};
/** 언어에 따른 글줄 설정 모음
 * @readonly
 * @constant wordsById
 * @type {object} HTMLElement id > language > HTMLElement Attribute */
const wordsById = {
    /* 제목
    ** 너모 **
    15세기 옛말에서 ‘넷’의 수관형사는 오늘날과 마찬가지로 “넉, 너, 네”였다.
    다만 분류사에 따라 붙는 수관형사의 종류가 오늘날과 달랐으니, ‘모’에는 ‘너’가 붙는 것이 조금 더 흔했던 듯하다.
    《월인석보》(1459년 세종作 세조編) 中
        【ᄯᅩ 鉤구ᇢ紐뉴ᇢ 브티ᄂᆞᆫ ᄯᅡ해 너모 반ᄃᆞᆨᄒᆞᆫ 거슬 브튜ᇙ 디니… (또 ‘구’와 ‘뉴’를 붙이는 땅에 네모 반듯한 것을 붙여야 할 것이니…)】
    ** 노ᄅᆞᆺ **
    ‘놀이’라는 낱말은 16세기에서야 보이는 낱말로, 15세기 ‘놀이’를 뜻하는 낱말은 ‘노ᄅᆞᆺ’이었다.
    《용비어천가》(1447년) 中
        【노ᄅᆞ샛 바ᅌᅩ리실ᄊᆡ ᄆᆞᆯ 우희 니ᅀᅥ 티시나 二軍 鞠手ᄲᅮᆫ 깃그니ᅌᅵ다 (놀이의 방울(공)이므로 말 위에 연이어 치시나 이군의 국수만 기뻐한 것입니다.)】
    */
    innerUpperBox :{
        english: {
            innerHTML: '<span>T</span><span>E</span><span>T</span><span>R</span><span>I</span><span>S</span>',
            style: {
                fontFamily: '',
                fontSize: '',
                letterSpacing: '',
                textAlign: ''
            }
        }, 
        korean: {
            innerHTML: '<span>테</span><span>트</span><span>리</span><span>스</span>',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '14.5dvh',
                letterSpacing: '0',
                textAlign: ''
            }
        },
        old_korean: {
            innerHTML: '<span>네 </span><span>너 </span><span>못 </span><span>돌 </span><span>노</span><span>ᄅᆞᆺ</span>',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '12dvh',
                letterSpacing: '-3dvh',
                textAlign: 'left'
            }
        }
    },
    textShadowBox: {
        english: {
            innerHTML: 'TETRIS',
            style: {
                fontFamily: '',
                fontSize: '',
                letterSpacing: '',
                textAlign: ''               
            }
        }, 
        korean: {
            innerHTML: '테트리스',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '14.5dvh',
                letterSpacing: '0',
                textAlign: ''             
            }
        },
        old_korean: {
            innerHTML: '네 너 못 돌 노ᄅᆞᆺ',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '12dvh',
                letterSpacing: '-3dvh',
                textAlign: 'left'
            }
        }
    },
    title: {
        english: {
            innerHTML: '<span>T</span><span>E</span><span>T</span><span>R</span><span>I</span><span>S</span>',
            style: {
                fontFamily: '',
                fontSize: '',
                letterSpacing: ''
            }
        }, 
        korean: {
            innerHTML: '<span>테</span><span>트</span><span>리</span><span>스</span>',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '7.5dvh',
                letterSpacing: ''
            }
        },
        old_korean: {
            innerHTML: '<span>네 </span><span>너 </span><span>못 </span><span>돌 </span><span>노</span><span>ᄅᆞᆺ </span>',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '7.6dvh',
                letterSpacing: '-1.6dvh'
            }
        }
    },
    titleShadow: {
        english: {
            innerHTML: 'TETRIS',
            style: {
                fontFamily: '',
                fontSize: '',
                letterSpacing: ''
            }
        }, 
        korean: {
            innerHTML: '테트리스',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '7.5dvh',
                letterSpacing: ''
            }
        },
        old_korean: {
            innerHTML: '네 너 못 돌 노ᄅᆞᆺ ',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '7.6dvh',
                letterSpacing: '-1.6dvh'
            }
        }
    },
    // 들머리 단추
    play_button: {
        english: {
            innerHTML: 'PLAY',
            style: {
                fontFamily: `Arial, Helvetica, sans-serif`,
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '시작하기',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '비르솜',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: '700'
            }
        }
    },
    levelup: {
        english: {
            innerHTML: '<span>LEVEL&nbsp;</span><span id="level_num">1</span>',
            style: {
                fontFamily: `Arial, Helvetica, sans-serif`,
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '<span>레벨&nbsp;</span><span id="level_num">1</span>',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: ''
            }
        },
        /* ‘ᄃᆞ리’는 1. 다리(橋, bridge), 2. 사다리, 3. 층층다리, 계단, 4. 등급, 계급, 품계의 뜻을 가졌다.
        다리(脚, leg)는 ‘다리’로 ‘ᄃᆞ리’와는 소리가 조금 달랐다.
        《내훈》(1475년 소혜왕후編) 中
            【有勢ᄒᆞᆫ ᄃᆡ 갓가이 ᄒᆞ야 ᄒᆞᆫ 資ㅣ나 半 ᄃᆞ리ᄅᆞᆯ 비록 시혹 得ᄒᆞ야도 衆人이 怒ᄒᆞ며 물사ᄅᆞ미 믜여 두리 아ᄎᆞ니라
            (세력 있는 데 가까이 하여 한 자(관등의 위계)나 반 계급을 혹시 얻더라도 뭇사람이 노하여 미워하여 보존하는 사람이 드무니라.)】 */
        old_korean: {
            innerHTML: '<span id="level_num">첫</span><span>&nbsp;ᄃᆞ리</span>',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: '700'
            }
        }
    },
    options_button: {
        english: {
            innerHTML: 'OPTIONS',
            style: {
                fontFamily: `Arial, Helvetica, sans-serif`,
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '설&nbsp;&nbsp;정',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: ''
            }
        },
        /* ‘아ᄅᆞᆷ뎌’ — “사사로이, 개인적으로”라는 뜻이다.
        ‘아ᄅᆞᆷ’은 사(私)적인 것이란 뜻으로, ‘ᄃᆞᆸ다’와 결합하여 ‘아ᄅᆞᆷᄃᆞᆸ다’(아ᄅᆞᆷᄃᆞᄫᅵ, 아ᄅᆞᆷᄃᆞ외, 아ᄅᆞᆷᄃᆞ이, 아ᄅᆞᆷ뎌)은 ‘사사롭다’는 뜻이 된다.
        (cf. ‘아ᄅᆞᆷ답다’는 ‘아름답다’고 하는 뜻으로 ‘아ᄅᆞᆷ(私)’와의 관계는 알 수 없다.)
        여기에서는 “customizing(개인 맞춤)”이라는 뜻에서 ‘아ᄅᆞᆷ뎌’를 가져왔다.
        《월인석보》(1459년 세종作 세조編) 中
            【내 이제 아ᄅᆞᆷ뎌 財ᄍᆡᆼ寶보ᇢᄅᆞᆯ 어더 衆쥬ᇰ生ᄉᆡᇰᄋᆞᆯ 足죡게 주리라 (내 이제 사사로이 재보를 얻어 중생에게 넉넉하도록 주리라.)
        《분류두공부시언해】(1481년)
            【그윗 것과 아ᄅᆞᇝ 거시 제여곰 ᄯᅡ해 브터셔 ᄌᆞᆷ겨 저저 하ᄂᆞᆳ ᄀᆞᄆᆞ리 업도다 (공물과 사유물이 제각각 땅에 붙어서 잠겨 젖어 하늘의 가문이 없도다.)】
        ‘ᄀᆞ촘’은 ‘갖춤’이다. ‘마초다(맞추다)’가 오늘날처럼 “어떤 기준에 따라 조정하다”라는 뜻으로 쓰인 예를 찾지 못했다. */
        old_korean: {
            innerHTML: '아ᄅᆞᆷ뎌 ᄀᆞ촘',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: '700'
            }
        }
    },
    howtoplay_button: {
        english: {
            innerHTML: 'HOW TO PLAY',
            style: {
                fontFamily: `Arial, Helvetica, sans-serif`,
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '게임 방법',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '노ᄅᆞᆺ 노ᄂᆞᆫ 법',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: '700'
            }
        }
    },
    highscores_button: {
        english: {
            innerHTML: 'HIGH SCORES',
            style: {
                fontFamily: `Arial, Helvetica, sans-serif`,
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '순 위 표',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '값 해 ᄐᆞ니',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: '700'
            }
        }
    },
    // 옵션 모달
    options: {
        english: {
            innerHTML: 'OPTIONS',
            style: {
                paddingTop: '',
                fontFamily: `Arial, Helvetica, sans-serif`
            }
        }, 
        korean: {
            innerHTML: '설&nbsp;&nbsp;정',
            style: {
                paddingTop: '2.2dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        /* ‘아ᄅᆞᆷ뎌’ — “사사로이, 개인적으로”라는 뜻이다.
        ‘아ᄅᆞᆷ’은 사(私)적인 것이란 뜻으로, ‘ᄃᆞᆸ다’와 결합하여 ‘아ᄅᆞᆷᄃᆞᆸ다’(아ᄅᆞᆷᄃᆞᄫᅵ, 아ᄅᆞᆷᄃᆞ외, 아ᄅᆞᆷᄃᆞ이, 아ᄅᆞᆷ뎌)은 ‘사사롭다’는 뜻이 된다.
        (cf. ‘아ᄅᆞᆷ답다’는 ‘아름답다’고 하는 뜻으로 ‘아ᄅᆞᆷ(私)’와의 관계는 알 수 없다.)
        여기에서는 “customizing(개인 맞춤)”이라는 뜻에서 ‘아ᄅᆞᆷ뎌’를 가져왔다.
        《월인석보》(1459년 세종作 세조編) 中
            【내 이제 아ᄅᆞᆷ뎌 財ᄍᆡᆼ寶보ᇢᄅᆞᆯ 어더 衆쥬ᇰ生ᄉᆡᇰᄋᆞᆯ 足죡게 주리라 (내 이제 사사로이 재보를 얻어 중생에게 넉넉하도록 주리라.)
        《분류두공부시언해】(1481년)
            【그윗 것과 아ᄅᆞᇝ 거시 제여곰 ᄯᅡ해 브터셔 ᄌᆞᆷ겨 저저 하ᄂᆞᆳ ᄀᆞᄆᆞ리 업도다 (공물과 사유물이 제각각 땅에 붙어서 잠겨 젖어 하늘의 가문이 없도다.)】
        ‘ᄀᆞ촘’은 ‘갖춤’이다. ‘마초다(맞추다)’가 오늘날처럼 “어떤 기준에 따라 조정하다”라는 뜻으로 쓰인 예를 찾지 못했다. */
        old_korean: {
            innerHTML: '아ᄅᆞᆷ뎌 ᄀᆞ촘',
            style: {
                paddingTop: '2.2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    title_key: {
        english: {
            innerHTML: 'KEYBOARD',
            style: {
                top: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '자 판',
            style: {
                top: '-1.5dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2dvh'
            }
        },
        old_korean: {
            innerHTML: '글 쇠',
            style: {
                top: '-1.5dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2dvh'
            }
        }
    },
    title_sound: {
        english: {
            innerHTML: 'SOUND',
            style: {
                top: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '소 리',
            style: {
                top: '-1.5dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2dvh'
            }
        },
        old_korean: {
            innerHTML: '소 리',
            style: {
                top: '-1.5dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2dvh'
            }
        }
    },
    // 언어 설정
    index_lang: {
        english: {
            innerHTML: 'LANGUAGE',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '언어',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: '말ᄊᆞᆷ',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    your_language: {
        english: {
            innerHTML: 'ENGLISH',
            style: {
                fontFamily: ``
            }
        }, 
        korean: {
            innerHTML: '한국어',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '나랏말ᄊᆞᆷ',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    // 자판 설정
    index_pause: {
        english: {
            innerHTML: 'PAUSE',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '일시 정지',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: '져근덛 머춤',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    index_move_left: {
        english: {
            innerHTML: 'MOVE LEFT',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '왼쪽으로 이동',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: '왼녀그로 옮굠',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    index_move_right: {
        english: {
            innerHTML: 'MOVE RIGHT',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '오른쪽으로 이동',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: '올ᄒᆞᆫ녀그로 옮굠',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    index_rotate_left: {
        english: {
            innerHTML: 'MOVE RIGHT',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '왼쪽으로 회전',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: '왼녀그로 돌욤',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    index_rotate_right: {
        english: {
            innerHTML: 'MOVE RIGHT',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '오른쪽으로 회전',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: '올ᄒᆞᆫ녀그로 돌욤',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    index_soft_drop: {
        english: {
            innerHTML: 'SOFT DROP',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '아래로 이동',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: '가ᄇᆡ야ᄫᅵ ᄠᅥᆯ움',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    index_hard_drop: {
        english: {
            innerHTML: 'HARD DROP',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '즉시 낙하',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: 'ᄆᆡᅀᆡ야ᄫᅵ ᄠᅥᆯ움',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    index_hold: {
        english: {
            innerHTML: 'HOLD',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '보관',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: '갈몸',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },    
    pause_key: {
        english: {
            style: {
                fontFamily: ''
            }
        },
        korean: {
            style: {
                fontFamily: ''
            }
        },
        old_korean: {
            style: {
                fontFamily: `'Noto Serif KR', 'Times New Roman', Times, serif`
            }
        }
    },
    move_left_key: {   
        english: {
            style: {
                fontFamily: ''
            }
        },
        korean: {
            style: {
                fontFamily: ''
            }
        },     
        old_korean: {
            style: {
                fontFamily: `'Noto Serif KR', 'Times New Roman', Times, serif`
            }
        }
    },
    move_right_key: {
        english: {
            style: {
                fontFamily: ''
            }
        },
        korean: {
            style: {
                fontFamily: ''
            }
        },     
        old_korean: {
            style: {
                fontFamily: `'Noto Serif KR', 'Times New Roman', Times, serif`
            }
        }
    },
    rotate_left_key: {
        english: {
            style: {
                fontFamily: ''
            }
        },
        korean: {
            style: {
                fontFamily: ''
            }
        },     
        old_korean: {
            style: {
                fontFamily: `'Noto Serif KR', 'Times New Roman', Times, serif`
            }
        }
    },
    rotate_right_key: {
        english: {
            style: {
                fontFamily: ''
            }
        },
        korean: {
            style: {
                fontFamily: ''
            }
        },    
        old_korean: {
            style: {
                fontFamily: `'Noto Serif KR', 'Times New Roman', Times, serif`
            }
        }
    },
    soft_drop_key: {
        english: {
            style: {
                fontFamily: ''
            }
        },
        korean: {
            style: {
                fontFamily: ''
            }
        },
        old_korean: {
            style: {
                fontFamily: `'Noto Serif KR', 'Times New Roman', Times, serif`
            }
        }
    },
    hard_drop_key: {
        english: {
            style: {
                fontFamily: ''
            }
        },
        korean: {
            style: {
                fontFamily: ''
            }
        },
        old_korean: {
            style: {
                fontFamily: `'Noto Serif KR', 'Times New Roman', Times, serif`
            }
        }
    },
    hold_key: {
        english: {
            style: {
                fontFamily: ''
            }
        },
        korean: {
            style: {
                fontFamily: ''
            }
        }, 
        old_korean: {
            style: {
                fontFamily: `'Noto Serif KR', 'Times New Roman', Times, serif`
            }
        }
    },
    // 키 설정 모달
    pressKey:{
        english: {
            innerHTML: 'PRESS THE DESIRED KEY FOR',
            style: {
                paddingTop: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '아래 동작을 실행할 키를 누르십시오.',
            style: {
                paddingTop: '4.3dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.4dvh'
            }
        },
        old_korean: {
            innerHTML: '아랫 뮈유믈 닐위ᇙ 글쇠ᄅᆞᆯ 누르쇼셔',
            style: {
                paddingTop: '4.3dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.4dvh'
            }
        }
    },
    actionText: {
        english: {
            style: {
                paddingTop: '',
                fontFamily: ''
            }
        }, 
        korean: {
            style: {
                paddingTop: '2.5dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            style: {
                paddingTop: '2.5dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    inputCancel: {
        english: {
            innerHTML: 'CANCEL',
            style: {
                fontFamily: '',
            }
        }, 
        korean: {
            innerHTML: '취소',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
            }
        },
        old_korean: {
            innerHTML: '마롬',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
            }
        }
    },
    invalid_key_text: {
        english: {
            innerHTML: 'Invalid key&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
            style: {
                fontFamily: ''
            }
        }, 
        korean: {
            innerHTML: '유효하지 않은 키입니다.&nbsp;&nbsp;&nbsp;',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '몯 ᄡᅳᇙ 글쇠니ᅌᅵ다&nbsp;&nbsp;&nbsp;&nbsp;',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    // 소리 크기 설정
    index_sfx: {
        english: {
            innerHTML: 'SOUND EFFECT VOLUME',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '효과음 크기',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: '뮈ᄂᆞᆫ소릿 킈',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    index_music: {
        english: {
            innerHTML: 'MUSIC VOLUME',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '배경음 크기',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: '푸ᇰ륫소릿 킈',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    SFX_Vol: {
        english: {
            style: {
                fontFamily: '',
                fontSize: ''
            }
        },
        korean: {
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        old_korean: {
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.8dvh'
            }
        }
    },
    BGM_Vol: { 
        english: {
            style: {
                fontFamily: '',
                fontSize: ''
            }
        },
        korean: {
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        old_korean: {
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.8dvh'
            }
        }
    },
    // 설정 초기화
    resetScores: {
        english: {
            innerHTML: 'RESET HIGH SCORES',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '순위표 초기화',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: '탯던 값 모도 지윰',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    resetOptions: {
        english: {
            innerHTML: 'RESET OPTIONS',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '설정 초기화',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            innerHTML: 'ᄀᆞ잿ᄂᆞᆫ 것 도로 믈륨',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    optionDone: {
        english: {
            innerHTML: 'DONE',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '확인',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.5dvh',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: 'ᄆᆞ촘',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.5dvh',
                fontWeight: '700'
            }
        }
    },
    confirm_reset_scores: {
        english: {
            innerHTML: 'RESET HIGH SCORES?',
            style: {
                paddingTop: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '점수를 초기화하시겠습니까?',
            style: {
                paddingTop: '3.5dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.5dvh'
            }
        },
        old_korean: {
            innerHTML: '여믓 모도 지이리ᅌᅵᆺ가',
            style: {
                paddingTop: '3.5dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: ''
            }
        }
    },
    confirm_reset_options: {
        english: {
            innerHTML: 'RESET OPTIONS?',
            style: {
                paddingTop: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '설정을 초기화하시겠습니까?',
            style: {
                paddingTop: '3.5dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.5dvh'
            }
        },
        old_korean: {
            innerHTML: '여믓 도로 믈리리ᅌᅵᆺ가',
            style: {
                paddingTop: '3.5dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: ''
            }
        }
    },
    resetOK: {
        english: {
            innerHTML: 'OK',
            style: {
                fontFamily: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '확인',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '그러타',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: '700'
            }
        }
    },
    resetCancel: {
        english: {
            innerHTML: 'CANCEL',
            style: {
                fontFamily: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '취소',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '아니다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: '700'
            }
        }
    },
    // 순위표
    highscores: {
        english: {
            innerHTML: 'HIGH SCORES',
            style: {
                paddingTop: '',
                fontFamily: `Arial, Helvetica, sans-serif`
            }
        }, 
        korean: {
            innerHTML: '순 위 표',
            style: {
                paddingTop: '2.2dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '값 해 ᄐᆞ니',
            style: {
                paddingTop: '2.2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    score_rank: {
        english: {
            innerHTML: 'RANK',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '순위',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.2dvh'
            }
        },
        old_korean: {
            innerHTML: '자리',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.2dvh'
            }
        }
    },
    score_name: {
        english: {
            innerHTML: 'NAME',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '이름',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.2dvh'
            }
        },
        old_korean: {
            innerHTML: '일훔',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.2dvh'
            }
        }
    },
    score_score: {
        english: {
            innerHTML: 'SCORE',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '점수',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.2dvh'
            }
        },
        old_korean: {
            innerHTML: 'ᄐᆞᆫ 값',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.2dvh'
            }
        }
    },
    score_lines: {
        english: {
            innerHTML: 'LINES',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '줄',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.2dvh'
            }
        },
        old_korean: {
            innerHTML: '아ᅀᆞᆫ 줄',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.2dvh'
            }
        }
    },
    score_date: {
        english: {
            innerHTML: 'DATE',
            style: {
                fontFamily: '',
                fontSize: '2.2dvh'
            }
        }, 
        korean: {
            innerHTML: '날짜',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.2dvh'
            }
        },
        /*《번역노걸대》(1517년) 中
            【伱說將年月曰生時來｡ 네 난 ᄒᆡ ᄃᆞᆯ 날 ᄣᅢ 니ᄅᆞ라
            (네가 태어난 해와 달과 날과 때를 이르라.)】 */
        old_korean: {
            innerHTML: 'ᄒᆡᄃᆞᆯ날',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: ''
            }
        }
    },
    scoreOk: {
        english: {
            innerHTML: 'OK',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '확인',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.5dvh',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '다돔',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.5dvh',
                fontWeight: '700'
            }
        }
    },
    // 게임 방법
    howtoplayTitle: {
        english: {
            innerHTML: 'HOW TO PLAY',
            style: {
                paddingTop: '',
                fontFamily: `Arial, Helvetica, sans-serif`
            }
        }, 
        korean: {
            innerHTML: '게임 방법',
            style: {
                paddingTop: '2.2dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '노ᄅᆞᆺ 노ᄂᆞᆫ 법',
            style: {
                paddingTop: '2.2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    howToPlayDone: {
        english: {
            innerHTML: 'DONE',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '확인',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.5dvh',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: 'ᄆᆞ촘',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.5dvh',
                fontWeight: '700'
            }
        }
    },
    howto1: {
        english: {
            innerHTML: '1',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        }, 
        korean: {
            innerHTML: '1',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        },
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildTheCardinal(1)}`,
            style: {
                fontSize: '2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                aspectRatio: '1.6/1'
            }
        }
    },
    howto2: {
        english: {
            innerHTML: '2',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        }, 
        korean: {
            innerHTML: '2',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        },
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildTheCardinal(2)}`,
            style: {
                fontSize: '2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                aspectRatio: '1.6/1'
            }
        }
    },
    howto3: {
        english: {
            innerHTML: '3',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        }, 
        korean: {
            innerHTML: '3',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        },
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildTheCardinal(3)}`,
            style: {
                fontSize: '2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                aspectRatio: '1.6/1'
            }
        }
    },
    howto4: {
        english: {
            innerHTML: '4',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        }, 
        korean: {
            innerHTML: '4',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        },
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildTheCardinal(4)}`,
            style: {
                fontSize: '2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                aspectRatio: '1.6/1'
            }
        }
    },
    howto5: {
        english: {
            innerHTML: '5',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        }, 
        korean: {
            innerHTML: '5',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        },
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildTheCardinal(5)}`,
            style: {
                fontSize: '2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                aspectRatio: '1.6/1'
            }
        }
    },
    howto6: {
        english: {
            innerHTML: '6',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        }, 
        korean: {
            innerHTML: '6',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        },
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildTheCardinal(6)}`,
            style: {
                fontSize: '2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                aspectRatio: '1.6/1'
            }
        }
    },
    howto7: {
        english: {
            innerHTML: '7',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        }, 
        korean: {
            innerHTML: '7',
            style: {
                fontSize: '',
                fontFamily: ``,
                aspectRatio: ''
            }
        },
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildTheCardinal(7)}`,
            style: {
                fontSize: '2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                aspectRatio: '1.6/1'
            }
        }
    },
    tetromino_title: {
        english: {
            innerHTML: 'TETROMINO&nbsp;',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: '',
                letterSpacing: '-0.01dvh'
            }
        }, 
        korean: {
            innerHTML: '테트로미노&nbsp;',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.1dvh',
                fontWeight: '',
                letterSpacing: ''
            }
        },
        old_korean: {
            innerHTML: '네너못돌&nbsp;',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh',
                fontWeight: '900',
                letterSpacing: ''
            }
        }
    },
    gravity_title: {
        english: {
            innerHTML: 'GRAVITY&nbsp;',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '중 력&nbsp;',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.1dvh',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: 'ᄠᅥ러듐&nbsp;',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh',
                fontWeight: '900'
            }
        }
    },
    lineclear_title: {
        english: {
            innerHTML: 'LINE CLEAR&nbsp;',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '줄 제거&nbsp;',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '줄 아ᅀᅩᆷ&nbsp;',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: '900'
            }
        }
    },
    move_title: {
        english: {
            innerHTML: 'MOVE&nbsp;',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '조 작&nbsp;',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.1dvh',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '돌 뮈윰&nbsp;',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh',
                fontWeight: '900'
            }
        }
    },
    ghostpiece_title: {
        english: {
            innerHTML: 'GHOST PIECE&nbsp;',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '그림자&nbsp;',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.1dvh',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '돐 그림제&nbsp;',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh',
                fontWeight: '900'
            }
        }
    },
    hold_title: {
        english: {
            innerHTML: 'HOLD&nbsp;',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '보관함&nbsp;',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.1dvh',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '돌 갈몸&nbsp;',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh',
                fontWeight: '900'
            }
        }
    },
    gameover_title: {
        english: {
            innerHTML: 'GAME OVER&nbsp;',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '게임 종료&nbsp;',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.1dvh',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '노ᄅᆞᆺ ᄆᆞ촘&nbsp;',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh',
                fontWeight: '900'
            }
        }
    },
    tetromino_explanation: {
        english: {
            innerHTML: 'The game is played using seven types of pieces, one at a time, each consisting of four squares connected orthogonally.',
            style: {
                fontFamily: '',
                fontSize: '',
                letterSpacing: '-0.01dvh'
            }
        }, 
        korean: {
            innerHTML: '게임은 네 개의 사각형이 직교하여 이루는 일곱 가지 조각이 하나씩 주어지며 진행됩니다.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                letterSpacing: '-0.1dvh'
            }
        },
        old_korean: {
            innerHTML: '노ᄅᆞᄉᆞᆫ 네 너모ᄅᆞᆯ 반ᄃᆞ기 브텨 ᄆᆡᇰᄀᆞ론 닐굽 가짓 돌로 ᄡᅥ ᄒᆞ나곰 노ᄂᆞ니ᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                letterSpacing: ''
            }
        }
    },
    gravity_explanation: {
        english: {
            innerHTML: 'The piece falls freely little by little and locks when it hits the ground. The higher the level, the faster it falls.',
            style: {
                fontFamily: '',
                fontSize: '',
                letterSpacing: ''
            }
        }, 
        korean: {
            innerHTML: '조각은 조금씩 땅으로 떨어지며 땅에 부딪히면 땅으로 굳습니다. 레벨이 오를수록 빠르게 떨어집니다.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                letterSpacing: '-0.1dvh'
            }
        },
        old_korean: {
            innerHTML: '돌히 젹젹 스싀로 ᄠᅥ러딜ᄊᆡ ᄆᆞᄎᆞᆷ내 ᄯᅡ해 ᄇᆞᄃᆞ텨 ᄯᅡ히 ᄃᆞᄫᆡᄂᆞᅌᅵ다 ᄃᆞ리 오ᄅᆞ디옷 ᄲᅡᆯ리 ᄠᅥ러디ᄂᆞᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                letterSpacing: ''
            }
        }
    }
};

/** 브라우저의 로컬스토리지에서 기존 설정값 꺼내오기
 * @type {{language: string, keyset: keyset, volume: soundVol}} */
var saved_options = loadOptions();
language = saved_options.language;
Object.keys(saved_options.keyset).forEach(key => {
    keyset[key] = saved_options.keyset[key];
});
Object.keys(saved_options.volume).forEach(key => {
    soundVol[key] = saved_options.volume[key];
});
changeLanguage(language);