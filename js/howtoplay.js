import { openModal, 
        closeModal, 
        addMouseInput, 
        removeMouseInput, 
        findButton, 
        addMouseOver,
        removeMouseOver,
        makeAnimation,
        addKeyboardInput,
        removeKeyboardInput,
        unitLen,
        setNodeAttributeByLang,
        removeResizeEvent,
        addResizeEvent,
        isPortrait
    } from "./utility.js";
import { getLanguage } from "./option.js";
import { playHoldSFX, playMovingSFX } from "./soundController.js";
import { BLOCKS, COLORS } from "./model.js";
/***************************** 게임 방법 모달 공통 *****************************/
/** 현재 열려 있는 페이지
 * @type {number} */
let current_page = 0;
/** 게임 방법 모달 열기
 * @function openHowToPlayModal */
export const openHowToPlayModal = () => {
    addMouseInput(openModal("howtoplay"), clickHowToPlay, overHowToPlay);
    openCurrentPage();
};
/** 게임 방법 모달 닫기
 * @function closeHowToPlayModal */
const closeHowToPlayModal = () => {
    removeMouseInput(closeModal("howtoplay"), clickHowToPlay, overHowToPlay);
    closeCurrentPage();
    current_page = 0;
};
/** 게임 방법 모달 다시 열기 
 * @function refreshHowToPlayModal */
const refreshHowToPlayModal = () => {
    // 닫기
    let tmp_curr_tab = current_tab;
    removeMouseInput(closeModal("howtoplay"), clickHowToPlay, overHowToPlay);
    closeCurrentPage();
    // 열기
    current_tab = tmp_curr_tab;
    addMouseInput(openModal("howtoplay"), clickHowToPlay, overHowToPlay);
    openCurrentPage();
};
const openPageById = (id) => {
    let element = document.getElementById(id);
    element.style.display = '';
    return element; 
};
const closePageById = (id) => {
    let element = document.getElementById(id);
    element.style.display = 'none';
    return element; 
};
/** 현재 페이지 열기
 * @function openCurrentPage */
const openCurrentPage = () => {
    switch(current_page){
        case 0:
            openExplanationPage();
            break;
        case 1:
            openKeybordPage();
            break;
        case 2:
            openScoringPage();
            break;
    }
    checkButtonStatue();
};
/** 현재 페이지 닫기
 * @function closeCurrentPage */
const closeCurrentPage = () => {
    switch(current_page){
        case 0:
            closeExplanationPage();
            break;
        case 1:
            closeKeyboardPage();
            break;
        case 2:
            closeScoringPage();
            break;
    }
};
/** 다음 페이지 열기
 * @function openNextPage */
const openNextPage = () => {
    closeCurrentPage();
    current_page = ++current_page%3;
    openCurrentPage();
};
/** 앞선 페이지 열기
 * @function openPreviousPage */
const openPreviousPage = () => {
    closeCurrentPage();
    current_page = (--current_page + 3)%3;
    openCurrentPage();
};
/** 게임 방법 모달 마우스클릭 콜백 함수
 * @function clickHowToPlay
 * @param {MouseEvent} event */
const clickHowToPlay = function(event){
    switch(findButton(event)){
        case 'howToPlayDone':
            playMovingSFX();
            closeHowToPlayModal();
            break;
        case 'left_arrow':
            playMovingSFX();
            openPreviousPage();
            break;
        case 'right_arrow':
            playMovingSFX();
            openNextPage();
            break;
    }
};
/** 마지막으로 실행된 버튼의 클래스 이름
 * @type {string}
 * @description
 * 마우스오버 동작의 중복 실행을 막기 위해 마지막으로 실행된 버튼의 식별용 클래스 이름을 저장한다. */
let last_button = '';
/** 게임 방법 모달 마우스클릭 콜백 함수
 * @function overHowToPlay
 * @param {MouseEvent} event */
const overHowToPlay = function(event){
    let button = findButton(event);
    switch(button){
        case last_button:
            break;
        case 'howToPlayDone':
        case 'left_arrow':
        case 'right_arrow':
            playHoldSFX();
            last_button = button;
            break;
        default:
            last_button = '';
    }
};
/** 왼쪽 화살표 버튼 죽이기
 * @function disableLeftButton  */
