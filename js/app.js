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
        if(event.code == 'KeyP') pause = !pause;
        if(!pause){
            removePlayingBlock(history.pres);
            switch(event.code){
                case 'keyZ':
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
                    consolidate(history.pres);
                    history.prev = history.pres;
                    history.pres = history.next;
                    history.next = new block();
                    drawGameBoard();
                    drawNext(history.next);
                    break;
                case 'KeyC': 
                    let tmp = history.pres;
                    if(history.hold == null){
                        if(history.next.isCrash()) break;
                        history.pres = history.next;                    
                        history.next = new block();                    
                    }else{               
                        let centerOfPres = history.pres.centerX();
                        let centerOfHold = history.hold.centerX();
                        history.pres = history.hold;
                        history.pres.position = tmp.position;
                        if(centerOfPres - centerOfHold === 1) {
                            history.pres.position++;
                        }else if(centerOfHold - centerOfPres === 1){
                            history.pres.position--;
                        }
                        if(history.pres.isCrash()){
                            history.pres = tmp;
                            break;
                        }
                    }
                    history.hold = tmp;
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