import {
    addKeyboardInput,
    removeKeyboardInput,
    addMouseInput,
    removeMouseInput,
    removeMouseClick,
    addMouseClick,
    addResizeEvent,
    removeResizeEvent,
    isPortrait,
    openModal,
    closeModal,
    goFullScreen
} from "./utility.js";
import { getKeyset } from "./option.js";
import {
    getMark,
    updateMarkByLines,
    updateMarkBySoftDrop,
    updateMarkByHardDrop,
    updateTSpin,
    getDelay,
    updateScoreByPerfectClear,
    initiateMark
} from "./scoring.js";
import {
    playBGM,
    pauseBGM,
    resetPlayList,
    playLockingSFX,
    playMovingSFX,
    playRotatingSFX,
    playHoldSFX,
    playDeletingSFX,
    playNextBGM,
    playPrevBGM,
    updatePlaybackRate
} from "./soundController.js";
import {
    openPauseModal,
    manageGameOverModal
} from "./modalController.js";
import { 
    block, 
    drawBackBoard, 
    drawGameBoard,
    removeGameBoard,
    drawPlayingBlock,
    removePlayingBlock,
    deleteRows,
    drawNext,
    removeNext,
    drawHold,
    removeHold,
    lockBlock,
    findFilledRows,
    wallKick,
    isPerfectClear,
    initiateTetrisMap
} from "./blockFunction.js";
import {
    lockingBlockAnimation,
    cancelLockingBlockAnimation,
    deletingRowsAnimation,
    hardDropingAnimation,
    lockedBlockAnimation
} from "./blockAnimation.js";
import {
    showMark,
    hideMark,
    setPlaySymbol,
    setPauseSymbol,
} from "./textFunction.js";
import {
    showLevelUpAnimation,
    showScoreTextAnimation,
    countDownTextAnimation
} from "./textAnimation.js";
/***************************** 게임 진행 변수 *****************************/
/** 테트로미노가 땅에 떨어져 땅으로 굳기까지의 시간
 * @readonly
 * @constant lockDelay
 * @type {number} */
const lockDelay = 1000;
/** 잠시 멈춤 상태인지 여부를 가리킨다.
 * @type {boolean} */
let pause = true;
/** 테트로미노가 떨어지는 시간을 조절하는 SetTimeout()의 ID를 가리킨다.
 * @type {number} */
let runTimer;
/** 현재·다음·홀드 테트로미노
 * @property {block} pres — 떨어지는 테트로미노
 * @property {block[]} next — 다음 테트로미노 배열
 * @property {block} hold — 홀드 테트로미노 */
const history = {
    /** 떨어지는 테트로미노
     * @type {block} */
    pres: null,
    /** 다음 테트로미노 배열
     * @type {block[]} */
    next: Array.from({length:5}, () => null),
    /** 홀드 테트로미노
     * @type {block} */
    hold: null
};
/***************************** 외부 입력 변수 *****************************/
/** 게임을 하는 중 키보드 입력을 받는 상태인지 여부를 가리킨다. 
 * @type {boolean} */
let keyboardAction = true;
/** 돌아온 기회에 hold 기능을 썼는지 여부를 가리킨다.
 * @type {boolean}
 * @description hold 기능을 아직 안 써서 쓸 수 있다면 True를, 이미 써서 쓰지 못한다면 False를 저장한다. */
let hold = true;
/** 키보드 및 터치 패드의 연속 입력 지연 시간 기본값
 * @type {number} */
