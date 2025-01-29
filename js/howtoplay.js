import { BLOCKS } from "./model.js";
import { getLanguage } from "./option.js";
import { playHoldSFX, playMovingSFX } from "./soundController.js";
import { openModal, 
        closeModal, 
        addMouseInput, 
        removeMouseInput, 
        findButton, 
        addMouseOver,
        removeMouseOver,
        makeAnimation,
        isAllTrue
    } from "./utility.js";
/** 현재 열려 있는 페이지
 * @type {number} */
let current_page = 1;
/** 게임 방법 모달 열기
 * @function openHowToPlayModal */
export const openHowToPlayModal = () => {
    addMouseInput(openModal("howtoplay"), clickHowToPlay, overHowToPlay);
    openExplanationPage();
};
/** 게임 방법 모달 닫기
 * @function closeHowToPlayModal */
const closeHowToPlayModal = () => {
    removeMouseInput(closeModal("howtoplay"), clickHowToPlay, overHowToPlay);
    closeExplanationPage();
};
const closeCurrentPage = () => {
    current_page = 1;
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
            break;
        case 'right_arrow':
            playMovingSFX();
            break;
    }
};
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
// 게임 설명 페이지 관련
let explanationPageOpen = false;
const isExplanationPageOpen = () => {
    return explanationPageOpen;
}
const setExplanationPageOpen = (bool) => {
    if(typeof bool === 'boolean')
        explanationPageOpen = bool;
}
const openExplanationPage = () => {
    for(let element of openModal("page1").getElementsByClassName("article"))
        addMouseOver(element, overArticle);
    focusCurrentArticle();
    setbluringOn(false);
};
const closeExplanationPage = () => {
    for(let element of closeModal("page1").getElementsByClassName("article"))
        removeMouseOver(element, overArticle);
    current_tab = 0;
    setExplanationPageOpen(false);
    drawExample(EXAMPLES.NOTHING);
}
/** 테트리미노의 종류 목록
 * @constant tetrominoes
 * @type {string[]} 
 * @description "model.BLOCKS"의 키 값에 'white'를 마지막 값으로 더한 배열이다. */
