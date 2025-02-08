import { startGame } from "./app.js";
import { openHighScoresModal } from "./modalController.js";
import { openHowToPlayModal } from "./howtoplay.js";
import { openModal, closeModal, addMouseInput, removeMouseInput, findButton, addMouseOver, removeMouseOver } from "./utility.js";
import { getTheOrdinalNumeralPrenouns, openOptionModal } from "./option.js";
import { playHoldSFX, playMovingSFX } from "./soundController.js";

/** 게임의 처음 레벨
 * @type {number} 
 * @description 이 레벨부터 게임이 시작된다. */
var initial_level = 1;
/** 화살표 버튼으로 건너뛸 레벨 목록
 * @type {number[]} */
const levels = [1, 5, 10, 15, 20];
/** 처음 레벨 가져오기 
 * @function getIniLevel */
export const getIniLevel = () => {
    return initial_level;
};
/** 대문 열기
 * @function openHomePage 
 * @description 게임의 현판을 걸고 목차를 늘어놓은 게임의 들머리를 연다. */
export const openHomePage = () => {
    closeModal("ingame");
    addMouseInput(openModal("home"), clickMenuEvent, overMenuEvent);
    writeLevel();
};
/** 대문 닫기
 * @function openHomePage 
 * @description 게임의 현판을 걸고 목차를 늘어놓은 게임의 들머리를 닫는다. */
const closeHomePage = () => {
    removeMouseInput(closeModal("home"), clickMenuEvent, overMenuEvent);
};
/** 목차 마우스클릭 콜백 함수
 * @function clickMenuEvent
 * @param {MouseEvent} event */
const clickMenuEvent = function(event){
    switch(findButton(event)){
        case 'play':
            playMovingSFX();
            closeHomePage();
            openModal("ingame");
            startGame();
            break;
        case 'level':
            playMovingSFX();
            addLevel();
            writeLevel();
            break;
        case 'left_arrow':
            playMovingSFX();
            moveDownToPrevLevel();
            writeLevel();
            break;
        case 'right_arrow':
            playMovingSFX();
            moveUpToNextLevel();
            writeLevel();
            break;
        case 'option':
            playMovingSFX();
            openOptionModal();
            break;
        case 'howtoplay':
            playMovingSFX();
            openHowToPlayModal();
            break;
        case 'highscores':
            playMovingSFX();
            openHighScoresModal();
            break;
    }
};
let last_button = '';
/** 목차 마우스오버 콜백 함수
 * @function overMenuEvent
 * @param {MouseEvent} event */
const overMenuEvent = function(event){
    let button = findButton(event)
    switch(button){
        case last_button:
            break;
        case 'play':
        case 'level':
        case 'left_arrow':
        case 'right_arrow':
        case 'option':
        case 'howtoplay':
        case 'highscores':
            playHoldSFX();
            last_button = button;
            break;
        default:
            last_button = '';
    }
};
/** 처음 레벨 올리기
 * @function addLevel
 * @description 처음 레벨을 1만큼 올린다. 레벨이 20을 넘기면 다시 1로 돌아온다. */
const addLevel = () => {
    initial_level++;
    if(initial_level > 20) initial_level = 1;
};
/** 레벨 건너뛰어 내리기
 * @function moveDownToPrevLevel
 * @description 레벨 목록을 따라서 처음 레벨을 건너뛰어 내린다. */
const moveDownToPrevLevel = () => {
    for(let i = levels.length - 1; i >= 0; i--){
        if(levels[i] < initial_level){
            initial_level = levels[i];
            break;
        }
    }
};
/** 레벨 건너뛰어 올리기
 * @function moveDownToPrevLevel
 * @description 레벨 목록을 따라서 처음 레벨을 건너뛰어 올린다. */
const moveUpToNextLevel = () => {
    for(let i = 0; i < levels.length; i++){
        if(levels[i] > initial_level){
            initial_level = levels[i];
            break;
        }
    }
};
/** 왼쪽 화살표 버튼 죽이기
 * @function disableLeftArrowButton
 * @description 왼쪽 화살표 버튼을 못 쓰게 만든다. */
const disableLeftArrowButton = () => {
    let list = document.getElementById("levelMinus").classList;
    if(list.contains("left_arrow"))
        list.remove("left_arrow");
};
/** 왼쪽 화살표 버튼 살리기
 * @function disableLeftArrowButton
 * @description 왼쪽 화살표 버튼을 쓸 수 있게 만든다. */
const enableLeftArrowButton = () => {
    let list = document.getElementById("levelMinus").classList;
    if(!list.contains("left_arrow"))
        list.add("left_arrow");
};
/** 오른쪽 화살표 버튼 죽이기
 * @function disableLeftArrowButton
 * @description 오른쪽 화살표 버튼을 못 쓰게 만든다. */
const disableRightArrowButton = () => {
    let list = document.getElementById("levelPlus").classList;
    if(list.contains("right_arrow"))
        list.remove("right_arrow");
};
/** 오른쪽 화살표 버튼 살리기
 * @function disableLeftArrowButton
 * @description 오른쪽 화살표 버튼을 쓸 수 있게 만든다. */
const enableRightArrowButton = () => {
    let list = document.getElementById("levelPlus").classList;
    if(!list.contains("right_arrow"))
        list.add("right_arrow");
};
/** 레벨 표시하기
 * @function writeLevel
 * @description 처음 레벨을 레벨 버튼에 표시하고, 레벨이 1이면 왼쪽 화살표 버튼을, 레벨이 20이면 오른쪽 화살 버튼을 죽인다. */
const writeLevel = () => {
    document.getElementById("level_num").innerHTML = `${getTheOrdinalNumeralPrenouns(initial_level)}`;

    if(initial_level === levels[0])
        disableLeftArrowButton();
    else
        enableLeftArrowButton();

    if(initial_level === levels[levels.length - 1])
        disableRightArrowButton();
    else
        enableRightArrowButton();
};
const loadAllFonts = async () => {};
const startLoadingAnimation = async () => {};
const getReadyToStart = async () => {};
// 대문 열고 시작
openHomePage();