const initial_delay = 300;
/** 키보드 및 터치 패드의 연속 입력 지연 시간을 가리킨다.(ms) */
const touchDelay = {
    moveRight: initial_delay,
    moveLeft: initial_delay,
    rotateRight: initial_delay,
    rotateLeft: initial_delay,
    softDrop: initial_delay,
    /** 입력 지연 시간 변수 초기화
     * @function initialize
     * @memberof touchDelay
     * @param {"moveRight"|"moveLeft"|"rotateRight"|"rotateLeft"|"softDrop"} action */
    initialize: (action) => { 
        if(typeof touchDelay[action] === "number")
            touchDelay[action] = initial_delay;
    },
    /** 입력 지연 시간 변수 바꾸기
     * @function set
     * @memberof touchDelay
     * @param {"moveRight"|"moveLeft"|"rotateRight"|"rotateLeft"|"softDrop"} action 
     * @param {number} delay (ms) */
    set: (action, delay) => {
        if(typeof touchDelay[action] === "number")
            touchDelay[action] = delay;
    },
    /** 입력 지연 시간 변수 가져오기
     * @function get
     * @memberof touchDelay
     * @param {"moveRight"|"moveLeft"|"rotateRight"|"rotateLeft"|"softDrop"} action 
     * @returns {number} */
    get: (action) => {
        if(typeof touchDelay[action] === "number")
            return touchDelay[action];
    }
};
/** 키보드 및 터치 패드의 연속 입력 시간을 조절하는 SetTimeout()의 ID를 가리킨다. */
const touchTimer = {
    moveRight: 0,
    moveLeft: 0,
    rotateRight: 0,
    rotateLeft: 0,
    softDrop: 0,
    /** 입력 지연 시간 타이머 ID 초기화
     * @function initialize
     * @memberof touchTimer
     * @param {"moveRight"|"moveLeft"|"rotateRight"|"rotateLeft"|"softDrop"} action */
    initialize: (action) => {
        if(typeof touchTimer[action] === "number")
            touchTimer[action] = 0;
    },
    /** 입력 지연 시간 타이머 설정
     * @function set
     * @memberof touchTimer
     * @param {"moveRight"|"moveLeft"|"rotateRight"|"rotateLeft"|"softDrop"} action */
    set: (action) => {
        if(typeof touchTimer[action] === "number"){
            touchTimer[action] = setTimeout(touchButton[action], touchDelay.get(action));
            touchDelay.set(action, 30);
        }
    },
    /** 입력 지연 시간 타이머ID 가져오기
     * @function get
     * @memberof touchTimer
     * @param {"moveRight"|"moveLeft"|"rotateRight"|"rotateLeft"|"softDrop"} action
     * @returns {number} */
    get: (action) => {
        if(typeof touchTimer[action] === "number")
            return touchTimer[action];
    },
    /** 입력 지연 시간 타이머 해제
     * @function clear
     * @memberof touchTimer
     * @param {"moveRight"|"moveLeft"|"rotateRight"|"rotateLeft"|"softDrop"} action */
    clear: (action) => {
        if(typeof touchTimer[action] === "number"){
            clearTimeout(touchTimer[action]);
            touchTimer.initialize(action);
            touchDelay.initialize(action);
        }
    }
};
/***************************** 외부 입력 함수 *****************************/
/** 테트로미노 조작 함수 모음 */
const action = {
    /** 오른쪽으로 옮기기
     * @function moveRight
     * @memberof action
     * @returns {boolean} 블록을 옮기면 True를, 땅이 부딪혀 못 옮기면 False를 돌려 준다. */
    moveRight: () => {
        // 지우기
        removePlayingBlock(history.pres);
        cancelLockingBlockAnimation();
        //옮기기
        history.pres.moveRight();
        if(history.pres.isCrash()){
            history.pres.moveLeft();
            drawPlayingBlock(history.pres);
            return false;
        }
        // T-스핀 아님
        updateTSpin(false);
        //그리기
        drawPlayingBlock(history.pres);
        return true;
    },
    /** 왼쪽으로 옮기기
     * @function moveLeft
     * @memberof action
     * @returns {boolean} 블록을 옮기면 True를, 땅이 부딪혀 못 옮기면 False를 돌려 준다. */
    moveLeft: () => {
        // 지우기
        removePlayingBlock(history.pres);
        cancelLockingBlockAnimation();
        // 옮기기
        history.pres.moveLeft();
        if(history.pres.isCrash()){
            history.pres.moveRight();
            drawPlayingBlock(history.pres);
            return false;
        }
        // T-스핀 아님
        updateTSpin(false);
        //그리기
        drawPlayingBlock(history.pres);
        return true;
    },
    /** 오른쪽으로 돌리기
     * @function rotateRight
     * @memberof action
     * @returns {boolean} 블록을 돌리면 True를, 땅이 부딪혀 못 돌리면 False를 돌려 준다. */
    rotateRight: () => {
        // 지우기
        removePlayingBlock(history.pres);
        cancelLockingBlockAnimation();
        // 돌리기
        history.pres.rotateR();
        if(history.pres.isCrash()){
            if(!wallKick(history.pres, "right")){
                history.pres.rotateL();
                drawPlayingBlock(history.pres);
                return false;
            }
        }
        // T-스핀인지 가늠
        updateTSpin(history.pres.is3CornerT());
        //그리기
        drawPlayingBlock(history.pres);
        return true;
    },
    /** 왼쪽으로 돌리기
     * @function rotateLeft
     * @memberof action
     * @returns {boolean} 블록을 돌리면 True를, 땅이 부딪혀 못 돌리면 False를 돌려 준다. */
    rotateLeft: () => {
        // 지우기
        removePlayingBlock(history.pres);
        cancelLockingBlockAnimation();
        // 돌리기
        history.pres.rotateL();
        if(history.pres.isCrash()){
            if(!wallKick(history.pres, "left")){
                history.pres.rotateR();
                drawPlayingBlock(history.pres);
                return false;
            }
        }
        // T-스핀인지 가늠
        updateTSpin(history.pres.is3CornerT());
        //그리기
        drawPlayingBlock(history.pres);
        return true;
    },
    /** 아래로 내리기
     * @async
     * @function softDrop
     * @memberof action
     * @returns {Promise<boolean>} 블록을 내리면 True를, 땅이 부딪혀 못 내리면 False를 돌려 준다. */
    softDrop: async () => {
        // hangOn 안에 cancelLockingBlockAnimation 함수가 들어 있음
        hangOn();
        let prev_height = history.pres.position.y;
        // dropingblock 안에 removePlayingBlock과 drawPlayingBlock과 updateTSpin(false)가 들어 있음
        return dropingblock()
            .then((result) => {
                switch(result){
                    case true:
                        let distance = history.pres.position.y - prev_height;
                        updateMarkBySoftDrop(distance);
                        showMark(getMark());
                    default:
                        playGame();
                        return result;
                }
            });
    },
    /** 땅에 내리꽂기
     * @async
     * @function hardDrop
     * @memberof action
     * @returns {Promise<boolean>} 블록이 땅에 내려와 꽂히면 True를 돌려 준다. */
    hardDrop: async () => {
        removePlayingBlock(history.pres);
        hangOn();
        let prev_height = history.pres.position.y;
        return hardDropingAnimation(history.pres)
            .then(() => {
                history.pres.hardDrop();
                let distance = history.pres.position.y - prev_height;
                updateMarkByHardDrop(distance);
                if(distance > 0) updateTSpin(false);
                showMark(getMark());
                return lockTheDropedBlock();
            })
            .then(() => {
                playGame();
                return true;
            });
    },
    /** 보관하기
     * @function hold
     * @memberof action
     * @returns {boolean} 블록을 보관하면 True를, 이미 한 번 보관하여 보관 못하면 False를 돌려 준다. */
    hold: () => {
        if(!hold) return false;
        // 지우기
        removePlayingBlock(history.pres);
        cancelLockingBlockAnimation();
        // 보관 및 교환
        let tmp = history.pres;
        if(history.hold == null){
            nextBlock();
        }else{               
            history.pres = history.hold;
        }
        history.hold = tmp;
        history.hold.initiate();
        hold = false; 
        drawHold(history.hold);
        // T-스핀 아님
        updateTSpin(false);
        //그리기
        drawPlayingBlock(history.pres);
        return true;
    }
};
/** 게임 조작 키보드 입력 추가
 * @function addKeyControl */