const disableLeftButton = () => {
    let list = document.getElementById('leftArrow_howtoplay').classList;
    if(list.contains('left_arrow'))
        list.remove('left_arrow');
};
/** 왼쪽 화살표 버튼 살리기
 * @function enableLeftButton */
const enableLeftButton = () => {
    let list = document.getElementById('leftArrow_howtoplay').classList;
    if(!list.contains('left_arrow'))
        list.add('left_arrow');
};
/** 오른쪽 화살표 버튼 죽이기
 * @function disableRightButton */
const disableRightButton = () => {
    let list = document.getElementById('rightArrow_howtoplay').classList;
    if(list.contains('right_arrow'))
        list.remove('right_arrow');
};
/** 오른쪽 화살표 버튼 살리기
 * @function enableRightButton */
const enableRightButton = () => {
    let list = document.getElementById('rightArrow_howtoplay').classList;
    if(!list.contains('right_arrow'))
        list.add('right_arrow');
};
/** 현재 페이지에 따라 버튼 죽살이 설정
 * @function checkButtonStatue */
const checkButtonStatue = () => {
    switch(current_page){
        case 0:
            disableLeftButton();
            enableRightButton();
            break;
        case 1:
            enableLeftButton();
            enableRightButton();
            break;
        case 2:
            disableRightButton();
            enableLeftButton();
            break;
        default:
            enableLeftButton();
            enableRightButton();
    }
};
/***************************** 게임 설명 페이지 관련 *****************************/
/** 게임 설명 페이지에 입력이 있었는지 여부를 가리킨다.
 * @type {boolean} */
let anyInputOnArticle = false;
/** 게임 설명 페이지에 입력이 있었는지 여부 가져오기
 * @function isAnyInputOnArticle
 * @returns {boolean} 페이지가 막 열려 입력이 없던 상태면 false를, 키보드 또는 마우스 입력이 있으면 True를 돌려 준다. */
const isAnyInputOnArticle = () => {
    return anyInputOnArticle;
};
/** 게임 설명 페이지에 입력이 있었는지 여부 저장하기
 * @function setAnyInputOnArticle
 * @param {boolean} bool 페이지가 막 열려 입력이 없던 상태면 false를, 키보드 또는 마우스 입력이 있으면 True를 저장한다. */
const setAnyInputOnArticle = (bool) => {
    if(typeof bool === 'boolean')
        anyInputOnArticle = bool;
};
/** 게임 설명 페이지 열기
 * @function openExplanationPage */
const openExplanationPage = () => {
    for(let element of openPageById("page1").getElementsByClassName("article"))
        addMouseOver(element, overArticle);
    addKeyboardInput(document, keydownAricle);
    addResizeEvent(resizeWindowPage1);
    focusCurrentArticle();
    setBluringOn(false);
};
/** 게임 설명 페이지 닫기
 * @function closeExplanationPage */
const closeExplanationPage = () => {
    for(let element of closePageById("page1").getElementsByClassName("article"))
        removeMouseOver(element, overArticle);
    removeKeyboardInput(document, keydownAricle);
    removeResizeEvent(resizeWindowPage1);
    current_tab = 0;
    setAnyInputOnArticle(false);
    drawExample(EXAMPLES.NOTHING);
};
/** 테트리미노의 종류 목록
 * @constant tetrominoes
 * @type {string[]} 
 * @description "model.BLOCKS"의 키 값에 'white'를 마지막 값으로 더한 배열이다. */
const tetrominoes = [...Object.keys(BLOCKS), 'white'];
/** 테트리미노의 빛깔 가져오기
 * @function getTetrominosColor
 * @param {keyof COLORS} type 
 * @param {number} [alpha] 투명도 0–1
 * @returns {string} rgba('red', 'green', 'blue', 'alpha') 형식으로 돌려 준다. */
const getTetrominosColor = (type, alpha = 1) => {
    if(COLORS[type] == undefined)
        return '';
    else
        return `rgba(${COLORS[type].r}, ${COLORS[type].g}, ${COLORS[type].b}, ${alpha})`;
};
/** 설명 예시가 들어갈 객체
 * @constant example_board
 * @type {HTMLElement} */
