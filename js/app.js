import { 
    block, 
    drawGameBoard, 
    drawPlayingBlock, 
    removePlayingBlock,
    deleteRows,
    drawNext,
    drawHold, 
    consolidate
} from "./function.js";

var pause = false;
var numOfblock = 0;
var level = 0;

const history = {
    prev: null,
    pres: new block(),
    next: new block(),
    hold: null
};

const dropingblock = () => {
    removePlayingBlock(history.pres);
    history.pres.moveDown();
    if(history.pres.isCrash()){
        history.pres.moveUp();
        consolidate(history.pres);
        history.prev = history.pres;
        history.pres = history.next;
        history.next = new block();
        drawGameBoard();
        drawNext(history.next);
    }
    drawPlayingBlock(history.pres);
}

const keyboardInput = () => {
    document.addEventListener("keydown", (event) => {
        // console.log(event);
        removePlayingBlock(history.pres);
        switch(event.code){
            case 'KeyP':
                pause = !pause;
                break;
            case 'ArrowUp':
                if(pause) break;
                if(event.shiftKey){
                    history.pres.rotateL();
                    if(history.pres.isCrash())
                        history.pres.rotateR();
                }else{
                    history.pres.rotateR();
                    if(history.pres.isCrash())
                        history.pres.rotateL();
                }
                break;
            case 'ArrowDown':
                if(pause) break;
                history.pres.moveDown();
                if(history.pres.isCrash())
                    history.pres.moveUp();
                break;
            case 'ArrowLeft':
                if(pause) break;
                history.pres.moveLeft();
                if(history.pres.isCrash())
                    history.pres.moveRight();
                break;
            case 'ArrowRight':
                if(pause) break;
                history.pres.moveRight();
                if(history.pres.isCrash())
                    history.pres.moveLeft();
                break;
            case 'Space':
                if(pause) break;
                history.pres.jumpDown();
                consolidate(history.pres);
                history.prev = history.pres;
                history.pres = history.next;
                history.next = new block();
                drawGameBoard();
                drawNext(history.next);
                break;
            case 'KeyZ':
                if(pause) break;
                history.pres.position = 5;
                let tmp = history.pres;
                if(history.hold == null){
                    history.pres = new block();
                }else{
                    history.pres = history.hold;
                }                
                history.hold = tmp;
                drawHold(history.hold);
                break;
        }
        drawPlayingBlock(history.pres);
    });
};

console.log("let's start");
drawGameBoard();
drawPlayingBlock(history.pres);
drawNext(history.next);

setTimeout(function run(){
    if(!pause) dropingblock();
    setTimeout(run, 1000);
}, 1000);

keyboardInput();