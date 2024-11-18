import {model, blocks, tetrisMap} from "./model.js";

export class block {
    constructor(){
        this.type = model[Math.floor(Math.random()*7)]; //블록 타입 이름
        this.position = tetrisMap[0].length/2;
        this.rotation = 0;
    }

    rotateR() {
        if(isCrash()){
            this.rotation++;
            this.rotation %= blocks[type].length;
        }
    }
    rotateL() {
        if(isCrash()){
            this.rotation--;
            this.rotation += blocks[type].length;
            this.rotation %= blocks[type].length;
        }
    }
    isCrash(){
        //블록이 충돌하는지
        return false;
    }
};

//떨어지는 블록 + 그림자
export const drawPlayingBlock = (block) => {
    drawBlock(block);
    drawShadow(block);
};

export const removePlayingBlock = (block) => {

};

//게임판 그리기
export const drawGameBoard = () => {
    let innerScript = "";
    tetrisMap.forEach((row, i)=>{
        // console.log(row);
        row.forEach((num, j) => {
            if(num > -1)
                innerScript += `<div class="block ${model[num]}" id="square_${row.length*i + j}"></div>\n`;
            else
            innerScript += `<div class="block" id="square_${row.length*i + j}"></div>\n`;
        })
    });
    document.getElementById("board").innerHTML = innerScript;
};

export const deleteRows = () => {};

// 떨어지는 블록 그리기
const drawBlock = (block) => {
    let numOfCols = tetrisMap[0].length;
    let numOfRows = tetrisMap.length;
    let sizeOfMap = numOfCols * numOfRows;
    let index = block.position - numOfCols - 2;

    blocks[block.type][block.rotation].forEach((row, i) => {
        console.log(row);        
        row.forEach((col, j) => {
            let id_num = index + j;
            if(id_num >= 0 && id_num < sizeOfMap && col == 1){
                document.getElementById(`square_${id_num}`).className += ` ${block.type}`;
            }
        });
        index += numOfCols;
    });

};

// 떨어지는 블록 그림자 그리기
const drawShadow = (block) => {};

// next block 그리기
const drawNextBlock = (block) => {};

// saved block 그리기
const drawSavedBlock = (block) => {};

const detour = () => {}; // 충돌일 때
const isFull = (row) => {};

const inputkey = (e) =>{};
