var line = 0;
var level = 0;
var score = 0;
var combo = 0;
var delay = 1000;

export const addLines = (n) => {
    line += n;
    level = Math.floor(line / 10);
    if(n === 0) combo = 0;
    else combo++;
};

const tSpin = (block) => {

};
