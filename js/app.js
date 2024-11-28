import { 
    block, 
    drawGameBoard, 
    drawPlayingBlock,
    drawAnimationBoard, 
    removePlayingBlock,
    deleteRows,
    drawNext,
    drawHold, 
    lockBlock,
    findFilledRows
} from "./function.js";

import {
    blurBlock
} from "./animation.js";

var pause = false;
var hold = true;
var line = 0;
var level = 0;
var delay = 1000;
var runTimer;

const history = {
    prev: null,
    pres: new block(),
    next: Array.from({length:5}, () => new block()),
    hold: null
};

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
        lockTheDropedBlock();
    }else{
        drawPlayingBlock(history.pres);
    }
};
const lockTheDropedBlock = () => {

    let filledRows;
    const bluringBlock = new Promise((resolve) => {
        let duration = 1000;
        console.log("프로미스 시작");
        resolve(1);
    });
    const deletingRows = new Promise((resolve) => {
        drawPlayingBlock(history.pres);// 1초짜리 흐려지는 애니메이션 넣기 bluringBlock 
        lockBlock(history.pres);
        filledRows = findFilledRows();
        pause = true;
        setTimeout(()=>{
            console.log("프로미스 진행");
            resolve(1);
        }, 2000);
    });

    bluringBlock
        .then(() => deletingRows)
        .then(() => {
            deleteRows(filledRows);
            drawGameBoard();
            nextBlock();
            console.log("프로미스 끝");
            drawPlayingBlock(history.pres);
            playGame();
        });
}
//키보드 입력
const keyboardInput = () => {
    document.addEventListener("keydown", (event) => {
        // console.log(event);
        if(event.code == 'KeyP'){
            if(pause)
                playGame();
            else
                pause = true;
        }
        if(!pause){
            removePlayingBlock(history.pres);
            switch(event.code){
                case 'KeyZ':
                    history.pres.rotateL();
                    if(history.pres.isCrash())
                        history.pres.rotateR();
                    drawPlayingBlock(history.pres);
                    break;
                case 'ArrowUp':
                    history.pres.rotateR();
                    if(history.pres.isCrash())
                        history.pres.rotateL();
                    drawPlayingBlock(history.pres);
                    break;
                case 'ArrowDown':
                    history.pres.moveDown();
                    if(history.pres.isCrash())
                        history.pres.moveUp();
                    drawPlayingBlock(history.pres);
                    break;
                case 'ArrowLeft':
                    history.pres.moveLeft();
                    if(history.pres.isCrash())
                        history.pres.moveRight();
                    drawPlayingBlock(history.pres);
                    break;
                case 'ArrowRight':
                    history.pres.moveRight();
                    if(history.pres.isCrash())
                        history.pres.moveLeft();
                    drawPlayingBlock(history.pres);
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
                    drawPlayingBlock(history.pres);
                    break;
            }           
        }
    });
};
const playGame = () => {
    pause = false;
    runTimer = setTimeout(function run(){
        if(pause){
            clearTimeout(runTimer);
        }else{
            dropingblock();
            runTimer = setTimeout(run, delay);    
        } 
    }, delay);
}

drawGameBoard();
drawAnimationBoard();
drawPlayingBlock(history.pres);
drawNext(history.next);
keyboardInput();
playGame();