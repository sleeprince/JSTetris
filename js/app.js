import { 
    block, 
    drawGameBoard, 
    drawPlayingBlock, 
    removePlayingBlock,
    deleteRows,
    drawNext,
    drawHold, 
    lockBlock
} from "./function.js";

var pause = false;
var hold = true;
var numOfblock = 0;
var level = 0;

const history = {
    prev: null,
    pres: new block(),
    next: new block(),
    hold: null
};

console.log(history.pres);

const nextBlock = () => {};

const dropingblock = () => {
    removePlayingBlock(history.pres);
    history.pres.moveDown();
    if(history.pres.isCrash()){
        history.pres.moveUp();
        lockBlock(history.pres);
        hold = true;
        history.prev = history.pres;
        history.pres = history.next;
        history.next = new block();
        drawGameBoard();
        drawNext(history.next);
    }
    drawPlayingBlock(history.pres);
};

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
                    history.pres.jumpDown();
                    lockBlock(history.pres);
                    hold = true; // 교환 함수에 넣기          
                    history.prev = history.pres;
                    history.pres = history.next;
                    history.next = new block();
                    drawGameBoard();
                    drawNext(history.next);
                    break;
                case 'KeyC': 
                    let tmp = history.pres;
                    if(!hold) break;
                    if(history.hold == null){               
                        history.pres = history.next;                
                        history.next = new block();
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

drawGameBoard();
drawPlayingBlock(history.pres);
drawNext(history.next);

setTimeout(function run(){
    if(!pause) dropingblock();
    setTimeout(run, 1000);
}, 1000);

keyboardInput();