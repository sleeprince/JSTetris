import { drawGameBoard, drawPlayingBlock, block } from "./function.js";

const history = {
    prev: null,
    now: new block(),
    next: new block(),
    saved: null
};

console.log("let's start");
console.log(`now:${history.now.type}, next:${history.next.type}`);

drawGameBoard();
drawPlayingBlock(history.now);
