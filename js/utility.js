import "./crypto-js.min.js";
/***************************** 객체 도구 *****************************/
/** 깊은 복사
 * @function deepCopy
 * @param {object} object 
 * @returns {object} 넣은 것과 똑같은 값의 객체를 다른 주소로 돌려 준다. */
export const deepCopy = (object) => {
    if(object === null || typeof object !== "object")
        return object;
    
    let new_object = (Array.isArray(object))? [] : {};
    
    for(let key of Object.keys(object))
        new_object[key] = deepCopy(object[key]);
    
    return new_object;
};
/** 객체 구조 비교하기
 * @function testObjectStructure
 * @param {object} test_obj 
 * @param {object} model_obj 
 * @returns {boolean} 두 객체의 구조가 같으면 True를, 다르면 False를 돌려 준다. 객체가 담은 원시자료형의 타입까지 따지지는 않는다. */
export const testObjectStructure = (test_obj, model_obj) => {
    if(model_obj === undefined || test_obj === undefined){
        return false;
    }else if(typeof model_obj !== "object" && typeof test_obj !== "object"){
        return true;
    }else if(typeof model_obj === "object" && typeof test_obj === "object"){
        for(let key of Object.keys(model_obj))
            if(!testObjectStructure(test_obj[key], model_obj[key]))
                return false;
        return true;
    }else{
        return false;
    }
};
/** 참/거짓 배열의 요소가 모두 참인지 검사
 * @function isAllTrue
 * @param {boolean[]} arr 
 * @returns {boolean} 배열 요소가 모두 참이라면 True를, 하나라도 거짓이라면 False를 돌려 준다. */
export const isAllTrue = (arr) => {
    if(!Array.isArray(arr))
        return false;
    for(let e of arr)
        if(!e) return false;
    return true;
};
/***************************** 문자열 도구 *****************************/
/** 숫자를 쉼표와 함께 문자열로 변환
 * @function makeScoreString
 * @param {number} score
 * @returns {string} */ 
export const makeScoreString = (score) => {
    let str = (score === '')? '' : score.toString();
    let text = '';
    for(let i = str.length; i > 0; i -= 3){
        text = (text === '')? str.substring(i - 3, i) : str.substring(i - 3, i) + ',' + text;
    }
    return text;
};
/** 오늘 날짜 받아오기 
 * @returns {string} yyyy-mm-dd */
export const getToday = () => {
    let today = new Date()
    return today.getFullYear().toString() + '-'
        + (today.getMonth() + 1).toString().padStart(2, '0') + '-'
        + today.getDate().toString().padStart(2, '0');
};
/***************************** 애니메이션 도구 *****************************/
/** 노드에 속성값을 적용하는 콜백 함수
 * @callback setNodeProperty
 * @param {HTMLElement|HTMLElement[]} nodes 대상이 되는 HTML요소의 배열
 * @param {number} property 대상에 적용할 값
 * @returns {void}
 */
/** 애니메이션을 그칠지 알려 주는 콜백 함수
 * @callback isAnimationOn
 * @returns {boolean} 애니메이션을 이어 하려거든 True를, 그치려거든 False를 돌려 준다. */
/** 애니메이션을 이루는 공통 함수
 * @async
 * @function makeAnimation
 * @param {number} initial_state 애니메이션이 시작될 때의 속성값
 * @param {number} final_state 애니메이션이 끝날 때의 속성값
 * @param {number} stride 속성값의 변화 폭
 * @param {HTMLElement|HTMLElement[]} nodes 대상 HTML요소
 * @param {number} duration 애니메이션 재생 시간(ms)
 * @param {setNodeProperty} setNodeProperty 대상 HTML요소에 속성값을 적용하는 콜백 함수
 * @param {isAnimationOn} isAnimationOn 애니메이션을 그칠지 알려 주는 콜백 함수
 * @returns {Promise<boolean>} 애니메이션을 끝마치거든 True를, 미처 마치치 못하고 멈추거든 False를 돌려 준다.  */
export const makeAnimation = (initial_state, final_state, stride, nodes, duration, setNodeProperty, isAnimationOn) => {
    let present_state = initial_state;
    let direction = (initial_state > final_state)? -1 : 1;
    stride = direction * stride;
    let delay = duration * stride / (final_state - initial_state);
    return new Promise(resolve => {
        let timerId = setTimeout(function animation(){
            if(isAnimationOn()){
                present_state = parseFloat((present_state + stride).toFixed(3));
                if(direction * present_state < direction * final_state){
                    setNodeProperty(nodes, present_state);
                    timerId = setTimeout(animation, delay);
                }else{
                    present_state = final_state;
                    setNodeProperty(nodes, present_state);
                    resolve(true);
                }
            }else{
                clearTimeout(timerId);
                resolve(false);
            }
        }, delay);
    })
};
/***************************** 창 여닫기 및 입력 도구 *****************************/
/** HTMLElement의 ID로 모달 열기 
 * @function openModal
 * @param {string} id HTMLElement의 ID 속성
 * @returns {HTMLElement} 연 모달의 HTMLElement */
export const openModal = (id) => {
    let element = document.getElementById(id);
    element.style.visibility = 'visible';
    return element;
};
/** HTMLElement의 ID로 모달 닫기
 * @function closeModal
 * @param {number} id HTMLElement의 ID 속성
 * @returns {HTMLElement} 닫은 모달의 HTMLElement */
export const closeModal = (id) => {
    let element = document.getElementById(id);
    element.style.visibility = 'hidden';
    return element;
};
/** EventListener에 들어갈 클릭 콜백 함수
 * @callback MouseCallback
 * @this {Document|HTMLElement}
 * @param {MouseEvent} event
*/
/** EventListener에 들어갈 키다운 콜백 함수
 * @callback KeydownCallback
 * @this {Document|HTMLElement}
 * @param {KeyboardEvent} event
*/
/** EventListener에 들어갈 인풋 콜백 함수
 * @callback InputCallback
 * @this {Document|HTMLElement}
 * @param {Event} event
*/
/** EventListener에 들어갈 윈도우 리사이즈 콜백 함수
 * @callback resizeCallback
 * @this {Document|HTMLElement}
 * @param {UIEvent}
 */
/** 마우스클릭 입력 추가
 * @function addMouseInput
 * @param {Document|HTMLElement} element 
 * @param {MouseCallback} callback */
export const addMouseClick = (element, callback) => {
    element.addEventListener("click", callback);
};
/** 마우스클릭 입력 삭제
 * @function removeMouseInput
 * @param {Document|HTMLElement} element 
 * @param {MouseCallback} callback */
export const removeMouseClick = (element, callback) => {
    element.removeEventListener("click", callback);
};
/** 마우스 올리기 추가
 * @function addMouseOver
 * @param {Document|HTMLElement} element 
 * @param {MouseCallback} callback */
export const addMouseOver = (element, callback) => {
    element.addEventListener("mouseover", callback);
};
/** 마우스 올리기 삭제
 * @function removeMouseOver
 * @param {Document|HTMLElement} element 
 * @param {MouseCallback} callback */
export const removeMouseOver = (element, callback) => {
    element.removeEventListener("mouseover", callback);
};
/** 마우스 입력 추가
 * @function addMouseInput
 * @param {Document|HTMLElement} element 
 * @param {MouseCallback} click_callback 
 * @param {MouseCallback} over_callback */
export const addMouseInput = (element, click_callback, over_callback) => {
    if(click_callback != undefined) addMouseClick(element, click_callback);
    if(over_callback != undefined) addMouseOver(element, over_callback);
};
/** 마우스 입력 삭제
 * @function addMouseInput
 * @param {Document|HTMLElement} element 
 * @param {MouseCallback} click_callback 
 * @param {MouseCallback} over_callback */
export const removeMouseInput = (element, click_callback, over_callback) => {
    if(click_callback != undefined) removeMouseClick(element, click_callback);
    if(over_callback != undefined) removeMouseOver(element, over_callback);
};
/** 키보드 입력 추가
 * @function addKeyboardInput
 * @param {Document|HTMLElement} element 
 * @param {KeydownCallback} callback */
export const addKeyboardInput = (element, callback) => {
    element.addEventListener("keydown", callback);
};
/** 키보드 입력 삭제
 * @function removeKeyboardInput
 * @param {Document|HTMLElement} element 
 * @param {KeydownCallback} callback */
export const removeKeyboardInput = (element, callback) => {
    element.removeEventListener("keydown", callback);
};
/** 인풋 입력 추가
 * @function addInputEvent
 * @param {Document|HTMLElement} element 
 * @param {InputCallback} callback */
export const addInputEvent = (element, callback) => {
    element.addEventListener("input", callback);
};
/** 인풋 입력 삭제
 * @function removeInputEvent
 * @param {Document|HTMLElement} element 
 * @param {InputCallback} callback */
export const removeInputEvent = (element, callback) => {
    element.removeEventListener("input", callback);
};
/** 창 크기 조정 입력 추가
 * @function addResizeEvent
 * @param {resizeCallback} callback */
export const addResizeEvent = (callback) => {
    window.addEventListener("resize", callback);
};
/** 창 크기 조정 입력 삭제
 * @function removeResizeEvent
 * @param {resizeCallback} callback */
export const removeResizeEvent = (callback) => {
    window.removeEventListener("resize", callback);
};
/** 마우스이벤트에서 버튼 이름 얻기
 * @function addMouseInput
 * @param {MouseEvent} event 
 * @return {string} HTMLElement의 클래스 이름 배열에서 마지막 요소를 돌려 준다. */
