import {model, blocks, tetrisMap} from "./model.js";

export class block {
    constructor(){
        this.type = model[Math.floor(Math.random()*7)]; //블록 타입 이름
        this.position = tetrisMap[0].length/2;
        this.rotation = 0;
    }
    moveUp(){
        this.position -= tetrisMap[0].length;
    }
    moveDown(){
        this.position += tetrisMap[0].length;
    }
    moveLeft(){
        this.position--;
    }
    moveRight(){
        this.position++;
    }
    rotateR() {
        this.rotation++;
        this.rotation %= blocks[type].length;
    }
    rotateL() {
        this.rotation--;
        this.rotation += blocks[type].length;
        this.rotation %= blocks[type].length;
    }
    isCrash(){
        //블록이 충돌하는지
        let numOfCols = tetrisMap[0].length;
        let numOfRows = tetrisMap.length;
        let cor_x = (this.position % numOfCols) - 2;
        let cor_y = Math.floor(this.position / numOfCols) - 1;
        let test_case = blocks[this.type][this.rotation];
        for(let i = 0; i < test_case.length; i++){
            for(let j = 0; j < test_case[i].length; j++){
                if(test_case[i][j] === 1){
                    let x = cor_x + j;
                    let y = cor_y + i;
                    console.log(`x: ${x}, y:${y}`);
                    if(y < 0){
                        continue;
                    }else if(y >= numOfRows || x >= numOfCols || x < 0){
                        return true;
                    }else if(tetrisMap[y][x] > -1){                        
                        return true;
                    }
                }
            }
        }
        return false;
    }
};

//떨어지는 블록 + 그림자
export const drawPlayingBlock = (block) => {
    let numOfCols = tetrisMap[0].length;
    let numOfRows = tetrisMap.length;
    let sizeOfMap = numOfCols * numOfRows;
    //실제 블록의 위치
    let loc = block.position;
    let index = loc - numOfCols - 2;
    //그림자 블록의 위치
    let shadow_loc = block.position;
    block.position = shadow_loc;
    while(!block.isCrash()){
        block.moveDown();
    }
    block.moveUp();
    shadow_loc = block.position;
    block.position = loc;
    let shadow_index = shadow_loc - numOfCols - 2;
    console.log(shadow_index);
    //그리기
    blocks[block.type][block.rotation].forEach((row, i) => {
        console.log(row);
        row.forEach((col, j) => {
            let id_num = index + j;
            let shadow_id = shadow_index + j;
            if(id_num >= 0 && id_num < sizeOfMap && col == 1){
                //실물
                document.getElementById(`square_${id_num}`).className += ` ${block.type}`;
            }
        });
        index += numOfCols;
    });
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

// next block 그리기
const drawNext = (block) => {};

// hold block 그리기
const drawHold = (block) => {};

const detour = () => {}; // 충돌일 때
const isFull = (row) => {};

const inputkey = (e) =>{};
