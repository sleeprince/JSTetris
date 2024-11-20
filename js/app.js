import { block, drawGameBoard, drawPlayingBlock, removePlayingBlock } from "./function.js";

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
    }
    drawPlayingBlock(history.pres);
}

const keyboardInput = () => {
    document.addEventListener("keydown", (event) => {
        console.log(event);
        removePlayingBlock(history.pres);
        switch(event.code){
            case 'ArrowUp':
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
                break;
        }
        drawPlayingBlock(history.pres);
    });
};

console.log("let's start"); 
console.log(`now:${history.pres.type}, next:${history.next.type}`);

drawGameBoard();
drawPlayingBlock(history.pres);

setTimeout(function run(){
    dropingblock();
    setTimeout(run, 1000);
}, 1000);

keyboardInput();