const addKeyControl = () => {
    addKeyboardInput(document, keydownEvent);
    document.addEventListener("keyup", keyupEvent);
};
/** 게임 조작 키보드 입력 삭제
 * @function removeKeyControl */
const removeKeyControl = () => {
    removeKeyboardInput(document, keydownEvent);
    document.removeEventListener("keyup", keyupEvent);
};
/** 게임 조작 키보드 입력 콜백 함수
 * @function keydownEvent
 * @param {KeyboardEvent} event */
const keydownEvent = function(event){
    // console.log(event);
    switch(event.code){
        case getKeyset('pause'):
        case 'Escape':
            if(keyboardAction) break;
            playMovingSFX();
            pauseGame();
            break;
        case getKeyset('move_right'):
            if(event.repeat) break;
            if(touchTimer.get("moveRight")) break;
            touchButton.moveRight();
            break;
        case getKeyset('move_left'):
            if(event.repeat) break;
            if(touchTimer.get("moveLeft")) break;
            touchButton.moveLeft();
            break;
        case getKeyset('rotate_right'):
            if(event.repeat) break;
            if(touchTimer.get("rotateRight")) break;
            touchButton.rotateRight();
            break;
        case getKeyset('rotate_left'):
            if(event.repeat) break;
            if(touchTimer.get("rotateLeft")) break;
            touchButton.rotateLeft();
            break;
        case getKeyset('soft_drop'):
            if(event.repeat) break;
            if(touchTimer.get("softDrop")) break;
            touchButton.softDrop();
            break;
        case getKeyset('hard_drop'):
            if(event.repeat) break;
            touchButton.hardDrop();
            break;
        case getKeyset('hold'):
            if(event.repeat) break;
            touchButton.hold();
            break;
    }
};
/** 키에서 손 떼기 콜백 함수 
 * @function keyupEvent
 * @param {keyboardEvent} event */
