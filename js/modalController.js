import {continueGame} from "./app.js"

export const openPauseModal = () => {
    document.getElementById("pauseModal").style.visibility = 'visible';
    addMouseInput(clickEvent);
};
const closePauseModal = () => {
    document.getElementById("pauseModal").style.visibility = 'hidden';
    removeMouseInput(clickEvent);
};
export const openGameOverModal = () => {
    document.getElementById("gameoverModal").style.visibility = 'visible';
};
const closeGameOverModal = () => {
    document.getElementById("gameoverModal").style.visibility = 'hidden';
};
const openQuitModal = () => {
    document.getElementById("quitModal").style.visibility = 'visible';
    addMouseInput(clickQuit);
};
const closeQuitModal = () => {
    document.getElementById("quitModal").style.visibility = 'hidden';
    removeMouseInput(clickQuit);
};
const clickEvent = function(event){
    event.preventDefault();
    let button = (event.target.className !== '')? event.target.className : event.target.parentElement.className;
    let classes = (button !== '')? button.split(' ') : [];
    button = (classes.length !== 0)? classes[classes.length - 1] : '';
    switch(button){
        case 'resume':
            closePauseModal();
            continueGame();
            break;
        case 'quit':
            closePauseModal();
            openQuitModal();
            break;
    }
};
const clickQuit = function(event){
    event.preventDefault();
    let button = (event.target.className !== '')? event.target.className : event.target.parentElement.className;
    let classes = (button !== '')? button.split(' ') : [];
    button = (classes.length !== 0)? classes[classes.length - 1] : '';
    switch(button){
        case 'quitOK':
            // fill later
            break;
        case 'quitCancel':
            closeQuitModal();
            openPauseModal();
            break;
    }
};
const addMouseInput = (callback) => {
    document.addEventListener("click", callback);
};
const removeMouseInput = (callback) => {
    document.removeEventListener("click", callback);
};