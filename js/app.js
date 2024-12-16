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
    isPerfectClear
} from "./blockFunction.js";

import {
    lockingBlockAnimation,
    cancelLockingBlockAnimation,
    deletingRowsAnimation,
    hardDropingAnimation,
    lockedBlockAnimation
} from "./blockAnimation.js";

import {
    openPauseModal,
    closePauseModal,
    gameOverModal,
    showMark,
    hideMark
} from "./textFunction.js";

import {
    getMark,
    updateMarkByLines,
    updateMarkBySoftDrop,
    updateMarkByHardDrop,
    updateTSpin,
    getDelay,
    updateScoreByPerfectClear
} from "./scoring.js";

var pause = false;
var keyboardAction = true;
var hold = true;
var lockDelay = 1000;
var runTimer; // 떨어지기 SetTimeout() ID

const history = {
    pres: new block(),
    next: Array.from({length:5}, () => new block()),
    hold: null
};
// 다음 블록 꺼내 오기 & 게임 오버
const nextBlock = () => {
    history.pres = history.next.shift();
    history.next.push(new block());
    hold = true;
    drawNext(history.next);
    if(history.pres.isCrash())
        gameOver();
};
//블록 내려오기
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
//블록 땅에 굳히기
const lockTheDropedBlock = async () => {
    lockBlock(history.pres);
    let filledRows = findFilledRows();
    console.log(updateMarkByLines(filledRows.length));
    showMark(getMark());

    let deletingBlock = await new Promise((resolve) => {
        if(filledRows.length > 0){
            drawGameBoard();
            resolve(deletingRowsAnimation(filledRows, 200));
        }else{
            resolve(true);
        }
    })
    if(deletingBlock){
        deleteRows(filledRows);   
        if(isPerfectClear()){
            console.log(updateScoreByPerfectClear(filledRows.length));
            showMark(getMark());
        }        
        drawGameBoard();
        nextBlock();
    }
    return deletingBlock;
}
//키보드 입력
const keydownEvent = (event) => {
    if(event.code == 'KeyP'){
        if(pause)
            continueGame();
        else
            pauseGame();
    }
    if(keyboardAction){
        // console.log(event);
        removePlayingBlock(history.pres);
        cancelLockingBlockAnimation();
        let drawingAgain = true;
        let prev_height;
        let distance;
        switch(event.code){
            case 'KeyZ':
                history.pres.rotateL();
                if(history.pres.isCrash())
                    if(!wallKick(history.pres, "left")){
                        history.pres.rotateR();
                        break;
                    }
                updateTSpin(history.pres.is3CornerT());
                break;
            case 'ArrowUp':
                history.pres.rotateR();
                if(history.pres.isCrash())
                    if(!wallKick(history.pres, "right")){
                        history.pres.rotateL();
                        break;
                    }
                updateTSpin(history.pres.is3CornerT());
                break;
            case 'ArrowDown':
                hangOn();
                drawingAgain = false;
                prev_height = history.pres.position.y;
                dropingblock()
                    .then((r) => {
                        switch(r){
                            case true:
                                distance = history.pres.position.y - prev_height;
                                updateMarkBySoftDrop(distance);
                                showMark(getMark());
                            default:
                                playGame();
                        }
                    });
                break;
            case 'ArrowLeft':
                history.pres.moveLeft();
                if(history.pres.isCrash()){                 
                    history.pres.moveRight();
                    break;
                }
                updateTSpin(false);
                break;
            case 'ArrowRight':
                history.pres.moveRight();
                if(history.pres.isCrash()){
                    history.pres.moveLeft();
                    break;
                }
                updateTSpin(false);
                break;
            case 'Space':
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
            case 'KeyC':
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
                updateTSpin(false);
                break;
        }
        if(drawingAgain) drawPlayingBlock(history.pres);           
    }
}
const addKeyboardInput = () => {
    document.addEventListener("keydown", keydownEvent);
};
const removeKeyboardInput = () => {
    document.removeEventListener("keydown", keydownEvent);
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
                            if(result){
                                // console.log("다시 런");
                                run();
                            }else{
                                // console.log(`사이클 ${cycleDelay*0.9}`);
                                crashCycle(cycleDelay*0.9);
                            }
                        });
                }else{
                    // console.log("런");
                    runTimer = setTimeout(run, getDelay());
                }
            }
        };
        dropingblock()
            .then((result) => {if(result || !result) crashCycle(lockDelay);});
    }, getDelay());
};
// 게임 시작
const startGame = () => {
    drawBackBoard();
    addKeyboardInput();
    continueGame();
};
// 게임 멈춤, pause 모달 띄우기
const pauseGame = () => {
    hangOn();
    removeGameBoard();
    removeNext();
    removeHold();
    hideMark();
    openPauseModal();
};
// 게임 계속
const continueGame = () => {
    closePauseModal();
    drawGameBoard();
    drawPlayingBlock(history.pres);
    drawNext(history.next);
    drawHold(history.hold);
    showMark(getMark());
    playGame();
}
// 게임 오버
const gameOver = () => {
    hangOn();
    removeKeyboardInput();
    gameOverModal();
};

startGame();