import { openModal, 
    closeModal, 
    addMouseInput, 
    removeMouseInput, 
    addResizeEvent,
    findButton, 
    getTheOrdinalNumeralPrenouns, 
    adjustLength,
    changeLanguage,
    transformUnit,
    goFullScreen} from "./utility.js";
import { getLanguage, openOptionModal } from "./option.js";
import { openHighScoresModal } from "./modalController.js";
import { playHoldSFX, playMovingSFX } from "./soundController.js";
import { openHowToPlayModal } from "./howtoplay.js";
import { BLOCKS } from "./model.js";
import { block } from "./blockFunction.js";
import { openGamePage, startGame } from "./app.js";

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
            goFullScreen();
            openGamePage();
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
/** 마지막으로 실행된 버튼의 클래스 이름
 * @type {string}
 * @description
 * 마우스오버 동작의 중복 실행을 막기 위해 마지막으로 실행된 버튼의 식별용 클래스 이름을 저장한다. */
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
    document.getElementById("level_num").innerHTML 
        = (getLanguage() === 'old_korean')?` ${getTheOrdinalNumeralPrenouns(initial_level)}` : initial_level;

    if(initial_level === levels[0])
        disableLeftArrowButton();
    else
        enableLeftArrowButton();

    if(initial_level === levels[levels.length - 1])
        disableRightArrowButton();
    else
        enableRightArrowButton();
};
/** 로딩 애니메이션의 속도를 조절하는 SetTimeout()의 ID를 가리킨다.
 * @type {number} */
let loadingTimerID = 0;
/** CSS @FontFace에 적힌 글씨체 모두 불러오기
 * @async
 * @function loadAllFonts
 * @returns {Promise<FontFaceSet>} */
const loadAllFonts = async () => {
    document.fonts.forEach(font => {font.load();});
    return document.fonts.ready;
};
/** 로딩 화면 띄우기
 * @function startLoadingAnimation
 * @description 로딩 대기 화면으로, 동그라미 둘레로 삼원색 막대가 돌아가고, 동그라미 안에서 T-미노가 돌아간다. */
const startLoadingAnimation = () => {
    // 로딩 화면의 바탕 구성
    let loading = document.createElement('div');
    loading.id = 'loading';
    let html = `<div class="circle" id="outerCircle"></div>\n<div class="circle" id="innerCircle"><div id="t_mino"></div></div>\n`
    switch(getLanguage()){
        case 'english':
            html += `<p class="loadText">NOW LOADING</p>`;
            break;
        case 'korean':
            html += `<p class="loadText loadKorean">불러오는 중…</p>`;
            break;
        case 'old_korean':
            html += `<p class="loadText loadOldKorean">블러오고 이슘</p>`;
            break;
    }
    loading.innerHTML = html;
    document.getElementsByTagName('body')[0].appendChild(loading);
    // T‐mino 구성
    let t_mino = new block("T_block");
    drawLoader(t_mino);
    loadingTimerID = setTimeout(function rotateTMino(){
        t_mino.rotateR();
        deleteLoader();
        drawLoader(t_mino);
        loadingTimerID = setTimeout(rotateTMino, 200);
    }, 200);
};
/** 로딩 화면 끄기
 * @function endLoadingAnimation */
const endLoadingAnimation = () => {
    document.getElementById("loading").remove();
    clearTimeout(loadingTimerID);
};
/** 로딩 동그라미 안의 테트로미노 그리기
 * @function drawLoader
 * @param {block} block 그릴 테트로미노 객체 */
const drawLoader = (block) => {
    let ground = document.getElementById('t_mino');
    BLOCKS[block.type][block.rotation].forEach((row, i) => {
        row.forEach((v, j) => {
            if(i < 3 && j > 0){
                let box = document.createElement("div");
                if(v === 1){
                    box.className = `block ${block.type}`;
                    box.innerHTML = `<div class="innerBlock"></div>`;
                }else{
                    block.className = `none`;
                }
                ground.appendChild(box);
            }
        });
    });
};
/** 로딩 동그라미 안의 테트로미노 지우기
 * @function deleteLoader */
const deleteLoader = () => {
    let ground = document.getElementById('t_mino');
    while(ground.hasChildNodes())
        ground.lastElementChild.remove();
};
/** 로딩 화면 이후 대문 열기
 * @function getReadyToOpenTetris
 * @description 글씨체를 다운받고 준비가 되면 대문을 연다. 적어도 2000ms는 로딩 화면을 보여 준다. */
const getReadyToOpenTetris = () => {
    startLoadingAnimation();
    transformUnit();
    changeLanguage(getLanguage());
    Promise.all([loadAllFonts(), new Promise((resolve) => {setTimeout(()=>{resolve(true);}, 2000)})])
            .then(() => {
                endLoadingAnimation();
                openHomePage();
            });
};
/** 창 크기가 바뀔 때마다 돌릴 콜백 함수
 * @function resizeWindow
 * @param {UIEvent} event
 * @description 가로형에서 세로형으로, 또는 세로형에서 가로형으로 바뀔 때 wordsById 객체의 길이 단위를 바꾸고 다. */
const resizeWindow = function(event){
    if(adjustLength())
        changeLanguage(getLanguage());
};
// 창을 우클릭하거나 길게 터치할 때 contextmenu를 띄우지 않게끔 한다.
document.addEventListener("contextmenu", function(event){ event.preventDefault(); });
// 창 크기 조절시 가로형/세로형 변환
addResizeEvent(resizeWindow);
// 로딩 화면 이후 대문 열고 시작
getReadyToOpenTetris();