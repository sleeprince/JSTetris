
const textLayer = document.getElementById("textLayer");
const textBoard = document.getElementById("textBoard");

export const openPauseModal = () => {
    textLayer.style.visibility = 'visible';
    textBoard.innerHTML = `PAUSE`;
};
export const closePauseModal = () => {
    textBoard.innerHTML = ``;
    textLayer.style.visibility = 'hidden';
};
export const gameOverModal = () => {
    textLayer.style.visibility = 'visible';
    textBoard.innerHTML = `GAME OVER`;
}
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
const setLevelBoard = (level) => {
    document.getElementById("levelSection")
        .getElementsByClassName("content")[0]
        .innerHTML = `${level}`;
}
const setLinesBoard = (lines) => {
    document.getElementById("linesSection")
        .getElementsByClassName("content")[0]
        .innerHTML = `${lines}`;
}
const setScoreBoard = (score) => {
    document.getElementById("scoreSection")
        .getElementsByClassName("content")[0]
        .innerHTML = `${score}`;
}