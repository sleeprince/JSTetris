
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
export const writeLevel = (level) => {
    document.getElementById("levelSection")
        .getElementsByClassName("content")[0]
        .innerHTML = `${level}`;
}
export const writeLines = (lines) => {
    document.getElementById("linesSection")
        .getElementsByClassName("content")[0]
        .innerHTML = `${lines}`;
}
export const writeScore = (score) => {
    document.getElementById("scoreSection")
        .getElementsByClassName("content")[0]
        .innerHTML = `${score}`;
}