const example_board = document.getElementById("example_container");
/** 설명 예시 모음
 * @constant EXAMPLES
 * @readonly
 * @description 10×17짜리 숫자 배열. [ -1: 빈 하늘, 0–7: 땅, 8–15: 그림자] */
const EXAMPLES = {
    TETROMINO: [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1,  3,  3,  3,  3, -1,  0,  0, -1, -1],
        [-1, -1, -1, -1, -1, -1,  0,  0, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1,  1, -1, -1, -1, -1, -1,  2, -1, -1],
        [-1,  1,  1,  1, -1,  2,  2,  2, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1,  4,  4, -1,  5,  5, -1, -1, -1],
        [-1,  4,  4, -1, -1, -1,  5,  5, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1,  6, -1, -1, -1, -1, -1],
        [-1, -1, -1,  6,  6,  6, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    ],
    GRAVITY: [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1,  4,  4, -1, -1, -1],
        [-1, -1, -1, -1,  4,  4, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1,  5, -1, -1, -1, -1, -1, -1, -1,  1],
        [ 5,  5, -1,  2, -1, 12, 12,  6, -1,  1],
        [ 5,  0,  0,  2, 12, 12,  6,  6,  1,  1],
        [ 1,  0,  0,  2,  2, -1, -1,  6,  4,  4],
        [ 1,  1,  1,  3,  3,  3,  3,  4,  4, -1]
    ],
    LINE_CLEAR: [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1,  5, -1, -1, -1, -1, -1, -1, -1,  1],
        [ 5,  5, -1,  2, -1,  4,  4,  6, -1,  1],
        [ 7,  7,  7,  7,  7,  7,  7,  7,  7,  7],
        [ 1,  0,  0,  2,  2, -1, -1,  6,  4,  4],
        [ 1,  1,  1,  3,  3,  3,  3,  4,  4, -1]
    ],
    MOVE: [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1,  6, -1, -1, -1, -1],
        [-1, -1, -1, -1,  6,  6,  6, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, 14, -1, -1, -1, -1],
        [-1,  5, -1, -1, 14, 14, 14, -1, -1,  1],
        [ 5,  5, -1,  2, -1,  4,  4,  6, -1,  1],
        [ 1,  0,  0,  2,  2, -1, -1,  6,  4,  4],
        [ 1,  1,  1,  3,  3,  3,  3,  4,  4, -1]
    ],
    GHOST_PIECE: [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1,  6, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1,  6,  6, -1, -1, -1, -1],
        [-1, -1, -1, -1,  6, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, 14, -1, -1, -1, -1, -1],
        [-1,  5, -1, -1, 14, 14, -1, -1, -1,  1],
        [ 5,  5, -1,  2, 14,  4,  4,  6, -1,  1],
        [ 1,  0,  0,  2,  2, -1, -1,  6,  4,  4],
        [ 1,  1,  1,  3,  3,  3,  3,  4,  4, -1]
    ],
    HOLD: [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1,  6, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1,  6,  6, -1, -1, -1, -1],
        [-1, -1, -1, -1,  6, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, 14, -1, -1, -1, -1, -1],
        [-1,  5, -1, -1, 14, 14, -1, -1, -1,  1],
        [ 5,  5, -1,  2, 14,  4,  4,  6, -1,  1],
        [ 1,  0,  0,  2,  2, -1, -1,  6,  4,  4],
        [ 1,  1,  1,  3,  3,  3,  3,  4,  4, -1]
    ],
    GAME_OVER: [
        [-1, -1, -1,  6,  6,  6, -1, -1, -1, -1],
        [-1, -1,  0,  0,  6, -1, -1, -1, -1, -1],
        [-1, -1,  0,  0,  2,  2,  2, -1, -1, -1],
        [-1, -1, -1,  6,  2,  1,  1,  1,  3, -1],
        [-1, -1,  2,  6,  6, -1,  4,  1,  3, -1],
        [-1,  5,  2,  6,  0,  0,  4,  4,  3, -1],
        [ 5,  5,  2,  2,  0,  0,  1,  4,  3, -1],
        [ 5, -1,  3,  3,  3,  3,  1, -1,  6, -1],
        [ 0,  0, -1, -1, -1,  1,  1,  6,  6,  6],
        [ 0,  0,  4,  4,  2,  2,  5,  5, -1,  3],
        [-1,  4,  4, -1,  5,  2, -1,  5,  5,  3],
        [ 1,  1,  3,  5,  5,  2,  0,  0, -1,  3],
        [ 1, -1,  3,  5,  6, -1,  0,  0,  2,  3],
        [ 1,  5,  3, -1,  6,  6,  2,  2,  2,  1],
        [ 5,  5,  3,  2,  6,  4,  4,  6, -1,  1],
        [ 1,  0,  0,  2,  2, -1, -1,  6,  4,  4],
        [ 1,  1,  1,  3,  3,  3,  3,  4,  4, -1]
    ],
    NOTHING: [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    ]
};
Object.freeze(EXAMPLES);
/** 설명 예시 그리기 함수 모음 */
const showExample = {
    ofTetromino: () => {
        setExample(EXAMPLES.TETROMINO);
    },
    ofGravity: () => {
        let nodes = Array.from({length:3}, () => document.createElement('div'));
        nodes.forEach((node, index) => {
            node.style.gridArea = `3/${index + 5}/span ${(index !== 0)? 2 : 3}/span 1`;
            node.style.backgroundImage = (index !== 0)? `linear-gradient(to bottom, transparent, ${getTetrominosColor('S_block', 0.5)})`
                                        : `linear-gradient(to bottom, transparent 0%, ${getTetrominosColor('S_block', 0.5)} 66.6%, ${getTetrominosColor('S_block', 0.7)} 100%)`;
        });
        setExample(EXAMPLES.GRAVITY, ...nodes);
    },
    ofLineClear: () => {
        setExample(EXAMPLES.LINE_CLEAR);
    },
    ofMove: () => {
        // 왼쪽 화살표
        let leftArrow = document.createElement('div');
        leftArrow.id = 'example_left';
        leftArrow.style.gridArea = '6/3/9/5';
        leftArrow.innerHTML = ' ←';
        // 오른쪽 화살표
        let rightArrow = document.createElement('div');
        rightArrow.id = 'example_right';
        rightArrow.style.gridArea = '6/8/9/10';
        rightArrow.innerHTML = '→ ';
        // 아래쪽 화살표
        let downArrow = document.createElement('div');
        downArrow.id = 'example_down';
        downArrow.style.gridArea = '8/5/10/8';
        downArrow.innerHTML = '↓';
        // 반시계 방향 화살표
        let leftArcArrow = document.createElement('div');
        leftArcArrow.id = 'example_leftArcArrow';
        leftArcArrow.style.rotate = '50deg';
        leftArcArrow.style.gridArea = '5/4/7/6';
        leftArcArrow.innerHTML = '⤹';
        // 시계 방향 화살표
        let rightArcArrow = document.createElement('div');
        rightArcArrow.id = 'example_rightArcArrow';
        rightArcArrow.style.rotate = '-50deg';
        rightArcArrow.style.gridArea = '5/7/7/9';
        rightArcArrow.innerHTML = '⤸';
        setExample(EXAMPLES.MOVE, leftArrow, rightArrow, downArrow, leftArcArrow, rightArcArrow);
    },
    ofGhostPiece: () => {
        let squares = Array.from({length: 4}, () => document.createElement('div'));
        let squaresIter = squares[Symbol.iterator]();
        let borderText = (str) => {
            let text = '';
            let width = `0.4${unitLen()}`;
            switch(true){
                case str.toLowerCase().includes('right'):
                    text = width;
                    break;
                case str.toLowerCase().includes('left'):
                    text = `-${width}`;
                    break;
                default:
                    text = '0';
            }
            switch(true){
                case str.toLowerCase().includes('bottom'):
                    text += ` ${width}`;
                    break;
                case str.toLowerCase().includes('top'):
                    text += ` -${width}`;
                    break;
                default:
                    text += ' 0';
            }
            return text + ' white';
        };
        BLOCKS.T_block[1].forEach((row, i, blocks) => {
            row.forEach((val, j) => {
                if(val === 1){
                    let square = squaresIter.next().value;
                    let boxShadow = '';
                    let top = i === 0 || blocks[i-1][j] === 0;
                    let bottom = i === blocks.length - 1 || blocks[i+1][j] === 0;
                    let left = j === 0 || blocks[i][j-1] === 0;
                    let right = j === blocks[i].length - 1 || blocks[i][j+1] === 0;
                    square.style.gridArea = `${13+i}/${3+j}/span 1/span 1`;
                    if(top)
                        boxShadow = borderText('top');
                    if(bottom)
                        boxShadow += (boxShadow === '')? borderText('bottom') : `, ${borderText('bottom')}`;
                    if(left)
                        boxShadow += (boxShadow === '')? borderText('left') : `, ${borderText('left')}`;
                    if(right)
                        boxShadow += (boxShadow === '')? borderText('right') : `, ${borderText('right')}`;
                    if(top&&left)
                        boxShadow += `, ${borderText('top left')}`;
                    if(top&&right)
                        boxShadow += `, ${borderText('top right')}`;
                    if(bottom&&left)
                        boxShadow += `, ${borderText('bottom left')}`;
                    if(bottom&&right)
                        boxShadow += `, ${borderText('bottom right')}`;
                    square.style.boxShadow = boxShadow;
                    square.style.zIndex = 1;
                }
            });
        });
        setExample(EXAMPLES.GHOST_PIECE, ...squares);
    },
    ofHold: () => {
        // 보관함 배경
        let holdBox = document.createElement('div');
        holdBox.id = 'example_holdBox';        
        // 보관함 문구
        let textBox = document.createElement('div');
        textBox.id = 'example_hold_title';
        setNodeAttributeByLang(textBox, textBox.id, getLanguage());
        // 보관함 네모 상자 
        let blackBox = document.createElement('div');
        blackBox.id = "example_blackBox";        
        // 보관함 요소 조립
        holdBox.appendChild(textBox);
        holdBox.appendChild(blackBox);
        // 화살표
        let arrow = document.createElement('div');
        arrow.id = "example_arrowToHold";
        arrow.innerHTML = '↖';        
        setExample(EXAMPLES.HOLD, holdBox, arrow);
    },
    ofGameOver: () => {
        setExample(EXAMPLES.GAME_OVER);
    }
};
/** 현재 보고 있는 설명 항목 저장
 * @type {number} 0–6의 자연수 */
