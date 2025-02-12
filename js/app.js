import {
    addKeyboardInput,
    removeKeyboardInput,
    addMouseInput,
    removeMouseInput,
    removeMouseClick,
    addMouseClick
} from "./utility.js"

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
    showLevelUpAnimation,
    showScoreTextAnimation,
    countDownTextAnimation
} from "./textAnimation.js";

import {
    openPauseModal,
    manageGameOverModal
} from "./modalController.js"

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
} from "./soundController.js"

import { getKeyset } from "./option.js";

/** 테트로미노가 땅에 떨어져 땅으로 굳기까지의 시간
 * @readonly
 * @constant lockDelay
 * @type {number} */
const lockDelay = 1000;
/** 잠시 멈춤 상태인지 여부를 가리킨다.
 * @type {boolean} */
var pause = true;
/** 게임을 하는 중 키보드 입력을 받는지 여부를 가리킨다. 
 * @type {boolean} */
var keyboardAction = true;
/** hold에 테트로미노가 차 있는지 여부를 가리킨다.
 * @type {boolean} */
var hold = true;
/** 테트로미노가 떨어지는 시간을 조절하는 SetTimeout()의 ID를 가리킨다.
 * @type {number} */
var runTimer;

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
                .then((result) => {if(result) return lockTheDropedBlock();}));
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
        .then((r) => {if(r) showLevelUpAnimation(scores, 700);});
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
/** 게임 조작 키보드 입력 콜백 함수
 * @function keydownEvent
 * @param {KeyboardEvent} event */
const keydownEvent = (event) => {
    if(keyboardAction){
        // console.log(event);
        removePlayingBlock(history.pres);
        cancelLockingBlockAnimation();
        let drawingAgain = true;
        let prev_height;
        let distance;
        switch(event.code){
            case getKeyset('pause'):
            case 'Escape':
                drawingAgain = false;
                pauseGame();
                break;
            case getKeyset('rotate_left'):
                history.pres.rotateL();
                if(history.pres.isCrash())
                    if(!wallKick(history.pres, "left")){
                        history.pres.rotateR();
                        break;
                    }
                if(!event.repeat) playRotatingSFX();
                updateTSpin(history.pres.is3CornerT());
                break;
            case getKeyset('rotate_right'):
                history.pres.rotateR();
                if(history.pres.isCrash())
                    if(!wallKick(history.pres, "right")){
                        history.pres.rotateL();
                        break;
                    }
                if(!event.repeat) playRotatingSFX();
                updateTSpin(history.pres.is3CornerT());
                break;
            case getKeyset('soft_drop'):
                hangOn();
                drawingAgain = false;
                prev_height = history.pres.position.y;
                dropingblock()
                    .then((r) => {
                        switch(r){
                            case true:
                                if(!event.repeat) playMovingSFX();
                                distance = history.pres.position.y - prev_height;
                                updateMarkBySoftDrop(distance);
                                showMark(getMark());
                            default:
                                playGame();
                        }
                    });
                break;
            case getKeyset('move_left'):
                history.pres.moveLeft();
                if(history.pres.isCrash()){                 
                    history.pres.moveRight();
                    break;
                }
                if(!event.repeat) playMovingSFX();
                updateTSpin(false);
                break;
            case getKeyset('move_right'):
                history.pres.moveRight();
                if(history.pres.isCrash()){
                    history.pres.moveLeft();
                    break;
                }
                if(!event.repeat) playMovingSFX();
                updateTSpin(false);
                break;
            case getKeyset('hard_drop'):
                hangOn();
                drawingAgain = false;
                prev_height = history.pres.position.y;
                hardDropingAnimation(history.pres)
                    .then((r) => {
                        if(r){
                            history.pres.hardDrop();
                            distance = history.pres.position.y - prev_height;
                            updateMarkByHardDrop(distance);
                            if(distance > 0) updateTSpin(false);
                            showMark(getMark());
                            return lockTheDropedBlock();
                        }
                    })
                    .then((r) => {if(r) playGame();});
                break;
            case getKeyset('hold'):
                let tmp = history.pres;
                if(!hold) break;
                if(history.hold == null){               
                    nextBlock();
                }else{               
                    history.pres = history.hold;
                }
                history.hold = tmp;
                history.hold.initiate();
                hold = false; 
                drawHold(history.hold);
                playHoldSFX();
                updateTSpin(false);
                break;
        }
        if(drawingAgain) drawPlayingBlock(history.pres);           
    }
};
/** 게임 조작 키보드 입력 추가
 * @function addKeyControl */