const keyupEvent = function(event){
    switch(event.code){
        case getKeyset('move_right'):
            touchEnd.moveRight();
            break;
        case getKeyset('move_left'):
            touchEnd.moveLeft();
            break;
        case getKeyset('rotate_right'):
            touchEnd.rotateRight();
            break;
        case getKeyset('rotate_left'):
            touchEnd.rotateLeft();
            break;
        case getKeyset('soft_drop'):
            touchEnd.softDrop();
            break;
        case getKeyset('hard_drop'):
            touchEnd.hardDrop();
            break;
        case getKeyset('hold'):
            touchEnd.hold();
            break;
    }
};
/** 터치 패드 입력 추가
 * @function addTouchButtonEvent */
const addTouchButtonEvent = () => {
    for(let key in touchButton){
        if(document.getElementById(`pad_${key}`) == undefined) continue;
        document.getElementById(`pad_${key}`)
                .addEventListener("touchstart", touchButton[key]);
    }
    for(let key in touchEnd){
        if(document.getElementById(`pad_${key}`) == undefined) continue;
        document.getElementById(`pad_${key}`)
                .addEventListener("touchend", touchEnd[key]);
    }
};
/** 터치 패드 입력 삭제
 * @function removeTouchButtonEvent */
const removeTouchButtonEvent = () => {
    for(let key in touchButton){
        if(document.getElementById(`pad_${key}`) == undefined) continue;
        document.getElementById(`pad_${key}`)
                .removeEventListener("touchstart", touchButton[key]);
    }
    for(let key in touchEnd){
        if(document.getElementById(`pad_${key}`) == undefined) continue;
        document.getElementById(`pad_${key}`)
                .removeEventListener("touchstart", touchEnd[key]);
    }
};
/** 터치 패드 손 대기 콜백 함수 모음 */
const touchButton = {
    /** 오른쪽으로 옮기기
     * @function moveRight
     * @memberof touchButton
     * @param {TouchEvent} event */
    moveRight: function(event){
        if(keyboardAction){
            lightOn("pad_moveRight");
            if(action.moveRight()) playMovingSFX();
            touchTimer.set("moveRight");
        }else{
            touchTimer.clear("moveRight");
        }
    },
    /** 왼쪽으로 옮기기
     * @function moveLeft
     * @memberof touchButton
     * @param {TouchEvent} event */
    moveLeft: function(event){
        if(keyboardAction){
            lightOn("pad_moveLeft");
            if(action.moveLeft()) playMovingSFX();
            touchTimer.set("moveLeft");
        }else{
            touchTimer.clear("moveLeft");
        }
    },
    /** 오른쪽으로 돌리기
     * @function rotateRight
     * @memberof touchButton
     * @param {TouchEvent} event */
    rotateRight: function(event){
        if(keyboardAction){
            lightOn("pad_rotateRight");
            if(action.rotateRight()) playRotatingSFX();
            touchTimer.set("rotateRight");
        }else{
            touchTimer.clear("rotateRight");
        }
    },
    /** 왼쪽으로 돌리기
     * @function rotateLeft
     * @memberof touchButton
     * @param {TouchEvent} event */
    rotateLeft: function(event){
        if(keyboardAction){
            lightOn("pad_rotateLeft");
            if(action.rotateLeft()) playRotatingSFX();
            touchTimer.set("rotateLeft");
        }else{
            touchTimer.clear("rotateLeft");
        }
    },
    /** 아래로 내리기
     * @function softDrop
     * @memberof touchButton
     * @param {TouchEvent} event */
    softDrop: function(event){
        if(keyboardAction){
            lightOn("pad_softDrop");
            if(action.softDrop()) playMovingSFX();
            touchTimer.set("softDrop");
        }else{
            touchTimer.clear("softDrop");
        }
    },
    /** 땅에 내리꽂기
     * @function hardDrop
     * @memberof touchButton
     * @param {TouchEvent} event */
    hardDrop: function(event){
        if(keyboardAction){
            lightOn("pad_hardDrop");
            action.hardDrop();
        }
    },
    /** 보관하기
     * @function hold
     * @memberof touchButton
     * @param {TouchEvent} event */
    hold: function(event){
        if(keyboardAction){
            lightOn("pad_hold");
            if(action.hold()) playHoldSFX();
        }
    }
};
/** 터치 패드 손 떼기 콜백 함수 모음 */
const touchEnd = {
    /** 오른쪽으로 옮기기
     * @function moveRight
     * @memberof touchEnd
     * @param {TouchEvent} event */
    moveRight: function(event){
        touchTimer.clear("moveRight");
        lightOff("pad_moveRight");
    },
    /** 왼쪽으로 옮기기
     * @function moveLeft
     * @memberof touchEnd
     * @param {TouchEvent} event */
    moveLeft: function(event){
        touchTimer.clear("moveLeft");
        lightOff("pad_moveLeft");
    },
    /** 오른쪽으로 돌리기
     * @function rotateRight
     * @memberof touchEnd
     * @param {TouchEvent} event */
    rotateRight: function(event){
        touchTimer.clear("rotateRight");
        lightOff("pad_rotateRight");
    },
    /** 왼쪽으로 돌리기
     * @function rotateLeft
     * @memberof touchEnd
     * @param {TouchEvent} event */
    rotateLeft: function(event){
        touchTimer.clear("rotateLeft");
        lightOff("pad_rotateLeft");
    },
    /** 아래로 내리기
     * @function softDrop
     * @memberof touchEnd
     * @param {TouchEvent} event */
    softDrop: function(event){
        touchTimer.clear("softDrop");
        lightOff("pad_softDrop");
    },
    /** 땅에 내리꽂기
     * @function hardDrop
     * @memberof touchEnd
     * @param {TouchEvent} event */
    hardDrop: function(event){
        lightOff("pad_hardDrop");
    },
    /** 보관하기
     * @function hold
     * @memberof touchEnd
     * @param {TouchEvent} event */
    hold: function(event){
        lightOff("pad_hold");
    }
};
/** 터치 버튼 불 켜기
 * @function lightOn
 * @param {string} id 터치 버튼의 HTML 요소 아이디 */
