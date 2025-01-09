import {
    addKeyboardInput,
    removeKeyboardInput,
    addMouseInput,
    removeMouseInput
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
    playDeletingSFX
} from "./soundController.js"

import { getKeyset } from "./option.js";

/** 일시 정시 상태인지 여부를 가리킨다. */
var pause = false;
/** 게임을 하는 중 키보드 입력을 받는지 여부를 가리킨다. */
var keyboardAction = true;
/** hold에 테트로미노가 차 있는지 여부를 가리킨다.*/
var hold = true;
/** 테트로미노가 땅에 떨어져 땅으로 굳기까지의 시간을 가리킨다. */
var lockDelay = 1000;
/** 테트로미노가 떨어지는 시간을 조절하는 SetTimeout()의 ID를 가리킨다. */
var runTimer; 

const history = {
    pres: new block(),
    next: Array.from({length:5}, () => new block()),
    hold: new block()
};
/** 현재·다음·홀드 테트로미노 히스토리 초기화 */
const initiateHistory = () => {
    history.pres = new block();
    history.next.forEach((v, i) => {history.next[i] = new block();});
    history.hold = null;
    hold = true;
    history.pres.willCrash();
};
/** 다음 블록 꺼내 오기. 새 테트로미노가 나올 자리에 이미 땅이 있다면 게임 오버 */
const nextBlock = () => {
    history.pres = history.next.shift();
    history.next.push(new block());
    hold = true;
    drawNext(history.next);
    if(history.pres.isCrash())
        gameOver();
};
/** 테트로미노 한 눈 내리기
 * @return {boolean} 내려오면 true를 돌려 주고, 굳으면 false를 돌려 준다.
 * @description 테트로미노를 한 눈 내리며, 땅 탓에 내리지 못하면 땅으로 굳는다.
 * */
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
/** 테트로미노를 땅에 굳히고, 꽉 찬 줄을 땅에서 지운다. 
* 모든 애니메이션 효과가 끝난 뒤 True를 돌려 준다. */
const lockTheDropedBlock = async () => {
    playLockingSFX();
    lockBlock(history.pres);
    let filledRows = findFilledRows();
    let scores = updateMarkByLines(filledRows.length);
    showScoreTextAnimation(scores, 600)
        .then((r) => {if(r) showLevelUpAnimation(scores, 600);});
    showMark(getMark());

    let deletingBlock = await new Promise((resolve) => {
        if(filledRows.length > 0){
            drawGameBoard();
            playDeletingSFX();
            resolve(deletingRowsAnimation(filledRows, 200));
        }else{
            resolve(true);
        }
    })
    
    if(deletingBlock){
        deleteRows(filledRows);
        if(isPerfectClear()){
            showScoreTextAnimation(updateScoreByPerfectClear(filledRows.length), 600)
            showMark(getMark());
        }
        drawGameBoard();        
        nextBlock();
    }
    return deletingBlock;
}
//키보드 입력
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
}
const addKeyControl = () => {
    addKeyboardInput(document, keydownEvent);
};
const removeKeyControl = () => {
    removeKeyboardInput(document, keydownEvent);
};
// 마우스 입력
const clickEvent = function(event){
    event.preventDefault();
    pauseGame();
};
const addClickingPause = () => {
    let element = document.getElementById("pauseButton");
    addMouseInput(element, clickEvent);
};
const removeClickingPause = () => {
    let element = document.getElementById("pauseButton");
    removeMouseInput(element, clickEvent);
};
// 일시 멈춤
const hangOn = () => {
    pause = true;
    keyboardAction = false;
    cancelLockingBlockAnimation();
    clearTimeout(runTimer);
};
// 게임 플레이
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
// 게임 멈춤, pause 모달 띄우기
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
// 게임 계속
export const continueGame = () => {
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
                    addClickingPause();
                    setPauseSymbol();
                    playGame();
                    playBGM();
                    resolve(true);
                }
            });
    })
}
// 게임 오버
const gameOver = () => {
    hangOn();
    pauseBGM();
    removeKeyControl();
    removeClickingPause();
    manageGameOverModal();
};
// 게임 시작
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