let current_tab = 0;
/** 예시 그리기 함수의 이름 배열
 * @type {keyof showExample}  */
const tabs = Object.keys(showExample);
/** 설명 예시 그리기 함수 불러오기
 * @function excuteExampleFunction
 * @param {number|string} index 설명 예시 보기 함수를 인덱스 번호 또는 이름으로 불러온다. */
const excuteExampleFunction = (index) => {
    switch(index){
        case 0:
        case tabs[0]:
            showExample.ofTetromino();
            break;
        case 1:
        case tabs[1]:
            showExample.ofGravity();
            break;
        case 2:
        case tabs[2]:
            showExample.ofLineClear();
            break;
        case 3:
        case tabs[3]:
            showExample.ofMove();
            break;
        case 4:
        case tabs[4]:
            showExample.ofGhostPiece();
            break;
        case 5:
        case tabs[5]:
            showExample.ofHold();
            break;
        case 6:
        case tabs[6]:
            showExample.ofGameOver();
            break;
    }
}
/** 설명 예시 바탕 그리기
 * @function drawExample
 * @param {keyof EXAMPLES} example 10×17 숫자 배열 [ -1: 빈 하늘, 0–7: 땅, 8–15: 그림자]*/
const drawExample = (example) => {
    let innerHTML = '';
    example.forEach((row, i) => {
        row.forEach((val, j) => {
            innerHTML += val>>>31? `<div class="grid" style="grid-area: ${i+1}/${j+1}/span 1/span 1;"></div>\n`
                        : val>>>3? `<div class="block ${tetrominoes[val&7]} shadow" style="grid-area: ${i+1}/${j+1}/span 1/span 1;"><div class="innerBlock"></div></div>\n`
                        : `<div class="block ${tetrominoes[val&7]}" style="grid-area: ${i+1}/${j+1}/span 1/span 1;"><div class="innerBlock"></div></div>\n`;
        });
    });
    example_board.innerHTML = innerHTML;
};
/** 흐림 애니메이션의 동작 상태를 가리킨다.
 * @type {boolean} */