export const findButton = (event) => {
    event.preventDefault();
    let button = (event.target.className === '' || event.target.className === 'wordForWord')? event.target.parentElement.className : event.target.className;
    let classes = (button !== '')? button.split(' ') : [];
    return button = (classes.length !== 0)? classes[classes.length - 1] : '';
};
/***************************** 문자열 대칭 알고리즘(AES256) *****************************/
/** 문자열 대칭 알고리즘 암호화(AES256) 
 * @function pseudoEncryptText
 * @param {string} text 암호화할 문자열
 * @returns {string} 암호화된 문자열 */
export const pseudoEncryptText = (text) => {
    return CryptoJS.AES.encrypt(text, 'ComingThisFar,DoWhateverYouWant.').toString();
};
/** 문자열 대칭 알고리즘 복호화(AES256)
 * @function pseudoDecryptText
 * @param {string} cipher 암호화된 문자열
 * @returns {string} 해독된 문자열 */
export const pseudoDecryptText = (cipher) => {
    return CryptoJS.AES.decrypt(cipher, 'ComingThisFar,DoWhateverYouWant.').toString(CryptoJS.enc.Utf8);
};
/***************************** 언어 변경 도구 *****************************/
/** 지원 언어 종류
 * @typedef {'english'|'korean'|'old_korean'} languages */
/** 언어 변경
 * @function changeLanguage
 * @param {languages} lang 바꿀 언어 */
export const changeLanguage = (lang) => {
    document.querySelectorAll('.wordForWord').forEach(element => {
        setNodeAttributeByLang(element, element.id, lang);
    });
};
/** HTMLElement에 글 넣기
 * @function setNodeAttribute
 * @param {HTMLElement} node 대상이 되는 HTMLElement
 * @param {string} id 적용할 HTMLElement의 id
 * @param {languages} lang 적어 넣을 언어 */
