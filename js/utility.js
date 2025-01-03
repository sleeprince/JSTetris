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