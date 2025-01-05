// 깊은 복사
export const deepCopy = (object) => {
    if(object === null || typeof object !== "object")
        return object;
    
    let new_object = (Array.isArray(object))? [] : {};
    
    for(let key of Object.keys(object))
        new_object[key] = deepCopy(object[key]);
    
    return new_object;
};
// 숫자형을 쉼표로 구분된 문자열로
export const makeScoreString = (score) => {
    let str = (score === '')? '' : score.toString();
    let text = '';
    for(let i = str.length; i > 0; i -= 3){
        text = (text === '')? str.substring(i - 3, i) : str.substring(i - 3, i) + ',' + text;
    }
    return text;
};
// 오늘 날짜 받아오기
export const getToday = () => {
    return new Date()
            .toISOString()
            .split("T")[0];
};
// id로 모달 열기
export const openModal = (id) => {
    let element = document.getElementById(id);
    element.style.visibility = 'visible';
    return element;
};
// id로 모달 닫기
export const closeModal = (id) => {
    let element = document.getElementById(id);
    element.style.visibility = 'hidden';
    return element;
};
// 마우스 입력 추가
export const addMouseInput = (element, callback) => {
    element.addEventListener("click", callback);
};
// 마우스 입력 삭제
export const removeMouseInput = (element, callback) => {
    element.removeEventListener("click", callback);
};
// 키보드 입력 추가
export const addKeyboardInput = (element, callback) => {
    element.addEventListener("keydown", callback);
};
// 키보드 입력 삭제
export const removeKeyboardInput = (element, callback) => {
    element.removeEventListener("keydown", callback);
};
// 인풋 입력 추가
export const addInputEvent = (element, callback) => {
    element.addEventListener("input", callback);
};
// 인풋 입력 삭제
export const removeInputEvent = (element, callback) => {
    element.removeEventListener("input", callback);
};
// 클래스 이름으로 버튼 반환
export const findButton = (event) => {
    event.preventDefault();
    let button = (event.target.className !== '')? event.target.className : event.target.parentElement.className;
    let classes = (button !== '')? button.split(' ') : [];
    return button = (classes.length !== 0)? classes[classes.length - 1] : '';
};