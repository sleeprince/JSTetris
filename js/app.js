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
    });
}

console.log("let's start"); 
console.log(`now:${history.pres.type}, next:${history.next.type}`);

drawGameBoard();
drawPlayingBlock(history.pres);

setTimeout(function run(){
    dropingblock();
    // keyboardInput();
    setTimeout(run, 1000);
}, 1000);

keyboardInput();