const lightOn = (id) => {
    if(document.getElementById(id) != undefined)
        document.getElementById(id).style.opacity = 1;
};
/** 터치 버튼 불 끄기
 * @function lightOn
 * @param {string} id 터치 버튼의 HTML 요소 아이디 */
const lightOff = (id) => {
    if(document.getElementById(id) != undefined)
        document.getElementById(id).style.opacity = 0.3;
};
/** 일시 정지 버튼 클릭 입력 추가
 * @function addClickButton */
const addClickButton = () => {
    addMouseInput(document.getElementById("pauseButton"), clickPauseEvent, overPauseEvent);
    addMouseClick(document.getElementById("nextMusic"), clickRightArrow);
    addMouseClick(document.getElementById("prevMusic"), clickLeftArrow);
};
/** 일시 정지 버튼 클릭 입력 삭제
 * @function removeClickButton */
const removeClickButton = () => {
    removeMouseInput(document.getElementById("pauseButton"), clickPauseEvent, overPauseEvent);
    removeMouseClick(document.getElementById("nextMusic"), clickRightArrow);
    removeMouseClick(document.getElementById("prevMusic"), clickLeftArrow);
};
/** 일시 정지 버튼 클릭 콜백 함수
 * @function clickEvent
 * @param {MouseEvent} event */
const clickPauseEvent = function(event){
    event.preventDefault();
    if(!pause){
        playMovingSFX();
        pauseGame();
    }
};
/** 일시 정지 버튼 오버 콜백 함수
 * @function overEvent
 * @param {MouseEvent} event */
const overPauseEvent = function(event){
    event.preventDefault();
    if(!pause)
        playHoldSFX();
};
/** 배경 음악 오른쪽 버튼 클릭 콜백 함수
 * @function clickRightArrow
 * @param {MouseEvent} event */
