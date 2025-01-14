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
/** 조작키에서 제외할 입력 목록
 * @readonly
 * @constant invalid_key
 * @type {string[]} */
const invalid_key = ['Escape', 'F1'];
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
            if(keyset[code] === keyCode) keyset[code] = '';
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
const clickOption = (event) => {
    let isDropdownBtn = false;
    switch(findButton(event)){
        case 'dropdownBtn':
            isDropdownBtn = true;
            toggleDropdownBox();
            break;
        case 'keyBtn':
            break;
        case 'lwerSFX':
            break;
        case 'raiseSFX':
            break;
        case 'lowerBGM':
            break;
        case 'raiseBGM':
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
const clickDropdownBox = (event) => {
    let button = findButton(event);
    Object.keys(languages).forEach(lang => {        
        if(button === lang)
            if(setLanguage(lang))
                document.querySelectorAll('.wordForWord').forEach(element => {
                    setNodeTextByLang(element, wordsById[element.id], lang);
                });
    });
}
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
/** HTMLElement에 글 넣기
 * @function setNodeAttribute
 * @param {HTMLElement} node 대상이 되는 HTMLElement
 * @param {object} text_property HTMLElement에 적용할 글 속성 객체
 * @param {languages} lang 적어 넣을 언어 */
const setNodeTextByLang = (node, text_property, lang) => {
    for(let key of Object.keys(text_property[lang]))
        setNodeAttribute(node, text_property[lang], key);
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