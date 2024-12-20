
const pauseModal = document.getElementById("pauseModal");
const gameoverModal = document.getElementById("gameoverModal");

export const openPauseModal = () => {
    pauseModal.style.visibility = 'visible';
};
export const closePauseModal = () => {
    pauseModal.style.visibility = 'hidden';
};
export const gameOverModal = () => {
    gameoverModal.style.visibility = 'visible';
};
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
};
const setLinesBoard = (lines) => {
    document.getElementById("linesSection")
        .getElementsByClassName("content")[0]
        .innerHTML = `${lines}`;
};
const setScoreBoard = (score) => {
    document.getElementById("scoreSection")
        .getElementsByClassName("content")[0]
        .innerHTML = `${score}`;
};