const addKeyControl = () => {
    addKeyboardInput(document, keydownEvent);
};
/** 게임 조작 키보드 입력 삭제
 * @function removeKeyControl */
const removeKeyControl = () => {
    removeKeyboardInput(document, keydownEvent);
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
    if(!pause)
        playHoldSFX();
};
/** 배경 음악 오른쪽 버튼 클릭 콜백 함수
 * @function clickRightArrow
 * @param {MouseEvent} event */
const clickRightArrow = function(event){
    playNextBGM();
};
/** 배경 음악 왼쪽 버튼 클릭 콜백 함수
 * @function clickLeftArrow
 * @param {MouseEvent} event */
const clickLeftArrow = function(event){
    playPrevBGM();
};
/** 일시 정지 버튼 클릭 입력 추가
 * @function addClickingPause */
const addClickingPause = () => {
    addMouseInput(document.getElementById("pauseButton"), clickPauseEvent, overPauseEvent);
    addMouseClick(document.getElementById("nextMusic"), clickRightArrow);
    addMouseClick(document.getElementById("prevMusic"), clickLeftArrow);
};
/** 일시 정지 버튼 클릭 입력 삭제
 * @function removeClickingPause */
const removeClickingPause = () => {
    removeMouseInput(document.getElementById("pauseButton"), clickPauseEvent, overPauseEvent);
    removeMouseClick(document.getElementById("nextMusic"), clickRightArrow);
    removeMouseClick(document.getElementById("prevMusic"), clickLeftArrow);
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
/** 게임 진행
 * @function playGame
 * @description 일정한 시간 간격으로 테트로미노를 떨어뜨린다. 테트로미노가 땅에 부딪혀 굳는 시간은 다르게 적용된다. */
const playGame = () => {
    pause = false;
    keyboardAction = true;
    history.pres.moveUp();
    dropingblock();
    runTimer = setTimeout(function run(){
        let crashCycle = (cycleDelay) => {
            if(!pause){
                if(history.pres.willCrash()){
                    lockingBlockAnimation(history.pres, cycleDelay)
                        .then((result) => {                    
                            if(result)
                                run();
                            else
                                crashCycle(cycleDelay*0.9);
                        });
                }else{
                    runTimer = setTimeout(run, getDelay());
                }
            }
        };
        dropingblock()
            .then((result) => {if(result || !result) crashCycle(lockDelay);});
    }, getDelay());
};
/** 게임 일시 정지
 * @function pauseGame
 * @description 게임과 음악을 잠시 멈추고, 블록·점수 따위의 게임 요소를 숨기고, 일시 정지 모달을 띄운다. */
const pauseGame = () => {
    hangOn();
    pauseBGM();
    removeKeyControl();
    removeClickingPause();
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
    addClickingPause();
    return new Promise(resolve => {
        countDownTextAnimation()
            .then((r) => {
                if(r){
                    drawGameBoard();
                    drawPlayingBlock(history.pres);
                    drawNext(history.next);
                    drawHold(history.hold);
                    showMark(getMark());
                    addKeyControl();                    
                    setPauseSymbol();
                    playGame();
                    playBGM();
                    resolve(true);
                }
            });
    })
};
/** 게임 종료
 * @function gameOver
 * @description 게임을 멈추고 게임 종료 모달을 연다. */
const gameOver = () => {
    hangOn();
    pauseBGM();
    removeKeyControl();
    removeClickingPause();
    manageGameOverModal();
};
/** 게임 시작
 * @function startGame
 * @description 블록·점수 따위의 게임 요소를 초기화하고 게임을 시작한다. */
export const startGame = () => {
    removeGameBoard();
    removeHold();
    removeNext();
    setPauseSymbol();
    resetPlayList();
    initiateTetrisMap();
    initiateHistory();
    initiateMark();
    drawBackBoard();
    continueGame();
};