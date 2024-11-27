import { 
    block, 
    drawGameBoard, 
    drawPlayingBlock,
    drawAnimationBoard, 
    removePlayingBlock,
    deleteRows,
    drawNext,
    drawHold, 
    lockBlock
} from "./function.js";

import {
    pause
} from "./animation.js";

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
        lockingBlocks();
    }
    drawPlayingBlock(history.pres);
};
const lockingBlocks = () => {
    lockBlock(history.pres);
    
    drawGameBoard();
    nextBlock();
}
//키보드 입력
const keyboardInput = () => {
    document.addEventListener("keydown", (event) => {
        // console.log(event);
        if(event.code == 'KeyP') pause = !pause;
        if(!pause){            
            removePlayingBlock(history.pres);
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
                    if(history.pres.isCrash())
                        history.pres.moveUp();
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
                    lockingBlocks();
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
const playGame = () => {
    runTimer = setTimeout(function run(){
        if(!pause) dropingblock();
        runTimer = setTimeout(run, delay);
    }, delay);
}

drawGameBoard();
drawAnimationBoard();
drawPlayingBlock(history.pres);
playGame();
drawNext(history.next);
keyboardInput();