let bluringOn = false;
/** 흐림 애니메이션의 동작 상태 가져오기
 * @function isBluringOn
 * @returns {boolean} 애니메이션을 이어 할 때는 True를, 그칠 때는 False를 돌려 준다. */
const isBluringOn = () => {
    return bluringOn;
};
/** 흐림 애니메이션의 동작 상대 설정
 * @function setBluringOn
 * @param {boolean} bool 애니메이션을 이어 하려거든 True를, 그치려거든 False를 넣는다. */
const setBluringOn = (bool) => {
    if(typeof bool === 'boolean')
        bluringOn = bool;
}
/** 설명 예시의 흐림 애니메이션
 * @async
 * @function blurExampleAnimation
 * @returns {Promise<boolean>} 애니메이션을 끝까지 마쳤다면 True를, 못 마쳤다면 False를 돌려 준다. */
const blurExampleAnimation = async () => {
    setBluringOn(true);
    let setOpacity = (elements, value) => {
        for(let element of elements)
            element.style.opacity = value;
    };
    return makeAnimation(1, 0.4, 0.05, example_board.getElementsByTagName('div'), 300, setOpacity, isBluringOn);
};
/** 설명 예시의 흐림 애니메이션 중단
 * @function stopExampleAnimation */
const stopExampleAnimation = () => {
    setBluringOn(false);
    example_board.style.opacity = 1;
};
/** 설명 예시 띄우기
 * @function setExample
 * @param {keyof EXAMPLES} example 그릴 예시의 10×17 행렬
 * @param {Node} [additionalNodes] 덧그릴 HTML Node */
