import {tetromino, blocks, tetrisMap} from "./model.js";

const nextBlocks = [];

export class block {
    constructor(){
        this.type = tetromino[Math.floor(Math.random()*7)]; //블록 타입 이름
        this.rotation = 0;
        this.position = tetrisMap[0].length*1.5 - Math.floor(this.centerX()) + 1;
    }
    initiate(){
        this.rotation = 0;
        this.position = tetrisMap[0].length*1.5 - Math.floor(this.centerX()) + 1;
    }
    moveUp(){
        this.position -= tetrisMap[0].length;
    }
    moveDown(){
        this.position += tetrisMap[0].length;
    }
    moveLeft(){
        if(this.position % tetrisMap[0].length !== 0)
            this.position--;
    }
    moveRight(){
        if((this.position + 1) % tetrisMap[0].length !== 0)
            this.position++;
    }
    rotateR() {
        this.rotation++;
        this.rotation %= blocks[this.type].length;
    }
    rotateL() {
        this.rotation--;
        this.rotation += blocks[this.type].length;
        this.rotation %= blocks[this.type].length;
    }
    jumpDown(){
        while(!this.isCrash()){
            this.moveDown();
        }
        this.moveUp();
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
                    // console.log(`x: ${x}, y:${y}`);
                    if(y < 0){
                        continue;
                    }else if(y >= numOfRows || x < 0 || x >= numOfCols){
                        return true;
                    }else if(tetrisMap[y][x] > -1){                        
                        return true;
                    }
                }
            }
        }
        return false;
    }
    centerX(){
        let leftmost = 3;
        let rightmost = 0;
        blocks[this.type][this.rotation].forEach((row, i) => {
            row.forEach((col, j) => {
                if(col === 1){
                    if(j < leftmost) leftmost = j;
                    if(j > rightmost) rightmost = j;
                }
            });
        });
        return (leftmost + rightmost)/2;
    }
    centerY(){
        let uppermost = 3;
        let downmost = 0;
        blocks[this.type][this.rotation].forEach((row, i) => {
            row.forEach((col, j) => {
                if(col === 1){
                    if(j < uppermost) uppermost = j;
                    if(j > downmost) downmost = j;
                }
            });
        });
        return (uppermost + downmost)/2;
    }
};
//떨어지는 블록 그리기
export const drawPlayingBlock = (block) => {
    let numOfCols = tetrisMap[0].length;
    let numOfRows = tetrisMap.length;
    let sizeOfMap = numOfCols * numOfRows;
    let hidden = 2 * numOfCols - 1;
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

    //그리기
    blocks[block.type][block.rotation].forEach((row, i) => {
        // console.log(row);
        row.forEach((col, j) => {
            let id_num = index + j;
            let shadow_id = shadow_index + j;
            //그림자
            if(shadow_id >= 0 && shadow_id > hidden && shadow_id < sizeOfMap && col == 1){
                document.getElementById(`square_${shadow_id}`).className = `block ${block.type} shadow`;
                document.getElementById(`square_${shadow_id}`).innerHTML = `<div class="innerBlock"></div>`;
            }
            //실물
            if(id_num >= 0 && id_num > hidden && id_num < sizeOfMap && col == 1){
                document.getElementById(`square_${id_num}`).className = `block ${block.type}`;
                document.getElementById(`square_${id_num}`).innerHTML = `<div class="innerBlock"></div>`;
            }            
        });
        index += numOfCols;
        shadow_index += numOfCols;
    });
};
//떨어지는 블록 지우기
export const removePlayingBlock = (block) => {
    let numOfCols = tetrisMap[0].length;
    let numOfRows = tetrisMap.length;
    let sizeOfMap = numOfCols * numOfRows;
    let hidden = 2*numOfCols - 1;
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

    //지우기
    blocks[block.type][block.rotation].forEach((row, i) => {
        // console.log(row);
        row.forEach((col, j) => {
            let id_num = index + j;
            let shadow_id = shadow_index + j;
            //그림자
            if(shadow_id >= 0 && shadow_id > hidden && shadow_id <sizeOfMap && col == 1){
                document.getElementById(`square_${shadow_id}`).className = `block`;
                document.getElementById(`square_${shadow_id}`).innerHTML = ``;
            }
            //실물
            if(id_num >= 0 && id_num > hidden && id_num < sizeOfMap && col == 1){
                document.getElementById(`square_${id_num}`).className = `block`;
                document.getElementById(`square_${id_num}`).innerHTML = ``;
            }            
        });
        index += numOfCols;
        shadow_index += numOfCols;
    });
};
//게임판 그리기
export const drawGameBoard = () => {
    let innerScript = "";
    tetrisMap.forEach((row, i) => {
        // console.log(row);
        if(i > 1){
            row.forEach((num, j) => {
                if(num > -1)
                    innerScript += `<div class="block ${tetromino[num]}" id="square_${row.length*i + j}"><div class="innerBlock"></div></div>\n`;
                else
                    innerScript += `<div class="block" id="square_${row.length*i + j}"></div>\n`;
            })
        }
    });
    document.getElementById("board").innerHTML = innerScript;
};
//줄 지우기
export const deleteRows = () => {
    //꽉 찬 줄 확인
    let filledList = [];
    tetrisMap.forEach((row, i) => {
        if(isFull(row)) filledList.push(i);
    });
    //지우기
};
// next block 그리기
export const drawNext = (block) => {
    let center = block.centerX();
    let nextDiv = document.getElementById("next_0");
    const htmlList = [];
    blocks[block.type][block.rotation].forEach((row, i)=>{
        row.forEach((col, j) => {            
            if(col === 1){
                htmlList.push(`<div class="small_block ${block.type}"><div class="innerBlock"></div></div>\n`);
            }else{
                htmlList.push(`<div class="small_block"></div>\n`);
            }
        });
    });
    nextDiv.style = `left: ${42 - 16*center}%`
    nextDiv.innerHTML = htmlList.join("");
};
// hold block 그리기
export const drawHold = (block) => {
    let center = block.centerX();
    let holdDiv = document.getElementById("hold");
    const htmlList = [];
    blocks[block.type][block.rotation].forEach((row, i)=>{
        row.forEach((col, j) => {            
            if(col === 1){
                htmlList.push(`<div class="small_block ${block.type}"><div class="innerBlock"></div></div>\n`);
            }else{
                htmlList.push(`<div class="small_block"></div>\n`);
            }
        });
    });
    holdDiv.style = `left: ${42 - 16*center}%`;
    holdDiv.innerHTML = htmlList.join("");
};
// 내려온 블록 굳히기
export const lockBlock = (block) => {
    let cor_y = Math.floor(block.position / tetrisMap[0].length) - 1;
    let cor_x = block.position % tetrisMap[0].length - 2;
    blocks[block.type][block.rotation].forEach((row, i) => {
        row.forEach((col, j) => {
            if((cor_x + j) >= 0 && (cor_y + i) >= 0 &&  col === 1){
                tetrisMap[cor_y + i][cor_x + j] = tetromino.indexOf(block.type);
            }
        });
    });    
};

const popBlock = () => {
    if(nextBlocks.length === 0){
        for(let i = tetromino.length; i > 0; i--){

        }
        for(let block of tetromino) tetromino.push(block);        
    }
};

const isFull = (row) => {
    for(let el of row){
        if(el === -1) return false;
    }
    return true;
};