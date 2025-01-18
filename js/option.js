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
const invalid_key = ['Escape', 'MetaLeft', 'MetaRight', 'ContextMenu', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
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
    language = defaultLanguage;
    keyset = deepCopy(defaultKeyset);
    soundVol = deepCopy(defaultsoundVol);
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
/** 사용할 언어 설정하기
 * @function setLanguage
 * @param {keyof languages} new_lang
 * @returns {boolean} 설정에 성공하면 True를, 실패하면 False를 돌려 준다. */
const setLanguage = (new_lang) => {
    let success = false;
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
    fillKeySet();
    fillDropdownBox();
    writeSFXVol();
    writeBGMVol();
    addMouseInput(openModal("option"), clickOption);
};
/** 옵션 모달 닫기
 * @function closeOptionModal */
const closeOptionModal = () => {
    removeMouseInput(closeModal("option"), clickOption);
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
            break;
        case 'resetOptions':
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
            if(setLanguage(lang))
                changeLanguage(lang)
    });
};
/** 언어 변경
 * @function changeLanguage
 * @param {keyof languages} language 바꿀 언어 */
const changeLanguage = (language) => {
    document.querySelectorAll('.wordForWord').forEach(element => {
        setNodeTextByLang(element, wordsById[element.id], language);
    });
};
/** 자판 입력 버튼에 글쇠 채우기
 * @function fillKeySet */
const fillKeySet = () => {
    Object.keys(keyset).forEach(key => {
        document.getElementById(`${key}_key`).innerHTML = translateKeyCodeToText(keyset[key]);
    });
};
/** 글쇠 코드 값을 내보일 낱말로 바꿈
 * @function translateKeyCodeToText
 * @param {string} keyCode 동작을 조작할 KeyboardEvent의 code 값
 * @returns {string} */
const translateKeyCodeToText = (keyCode) => {
    let text = keyCode;
    // Left/Right 앞으로 옮기기
    if(text.includes("Left"))
        text = "Left".concat(text.slice(0, text.indexOf("Left")));
    else if(text.includes("Right"))
        text = "Right".concat(text.slice(0, text.indexOf("Right")));
    // 낱말 사이 띄어쓰기
    for(let i = 0; i < text.length; i++){
        if(text.charCodeAt(i) < 97 || text.charCodeAt(i) > 122){
            text = text.slice(0, i) + " " + text.slice(i);
            i++;
        }
    }

    return text;
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
        closeKeyErrorDialogue();
        closeKeyInpuModal();
        fillKeySet();
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
    let old_korean_fraction = ['업숨', 'ᄒᆞᆫ 푼', '두 푼', '세 푼', '네 푼', '다ᄉᆞᆺ 푼', '여슷 푼', '닐굽 푼', '여듧 푼', '아홉 푼', '오ᄋᆞ롬'];
    switch(getLanguage()){
        case 'old_korean':
            element.innerHTML = `${old_korean_fraction[volume * 10]}`;
            break;
        default:
            element.innerHTML = `${volume * 100}%`;
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
/** 언어에 따른 글줄 설정 모음
 * @readonly
 * @constant wordsById
 * @type {object} HTMLElement id > language > HTMLElement Attribute */
const wordsById = {
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
            innerHTML: '손&nbsp;마&nbsp;촘',
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
            innerHTML: '낙하',
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
                fontFamily: `'Times New Roman', Times, serif`
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
                fontFamily: `'Times New Roman', Times, serif`
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
                fontFamily: `'Times New Roman', Times, serif`
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
                fontFamily: `'Times New Roman', Times, serif`
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
                fontFamily: `'Times New Roman', Times, serif`
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
                fontFamily: `'Times New Roman', Times, serif`
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
                fontFamily: `'Times New Roman', Times, serif`
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
                fontFamily: `'Times New Roman', Times, serif`
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
            innerHTML: '아랫 뮈유믈 닐윌 글쇠ᄅᆞᆯ 누르쇼셔',
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
            innerHTML: '몯 ᄡᅳᆯ 글쇠니ᅌᅵ다&nbsp;&nbsp;&nbsp;&nbsp;',
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
            innerHTML: 'ᄠᆞᆫ값 모도 지윰',
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
            innerHTML: '마촘 도로 믈움',
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
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '확인',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.5dvh'
            }
        },
        old_korean: {
            innerHTML: 'ᄆᆞ촘',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.5dvh'
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