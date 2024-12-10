
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