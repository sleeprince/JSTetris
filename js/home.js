import { startGame } from "./app.js";
import { openHighScoresModal,
        } from "./modalController.js";
import { openModal, closeModal, addMouseInput, removeMouseInput, findButton } from "./utility.js";
import { openOptionModal } from "./option.js";

var initial_level = 1;
const levels = [1, 5, 10, 15, 20];
// 초기 레벨 얻기
export const getIniLevel = () => {
    return initial_level;
};
// 대문 열기
export const openHomePage = () => {
    closeModal("ingame");
    addMouseInput(openModal("home"), clickMenuEvent);
    writeLevel();
};
// 대문 닫기
const closeHomePage = () => {
    removeMouseInput(closeModal("home"), clickMenuEvent);
};
// 메뉴 클릭 이벤트
const clickMenuEvent = (event) => {
    switch(findButton(event)){
        case 'play':
            closeHomePage();
            openModal("ingame");
            startGame();
            break;
        case 'level':
            addLevel();
            break;
        case 'left_arrow':
            moveDownToPrevLevel();
            break;
        case 'right_arrow':
            moveUpToNextLevel();
            break;
        case 'option':
            openOptionModal();
            break;
        case 'howtoplay':
            break;
        case 'highscores':
            openHighScoresModal();
            break;
    }
};
const addLevel = () => {
    initial_level++;
    if(initial_level > 20) initial_level = 1;
    writeLevel();
};
const moveDownToPrevLevel = () => {
    for(let i = levels.length - 1; i >= 0; i--){
        if(levels[i] < initial_level){
            initial_level = levels[i];
            break;
        }
    }
    writeLevel();
};
const moveUpToNextLevel = () => {
    for(let i = 0; i < levels.length; i++){
        if(levels[i] > initial_level){
            initial_level = levels[i];
            break;
        }
    }
    writeLevel();
};
const disableLeftArrowButton = () => {
    let list = document.getElementById("levelMinus").classList;
    if(list.contains("left_arrow"))
        list.remove("left_arrow");
};
const enableLeftArrowButton = () => {
    let list = document.getElementById("levelMinus").classList;
    if(!list.contains("left_arrow"))
        list.add("left_arrow");
};
const disableRightArrowButton = () => {
    let list = document.getElementById("levelPlus").classList;
    if(list.contains("right_arrow"))
        list.remove("right_arrow");
};
const enableRightArrowButton = () => {
    let list = document.getElementById("levelPlus").classList;
    if(!list.contains("right_arrow"))
        list.add("right_arrow");
};
const writeLevel = () => {
    document.getElementById("levelup")
            .getElementsByTagName("span")[0]
            .innerHTML = `LEVEL: ${initial_level}`;
            
    if(initial_level === levels[0])
        disableLeftArrowButton();
    else
        enableLeftArrowButton();

    if(initial_level === levels[levels.length - 1])
        disableRightArrowButton();
    else
        enableRightArrowButton();
};
// 홈페이지 열고 시작
openHomePage();