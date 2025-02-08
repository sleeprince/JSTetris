import "./crypto-js.min.js";

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
/** 참/거짓 배열의 요소가 모두 참인지 검사
 * @function isAllTrue
 * @param {boolean[]} arr 
 * @returns {boolean} 배열 요소가 모두 참이라면 True를, 하나라도 거짓이라면 False를 돌려 준다. */
export const isAllTrue = (arr) => {
    for(let e of arr)
        if(!e) return false;
    return true;
};
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
/** 노드에 속성값을 적용하는 콜백 함수
 * @callback setNodeProperty
 * @param {HTMLElement|HTMLElement[]} nodes 대상이 되는 HTML요소의 배열
 * @param {number} property 대상에 적용할 값
 * @returns {void}
 */
/** 애니메이션을 그칠지 알려 주는 콜백 함수
 * @callback isAnimationOn
 * @returns {boolean} 애니메이션을 이어 하려거든 True를, 그치려거든 False를 돌려 준다.
 */
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