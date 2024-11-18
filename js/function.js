import {model, blocks, tetrisMap} from "./model.js";

export class block {
    constructor(){
        this.type = model[Math.floor(Math.random()*7)];
        this.position = 5;
        this.rotation = 0;
    }
    rotateR() {
        if(!isCrash){
            this.rotation++;
            this.rotation %= blocks[type].length;
        }
    }
    rotateL() {
        if(!isCrash){
            this.rotation--;
            this.rotation += blocks[type].length;
            this.rotation %= blocks[type].length;
        }
    }
};
//떨어지는 블록 + 그림자
export const drawPlayingBlock = (block) => {
    drawBlock(block);
    drawShadow(block);
};
//게임판 그리기
export const drawGameBoard = () => {
    let innerScript = "";
    tetrisMap.forEach((row, i)=>{
        // console.log(row);
        row.forEach((num, j) => {
            if(num > -1)
                innerScript += `<div class="block ${model[num]}" id="${10*i + j}"></div>\n`;
            else
            innerScript += `<div class="block" id="${10*i + j}"></div>\n`;
        })
    });
    document.getElementById("board").innerHTML = innerScript;
};
export const deleteRows = () => {};
export const ground = () => {};
// 굳은 부분 그리기

// 떨어지는 블록 그리기
const drawBlock = (block) => {
    
};
// 떨어지는 블록 그림자 그리기
const drawShadow = (block) => {};

// next block 그리기
const drawNextBlock = (block) => {};

//
const isCrash = (tetrisMap) => {};
const detour = () => {}; // 충돌일 때
const isFull = (row) => {};

const inputkey = (e) =>{};
