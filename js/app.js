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
    deletingRowsAnimation
} from "./animation.js";

var pause = false;
var keyboardAction = true;
var hanging = false;
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
const dropingblock = () => {
    removePlayingBlock(history.pres);
    history.pres.moveDown();
    //바닥에 닿았을 때
    if(history.pres.isCrash()){
        history.pres.moveUp();
        // lockTheDropedBlock();
        lockBlock(history.pres);
        drawGameBoard();
        nextBlock();
    }
    drawPlayingBlock(history.pres);
};
//블록 땅에 굳히기
const lockTheDropedBlock = () => {
    // let filledRows;
    // const bluringBlock = () => new Promise((resolve) => {
    //     hangOnGame();
    //     let duration = 2000;
    //     console.log(`${Date.now()}: 프로미스 시작`);
    //     drawPlayingBlock(history.pres);
    //     bluringBlockAnimation(history.pres, duration);
    //     setTimeout(() => {
    //         resolve(true);
    //     }, duration);
    // });
    // const deletingRows = (result) => {
    //     console.log(result);
    //     return new Promise((resolve) => {
    //         lockBlock(history.pres);
    //         filledRows = findFilledRows();
    //         pauseGame();
    //         console.log(`${Date.now()}: 프로미스 진행1`);
    //         setTimeout(()=>{
    //             console.log(`${Date.now()}: 프로미스 진행2`);
    //             resolve(true);
    //         }, 1000);
    //     });
    // };

    // bluringBlock()
    //     .then(deletingRows)
    //     .then((result) => {
    //         if(result){
    //             deleteRows(filledRows);
    //             drawGameBoard();
    //             nextBlock();
    //             console.log(`${Date.now()}: 프로미스 끝`);
    //             drawPlayingBlock(history.pres);
    //             playGame();
    //         }
    //     });
}
//키보드 입력
const keyboardInput = () => {
    document.addEventListener("keydown", (event) => {
        // console.log(event);
        if(event.code == 'KeyP'){
            if(pause)
                playGame();
            else
                pauseGame();
        }
        if(keyboardAction){
            removePlayingBlock(history.pres);
            cancelLockingBlockAnimation(history.pres);
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
                    history.pres.moveDown();
                    if(history.pres.isCrash()){
                        history.pres.moveUp();
                    }
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
                    //애니매이션 효과는 따로 div와 함수를 만들어서 하기
                    history.pres.hardDrop();
                    lockTheDropedBlock();
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
            drawPlayingBlock(history.pres);               
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
    clearTimeout(runTimer);
};
const playGame = () => {
    pause = false;
    keyboardAction = true;
    runTimer = setTimeout(function run(){
        dropingblock();
        if(history.pres.willCrash()){
            lockingBlockAnimation(history.pres, delay)
                .then((result) => {
                    if(result)
                        run();
                });
        }else{
            runTimer = setTimeout(run, delay);
        }
    }, delay);
};

drawBackBoard();
drawGameBoard();
drawPlayingBlock(history.pres);
drawNext(history.next);
keyboardInput();
playGame();