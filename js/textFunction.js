export const showMark = (mark) => {
    setLevelBoard(mark.level);
    setLinesBoard(mark.line);
    setScoreBoard(mark.score);
};
export const hideMark = () => {
    setLevelBoard('');
    setLinesBoard('');
    setScoreBoard('');
};
export const setPauseSymbol = () => {
    document.getElementById("pauseButton").innerHTML =`<div>⏸</div>`;
};
export const setPlaySymbol = () => {
    document.getElementById("pauseButton").innerHTML =`<div>⏵</div>`;
};
const setLevelBoard = (level) => {
    document.getElementById("levelSection")
        .getElementsByClassName("content")[0]
        .innerHTML = `${level}`;
};
const setLinesBoard = (lines) => {
    document.getElementById("linesSection")
        .getElementsByClassName("content")[0]
        .innerHTML = `${lines}`;
};
const setScoreBoard = (score) => {
    let str = (score === '')? '' : score.toString();
    let text = '';
    for(let i = str.length; i > 0; i -= 3){
        text = (text === '')? str.substring(i - 3, i) : str.substring(i - 3, i) + ',' + text;
    }
    document.getElementById("scoreSection")
        .getElementsByClassName("content")[0]
        .innerHTML = `${text}`;
};