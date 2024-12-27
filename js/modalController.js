import {continueGame, startGame} from "./app.js"

export const openPauseModal = () => {
    let element = document.getElementById("pauseModal");
    element.style.visibility = 'visible';
    addMouseInput(element, clickEvent);
};
const closePauseModal = () => {
    let element = document.getElementById("pauseModal");
    element.style.visibility = 'hidden';
    removeMouseInput(element, clickEvent);
};
export const openGameOverModal = () => {
    let element = document.getElementById("gameoverModal");
    element.style.visibility = 'visible';
};
const closeGameOverModal = () => {
    let element = document.getElementById("gameoverModal");
    element.style.visibility = 'hidden';
};
const openQuitModal = () => {
    let element = document.getElementById("quitModal");
    element.style.visibility = 'visible';
    addMouseInput(element, clickQuit);
};
const closeQuitModal = () => {
    let element = document.getElementById("quitModal");
    element.style.visibility = 'hidden';
    removeMouseInput(element, clickQuit);
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
            // fill later properly
            closeQuitModal();
            startGame();
            break;
        case 'quitCancel':
            closeQuitModal();
            openPauseModal();
            break;
    }
};
const addMouseInput = (element, callback) => {
    element.addEventListener("click", callback);
};
const removeMouseInput = (element, callback) => {
    element.removeEventListener("click", callback);
};