const setExample = (example, ...additionalNodes) => {
    stopExampleAnimation();
    blurExampleAnimation()
        .then((value) => {
            if(value || !value){
                drawExample(example);
                for(let additionalNode of additionalNodes)
                    example_board.appendChild(additionalNode);
            }
        });
};
/** 설명 항목 마우스오버 콜백 함수
 * @function focusArticle
 * @param {MouseEvent} event
 * @returns {boolean} 동작에 성공하면 True를, 실패하면 False를 돌려 준다.
 * @description 설명 항목에 흰 테두리를 치고, 글씨를 키운다. 설명에 해당하는 보기 그림을 띄운다. */
const overArticle = function(event){
    if(!isAnyInputOnArticle()){
        setAnyInputOnArticle(true);
        return false;
    }
    if(current_tab === tabs.indexOf(this.id))
        return false;
    return focusArticle(this);
};
/** 설명 항목 키보드 입력 콜백 함수
 * @function keydownAricle
 * @param {KeyboardEvent} event */
const keydownAricle = function(event){
    switch(event.code){
        case 'ArrowRight':
        case 'ArrowDown':
            setAnyInputOnArticle(true);
            current_tab = ++current_tab % 7;
            focusCurrentArticle();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            setAnyInputOnArticle(true);
            current_tab = (--current_tab + 7) % 7;
            focusCurrentArticle()
            break;
    }
};
/** 머물고 있는 항목 살펴보기
 * @function focusCurrentArticle */
const focusCurrentArticle = () => {
    focusArticle(document.getElementsByClassName("article")[current_tab]);
};
/** 설명 항목 살펴보기
 * @function focusArticle
 * @param {HTMLElement} element 살펴볼 항목의 HTML 요소
 * @returns {boolean} 동작에 성공하면 True를, 실패하면 False를 돌려 준다.
 * @description 설명 항목에 흰 테두리를 치고, 글씨를 키운다. 설명에 해당하는 보기 그림을 띄운다. */
