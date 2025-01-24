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
        testObjectStructure
    } from "./utility.js";

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
 * @constant defaultLanguage
 * @type {keyof languages} */
const defaultLanguage = 'english';
/** 조작키의 코드 값 목록
 * @type {defaultKeyset}
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
const keyset = {};
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
Object.freeze(defaultKeyset);
/** 조작키에서 제외할 입력 목록
 * @readonly
 * @constant invalid_key
 * @type {string[]} */
const invalid_key = ['Escape', 'MetaLeft', 'MetaRight', 'ContextMenu', 'MediaTrackNext', 'MediaTrackPrevious', 'VolumeMute', 'VolumeDown', 'VolumeUp', 'WakeUp', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
/** 효과음, 배경음 크기
 * @type {defaultsoundVol}
 * @namespace soundVol
 * @property {number} sfx_vol 효과음 크기 (0–1)
 * @property {number} bgm_vol 배경음 크기 (0–1) */
const soundVol = {};
/** 효과음, 배경음 크기 기초 설정
 * @readonly
 * @constant defaultsoundVol
 * @namespace defaultsoundVol
 * @property {number} sfx_vol 효과음 크기 (0–1)
 * @property {number} bgm_vol 배경음 크기 (0–1) */
const defaultsoundVol = {
    /** 효과음 크기
     * @type {number} 0부터 1까지 */
    sfx_vol: 1,
    /** 배경음 크기
     * @type {number} 0부터 1까지 */
    bgm_vol: 1
};
Object.freeze(defaultsoundVol);
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
        language: getItemFromLocalStorage("language", defaultLanguage),
        keyset: getItemFromLocalStorage("keyset", defaultKeyset),
        volume: getItemFromLocalStorage("volume", defaultsoundVol)
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
    if(setLanguage(defaultLanguage))
        changeLanguage(language);
    // 조작키 초기화
    Object.keys(defaultKeyset).forEach(key => {
        keyset[key] = defaultKeyset[key];
    });
    // 소리 크기 초기화
    Object.keys(defaultsoundVol).forEach(key => {
        soundVol[key] = defaultsoundVol[key];   
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
 * @param {keyof defaultKeyset} [action] 동작 이름
 * @returns {string|defaultKeyset|undefined} 매개변수가 있으면 그에 맞는 코드(string)를 돌려 주고, 없으면 조작키 목록 객체(object)를 돌려 준다. */
export const getKeyset = (action) => {
    return (action === undefined)? keyset : keyset[action];
};
/** 조작키 코드 집어넣기
 * @function setKeyset
 * @param {keyof defaultKeyset} action 동작 이름
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
    addMouseInput(openModal("option"), clickOption);
    refreshOptionModal();
};
/** 옵션 모달 닫기
 * @function closeOptionModal */
const closeOptionModal = () => {
    removeMouseInput(closeModal("option"), clickOption);
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
            toggleDropdownBox();
            break;
        case 'keyBtn':
            openKeyInputModal(event.target.id.slice(0, -4), event.target.parentElement.previousElementSibling.innerText);
            break;
        case 'lowerSFX':
            lowerSFXVol();
            writeSFXVol();
            break;
        case 'raiseSFX':
            raiseSFXVol();
            writeSFXVol();
            break;
        case 'lowerBGM':
            lowerBGMVol();
            writeBGMVol ();
            break;
        case 'raiseBGM':
            raiseBGMVol();
            writeBGMVol();
            break;
        case 'resetScores':
            openScoreResetModal();
            break;
        case 'resetOptions':
            openOptionResetModal();
            break;
        case 'optionDone':
            saveOptions();
            closeOptionModal();
            break;
    }
    //dropdown 다른 데 눌러도 닫기
    if(!isDropdownBtn) closeDropdownBox();
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
    addMouseInput(dropdownBox, clickDropdownBox);
};
/** 언어 설정 드롭다운 박스 닫기
 * @function closeDropdownBox */
const closeDropdownBox = () => {
    doDropdownBoxOpen = false;
    let dropdownBox = document.getElementById("dropdownBox");
    dropdownBox.style.display = 'none';
    removeMouseInput(dropdownBox, clickDropdownBox);
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
 * @param {keyof defaultKeyset} action 설정할 동작 이름
 * @param {string} keyText 모달에 보일 동작 이름 */
const openKeyInputModal = (action, actionText) => {
    document.getElementById("action").innerHTML = action;
    document.getElementById("actionText").innerHTML = actionText;
    addMouseInput(openModal("keyInput"), clickKeyInput);
    addKeyboardInput(document, keydownKeyInput);
};
/** 글쇠 입력 모달 닫기
 * @function closeKeyInpuModal */
const closeKeyInpuModal = () => {
    document.getElementById("action").innerHTML = '';
    document.getElementById("actionText").innerHTML = '';
    removeKeyboardInput(document, keydownKeyInput);
    removeMouseInput(closeModal("keyInput"), clickKeyInput);
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
            closeKeyErrorDialogue();
            closeKeyInpuModal();
            break;
    }
};
/** 글쇠 입력 오류 말풍선 열기
 * @function openKeyErrorDialogue */
const openKeyErrorDialogue = () => {
    document.getElementById("invalid_key").show();
    addMouseInput(document.getElementById("closeInvalidKey"), clickCloseKeyErrorButton);
};
/** 글쇠 입력 오류 말풍선 닫기
 * @function closeKeyErrorDialogue */
const closeKeyErrorDialogue = () => {
    document.getElementById("invalid_key").close();
    removeMouseInput(document.getElementById("closeInvalidKey"), clickCloseKeyErrorButton);
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
    /* 
        【세 돈애 믈 ᄒᆞᆫ 盞잔 半반ᄋᆞ로 닐굽 分분ᄋᆞᆯ 글혀… (서 돈에 물 한 잔 반으로 칠푼이 되도록 끓여…)】
    */
    let old_korean_fraction = ['업숨', 'ᄒᆞᆫ 분', '두 분', '서 분', '너 분', '닷 분', '엿 분', '닐굽 분', '여듧 분', '아홉 분', '오ᄋᆞ롬'];
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
    addMouseInput(openModal("resetModal"), clickScoreReset);
};
/** 순위표 초기화 모달 닫기
 * @function closeScoreResetModal */
const closeScoreResetModal = () => {
    removeMouseInput(closeModal("resetModal"), clickScoreReset);
};
/** 순위표 초기화 모달 마우스클릭 콜백 함수
 * @function clickScoreReset
 * @param {MouseEvent} event */
const clickScoreReset = function(event){
    switch(findButton(event)){
        case 'resetOK':
            resetScores();
            refreshOptionModal();
        case 'resetCancel':
            closeScoreResetModal();
            break;
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
    addMouseInput(openModal("resetModal"), clickOptionReset);
};
/** 설정 초기화 모달 닫기
 * @function closeOptionModal */
const closeOptionResetModal = () => {
    removeMouseInput(closeModal("resetModal"), clickOptionReset);
};
/** 설정 초기화 모달 마우스클릭 콜백 함수
 * @function clickOptionReset
 * @param {MouseEvent} event */
const clickOptionReset = function(event){
    switch(findButton(event)){
        case 'resetOK':
            resetOptions();
            refreshOptionModal();
        case 'resetCancel':
            closeOptionResetModal();
            break;
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
/** 수 관형사(꾸미는 말) 가져오기
 * @function getTheNumeralPrenouns
 * @param {number} num
 * @returns {string | number} 옛말은 문자열로 돌려 준다. */
export const getTheNumeralPrenouns = (num) => {

};
/** 옛말 수 관형사(꾸미는 말)로 바꾸기
 * @function buildTheNumeralPrenounsOfOldKorean
 * @param {number} cycle
 * @param {number} num
 * @param {string} [unit] 단위(單位), 하나치
 * @returns {string}
 */
const buildTheNumeralPrenounsOfOldKorean = (cycle, num, unit) => {
    
    if(!isNaturalNumber(num)) 
        return '';

    let unit_list = [
        [['']],
        [['']],
        [['']],
        [['ᄃᆞᆯ', '달', '랴ᇰ', '냥', '자', '자'], ['근', '근', '말', '말', '되', '되', '분', '분', '푼', '푼', '홉', '홉'], ['']], // 세 돈(> 서 돈), 서 되(> 석 되) 
        [['ᄃᆞᆯ', '달', '랴ᇰ', '냥', '자', '자'], ['근', '근', '말', '말', '되', '되', '분', '분', '푼', '푼', '홉', '홉'], ['']],
        [['자', '자'], ['근', '근', '돈', '돈', '말', '말', '되', '랴ᇰ', '냥', '되', '분', '분', '푼', '푼', '홉', '홉'], ['']],
        [['자', '자'], ['근', '근', '돈', '돈', '말', '말', '되', '랴ᇰ', '냥', '되', '분', '분', '푼', '푼', '홉', '홉'], ['']],
        [['']],
        [['']],
        [['']]
    ];
    let fir_digit = [[''], ['ᄒᆞᆫ'], ['두'], ['석', '서', '세'], ['넉', '너', '네'], ['대', '닷', '다ᄉᆞᆺ'], ['예', '엿', '여슷'], ['닐굽'], ['여듧'], ['아홉']];
    /* 15세기 ‘스믈’의 관형사는 ‘스믈’ 그대로였다. 오늘날 ‘스물’의 관형사가 ‘스무’인 것과 다르다.
    《구급방언해》(1466년) 中
        【巴방豆뚜ᇢ 스믈 나ᄎᆞᆯ 것과 소ᄇᆞᆯ 앗고 ᄀᆞ라…(파두 스무 낱(個)을 겉과 속을 앗고 갈아…)】 */
    let sec_digit = ['', '열', '스믈', '셜흔', '마ᅀᆞᆫ', '쉰', '여ᄉᆔᆫ', '닐흔', '여든', '아ᄒᆞᆫ'];
    let hundred = '온';
    let thousand = '즈믄';

    let over_thousand = 
};
/** 기수사(개수를 세는 말) 가져오기
 * @function getTheCardinalNumerals
 * @param {number} num
 * @returns {string | number}
 */
export const getTheCardinalNumerals = (num) => {
    
};
/** 옛말 기수사(개수를 세는 말)로 바꾸기
 * @function buildTheCardinalNumeralsOfOldKorean
 * @param {number} cycle 
 * @param {number} num
 * @returns {string} 
 */
const buildTheCardinalNumeralsOfOldKorean = (cycle, num) => {
    let fir_digit = ['', 'ᄒᆞ나', '둘', '세', '네', '다ᄉᆞᆺ', '여슷', '닐굽', '여듧', '아홉'];
    let sec_digit = ['', '열', '스믈', '셜흔', '마ᅀᆞᆫ', '쉰', '여ᄉᆔᆫ', '닐흔', '여든', '아ᄒᆞᆫ'];
};
/** 서수사(순서 세는 말) 가져오기
 * @function getTheOrdinalNumerals
 * @param {number} num 
 * @returns {string | number}
 */
export const getTheOrdinalNumerals = (num) => {

};
/** 옛말 서수사(순서 세는 말)로 바꾸기
 * @function buildTheOrdinalNumeralsOfOldKorean
 * @param {number} cycle 
 * @param {number} num 
 * @returns {string}
 */
const buildTheOrdinalNumeralsOfOldKorean = (cycle, num) => {
    /* 《월인석보》(1459년 세종作 세조編) 中
     《소학언해》(1588년) 中 【그 ᄒᆞ낫재ᄂᆞᆫ 스스로 편안홈을 求ᄒᆞ며 ᄆᆞᆰ고 조홈을 ᄃᆞᆯ이 너기디 아니ᄒᆞ야…】
     첫째의 옛말이 나타나는 것은 훨씬 뒤의 일이다.
     더욱이 아래의 예와 같이 서수사 자리에 “ᄒᆞ나, 둘, 세” 따위를 쓴 일이 많았으므로, 여기서는 ‘ᄒᆞ나차히’를 15세기 서수사로 본다. 
     《월인석보》(1459년 세종作 세조編) 中
        【여듧 가짓 소리ᄂᆞᆫ ᄒᆞ나핸 ᄀᆞ자ᇰ 됴ᄒᆞ신 소리오 둘헨 보ᄃᆞ라ᄫᆞ신 소리오 세헨 맛가ᄫᆞ신 소리오…
        (여덟 가지의 소리는 첫째는 가장 좋으신 소리고, 둘째는 보드라우신 소리고, 셋째는 알맞으신 소리고…)】
    */
};
/** 서수 관형사(순서로 꾸미는 말) 가져오기
 * @function getTheOrdinalNumeralPrenouns
 * @param {number} num
 * @return {string | number} */
export const getTheOrdinalNumeralPrenouns = (num) => {

};
/** 옛말 서수 관형사(순서로 꾸미는 말)로 바꾸기
 * @function buildTheOrdinalNumeralPrenounsOfOldKorean
 * @param {number} cycle 
 * @param {number} num 
 * @returns {string}
 */
const buildTheOrdinalNumeralPrenounsOfOldKorean = (cycle, num) => {
    
};
export const getDate = (date) => {

};
const buildTheDayNumeralsOfOldKorean = (num) => {

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
/** 언어에 따른 글줄 설정 모음
 * @readonly
 * @constant wordsById
 * @type {object} HTMLElement id > language > HTMLElement Attribute */
const wordsById = {
    // 제목
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
    levelup:{
        english: {
            innerHTML: '<span>LEVEL:&nbsp;</span><span id="level_num">1</span>',
            style: {
                fontFamily: `Arial, Helvetica, sans-serif`,
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '<span>레벨:&nbsp;</span><span id="level_num">1</span>',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '<span id="level_num">1</span><span>&nbsp;ᄃᆞ리</span>',
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
            innerHTML: '저장',
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