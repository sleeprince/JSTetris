import { drawGameBoard, block } from "./function.js";

const history = {
    now: new block(),
    next: new block(),
    saved: null
};

console.log("let's start");
console.log(`now:${history.now.type}, next:${history.next.type}`);

drawGameBoard();