const tetrominoes = [...Object.keys(BLOCKS), 'white'];
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
        // [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        // [-1,  3,  3,  3,  3, -1, -1, -1, -1, -1],
        // [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        // [-1, -1, -1, -1, -1, -1,  0,  0, -1, -1],
        // [-1, -1,  1, -1, -1, -1,  0,  0, -1, -1],
        // [-1, -1,  1,  1,  1, -1, -1, -1, -1, -1],
        // [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        // [-1, -1, -1, -1, -1, -1, -1,  2, -1, -1],
        // [-1, -1, -1, -1, -1,  2,  2,  2, -1, -1],
        // [-1, -1,  4,  4, -1, -1, -1, -1, -1, -1],
        // [-1,  4,  4, -1, -1, -1, -1, -1, -1, -1],
        // [-1, -1, -1, -1, -1, -1,  5,  5, -1, -1],
        // [-1, -1, -1, -1, -1, -1, -1,  5,  5, -1],
        // [-1, -1, -1,  6, -1, -1, -1, -1, -1, -1],
        // [-1, -1,  6,  6,  6, -1, -1, -1, -1, -1],
        // [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        // [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
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
        [ 1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [ 1,  1,  1, -1, -1, -1, -1, -1, -1, -1]
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
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    ],
    MOVE: [
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
    ],
    GHOST_PIECE: [
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
    ],
    HOLD: [
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
    ],
    GAME_OVER: [
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
/** 설명 예시 함수 모음 */
const showExample = {
    ofTetromino: () => {
        setExample(EXAMPLES.TETROMINO);
    },
    ofGravity: () => {
        setExample(EXAMPLES.GRAVITY);
    },
    ofLineClear: () => {
        setExample(EXAMPLES.LINE_CLEAR);
    },
    ofMove: () => {
        setExample(EXAMPLES.MOVE);
    },
    ofGhostPiece: () => {
        setExample(EXAMPLES.GHOST_PIECE);
    },
    ofHold: () => {
        setExample(EXAMPLES.HOLD);
    },
    ofGameOver: () => {
        setExample(EXAMPLES.GAME_OVER);
    }
};
let current_tab = 0;
const tabs = Object.keys(showExample);
const excuteExampleFunction = (value) => {
    switch(value){
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
/** 게임 방법에 설명 예시 그리기
 * @function drawExample
 * @param {keyof EXAMPLES} example 10×17 숫자 배열 [ -1: 빈 하늘, 0–7: 땅, 8–15: 그림자]*/
const drawExample = (example) => {
    let innerHTML = '';
    example.forEach(row => {
        row.forEach(val => {
            innerHTML += val>>>31? `<div class="grid"></div>\n`
                        : val>>>3? `<div class="block ${tetrominoes[val&7]} shadow"><div class="innerBlock"></div></div>\n`
                        : `<div class="block ${tetrominoes[val&7]}"><div class="innerBlock"></div></div>\n`;
        });
    });
    example_board.innerHTML = innerHTML;
};
let bluringOn = false;
const isbluringOn = () => {
    return bluringOn;
};
const setbluringOn = (bool) => {
    if(typeof bool === 'boolean')
        bluringOn = bool;
}
const blurExampleAnimation = async () => {
    setbluringOn(true);
    let setOpacity = (elements, value) => {
        for(let element of elements)
            element.style.opacity = value;
    };
    return makeAnimation(1, 0, 0.05, example_board.getElementsByTagName('div'), 300, setOpacity, isbluringOn);
};
const stopExampleAnimation = () => {
    setbluringOn(false);
    example_board.style.opacity = 1;
};
const setExample = (example, additionalNode) => {
    stopExampleAnimation();
    blurExampleAnimation()
        .then((value) => {
            if(value || !value){
                drawExample(example);
                if(additionalNode != undefined)
                    example_board.appendChild(additionalNode);
            }
        });
};
/** 설명 항목 마우스오버 콜백 함수
 * @function focusArticle
 * @param {MouseEvent} event
 * @returns {boolean} 동작에 성공하면 True를, 실패하면 False를 돌려 준다.
 * @description 설명 칸에 흰 테두리를 치고, 글씨를 키운다. 설명에 해당하는 보기 그림을 띄운다. */
const overArticle = function(event){
    if(!isExplanationPageOpen()){
        setExplanationPageOpen(true);
        return false;
    }
    if(current_tab === tabs.indexOf(this.id))
        return false;
    return focusArticle(this);
};
const focusCurrentArticle = () => {
    focusArticle(document.getElementsByClassName("article")[current_tab]);
};
/**
 * @function focusArticle
 * @param {HTMLElement} element 
 * @returns {boolean} 동작에 성공하면 True를, 실패하면 False를 돌려 준다.
 */
const focusArticle = (element) => {
    if(!element.classList.contains('article')) return false;

    for(let article of document.getElementsByClassName("article")){
        article.style.borderColor = 'transparent';
        if('english' === getLanguage())
            article.getElementsByClassName('article_title')[0].style.fontSize = '2dvh';
        else
            article.getElementsByClassName('article_title')[0].style.fontSize = '2.1dvh';
        article.getElementsByClassName('article_content')[0].style.fontSize = '2dvh';
    }
    element.style.borderColor = 'white';
    if('english' === getLanguage())
        element.getElementsByClassName('article_title')[0].style.fontSize = '2.1dvh';
    else
        element.getElementsByClassName('article_title')[0].style.fontSize = '2.2dvh';            
    element.getElementsByClassName('article_content')[0].style.fontSize = '2.1dvh';

    excuteExampleFunction(element.id);
    current_tab = tabs.indexOf(element.id);

    return true;
};
openHowToPlayModal();