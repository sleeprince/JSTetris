import { 
    block, 
    drawBackBoard, 
    drawGameBoard, 
    drawPlayingBlock,
    removePlayingBlock,
    deleteRows,
    drawNext,
    drawHold, 
    lockBlock,
    findFilledRows
} from "./function.js";

import {
    lockingBlockAnimation,
    cancelLockingBlockAnimation,
    deletingRowsAnimation,
    hardDropingAnimation,
    lockedBlockAnimation
} from "./animation.js";

var pause = false;
var keyboardAction = true;
var hold = true;
var line = 0;
var level = 0;
var delay = 1000;
var runTimer;

const history = {
    pres: new block(),
    next: Array.from({length:5}, () => new block()),
    hold: null
};
// 다음 블록 꺼내 오기
const nextBlock = () => {
    history.pres = history.next.shift();
    history.next.push(new block());
    hold = true;
    drawNext(history.next);
};
//블록 내려오기
const dropingblock = async () => {
    removePlayingBlock(history.pres);
    history.pres.moveDown();
    //바닥에 닿았을 때
    let blockCrash = await new Promise((resolve) => {
        if(history.pres.isCrash()){
            history.pres.moveUp();
            drawPlayingBlock(history.pres);
            resolve(lockedBlockAnimation(history.pres, 120)
                .then((result) => {if(result) return lockTheDropedBlock()}));
        }else{
            resolve(true);
        }
    });
    if(blockCrash) drawPlayingBlock(history.pres);
    return blockCrash;
};
//블록 땅에 굳히기
const lockTheDropedBlock = async () => {
    lockBlock(history.pres);
    let filledRows = findFilledRows();
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
        drawGameBoard();
        nextBlock();
    }
    return deletingBlock;
}
//키보드 입력
const keyboardInput = () => {
    document.addEventListener("keydown", (event) => {
        if(event.code == 'KeyP'){
            if(pause)
                playGame();
            else
                pauseGame();
        }
        if(keyboardAction){
            // console.log(event);
            removePlayingBlock(history.pres);
            cancelLockingBlockAnimation();
            let drawingAgain = true;
            switch(event.code){
                case 'KeyZ':
                    history.pres.rotateL();
                    if(history.pres.isCrash())
                        history.pres.rotateR();
                    break;
                case 'ArrowUp':
                    history.pres.rotateR();
                    if(history.pres.isCrash())
                        history.pres.rotateL();
                    break;
                case 'ArrowDown':
                    pauseGame();
                    drawingAgain = false;
                    dropingblock().then((r) => {if(r) playGame();});
                    break;
                case 'ArrowLeft':
                    history.pres.moveLeft();
                    if(history.pres.isCrash())
                        history.pres.moveRight();
                    break;
                case 'ArrowRight':
                    history.pres.moveRight();
                    if(history.pres.isCrash())
                        history.pres.moveLeft();
                    break;
                case 'Space':
                    drawingAgain = false;
                    pauseGame();
                    hardDropingAnimation(history.pres)
                        .then((r) => {
                            if(r){
                                history.pres.hardDrop();
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
                    break;
            }
            if(drawingAgain) drawPlayingBlock(history.pres);           
        }
    });
};
const hangOnGame = () => {
    pause = false;
    keyboardAction = true;
    clearTimeout(runTimer);
;}
const pauseGame = () => {
    pause = true;
    keyboardAction = false;
    cancelLockingBlockAnimation();
    clearTimeout(runTimer);
};
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
                    runTimer = setTimeout(run, delay);
                }
            }
        };
        dropingblock()
        .then((result) => {if(result) crashCycle(delay);});
    }, delay);
};

drawBackBoard();
drawGameBoard();
drawPlayingBlock(history.pres);
drawNext(history.next);
keyboardInput();
playGame();