const clickRightArrow = function(event){
    event.preventDefault();
    playNextBGM();
};
/** 배경 음악 왼쪽 버튼 클릭 콜백 함수
 * @function clickLeftArrow
 * @param {MouseEvent} event */
const clickLeftArrow = function(event){
    event.preventDefault();
    playPrevBGM();
};
/***************************** 게임 진행 함수 *****************************/
/** 현재·다음·홀드 테트로미노 히스토리 초기화
 * @function initiateHistory */
const initiateHistory = () => {
    history.pres = new block();
    history.next.forEach((v, i) => {history.next[i] = new block();});
    history.hold = null;
    hold = true;
    history.pres.willCrash();
};
/** 다음 블록 꺼내 오기.
 * @function nextBlock
 * @description 다음 블록 가운데 첫째 것이 현재 블록이 된다. 새 테트로미노가 나올 자리에 이미 땅이 올라와 있다면 게임이 끝난다. */
const nextBlock = () => {
    history.pres = history.next.shift();
    history.next.push(new block());
    hold = true;
    drawNext(history.next);
    if(history.pres.isCrash())
        gameOver();
};
/** 테트로미노 내리기
 * @async
 * @function dropingblock 
 * @return {Promise<boolean>} 테트로미노가 내리면 true를 돌려 주고, 굳으면 false를 돌려 준다.
 * @description 테트로미노를 한 눈 내리며, 땅 탓에 내리지 못하면 그 자리에서 땅으로 굳는다. */
const dropingblock = async () => {
    removePlayingBlock(history.pres);
    history.pres.moveDown();
    //바닥에 닿았을 때
    let blockCrash = await new Promise((resolve) => {
        if(history.pres.isCrash()){
            history.pres.moveUp();
            keyboardAction = false;
            drawPlayingBlock(history.pres);
            resolve(lockedBlockAnimation(history.pres, 120)
                .then(() => {return lockTheDropedBlock();}));
        }else{
            updateTSpin(false);
            resolve(false);
        }
    });
    if(blockCrash || !blockCrash) {
        drawPlayingBlock(history.pres)
        keyboardAction = true;
    };
    return !blockCrash;
};
/** 테트로미노 땅으로 굳히기
 * @async
 * @function lockTheDropedBlock
 * @returns {Promise<boolean>} 모든 애니메이션 효과가 끝난 뒤 True를 돌려 준다.
 * @description 테트로미노를 땅으로 굳히고, 꽉 찬 줄을 땅에서 지운다.*/
const lockTheDropedBlock = async () => {
    playLockingSFX();
    lockBlock(history.pres);
    let filledRows = findFilledRows();
    let scores = updateMarkByLines(filledRows.length);
    showScoreTextAnimation(scores, 700)
        .then(() => {showLevelUpAnimation(scores, 700);});
    showMark(getMark());
    updatePlaybackRate(getMark().level);

    let deletingBlock = await new Promise((resolve) => {
        if(filledRows.length > 0){
            drawGameBoard();
            playDeletingSFX();
            resolve(deletingRowsAnimation(filledRows, 200));
        }else{
            resolve(true);
        }
    });
    
    if(deletingBlock){
        deleteRows(filledRows);
        if(isPerfectClear()){
            showScoreTextAnimation(updateScoreByPerfectClear(filledRows.length), 700)
            showMark(getMark());
        }
        drawGameBoard();        
        nextBlock();
    }
    return deletingBlock;
};
/** 게임 잠시 멈춤
 * @function hangOn
 * @description 블록이 한 눈씩 떨어지는 것을 멈추고, 키보드 입력을 막는다. */
const hangOn = () => {
    pause = true;
    keyboardAction = false;
    cancelLockingBlockAnimation();
    clearTimeout(runTimer);
};
/***************************** 게임 종합 기능 함수 *****************************/
/** 게임 진행
 * @function playGame
 * @description 일정한 시간 간격으로 테트로미노를 떨어뜨린다. 테트로미노가 땅에 부딪혀 굳는 시간은 다르게 적용된다. */
const playGame = () => {
    pause = false;
    keyboardAction = true;
    history.pres.moveUp();
    fallFree();
};
/** 땅으로 굳는 지연 시간 조정 함수
 * @function crashCycle
 * @param {number} cycleDelay  */