const focusArticle = (element) => {
    if(!element.classList.contains('article')) return false;

    for(let article of document.getElementsByClassName("article")){
        article.style.borderColor = 'transparent';
        if('english' === getLanguage())
            article.getElementsByClassName('article_title')[0].style.fontSize = `2${unitLen()}`;
        else
            article.getElementsByClassName('article_title')[0].style.fontSize = `2.1${unitLen()}`;
        article.getElementsByClassName('article_content')[0].style.fontSize = `2${unitLen()}`;
    }
    element.style.borderColor = 'white';
    if('english' === getLanguage())
        element.getElementsByClassName('article_title')[0].style.fontSize = `2.1${unitLen()}`;
    else
        element.getElementsByClassName('article_title')[0].style.fontSize = `2.2${unitLen()}`;
    element.getElementsByClassName('article_content')[0].style.fontSize = `2.1${unitLen()}`;

    excuteExampleFunction(element.id);
    current_tab = tabs.indexOf(element.id);
    adjustArticleLineHeight();

    return true;
};
/** 윈도우 크기 조절 콜백 함수
 * @function resizeWindowPage1
 * @param {UIEvent} event */
const resizeWindowPage1 = function(event){
    focusCurrentArticle();
};
/** 설명 항목 줄 간격 조정
 * @function adjustArticleLineHeight */
const adjustArticleLineHeight = () => {
    let articles = document.getElementsByClassName('article');
    for(let article of articles){
        let border = Number.parseFloat(window.getComputedStyle(article).borderWidth);
        let item = article.getElementsByClassName('article_item')[0];
        let lineHeight = 2.4;
        article.style.lineHeight = `${lineHeight}${unitLen()}`;
        if(isPortrait()){
            let objective = article.getBoundingClientRect().width - 2*border;
            let item_width = item.getBoundingClientRect().width;
            while(objective < item_width){
                lineHeight = Number.parseFloat((lineHeight - 0.01).toFixed(2));
                article.style.lineHeight = `${lineHeight}${unitLen()}`;
                let new_width = item.getBoundingClientRect().width;
                if(new_width === item_width)
                    break;
                else
                    item_width = new_width;
                if(lineHeight === 0) break;
            }
        }else{
            let objective = article.getBoundingClientRect().height - 2*border;
            let item_height = item.getBoundingClientRect().height;
            while(objective < item_height){
                lineHeight = Number.parseFloat((lineHeight - 0.01).toFixed(2));
                article.style.lineHeight = `${lineHeight}${unitLen()}`;
                let new_height = item.getBoundingClientRect().height;
                if(new_height === item_height)
                    break;
                else
                    item_height = new_height;
                if(lineHeight === 0) break;
            }                                        
        }
    }
};
/***************************** 키보드 설정 페이지 관련 *****************************/
/** 자판 안내 페이지 열기
 * @function openKeybordPage */
const openKeybordPage = () => {
    openPageById('page2');
    addResizeEvent(resizeWindowPage2);
    adjustAriticleWidth();
};
/** 자판 안내 페이지 닫기
 * @function closeKeyboardPage */
const closeKeyboardPage = () => {
    closePageById('page2');
    removeResizeEvent( resizeWindowPage2);
};
/** 윈도우 크기 조절 콜백 함수
 * @function resizeWindowPage2
 * @param {UIEvent} event */
const resizeWindowPage2 = function(event){
    adjustAriticleWidth();
};
/** 기능 항목 자간 조정
 * @function adjustAriticleWidth */
const adjustAriticleWidth = () => {
    let list = document.getElementsByClassName("key_fuction");
    let max_width = 0;
    for(let text of list){
        text.style.width = '';
        let width = (isPortrait())? text.getBoundingClientRect().height : text.getBoundingClientRect().width;
        if(width > max_width)
            max_width = width;
    }
    for(let text of list){
        text.style.width = `${max_width}px`;
    }
};
/***************************** 점수 기준 페이지 관련 *****************************/
/** 점수 기준 페이지 열기
 * @function openScoringPage */
const openScoringPage = () => {
    openPageById('page3');
};
/** 점수 기준 페이지 닫기
 * @function closeScoringPage */
const closeScoringPage = () => {
    closePageById('page3');
};