export const setNodeAttributeByLang = (node, id, lang) => {
    // 속성 아이디가 있는지 확인
    if(wordsById[id] == undefined)
        return false;
    // 해당 언어가 있는지 확인
    let test = false
    for(let key of Object.keys(wordsById[id]))
        if(key === lang)
            test = true;
    if(!test) return false;
    // 있다면 글 바꾸기
    for(let key of Object.keys(wordsById[id][lang]))
        setNodeAttribute(node, wordsById[id][lang], key);
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
/** 수관형사(꾸미는 말) 가져오기
 * @function getTheNumeralPrenouns
 * @param {number} num 자연수, 수관형사로 바꿀 아라비아 숫자
 * @param {string} [classifier] 분류사(分類詞), 단위(單位), 하나치
 * @returns {string | number} 수관형사를 나랏말ᄊᆞᆷ의 문자열로 돌려 준다. */
export const getTheNumeralPrenouns = (num, classifier) => {
    return (num === 0)? '업숨' : oldKoreanNumeral.buildThePrenoun(num, classifier);
};
/** 기수사(개수를 세는 말) 가져오기
 * @function getTheCardinalNumerals
 * @param {number} num 자연수, 기수사로 바꿀 아라비아 숫자
 * @returns {string} 기수사를 나랏말ᄊᆞᆷ의 문자열로 돌려 준다. */
export const getTheCardinalNumerals = (num) => {
    return (num === 0)? '업숨' : oldKoreanNumeral.buildTheCardinal(num);
};
/** 서수사(순서 세는 말) 가져오기
 * @function getTheOrdinalNumerals
 * @param {number} num 자연수, 서수사로 바꿀 아라비아 숫자
 * @returns {string} 서수사를 나랏말ᄊᆞᆷ의 문자열로 돌려 준다. */
export const getTheOrdinalNumerals = (num) => {
    return oldKoreanNumeral.buildTheOrdinal(num);
};
/** 서수 관형사(순서로 꾸미는 말) 가져오기
 * @function getTheOrdinalNumeralPrenouns
 * @param {number} num 자연수, 서수 관형사로 바꿀 아라비아 숫자
 * @param {number} option 첫째를 나타내는 말 선택, 0: 첫, 1: ᄒᆞᆫ, 기본값은 0
 * @return {string} 서수 관형사를 나랏말ᄊᆞᆷ의 문자열로 돌려 준다. */
export const getTheOrdinalNumeralPrenouns = (num, option = 0) => {
    return oldKoreanNumeral.buildTheOrdinalPrenoun(num, option);
};
/** 순위에 해당하는 옛말 문자열 가져오기
 * @function getRankText
 * @param {number} num 자연수, 출력할 순위
 * @param {languages} lang 가져올 언어
 * @returns {string} */
export const getRankText = (num, lang) => {
    switch(lang){
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
/** 날짜를 옛말로 가져오기
 * @function getDateText
 * @param {string} date yyyy-MM-dd 형식의 문자열 
 * @returns {string} */
export const getDateText = (date) => {
    /* 15세기 실제로 해와 달을 나타내던 방법은 명나라의 연호 또는 간지(干支)와 아울러, 일월(一月), 이월(二月), 삼월(三月)과 같은 한자어로 나타내었는데
    아래의 보기에서와 같이 해와 달을 서수사로 나타냄 직하므로, 해와 달과 날을 우리말로 옮겨 본다.
    《석보상절》(1447년 수양대군作) 中
        【부텻 나히 셜흔다ᄉᆞ시러시니 穆목王ᅌᅪᇰ 아홉찻 ᄒᆡ 戊무ᇢ子ᄌᆞᆼㅣ라 (부처의 나이 서른다섯이시더니, 목왕 아홉째 해 무자년이다.)】,
        【부텻 나히 셜흔여스시러시니 穆목王ᅌᅪᇰ 열찻 ᄒᆡ 己긩丑튜ᇢㅣ라 (부처의 나이서른여섯이시더니, 목왕 열째 해 기축년이다.)】,
        【부텻 나히 셜흔닐구비러시니 穆목王ᅌᅪᇰ 열ᄒᆞᆫ찻 ᄒᆡ 庚ᄀᆡᇰ寅인이라 (부처의 나이서른일곱이시더니, 목왕 열한째 해 경인년이다.)】,
        【부텻 나히 셜흔여들비러시니 穆목王ᅌᅪᇰ 열둘찻 ᄒᆡ 辛신卯모ᇢㅣ라 (부처의 나이 서른여덟이시더니 목왕 열두째 해 신묘년이다)】 */
    let date_list = date.split('-');
    if(date_list.length !== 3) return date;
    return oldKoreanNumeral.buildTheOrdinalPrenoun(Number.parseInt(date_list[0])) + 'ᄒᆡ '
            + oldKoreanNumeral.buildTheOrdinalPrenoun(Number.parseInt(date_list[1])) + 'ᄃᆞᆯ '
            + oldKoreanNumeral.buildTheDate(Number.parseInt(date_list[2]));
};
/** ‘즈믄’ 앞에 공백 두기
 * @function putSpaceByThousand
 * @param {string} str 옛말 수사
 * @param {string} [chars] 공백 대신 들어갈 문자열
 * @returns {string} */
export const putSpaceByThousand = (str, chars = ' ') => {
    return oldKoreanNumeral.spaceByThousand(str, chars);
};
/** 옛말을 다시 아라비아 숫자로 바꾸기
     * @function interpretOldKoreanAsArabic
     * @param {string} str 숫자를 나타내는 옛말
     * @param {number} [option] 0: 숫자로 반환, 1: 문자열로 반환, 기본값은 0
     * @return {number | string} 문자열로 반환시 서수의 경우 1st, 2nd, 3rd, 4th 따위로 돌려 준다. */
export const interpretOldKoreanAsArabic = (numeral_text, option = 0) => {
    return oldKoreanNumeral.interpretAsArabic(numeral_text, option);
}
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
        [['ᄃᆞᆯ', '달', '랴ᇰ', '냥', '자', '자'], ['근', '근', '말', '말', '되', '되', '분', '분', '푼', '푼', '홉', '홉'], ['']],
        [['ᄃᆞᆯ', '달', '랴ᇰ', '냥', '자', '자'], ['근', '근', '말', '말', '되', '되', '분', '분', '푼', '푼', '홉', '홉'], ['']],
        [['자', '자'], ['근', '근', '돈', '돈', '말', '말', '되', '랴ᇰ', '냥', '되', '분', '분', '푼', '푼', '홉', '홉'], ['']],
        [['자', '자'], ['근', '근', '돈', '돈', '말', '말', '되', '랴ᇰ', '냥', '되', '분', '분', '푼', '푼', '홉', '홉'], ['']],
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
     * @param {number} [optionOfFirst] 첫째를 나타내는 말 선택, 0: 처ᅀᅥᆷ, 1: ᄒᆞ나차히, 기본값은 0
     * @returns {string}
     * @description 
     *  오늘날 접미사 ‘‐째’를 붙이듯이 15세기에는 ‘‐차히’를 붙여 서수를 나타냈다.
        다만 오늘날엔 “열한째, 열두째”와 같이 수관형사에 접미사를 붙이지만, 15세기에는 “열ᄒᆞ나차이, 열둘차이”와 같이 기수사에 접미사를 붙이는 일이 더욱 흔했다.
        《월인석보》(1459년 세종作 세조編) 中
            【첫 相샤ᇰᄋᆞᆫ 머릿 뎌ᇰ바기ᄅᆞᆯ 보ᅀᆞᄫᆞ리 업스며 둘차힌 뎌ᇰ바깃(…) 세차힌 니마히(…) 네차힌 눈서비(…) 닐흔아홉차힌 손바리(…) 여든차힌 손바래 德득字ᄍᆞᆼ 겨샤미라
            (첫 상은 머리 정수리를 볼 이가 없으며 둘째는 정수리의(…) 세째는 이마가(…) 네째는 눈썹이(…) 일흔아홉째는 손발이(…) 여든째는 손발에 덕 자가 있으심이다.】
        《능엄경언해》(1462년 간경도감刊) 中
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
    buildTheOrdinal: (num, optionOfFirst = 0) => {
        // 예외 처리
        if(!isNaturalNumber(num)) 
            return '';
        optionOfFirst = (optionOfFirst !== 1)? 0 : optionOfFirst;
        return (optionOfFirst === 0 && num === 1)? oldKoreanNumeral.first_noun : oldKoreanNumeral.buildTheCardinal(num) + '차히';
    },
    /** 옛말 서수사 관형격(순서로 꾸미는 말)으로 바꾸기
     * @function buildTheOrdinalPrenoun
     * @param {number} num 자연수, 서수사 관형격으로 바꿀 아라비아 숫자
     * @param {number} [optionOfFirst] 첫째를 나타내는 말 선택, 0: 첫, 1: ᄒᆞᆫ, 기본값은 0
     * @returns {string} 
     * @description
     * 서수사를 관형격으로 쓸 때에는 무정명사의 관형격 조사 ‘ㅅ’을 붙여 나타냈다. (cf. 유정명사의 관형격 조사 ‘ᄋᆡ/의’)
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
    buildTheOrdinalPrenoun: (num, optionOfFirst = 0) => {
        // 예외 처리
        if(!isNaturalNumber(num)) 
            return '';
        optionOfFirst = (optionOfFirst !== 1)? 0 : optionOfFirst;
        if(num === 1) 
            return (optionOfFirst === 1)? oldKoreanNumeral.ones_prenouns[1][0] : oldKoreanNumeral.first_prenoun;
        else
            return (num%10 === 1)? oldKoreanNumeral.buildThePrenoun(num) + '찻' : oldKoreanNumeral.buildTheCardinal(num) + '찻';
    },
    /** 옛말 날수로 바꾸기
     * @function buildTheDay
     * @param {number} num 자연수, 날수로 바꿀 아라비아 숫자
     * @param {number} [option] 십의 자리 표현, 0: 스므날, 셜흔날 형식, 1: 두열흘, 세열흘 형식, 기본값은 0
     * @returns {string} */
    buildTheDay: (num, option = 0) => {
        let day = '';
        // 예외 처리
        if(!isNaturalNumber(num))
            return '';

        option = (option !== 1)? 0 : option;
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
     * @param {number} [option] 0: 숫자로 반환, 1: 문자열로 반환, 기본값은 0
     * @return {number | string} 문자열로 반환시 서수의 경우 1st, 2nd, 3rd, 4th 따위로 돌려 준다. */
    interpretAsArabic: (str, option = 0) => {
        // 재귀 함수의 정지
        if(str === '') return 0;

        option = (option !== 1)? 0 : option;
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
     * @param {string} str 옛말 수사
     * @param {string} [chars] 공백 대신 들어갈 문자열
     * @returns {string} */
    spaceByThousand: (str, chars = ' ') => {
        if(str.indexOf(oldKoreanNumeral.thousand) > 0)
            return str.replaceAll(oldKoreanNumeral.thousand, chars.concat(oldKoreanNumeral.thousand));
        else
            return str;
    }
};
/** 언어에 따른 글줄 설정 모음
 * @readonly
 * @constant wordsById
 * @type {object} HTMLElement id > language > HTMLElement Attribute */
const wordsById = {
    textLayer:{
        english: {
            style: {
                fontFamily: ''
            }
        },
        korean: {
            style: {
                fontFamily: `'Noto Sans KR', Arial, sans-serif`
            }
        },
        old_korean: {
            style: {
                fontFamily: `'Noto Serif KR','Times New Roman', Times, serif`
            }
        }
    },
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
                fontFamily: `Arial, sans-serif`,
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
            innerHTML: '비르숨',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: ''
            }
        }
    },
    levelup: {
        english: {
            innerHTML: '<span>LEVEL&nbsp;</span><span id="level_num">1</span>',
            style: {
                fontFamily: `Arial, sans-serif`,
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
                fontWeight: ''
            }
        }
    },
    options_button: {
        english: {
            innerHTML: 'OPTIONS',
            style: {
                fontFamily: `Arial, sans-serif`,
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
                fontWeight: ''
            }
        }
    },
    howtoplay_button: {
        english: {
            innerHTML: 'HOW TO PLAY',
            style: {
                fontFamily: `Arial, sans-serif`,
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
                fontWeight: ''
            }
        }
    },
    highscores_button: {
        english: {
            innerHTML: 'HIGH SCORES',
            style: {
                fontFamily: `Arial, sans-serif`,
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
                fontWeight: ''
            }
        }
    },
    // 게임 진행
    hold_in_game: {
        english: {
            innerHTML: 'HOLD',
            style: {
                paddingTop: '2dvh',
                paddingBottom: '1dvh',
                fontFamily: ``
            }
        }, 
        korean: {
            innerHTML: '보관함',
            style: {
                paddingTop: '1.241dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '갈ᄆᆞ니',
            style: {
                paddingTop: '1.241dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    level_in_game: {
        english: {
            innerHTML: 'LEVEL',
            style: {
                top: '',
                fontFamily: ``
            }
        }, 
        korean: {
            innerHTML: '레 벨',
            style: {
                top: '-0.759dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: 'ᄃᆞ 리',
            style: {
                top: '-0.759dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    levelBox: {
        english: {
            style: {
                top: '',
                fontFamily: ''
            }
        }, 
        korean: {
            style: {
                top: '-0.759dvh'
            }
        },
        old_korean: {
            style: {
                top: '-0.759dvh'
            }
        }
    },
    score_in_game: {
        english: {
            innerHTML: 'SCORE',
            style: {
                top: '',
                fontFamily: ``
            }
        }, 
        korean: {
            innerHTML: '점 수',
            style: {
                top: '-0.759dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: 'ᄐᆞᆫ 값',
            style: {
                top: '-0.759dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    scoreBox: {
        english: {
            style: {
                top: '',
                // height: ''
            }
        }, 
        korean: {
            style: {
                top: '-0.759dvh',
                // height: ''
            }
        },
        old_korean: {
            style: {
                top: '-0.759dvh',
                // height: '8.75dvh'
            }
        }
    },
    lines_in_game: {
        english: {
            innerHTML: 'LINES',
            style: {
                top: '',
                fontFamily: ``
            }
        }, 
        korean: {
            innerHTML: '지운 줄',
            style: {
                top: '-0.759dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '아ᅀᆞᆫ 줄',
            style: {
                top: '-0.759dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    lineBox: {
        english: {
            style: {
                top: '',
            }
        }, 
        korean: {
            style: {
                top: '-0.759dvh',
            }
        },
        old_korean: {
            style: {
                top: '-0.759dvh',
            }
        }
    },
    pause_in_game: {
        english: {
            innerHTML: 'PAUSE',
            style: {
                // paddingTop: '3dvh',
                paddingBottom: '0.75dvh',
                fontFamily: ``
            }
        }, 
        korean: {
            innerHTML: '일시 정지',
            style: {
                // paddingTop: '2.241dvh',
                paddingBottom: '0.75dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '져근덛 머춤',
            style: {
                // paddingTop: '2.241dvh',
                paddingBottom: '0.75dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    next_in_game: {
        english: {
            innerHTML: 'NEXT',
            style: {
                paddingTop: '2dvh',
                paddingBottom: '1dvh',
                fontFamily: ``
            }
        }, 
        korean: {
            innerHTML: '다음 조각',
            style: {
                paddingTop: '1.241dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '버그니',
            style: {
                paddingTop: '1.241dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    level_now: {
        english: {
            style: {
                top: '',
                fontSize: '',
                letterSpacing: '',
                fontFamily: ``,
            }
        }, 
        korean: {
            style: {
                top: '',
                fontSize: '',
                letterSpacing: '',
                fontFamily: ``,
            }
        },
        old_korean: {
            style: {
                top: '',
                fontSize: '2.6dvh',
                letterSpacing: '-0.2dvh',
                fontFamily: `'Noto Serif KR','Times New Roman', Times, serif`,
            }
        }
    },
    lines_now: {
        english: {
            style: {
                top: '',
                fontSize: '',
                letterSpacing: '',
                fontFamily: ``
            }
        }, 
        korean: {
            style: {
                top: '',
                fontSize: '',
                letterSpacing: '',
                fontFamily: ``
            }
        },
        old_korean: {
            style: {
                top: '',
                fontSize: '2.6dvh',
                letterSpacing: '-0.2dvh',
                fontFamily: `'Noto Serif KR','Times New Roman', Times, serif`
            }
        }
    },
    score_now: {
        english: {
            style: {
                padding: '',
                fontSize: '',
                fontFamily: ``,
                letterSpacing: '',
                lineHeight: ''
            }
        }, 
        korean: {
            style: {
                padding: '',
                fontSize: '',
                fontFamily: ``,
                letterSpacing: '',
                lineHeight: ''
            }
        },
        old_korean: {
            style: {
                padding: '0.6dvh 0.3dvh 0.3dvh 0.3dvh',
                fontSize: '2.6dvh',
                fontFamily: `'Noto Serif KR','Times New Roman', Times, serif`,
                letterSpacing: '-0.2dvh',
                lineHeight: '2.6dvh',
            }
        }
    },
    bgm_bgm: {
        english: {
            innerHTML: 'BGM ♬',
            style: {
                top: '',
                fontFamily: ``,
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '배경음♬',
            style: {
                top: '-0.2dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2dvh'
            }
        },
        /* 음악을 “푸ᇰ륫소리”라고 했다.
        《석보상절》(1447년 수양대군作) 中 
            【樂ᅌᅡᆨ音ᅙᅳᆷ은 푸ᇰ륫 소리니 붑 티ᄂᆞᆫ ᄆᆞᄃᆡ며 시우대ᄅᆞᆯ 니르니라
            (악음은 풍류의 소리이니 북 치는 마디이며 관현악을 이른 것이다.) */
        old_korean: {
            innerHTML: '푸ᇰ륫소리♬',
            style: {
                top: '-0.2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,                
                fontSize: '2dvh',
            }
        }
    },
    bgm_title: {
        english: {
            style: {
                fontFamily: ``,
                fontSize: ''
            }
        }, 
        korean: {
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        },
        old_korean: {
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '1.9dvh'
            }
        }
    },
    // 일시 정지
    paused: {
        english: {
            innerHTML: 'PAUSED',
            style: {
                paddingTop: '',
                fontFamily: `Arial, sans-serif`
            }
        }, 
        korean: {
            innerHTML: '일시 정지',
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
    resume_in_pause: {
        english: {
            innerHTML: 'RESUME',
            style: {
                fontFamily: `Arial, sans-serif`,
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '이어 하기',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '니ᅀᅥ 놀옴',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: ''
            }
        }
    },
    options_in_pause: {
        english: {
            innerHTML: 'OPTIONS',
            style: {
                fontFamily: `Arial, sans-serif`,
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
                fontWeight: ''
            }
        }
    },
    howtoplay_in_pause: {
        english: {
            innerHTML: 'HOW TO PLAY',
            style: {
                fontFamily: `Arial, sans-serif`,
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
                fontWeight: ''
            }
        }
    },
    highscores_in_pause: {
        english: {
            innerHTML: 'HIGH SCORES',
            style: {
                fontFamily: `Arial, sans-serif`,
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
                fontWeight: ''
            }
        }
    },
    quit_in_pause: {
        english: {
            innerHTML: 'QUIT',
            style: {
                fontFamily: `Arial, sans-serif`,
                fontWeight: ''
            }
        },
        korean: {
            innerHTML: '그만두기',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '노ᄅᆞᆺ 그츔',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: ''
            }
        }
    },
    // 새 기록
    title_new_record: {
        english: {
            innerHTML: 'NEW RECORD!',
            style: {
                paddingTop: '',
                fontFamily: `Arial, sans-serif`
            }
        },
        korean: {
            innerHTML: '기록 달성!',
            style: {
                paddingTop: '2.2dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '한 갑시로소ᅌᅵ다',
            style: {
                paddingTop: '2.2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    enter_your_name: {
        english: {
            innerHTML: 'ENTER YOUR NAME:',
            style: {
                paddingTop: '',
                fontFamily: `Arial, sans-serif`
            }
        },
        korean: {
            innerHTML: '이름을 넣어 주십시오:',
            style: {
                paddingTop: '0.566dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '그딋 일훔 므스기시니ᅌᅵᆺ고',
            style: {
                paddingTop: '0.566dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    yourScore:{
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
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    yourName: {
        english: {
            placeholder: 'your name',
            style: {
                fontFamily: ''
            }
        },
        korean: {
            placeholder: '이름',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            placeholder: '이ᅌᅥ긔 일훔 두쇼셔',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    long_name_text: {
        english: {
            innerHTML: 'Your name is too long.&nbsp;&nbsp;',
            style: {
                fontFamily: ''
            }
        },
        korean: {
            innerHTML: '이름이 너무 깁니다.&nbsp;&nbsp;&nbsp;&nbsp;',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '일후미 너무 기니ᅌᅵ다&nbsp;&nbsp;&nbsp;&nbsp;',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    newRecordOK: {
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
            innerHTML: 'ᄆᆞ촘',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: '700'
            }
        }
    },    
    // 게임 종료
    gameover: {
        english: {
            innerHTML: 'GAME OVER',
            style: {
                paddingTop: '',
                fontFamily: `Arial, sans-serif`
            }
        }, 
        korean: {
            innerHTML: '게임 종료',
            style: {
                paddingTop: '2.2dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '노ᄅᆞᆺ ᄆᆞ촘',
            style: {
                paddingTop: '2.2dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    replay_in_gameover: {
        english: {
            innerHTML: 'REPLAY',
            style: {
                fontFamily: `Arial, sans-serif`,
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '다시 하기',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '다시 놀옴',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: ''
            }
        }
    },
    options_in_gameover: {
        english: {
            innerHTML: 'OPTIONS',
            style: {
                fontFamily: `Arial, sans-serif`,
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
                fontWeight: ''
            }
        }
    },
    highscores_in_gameover: {
        english: {
            innerHTML: 'HIGH SCORES',
            style: {
                fontFamily: `Arial, sans-serif`,
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
                fontWeight: ''
            }
        }
    },
    exit_in_gameover: {
        english: {
            innerHTML: 'EXIT',
            style: {
                fontFamily: `Arial, sans-serif`,
                fontWeight: ''
            }
        },
        korean: {
            innerHTML: '나가기',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: ''
            }
        },
        /* “잎(어귀, 입구, 문門)으로 남(나감)”
            ‘잎’은 어귀, 입구, 문門, 문지방 등의 뜻을 지녔다.
            ‘닢’이 식물의 잎사귀, 이파리 따위를 가리키고, ‘입’이 동물의 입, 아가리, 주둥이 따위를 가리켜 ‘잎’과 가름되었다.
            《월인석보》(1459년 세종作 세조編) 中
                【그제 釋셕迦강牟무ᇢ尼닝佛뿌ᇙ이 올ᄒᆞᆫ 소ᇇ가라ᄀᆞ로 七치ᇙ寶보ᇢ塔탑 이플 여르시니 큰 音ᅙᅳᆷ聲셔ᇰ이 나ᄃᆡ 쇠 앗고 큰 城쎠ᇰ門몬 여ᄂᆞᆫ ᄃᆞᆺ ᄒᆞ더니
                (그때 석가모니 부처님께서 오른 손가락으로 칠보탑 문을 여시니 큰 음성이 나는데 쇳대를 앗고 큰 성문 여는 듯하더니)】
            《구급방언해》(1466년) 中
                【ᄯᅩ 韭구ᇢ菜ᄎᆡᆼㅅ 니플 사ᄒᆞ라 甁뼈ᇰ의 녀코 醋총 조쳐 블 브티고 죠ᄒᆡ로 甁뼈ᇰㅅ 이플 ᄉᆞ외 마가 氣킝分분이 ᄉᆞᄆᆞᆺ디 아니케 ᄒᆞ고
                (또 부추의 잎을 썰어 병에 넣고 초를 아울러 불 붙이고 종이로 병의 입구를 굳게 막아 기운이 통하지 않게 하고)】
            《금강경삼가해》(1482년) 中
                【자바 定ᄒᆞ면 구루미 곬 이페 빗고 노호맨 ᄃᆞ리 ᄎᆞᆫ 모새 디도다
                (잡아서 정하면 구름이 골짜기 어귀에 가로놓이고, 놓으면 달이 찬 못에 떨어지는구나)】
        */
        old_korean: {
            innerHTML: '이페 남',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: ''
            }
        }
    },
    // 게임 나가기 확인
    confirm_quit: {
        english: {
            innerHTML: 'QUIT GAME?',
            style: {
                paddingTop: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '게임을 그만두시겠습니까?',
            style: {
                paddingTop: '3.5dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.5dvh'
            }
        },
        old_korean: {
            innerHTML: '여믓 노ᄅᆞᄉᆞᆯ 그치리ᅌᅵᆺ가',
            style: {
                paddingTop: '3.5dvh',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: ''
            }
        }
    },
    quitOK: {
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
                fontWeight: ''
            }
        }
    },
    quitCancel: {
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
                fontWeight: ''
            }
        }
    },
    // 옵션 모달
    options: {
        english: {
            innerHTML: 'OPTIONS',
            style: {
                paddingTop: '',
                fontFamily: `Arial, sans-serif`
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
            【내 이제 아ᄅᆞᆷ뎌 財ᄍᆡᆼ寶보ᇢᄅᆞᆯ 어더 衆쥬ᇰ生ᄉᆡᇰᄋᆞᆯ 足죡게 주리라 
            (내 이제 사사로이 재보를 얻어 중생에게 넉넉하도록 주리라.)】
        《분류두공부시언해】(1481년)
            【그윗 것과 아ᄅᆞᇝ 거시 제여곰 ᄯᅡ해 브터셔 ᄌᆞᆷ겨 저저 하ᄂᆞᆳ ᄀᆞᄆᆞ리 업도다
            (공물과 사유물이 제각각 땅에 붙어서 잠겨 젖어 하늘의 가문이 없도다.)】
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
    index_rotate_right: {
        english: {
            innerHTML: 'ROTATE RIGHT',
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
    index_rotate_left: {
        english: {
            innerHTML: 'ROTATE LEFT',
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
            innerHTML: '가ᄇᆡ야ᄫᅵ 디욤',
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
            innerHTML: 'ᄆᆡᅀᆡ야ᄫᅵ 디욤',
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
        /* 음악을 “푸ᇰ륫소리”라고 했다.
        《석보상절》(1447년 수양대군作) 中 
            【樂ᅌᅡᆨ音ᅙᅳᆷ은 푸ᇰ륫 소리니 붑 티ᄂᆞᆫ ᄆᆞᄃᆡ며 시우대ᄅᆞᆯ 니르니라
            (악음은 풍류의 소리이니 북 치는 마디이며 관현악을 이른 것이다.) */
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
                fontWeight: ''
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
                fontWeight: ''
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
                fontWeight: ''
            }
        }
    },
    // 순위표
    highscores: {
        english: {
            innerHTML: 'HIGH SCORES',
            style: {
                paddingTop: '',
                fontFamily: `Arial, sans-serif`
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
                fontWeight: ''
            }
        }
    },
    // 게임 방법
    howtoplayTitle: {
        english: {
            innerHTML: 'HOW TO PLAY',
            style: {
                paddingTop: '',
                fontFamily: `Arial, sans-serif`
            }
        }, 
        korean: {
            innerHTML: '게임 방법',
            style: {
                paddingTop: '2.23dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '노ᄅᆞᆺ 노ᄂᆞᆫ 법',
            style: {
                paddingTop: '2.23dvh',
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
            innerHTML: '다돔',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.5dvh',
                fontWeight: ''
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
            innerHTML: '절로 듐&nbsp;',
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
    holdpiece_title: {
        english: {
            innerHTML: 'HOLD PIECE&nbsp;',
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
            innerHTML: '돌히 젹젹 절로 딜ᄊᆡ ᄆᆞᄎᆞᆷ내 ᄯᅡ해 ᄇᆞᄃᆞ텨 ᄯᅡ히 ᄃᆞᄫᆡᄂᆞᅌᅵ다 ᄃᆞ리 오ᄅᆞ디옷 ᄲᅡᆯ리 디ᄂᆞᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                letterSpacing: '-0.1dvh'
            }
        }
    },
    lineclear_explanation: {
        english: {
            innerHTML: 'When all the squares within a single row are filled, the row disappears and points are awarded.',
            style: {
                fontFamily: '',
                fontSize: '',
                letterSpacing: ''
            }
        }, 
        korean: {
            innerHTML: '한 줄의 모든 칸을 조각으로 채우면 줄이 제거되며 점수를 얻게 됩니다.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                letterSpacing: ''
            }
        },
        old_korean: {
            innerHTML: 'ᄒᆞᆫ ᄀᆞᄅᆞᆫ 줈 누늘 돌ᄒᆞ로 모도 ᄎᆡ오시면 그 주리 허러 업고 갑ᄉᆞᆯ 어드시리ᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                letterSpacing: ''
            }
        }
    },
    move_explanation: {
        english: {
            innerHTML: 'Manoeuvre the falling pieces to fit them together and clear as many lines as possible.',
            style: {
                fontFamily: '',
                fontSize: '',
                letterSpacing: ''
            }
        }, 
        korean: {
            innerHTML: '떨어지는 조각을 조작하여 알맞게 칸을 채우고, 되도록 많은 줄을 제거하십시오.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                letterSpacing: ''
            }
        },
        old_korean: {
            innerHTML: '디오 잇ᄂᆞᆫ 돌 뮈샤 맛가ᄫᅵ 누늘 ᄎᆡ오시고 한 주를 히ᇝᄀᆞ자ᇰ 아ᅀᆞ쇼셔',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                letterSpacing: ''
            }
        }
    },
    ghostpiece_explanation: {
        english: {
            innerHTML: 'This gives a preview of where the falling piece will land, helping you determine the best fit for it.',
            style: {
                fontFamily: '',
                fontSize: '',
                letterSpacing: ''
            }
        }, 
        korean: {
            innerHTML: '조각이 떨어질 곳을 미리 보여 줍니다. 조각을 떨어뜨릴 알맞은 자리를 찾도록 돕습니다.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                letterSpacing: ''
            }
        },
        old_korean: {
            innerHTML: '돌 마촐 맛가ᄫᆞᆫ ᄯᅡ ᄎᆞᄌᆞ샤ᄆᆞᆯ 돕ᄉᆞᄫᅡ 돌히 디ᇙ ᄃᆡᄅᆞᆯ 미리 뵈ᅀᆞᆸᄂᆞ니ᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                letterSpacing: ''
            }
        }
    },
    holdpiece_explanation: {
        english: {
            innerHTML: 'The falling piece can be stored as a hold piece for later use. However, once the piece is taken out, it cannot be put back in.',
            style: {
                fontFamily: '',
                fontSize: '',
                letterSpacing: ''
            }
        }, 
        korean: {            
            innerHTML: '필요할 때에 꺼내 쓰도록 떨어지는 조각을 보관해 둘 수 있습니다. 다만 한번 꺼낸 조각은 다시 보관할 수 없습니다.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                letterSpacing: ''
            }
        },
        /* 의존명사 ‘줄’의 쓰임이 오늘날과는 조금 달랐다.
            오늘날 ‘알다/모르다’하고만 어울리는 것과 달리 ‘있다/없다’와도 흔히 어울렸다.
            뜻도 “어떤 방법, 셈속”만이 아니라 추상적인 어떤 것을 가리키기도 했다., 
            — 있다/없다 —
            《월인석보》(1459년 세종作 세조編) 中 
                【一ᅙᅵᇙ切촁 사ᄅᆞ미 다 부텨 ᄃᆞ외ᇙ ᄃᆞᆯ 알면 엇뎨 업시우ᇙ 주리 이시리오 
                (일체 사람이 다 부처 될 줄 알면 어찌 업신여길 수가 있으리오.)】
                【善쎤惡ᅙᅡᆨ業ᅌᅥᆸ이 엇뎨 모미 記긩호ᇙ 주리 이시며 엇뎨 모미 니즈ᇙ 주리 업스리오마ᄅᆞᆫ
                (선악업이 어찌 몸이 있어 기할 수가 있으며 어찌 몸이 잊을 수가 없으리오마는)】
            《능엄경언해》(1462년 간경도감刊) 中
                【아홉 旬쓘을 바ᄅᆞᆯ 禁금止징ᄒᆞ야 부텨 뵈ᅀᆞ오ᇙ 주리 업던 젼ᄎᆞ로…
                (아흔 날을 발을[외출을] 금지하여 부처 뵐 수가 없던 까닭으로…)】
            《법화경언해》(1463년 간경도감刊) 中
                【ᄆᆞᅀᆞ미 生ᄉᆡᇰ이 이시면 곧 어루 滅며ᇙ홀 쭈리 이시려니와 ᄆᆞᅀᆞ미 本본來ᄅᆡᆼ 生ᄉᆡᇰ이 업슬ᄊᆡ 實시ᇙ로 어루 滅며ᇙ홀 쭐 업스니
                (마음이 생이 있으면 곧 멸할 수가 있으려니와, 마음이 본래 생이 생이 없으므로 실로 멸할 수 없으니】                
            — 그 밖에 —
            《석보상절》(1447년 수양대군作) 中 
                【너희ᄃᆞᆯ히 이 妙묘ᇢ莊자ᇰ嚴ᅌᅥᆷ王ᅌᅪᇰ이 내 알ᄑᆡ 合ᅘᅡᆸ掌쟈ᇰᄒᆞ야 솃ᄂᆞᆫ 주를 보ᄂᆞᆫ다 몯 보ᄂᆞᆫ다
                (너희들이 이 묘장엄왕이 내 앞에 합장하여 서 있는 것을 보느냐 못 보느냐)】
            《월인석보》(1459년 세종作 세조編) 中 
                【佛뿌ᇙ智딩 어려ᄫᅳᆫ 주리 아니라 機긩 제 어려ᄫᅳᆯ ᄯᆞᄅᆞ미라
                (부처의 지혜가 어려운 것이 아니라 중생 스스로가 어려울 따름이다.)】 */
        old_korean: {            
                innerHTML: 'ᄣᅢᄅᆞᆯ 기드려 ᄌᆞᅀᆞᄅᆞᄫᅵ ᄡᅳ고져 ᄒᆞ거시든 디오 잇ᄂᆞᆫ 돌ᄒᆞᆯ 갈모ᇙ 주리 잇ᄂᆞ니ᅌᅵ다 다ᄆᆞᆫ ᄒᆞᆫ 디위 갈몬 돌ᄒᆞᆫ ᄂᆞ외야 갊디 몯ᄒᆞᄂᆞᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                letterSpacing: '-0.1dvh'
            }
        }
    },
    gameover_explanation: {
        english: {
            innerHTML: 'The game ends when the pieces are stacked too high to spawn new pieces.',
            style: {
                fontFamily: '',
                fontSize: '',
                letterSpacing: ''
            }
        }, 
        korean: {
            innerHTML: '땅이 너무 높이 쌓여 더는 새로운 조각을 놓을 수 없게 되면 게임을 종료합니다.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                letterSpacing: ''
            }
        },
        old_korean: {
            innerHTML: 'ᄯᅡ히 너무 노피 싸힐ᄊᆡ 새 돌히 더 나디 몯게 ᄃᆞᄫᆡ어든 노ᄅᆞ시 ᄆᆞᆺᄂᆞᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                letterSpacing: ''
            }
        }
    },
    example_hold_title: {
        english: {
            innerHTML: 'HOLD',
            style: {
                fontFamily: '',
                fontWeight: '',
                margin: '',
                marginTop: '1.4dvh',
                marginBottom: '0.6dvh'
            }
        }, 
        korean: {
            innerHTML: '보관함',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontWeight: '',
                margin: '0.7dvh',
                marginTop: '',
                marginBottom: ''
            }
        },
        old_korean: {
            innerHTML: '갈ᄆᆞ니',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontWeight: '900',
                margin: '0.7dvh',
                marginTop: '',
                marginBottom: ''
            }
        }
    },
    // 자판 안내
    keybordInfo: {
        english: {
            innerHTML: '— KEYBOARD —',
            style: {
                paddingTop: '',
                fontFamily: ''
            }
        }, 
        korean: {
            innerHTML: '— 자판 안내 —',
            style: {
                paddingTop: '0.1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        old_korean: {
            innerHTML: '— 돌 브리ᇙ 글쇠 —',
            style: {
                paddingTop: '0.1dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    key_move_right: {
        english: {
            innerHTML: '<span>M</span><span>O</span><span>V</span><span>E</span><span>&nbsp;</span><span>R</span><span>I</span><span>G</span><span>H</span><span>T</span>',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        },
        korean: {
            innerHTML: '<span>오</span><span>른</span><span>쪽</span><span>으</span><span>로</span><span>&nbsp;</span><span>이</span><span>동</span>',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: '700'
            }
        },
        old_korean: {
            innerHTML: '<span>올</span><span>ᄒᆞᆫ</span><span>녀</span><span>그</span><span>로</span><span>&nbsp;</span><span>옮</span><span>굠</span>',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: '700'
            }
        }
    },
    key_move_left: {
        english: {
            innerHTML: '<span>M</span><span>O</span><span>V</span><span>E</span><span>&nbsp;</span><span>L</span><span>E</span><span>F</span><span>T</span>',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '<span>왼</span><span>쪽</span><span>으</span><span>로</span><span>&nbsp;</span><span>이</span><span>동</span>',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: '700'
            }
        },
        old_korean: {
            innerHTML: '<span>왼</span><span>녀</span><span>그</span><span>로</span><span>&nbsp;</span><span>옮</span><span>굠</span>',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: '700'
            }
        }
    },
    key_rotate_right: {
        english: {
            innerHTML: '<span>R</span><span>O</span><span>T</span><span>A</span><span>T</span><span>E</span><span>&nbsp;</span><span>R</span><span>I</span><span>G</span><span>H</span><span>T</span>',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        },
        korean: {
            innerHTML: '<span>오</span><span>른</span><span>쪽</span><span>으</span><span>로</span><span>&nbsp;</span><span>회</span><span>전</span>',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: '700'
            }
        },
        old_korean: {
            innerHTML: '<span>올</span><span>ᄒᆞᆫ</span><span>녀</span><span>그</span><span>로</span><span>&nbsp;</span><span>돌</span><span>욤</span>',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: '700'
            }
        }
    },
    key_rotate_left: {
        english: {
            innerHTML: '<span>R</span><span>O</span><span>T</span><span>A</span><span>T</span><span>E</span><span>&nbsp;<span>L</span><span>E</span><span>F</span><span>T</span>',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '<span>왼</span><span>쪽</span><span>으</span><span>로</span><span>&nbsp;</span><span>회</span><span>전</span>',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: '700'
            }
        },
        old_korean: {
            innerHTML: '<span>왼</span><span>녀</span><span>그</span><span>로</span><span>&nbsp;</span><span>돌</span><span>욤</span>',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: '700'
            }
        }
    },
    key_soft_drop: {
        english: {
            innerHTML: '<span>S</span><span>O</span><span>F</span><span>T</span><span>&nbsp;</span><span>D</span><span>R</span><span>O</span><span>P</span>',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '<span>아</span><span>래</span><span>로</span><span>&nbsp;</span><span>이</span><span>동</span>',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: '700'
            }
        },
        old_korean: {
            innerHTML: '<span>가</span><span>ᄇᆡ</span><span>야</span><span>ᄫᅵ</span><span>&nbsp;</span><span>디</span><span>욤</span>',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: '700'
            }
        }
    },
    key_hard_drop: {
        english: {
            innerHTML: '<span>H</span><span>A</span><span>R</span><span>D</span><span>&nbsp;</span><span>D</span><span>R</span><span>O</span><span>P</span>',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        },
        korean: {
            innerHTML: '<span>즉</span><span>시</span><span>&nbsp;</span><span>낙</span><span>하</span>',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: '700'
            }
        },
        old_korean: {
            innerHTML: '<span>ᄆᆡ</span><span>ᅀᆡ</span><span>야</span><span>ᄫᅵ</span><span>&nbsp;</span><span>디</span><span>욤</span>',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: '700'
            }
        }
    },
    key_move_right_explanation: {
        english: {
            innerHTML: 'Moves the piece one square to the right.',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '조각을 한 칸 오른쪽으로 이동시킵니다.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '돌ᄒᆞᆯ ᄒᆞᆫ 눈 올ᄒᆞᆫ녀그로 옮기ᄂᆞᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        }
    },
    key_move_left_explanation: {
        english: {
            innerHTML: 'Moves the piece one square to the left.',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '조각을 한 칸 왼쪽으로 이동시킵니다.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '돌ᄒᆞᆯ ᄒᆞᆫ 눈 왼녀그로 옮기ᄂᆞᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        }
    },
    key_rotate_right_explanation: {
        english: {
            innerHTML: 'Rotates the piece 90 degrees clockwise.',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '조각을 시계 방향으로 90도 회전시킵니다.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '돌ᄒᆞᆯ 바ᄅᆞ 셰오 드위오 갓ᄀᆞ로 셰오 바ᄅᆞ 누ᄫᅵᄂᆞᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        }
    },
    key_rotate_left_explanation: {
        english: {
            innerHTML: 'Rotates the piece 90 degrees counterclockwise.',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '조각을 반시계 방향으로 90도 회전시킵니다.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '돌ᄒᆞᆯ 갓ᄀᆞ로 셰오 드위오 바ᄅᆞ 셰오 바ᄅᆞ 누ᄫᅵᄂᆞᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        }
    },
    key_soft_drop_explanation: {
        english: {
            innerHTML: 'Moves the piece down one square.',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '조각을 한 칸 아래로 이동시킵니다.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '돌ᄒᆞᆯ ᄒᆞᆫ 눈 아래로 디ᄂᆞᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        }
    },
    key_hard_drop_explanation: {
        english: {
            innerHTML: 'Immediately drops the piece to the ground and locks it.',
            style: {
                fontFamily: '',
                fontSize: '',
                fontWeight: ''
            }
        }, 
        korean: {
            innerHTML: '조각을 즉시 낙하시켜 땅으로 굳힙니다.',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        },
        old_korean: {
            innerHTML: '돌ᄒᆞᆯ 고대 디여 ᄯᅡᄒᆞ로 구티ᄂᆞᅌᅵ다',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                fontWeight: ''
            }
        }
    },
    tack_esc: {
        english: {
            style: {
                top: '0.5dvh'
            }
        },
        korean: {
            style: {
                top: '0.6dvh'
            }
        },
        old_korean: {
            style: {
                top: '0.6dvh'
            }
        }
    },
    tag_esc: {
        english: {
            innerHTML: 'PAUSE',
            style: {
                fontFamily: '',
                fontSize: '',
                top: '0.5dvh'
            }
        }, 
        korean: {
            innerHTML: '일시 정지',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                top: '-0.1dvh'
            }
        },
        old_korean: {
            innerHTML: '져근덛 머춤',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                top: '0.1dvh'
            }
        }
    },
    tag_pause: {
        english: {
            innerHTML: 'PAUSE',
            style: {
                fontFamily: '',
                fontSize: '',
                top: '',
                left: ''
            }
        }, 
        korean: {
            innerHTML: '일시 정지',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                top: '-0.3dvh',
                left: '0.6dvh'
            }
        },
        old_korean: {
            innerHTML: '져근덛 머춤',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                top: '-0.2dvh',
                left: '1.8dvh'
            }
        }
    },
    tag_move_right: {
        english: {
            innerHTML: 'MOVE&NewLine;RIGHT',
            style: {
                fontFamily: '',
                fontSize: '',
                top: '',
                left: '',
                lineHeight: ''
            }
        },
        korean: {
            innerHTML: '오른쪽으로&NewLine;이동',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                top: '-0.3dvh',
                left: '',
                lineHeight: '2.6dvh'
            }
        },
        old_korean: {
            innerHTML: '올ᄒᆞᆫ녀그로&NewLine;옮굠',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                top: '-0.3dvh',
                left: '',
                lineHeight: '2.6dvh'
            }
        }
    },
    tag_move_left: {
        english: {
            innerHTML: 'MOVE&NewLine;LEFT',
            style: {
                fontFamily: '',
                fontSize: '',
                top: '',
                left: '',
                lineHeight: ''
            }
        }, 
        korean: {
            innerHTML: '왼쪽으로&NewLine;이동',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                top: '-0.3dvh',
                left: '',
                lineHeight: '2.6dvh'
            }
        },
        old_korean: {
            innerHTML: '왼녀그로&NewLine;옮굠',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                top: '-0.3dvh',
                left: '',
                lineHeight: '2.6dvh'
            }
        }
    },
    tag_rotate_right: {
        english: {
            innerHTML: 'ROTATE&NewLine;RIGHT',
            style: {
                fontFamily: '',
                fontSize: '',
                top: '',
                left: '',
                lineHeight: ''
            }
        }, 
        korean: {
            innerHTML: '오른쪽으로&NewLine;회전',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                top: '-0.3dvh',
                left: '',
                lineHeight: '2.6dvh'
            }
        },
        old_korean: {
            innerHTML: '올ᄒᆞᆫ녀그로&NewLine;돌욤',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                top: '-0.3dvh',
                left: '',
                lineHeight: '2.6dvh'
            }
        }
    },
    tag_rotate_left: {
        english: {
            innerHTML: 'ROTATE&NewLine;LEFT',
            style: {
                fontFamily: '',
                fontSize: '',
                top: '',
                left: '',
                lineHeight: ''
            }
        }, 
        korean: {
            innerHTML: '왼쪽으로&NewLine;회전',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                top: '',
                left: '-0.3dvh',
                lineHeight: '2.6dvh'
            }
        },
        old_korean: {
            innerHTML: '왼녀그로&NewLine;돌욤',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                top: '',
                left: '-0.3dvh',
                lineHeight: '2.6dvh'
            }
        }
    },
    tag_soft_drop: {
        english: {
            innerHTML: '&nbsp;SOFT DROP&nbsp;',
            style: {
                fontFamily: '',
                fontSize: '',
                top: '',
                left: ''
            }
        }, 
        korean: {
            innerHTML: '&nbsp;아래로 이동&nbsp;',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                top: '',
                left: ''
            }
        },
        old_korean: {
            innerHTML: '&nbsp;가ᄇᆡ야ᄫᅵ 디욤&nbsp;',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                top: '',
                left: ''
            }
        }
    },
    tag_hard_drop: {
        english: {
            innerHTML: '&nbsp;HARD DROP&nbsp;',
            style: {
                fontFamily: '',
                fontSize: '',
                top: '',
                left: ''
            }
        }, 
        korean: {
            innerHTML: '&nbsp;즉시 낙하&nbsp;',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                top: '',
                left: ''
            }
        },
        old_korean: {
            innerHTML: '&nbsp;ᄆᆡᅀᆡ야ᄫᅵ 디욤&nbsp;',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                top: '',
                left: ''
            }
        }
    },
    tag_hold: {
        english: {
            innerHTML: 'HOLD',
            style: {
                fontFamily: '',
                fontSize: '',
                top: '',
                left: ''
            }
        }, 
        korean: {
            innerHTML: '보관',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '',
                top: '-0.3dvh',
                left: '-1dvh'
            }
        },
        old_korean: {
            innerHTML: '갈몸',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '',
                top: '-0.3dvh',
                left: '-1dvh'
            }
        }
    },
    // 점수 기준 표
    scoringInfo: {
        english: {
            innerHTML: '— SCORE VALUES —',
            style: {
                paddingTop: '',
                fontFamily: ''
            }
        }, 
        korean: {
            innerHTML: '— 점수 기준 —',
            style: {
                paddingTop: '0.1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`
            }
        },
        /*  ‘벌다’는 “열(列) 짓다/줄 짓다”라는 뜻으로, 그 사동사인 ‘버리다’는 “나열하다”, “배열하다”라는 뜻을 갖는다.        
        아래 법화경언해의 예문에서 ‘버륨’은 한자 歷(지날 력: e.g. 책력, 달력)을 우리말로 옮긴 것으로서 목차 또는 차례의 뜻으로 쓰이고,
        월인석보와 원각경언해의 예문에서 ‘버리고’와 ‘버륨’은 列(벌일 렬: e.g. 나열, 배열)을 우리말로 옮긴 것이다.
        따라서 글자 그대로 새기자면 “벌여 놓음” 또는 “벌여 놓은 것”이나,
        기준을 가지고 정보를 나열한다는 데에서 ‘표(表)’를 ‘버륨’으로 옮겼다.
        표(表)는 임금에게 올리는 글을 일컫는 말로 더 널리 쓰였다.
        《월인석보》(1459년 세종作 세조編) 中 
            【한 일훔난 곳 비흐며 보ᄇᆡ옛 것 느러니 버리고… (큰 이름 난 꽃 뿌리며 벌이고…)】
            【森羅ᄂᆞᆫ 느러니 벌씨라 (삼라는 느런히 줄 지은 것이다)】
        《법화경언해》(1463년 간경도감刊) 中 
            【ᄀᆞ조미 序쎵에 버륨 ᄀᆞᆮᄒᆞᆯᄉᆡ…(갖춘 것이 서문에 나열함과 같으므로…)】),
        《원각경언해》(1465년 간경도감刊) 中
            【도로 앏 七치ᇙ段뙨앳 한 法법門몬 버륨 ᄀᆞᆮᄒᆞ니…(도로 앞의 칠단에의 한 법문이 나열함과 같으니…)】,
            【請쳐ᇰ을 펴샨 中듀ᇰ엣 세토 ᄯᅩ 알ᄑᆡ 버륨 ᄀᆞᆮᄒᆞ니라(청을 펴시는 가운데의 셋도 또 앞에 나열함과 같은 것이다.)】 */
        old_korean: {
            innerHTML: '— 일와 값과 버륨 —',
            style: {
                paddingTop: '0.1dvh',
                fontFamily: `'Noto Serif KR', sans-serif`
            }
        }
    },
    score_table1: {
        english: {
            style:{
                lineHeight: ''
            }
        },
        korean: {
            style:{
                lineHeight: '2.7dvh'
            }
        },
        old_korean: {
            style:{
                lineHeight: '2.61dvh'
            }
        }
    },
    score_table2: {
        english: {
            style:{
                lineHeight: ''
            }
        },
        korean: {
            style:{
                lineHeight: '2.7dvh'
            }
        },
        old_korean: {
            style:{
                lineHeight: '2.61dvh'
            }
        }
    },
    score_action1: {
        english: {
            innerHTML: 'ACTION',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '동 작',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.3dvh'
            }
        },
        old_korean: {
            innerHTML: '일울 일',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.3dvh'
            }
        }
    },
    score_points1: {
        english: {
            innerHTML: 'POINTS',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '점 수',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.3dvh'
            }
        },
        old_korean: {
            innerHTML: 'ᄐᆞᇙ 값',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.3dvh'
            }
        }
    },
    score_action2: {
        english: {
            innerHTML: 'ACTION',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '동 작',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.3dvh'
            }
        },
        old_korean: {
            innerHTML: '일울 일',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.3dvh'
            }
        }
    },
    score_points2: {
        english: {
            innerHTML: 'POINTS',
            style: {
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '점 수',
            style: {
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: '2.3dvh'
            }
        },
        old_korean: {
            innerHTML: 'ᄐᆞᇙ 값',
            style: {
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.3dvh'
            }
        }
    },
    action_softDrop: {
        english: {
            innerHTML: 'Soft Drop',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: '',
            }
        }, 
        korean: {
            innerHTML: '아래로 이동',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: '가ᄇᆡ야ᄫᅵ 디욤',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_softDrop: {
        english: {
            innerHTML: '1 × cells',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '1 × 칸 수',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `디난 누넷 ${oldKoreanNumeral.buildThePrenoun(1, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_hardDrop: {
        english: {
            innerHTML: 'Hard Drop',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '즉시 낙하',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: 'ᄆᆡᅀᆡ야ᄫᅵ 디욤',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_hardDrop: {
        english: {
            innerHTML: '2 × cells',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '2 × 칸 수',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `디난 누넷 ${oldKoreanNumeral.buildThePrenoun(2, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_single: {
        english: {
            innerHTML: 'Single',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '한 줄 지움',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildThePrenoun(1, '줄')} 아ᅀᅩᆷ`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_single: {
        english: {
            innerHTML: '100 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '100 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(100, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_double: {
        english: {
            innerHTML: 'Double',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '두 줄 지움',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildThePrenoun(2, '줄')} 아ᅀᅩᆷ`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_double: {
        english: {
            innerHTML: '300 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '300 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(300, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_triple: {
        english: {
            innerHTML: 'Triple',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '세 줄 지움',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildThePrenoun(3, '줄')} 아ᅀᅩᆷ`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_triple: {
        english: {
            innerHTML: '500 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '500 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(500, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_tetris: {
        english: {
            innerHTML: 'Tetris',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '테트리스',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildThePrenoun(4, '줄')} 아ᅀᅩᆷ`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_tetris: {
        english: {
            innerHTML: '800 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '800 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(800, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_tSpin: {
        english: {
            innerHTML: 'T‐Spin',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: 'T‐스핀',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ㅗ 도리`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_tSpin: {
        english: {
            innerHTML: '400 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '400 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(400, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_tSpinSingle: {
        english: {
            innerHTML: 'T‐Spin Single',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: 'T‐스핀 한 줄 지움',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ㅗ 도리로 ${oldKoreanNumeral.buildThePrenoun(1, '줄')} 아ᅀᅩᆷ`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_tSpinSingle: {
        english: {
            innerHTML: '800 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '800 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(800, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_tSpinDouble: {
        english: {
            innerHTML: 'T‐Spin Double',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: 'T‐스핀 두 줄 지움',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ㅗ 도리로 ${oldKoreanNumeral.buildThePrenoun(2, '줄')} 아ᅀᅩᆷ`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_tSpinDouble: {
        english: {
            innerHTML: '1,200 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '1,200 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(1200, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_tSpinTriple: {
        english: {
            innerHTML: 'T‐Spin Triple',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: 'T‐스핀 세 줄 지움',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ㅗ 도리로 ${oldKoreanNumeral.buildThePrenoun(3, '줄')} 아ᅀᅩᆷ`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_tSpinTriple: {
        english: {
            innerHTML: '1,600 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '1,600 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(1600, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_backtoback: {
        english: {
            innerHTML: 'Back‐to‐Back',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '백 투 백',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `니ᅀᅥᆷ 니ᅀᅮᆷ`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_backtoback: {
        english: {
            innerHTML: '1.5 × Tetris or T‐Spin',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '1.5 × 테트리스 및&NewLine;T‐스핀 점수',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        /* 仲秋 *가ᄫᆡ(삼국사기, 1145) > 가외(역어유해, 1690) > 가위(오늘날)
            中   가ᄫᆞᆫᄃᆡ(월인석보, 1459) > 가온ᄃᆡ(월인석보, 1459) > 가운데(오늘날)
            半   *가ᄫᆞᆮ(15세기 추정음) > 가옫(간이벽온방언해, 1525) > 가웃(오늘날)
            위 낱말들에서 ‘갑다’라는 동사를 찾는 설(說)이 유력하며, “절반으로 나누다”라는 뜻을 갖는다.   
            그리하여 가온음(中音, mediant), 가온북(중간 크기의 북), 가웃금속(半金屬, semimetal), 가웃원(半圓, semicircle) 따위로
            中, 半 또는 medi‐, semi‐를 우리말로 옮길 때 ‘갑‐’을 되살려 쓰고 있다.
            따라서 여기서의 “ᄒᆞᆫ ᄇᆞᆯ 가ᄫᆞᆮ”은 1.5배라는 뜻이다. 
            《간이벽온방언해》(1525년) 中
                【이 약ᄃᆞᆯᄒᆞᆯ 횩게 사ᄒᆞ라 ᄒᆞᆫ 복애 서 돈식 ᄒᆞ야 믈 ᄒᆞᆫ 사발 가옫과 ᄉᆡᇰ가ᇰ 다ᄉᆞᆺ 편 녀허 달히니…
                (이 약들을 작게 썰어 한 번 복용에 서 돈씩 해서 믈 한 사발 반과 생강 다섯 편 넣어 달이니)】 */
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildThePrenoun(4, '줄')} 아ᅀᅩᆷ 밋 ㅗ 도리옛&NewLine;${oldKoreanNumeral.buildThePrenoun(1, 'ᄇᆞᆯ')} 가ᄫᆞᆮ`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_combo: {
        english: {
            innerHTML: 'Combo',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '콤보',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄀᆞᆯ포 아ᅀᅩᆷ`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_combo: {
        english: {
            innerHTML: '50 × combo count × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '50 × 콤보 횟수 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄀᆞᆲ 혜요맷 ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(50, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_singlePC: {
        english: {
            innerHTML: 'Single&NewLine;Perfect Clear',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '한 줄 싹쓸이',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        /* 옛말에도 “쓸어 버리다”라는 말은 “모두 없애다”는 뜻으로 쓰였다.
        아래의 예에서도  “ᄡᅳ러 ᄇᆞ룜”은 掃蕩(소탕)을 우리말로 옮긴 것이다.
        《금강경삼가해》(1482년) 中
            【ᄡᅳ러 ᄇᆞ룜도 ᄯᅩ 내게 잇ᄂᆞ니라 (쓸어 버림도 또한 내게 있는 것이다.)】 */
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildThePrenoun(1, '줄')} 아ᅀᅡ&NewLine;ᄡᅳ러 ᄇᆞ룜`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_singlePC: {
        english: {
            innerHTML: '800 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '800 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(800, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_doublePC: {
        english: {
            innerHTML: 'Double&NewLine;Perfect Clear',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '두 줄 싹쓸이',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        /* 옛말에도 “쓸어 버리다”라는 말은 “모두 없애다”는 뜻으로 쓰였다.
        아래의 예에서도  “ᄡᅳ러 ᄇᆞ룜”은 掃蕩(소탕)을 우리말로 옮긴 것이다.
        《금강경삼가해》(1482년) 中
            【ᄡᅳ러 ᄇᆞ룜도 ᄯᅩ 내게 잇ᄂᆞ니라 (쓸어 버림도 또한 내게 있는 것이다.)】 */
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildThePrenoun(2, '줄')} 아ᅀᅡ&NewLine;ᄡᅳ러 ᄇᆞ룜`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_doublePC: {
        english: {
            innerHTML: '1,200 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '1,200 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(1200, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_triplePC: {
        english: {
            innerHTML: 'Triple&NewLine;Perfect Clear',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '세 줄 싹쓸이',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        /* 옛말에도 “쓸어 버리다”라는 말은 “모두 없애다”는 뜻으로 쓰였다.
        아래의 예에서도  “ᄡᅳ러 ᄇᆞ룜”은 掃蕩(소탕)을 우리말로 옮긴 것이다.
        《금강경삼가해》(1482년) 中
            【ᄡᅳ러 ᄇᆞ룜도 ᄯᅩ 내게 잇ᄂᆞ니라 (쓸어 버림도 또한 내게 있는 것이다.)】 */
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildThePrenoun(3, '줄')} 아ᅀᅡ&NewLine;ᄡᅳ러 ᄇᆞ룜`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_triplePC: {
        english: {
            innerHTML: '1,600 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '1,600 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(1600, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_tetrisPC: {
        english: {
            innerHTML: 'Tetris&NewLine;Perfect Clear',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '테트리스&NewLine;싹쓸이',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        /* 옛말에도 “쓸어 버리다”라는 말은 “모두 없애다”는 뜻으로 쓰였다.
        아래의 예에서도  “ᄡᅳ러 ᄇᆞ룜”은 掃蕩(소탕)을 우리말로 옮긴 것이다.
        《금강경삼가해》(1482년) 中
            【ᄡᅳ러 ᄇᆞ룜도 ᄯᅩ 내게 잇ᄂᆞ니라 (쓸어 버림도 또한 내게 있는 것이다.)】 */
        old_korean: {
            innerHTML: `${oldKoreanNumeral.buildThePrenoun(4, '줄')} 아ᅀᅡ&NewLine;ᄡᅳ러 ᄇᆞ룜`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_tetrisPC: {
        english: {
            innerHTML: '2,000 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '2,000 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(2000, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    action_BTBTetrisPC: {
        english: {
            innerHTML: 'Back‐to‐Back&NewLine;Tetris&NewLine;Perfect Clear',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '백 투 백&NewLine;테트리스&NewLine;싹쓸이',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        /* 옛말에도 “쓸어 버리다”라는 말은 “모두 없애다”는 뜻으로 쓰였다.
        아래의 예에서도  “ᄡᅳ러 ᄇᆞ룜”은 掃蕩(소탕)을 우리말로 옮긴 것이다.
        《금강경삼가해》(1482년) 中
            【ᄡᅳ러 ᄇᆞ룜도 ᄯᅩ 내게 잇ᄂᆞ니라 (쓸어 버림도 또한 내게 있는 것이다.)】 */
        old_korean: {
            innerHTML: `니ᅀᅥᆷ 니ᅀᅥ&NewLine;${oldKoreanNumeral.buildThePrenoun(4, '줄')} 아ᅀᅡ&NewLine;ᄡᅳ러 ᄇᆞ룜`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    },
    points_BTBTetrisPC: {
        english: {
            innerHTML: '3,200 × level',
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: '',
                fontSize: ''
            }
        }, 
        korean: {
            innerHTML: '3,200 × 레벨',
            style: {
                paddingTop: '1dvh',
                paddingBottom: '1dvh',
                fontFamily: `'Noto Sans KR', sans-serif`,
                fontSize: ''
            }
        },
        old_korean: {
            innerHTML: `ᄃᆞ리옛 ${oldKoreanNumeral.buildThePrenoun(3200, 'ᄇᆞᆯ')}`,
            style: {
                paddingTop: '',
                paddingBottom: '',
                fontFamily: `'Noto Serif KR', sans-serif`,
                fontSize: '2.1dvh'
            }
        }
    }
};
/***************************** 가로/세로 창 변환 도구 *****************************/
/** 지난 창 비율 상태
 * @type {boolean}
 * @description 창 크기가 조절되기 전에 가로형이었는지 세로형이었는지 저장한다.
 * 세로형이었다면 True를, 가로형이었다면 False를 저장한다. */
var last_portrait = (window.matchMedia('(orientation: portrait)').matches)? true: false;
/** 길이 기준 단위
 * @function unitLen
 * @returns {"dvw"|"dvh"} 창 비율이 세로형일 때 "dvw"를, 가로형일 때 "dvh"를 돌려 준다. */
export const unitLen = () => {
    return (window.matchMedia('(orientation: portrait)').matches)? 'dvw': 'dvh';
};
/** 창이 현재 가로형인가
 * @function isPortrait
 * @returns {boolean} 세로형이라면 True를, 가로형이라면 False를 돌려 준다. */
export const isPortrait = () => {
    return (window.matchMedia('(orientation: portrait)').matches)? true: false;;
};
/** 가로/세로 창 변환에 따라 기준 단위 변환
 * @function transformUnit
 * @param {object} [obj] wordsById 객체를 기본값으로 한다.
 * @returns {object}
 * @description 언어 환경을 담고 있는 wordsById 객체에서 css스타일의 길이 기준 단위를 가로형/세로형 창 변환에 따라 바꿔 준다. */
export const transformUnit = (obj = wordsById) => {
    // 객체일 경우 재귀 함수 불러온다.
    if(typeof obj === 'object'){
        for(let key in obj)
            obj[key] = transformUnit(obj[key]);
    // 재귀 함수의 중단점
    }else if(typeof obj === 'string'){
        if(!Number.isNaN(Number.parseFloat(obj)))
            return (isPortrait())? obj.replaceAll("dvh", "dvw") : obj.replaceAll("dvw", "dvh");
    }
    // 그 밖에는 객체 그대로 돌려준다.
    return obj;
};
export const adjustLength = () => {
    let now_portrait = isPortrait();
    if((last_portrait && !now_portrait) || (!last_portrait && now_portrait)){
        transformUnit();
        last_portrait = now_portrait;
        return true;
    }
    return false;
};