const crashCycle = (cycleDelay) => {
    if(!pause){
        if(history.pres.willCrash()){
            lockingBlockAnimation(history.pres, cycleDelay)
                .then((result) => {
                    if(result)
                        fallFree();
                    else
                        crashCycle(cycleDelay*0.95);
                });
        }else{
            runTimer = setTimeout(fallFree, getDelay());
        }
    }
};
/** 자유 낙하 진행
 * @function fallFree */
const fallFree = () => {
    dropingblock()
        .then(() => {crashCycle(lockDelay);});
};
/** 게임 일시 정지
 * @function pauseGame
 * @description 게임과 음악을 잠시 멈추고, 블록·점수 따위의 게임 요소를 숨기고, 일시 정지 모달을 띄운다. */
const pauseGame = () => {
    hangOn();
    pauseBGM();
    removeTouchButtonEvent();
    removeKeyControl();
    removeClickButton();
    removeGameBoard();
    removeNext();
    removeHold();
    hideMark();
    setPlaySymbol();
    openPauseModal();
};
/** 게임 이어 하기 
 * @function continueGame
 * @description 카운트 다운을 센 다음, 하던 게임을 이어서 한다. */
export const continueGame = () => {
    goFullScreen();
    addClickButton();
    return new Promise(resolve => {
        countDownTextAnimation()
            .then(() => {
                drawGameBoard();
                drawPlayingBlock(history.pres);
                drawNext(history.next);
                drawHold(history.hold);
                showMark(getMark());
                addKeyControl();
                addTouchButtonEvent();
                setPauseSymbol();
                playGame();
                playBGM();
                resolve(true);
            });
    })
};
/** 게임 종료
 * @function gameOver
 * @description 게임을 멈추고 게임 종료 모달을 연다. */
const gameOver = () => {
    hangOn();
    pauseBGM();
    removeTouchButtonEvent();
    removeKeyControl();
    removeClickButton();
    manageGameOverModal();
};
/** 게임 시작
 * @function startGame
 * @description 블록·점수 따위의 게임 요소를 초기화하고 게임을 시작한다. */
export const startGame = () => {
    removeGameBoard();
    removeHold();
    removeNext();
    hideMark();
    setPauseSymbol();
    resetPlayList();
    initiateTetrisMap();
    initiateHistory();
    initiateMark();
    drawBackBoard();
    continueGame();
};
/***************************** 게임 창 여닫기 *****************************/
/** 게임 창 열기
 * @function openGamePage */
export const openGamePage = () => {
    openModal("ingame");
    prepareController();
    addResizeEvent(resizeWindow);
};
/** 게임 창 닫기
 * @function closeGamePage */
export const closeGamePage = () => {
    removeResizeEvent(resizeWindow);
    hideController();
    hideInstruction();
    closeModal("ingame");
};
/** 브라우저 크기 조정 콜백 함수
 * @function resizeWindow
 * @param {UIEvent} event 
 * @description 
 * 브라우저 창의 가로 세로 비율이 2:1보다 작거나 1:2보다 크면 터치 패드를 숨기고, 아니면 터치 패드를 단다. */
const resizeWindow = function(event){
    prepareController();
};
/** 터치 패드 추가
 * @function prepareController
 * @description 
 * 게임판 오른쪽 왼쪽으로 터치 패드를 단다.
 * 다만 브라우저 창의 가로 세로 비율이 2:1보다 작거나 1:2보다 크면 터치 패드를 숨긴다. */
const prepareController = () => {
    let win_width = (isPortrait())? window.innerHeight : window.innerWidth;
    let win_Height = (isPortrait())? window.innerWidth : window.innerHeight;
    if(win_width < win_Height*2){
        hideController();
        showInstruction();
    }else{
        hideInstruction();
        showController();
    }
};
/** 터치 패드 보이기
 * @function showController */
const showController = () => {
    openModal("right_pad");
    openModal("left_pad");
};
/** 터치 패드 숨기기
 * @function hideController */
const hideController = () => {
    closeModal("right_pad");
    closeModal("left_pad");
};
/** 지시문 보이기
 * @function showInstruction */
const showInstruction = () => {
    openModal("right_instruction");
    openModal("left_instruction");
};
/** 지시문 숨기기
 * @function hideInstruction */
const hideInstruction = () => {
    closeModal("right_instruction");
    closeModal("left_instruction");
};