import {
    MAP_WIDTH,
    MAP_HEIGHT,
    tetromino,
    blocks,
    tetrisMap,
    wallKickModel,
    wallkickModelForI
} from "./model.js";

export class block {
    constructor(){
        this.type = popNewBlock(); //블록 타입 이름
        this.rotation = 0;
        this.position = {
            x: MAP_WIDTH/2 - Math.floor(this.centerX()) - 1,
            y: 1
        };
    }
    initiate(){
        this.rotation = 0;
        this.position = {
            x: MAP_WIDTH/2 - Math.floor(this.centerX()) - 1,
            y: 1
        };
    }
    moveUp(){
        this.position.y--;
    }
    moveDown(){
        this.position.y++;
    }
    moveLeft(){
        this.position.x--;
    }
    moveRight(){
        this.position.x++;
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
    hardDrop(){
        while(!this.isCrash()){
            this.moveDown();
        }
        this.moveUp();
    }
    isCrash(){
        //블록이 충돌하는지
        let test_case = blocks[this.type][this.rotation];
        for(let i = 0; i < test_case.length; i++){
            for(let j = 0; j < test_case[i].length; j++){
                if(test_case[i][j] === 1){
                    let x = this.position.x + j;
                    let y = this.position.y + i;
                    // console.log(`x: ${x}, y:${y}`);
                    if(y < 2){
                        continue;
                    }else if(y >= MAP_HEIGHT || x < 0 || x >= MAP_WIDTH){
                        return true;
                    }else if(tetrisMap[y][x] > -1){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    willCrash(){
        this.moveDown();
        let result = this.isCrash();
        this.moveUp();
        return result;
    }
    is3CornerT(){
        if(this.type !== 'T_block') return false;
        let corner = 0;
        for(let i = 0; i < 4; i += 2){
            for(let j = 1; i < 4; j += 2){
                let x = this.position.x + j;
                let y = this.position.y + i;
                if(y < 2){
                    continue;
                }else if(y >= MAP_HEIGHT || x < 0 || x >= MAP_WIDTH){
                    corner++;
                }else if(tetrisMap[y][x] > -1){
                    corner++;
                }
            }
        }
        if(corner > 2) return true;
        else return false;
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
    positionOfShadow(){
        let block_position = deepCopy(this.position);
        this.hardDrop();
        let shadow_position = this.position;
        this.position = block_position;
        return shadow_position;
    }
};
//배경레이어 그리기
export const drawBackBoard = () => {
    let innerScript = "";
    tetrisMap.forEach((row, i) => {
        if(i > 1){
            row.forEach((num, j) => {
                innerScript += `<div class="grid" id="squre_${row.length*i + j}"></div>\n`;
            })
        }
    });
    document.getElementById("backBoard").innerHTML = innerScript;
};
//게임판 그리기
export const drawGameBoard = () => {
    let innerScript = "";
    tetrisMap.forEach((row, i) => {
        // console.log(row);
        if(i > 1){
            row.forEach((num, j) => {
                if(num > -1)
                    innerScript += `<div class="block ${tetromino[num]}" id="block_${row.length*i + j}"><div class="innerBlock"></div></div>\n`;
                else
                    innerScript += `<div class="none" id="block_${row.length*i + j}"></div>\n`;
            })
        }
    });
    document.getElementById("blockBoard").innerHTML = innerScript;
};
// 게임판 지우기
export const removeGameBoard = () => {
    document.getElementById("blockBoard").innerHTML = ``;
}
//떨어지는 블록 그리기
export const drawPlayingBlock = (block) => {
    let sizeOfMap = MAP_WIDTH * MAP_HEIGHT;
    let hidden = 2 * MAP_WIDTH - 1;
    //실제 블록의 위치
    let index = block.position.y*MAP_WIDTH + block.position.x;
    //그림자 블록의 위치
    let shadow_position = block.positionOfShadow();
    let shadow_index = shadow_position.y*MAP_WIDTH + shadow_position.x;

    //그리기
    blocks[block.type][block.rotation].forEach((row, i) => {
        // console.log(row);
        row.forEach((col, j) => {
            let id_num = index + j;
            let shadow_id = shadow_index + j;
            //그림자
            if(shadow_id >= 0 && shadow_id > hidden && shadow_id < sizeOfMap && col === 1){
                document.getElementById(`block_${shadow_id}`).className = `block ${block.type} shadow`;
                document.getElementById(`block_${shadow_id}`).innerHTML = `<div class="innerBlock"></div>`;
            }
            //실물
            if(id_num >= 0 && id_num > hidden && id_num < sizeOfMap && col === 1){
                document.getElementById(`block_${id_num}`).className = `block ${block.type}`;
                document.getElementById(`block_${id_num}`).innerHTML = `<div class="innerBlock"></div>`;
            }            
        });
        index += MAP_WIDTH;
        shadow_index += MAP_WIDTH;
    });
};
//떨어지는 블록 지우기
export const removePlayingBlock = (block) => {
    let sizeOfMap = MAP_WIDTH * MAP_HEIGHT;
    let hidden = 2*MAP_WIDTH - 1;
    //실제 블록의 위치
    let index = block.position.y*MAP_WIDTH + block.position.x;
    //그림자 블록의 위치
    let shadow_position = block.positionOfShadow();
    let shadow_index = shadow_position.y*MAP_WIDTH + shadow_position.x;

    //지우기
    blocks[block.type][block.rotation].forEach((row, i) => {
        // console.log(row);
        row.forEach((col, j) => {
            let id_num = index + j;
            let shadow_id = shadow_index + j;
            //그림자
            if(shadow_id >= 0 && shadow_id > hidden && shadow_id <sizeOfMap && col == 1){
                document.getElementById(`block_${shadow_id}`).className = `none`;
                document.getElementById(`block_${shadow_id}`).innerHTML = ``;
            }
            //실물
            if(id_num >= 0 && id_num > hidden && id_num < sizeOfMap && col == 1){
                document.getElementById(`block_${id_num}`).className = `none`;
                document.getElementById(`block_${id_num}`).style = `none`;
                document.getElementById(`block_${id_num}`).innerHTML = ``;
            }            
        });
        index += MAP_WIDTH;
        shadow_index += MAP_WIDTH;
    });
};
//꽉 찬 줄 번호 찾기
export const findFilledRows = () => {
    let filledList = [];
    tetrisMap.forEach((row, i) => {
        if(isFull(row))
            filledList.push(i);
    });
    return filledList;
};
//줄 지우기
export const deleteRows = (filledList) => {
    for(let i of filledList){
        for(let j = i; j > 0; j--)
            tetrisMap[j] = tetrisMap[j-1];
        tetrisMap[0] = Array.from({length: MAP_WIDTH}, () => -1); 
    }
};
// next block 그리기
export const drawNext = (blockList) => {
    let section = document.getElementById("nextSection");
    while(section.getElementsByClassName("small_board").length > 0){
        section.getElementsByClassName("small_board")[0].remove();
    }
    blockList.forEach((block, i) => {
        let node = document.createElement("div");
        node.className = "small_board";
        node.id = `next_${i}`;
        section.appendChild(node);
        drawSide(node.id, block);
        if(block.type === 'I_block')
            node.style.top = `${-3*i - 1.6}dvh`;
        else
            node.style.top = `${-3*i}dvh`;
    });
};
// next block 지우기
export const removeNext = () => {
    let section = document.getElementById("nextSection");
    while(section.getElementsByClassName("small_board").length > 0){
        section.getElementsByClassName("small_board")[0].remove();
    }
};
// hold block 그리기
export const drawHold = (block) => {
    if(block != null || block != undefined)
        drawSide("hold", block);
};
// hold block 지우기
export const removeHold = () => {
    document.getElementById("hold").innerHTML = ``;    
};
// id: html id attribution, block: block class object
const drawSide = (id, block) => {
    let center = block.centerX();
    let section = document.getElementById(id);
    const htmlList = [];
    blocks[block.type][block.rotation].forEach((row, i)=>{
        row.forEach((col, j) => {            
            if(col === 1){
                htmlList.push(`<div class="block ${block.type}"><div class="innerBlock"></div></div>\n`);
            }else{
                htmlList.push(`<div></div>\n`);
            }
        });
    });
    section.style.left = `${42 - 16*center}%`;
    if(block.type === 'I_block') section.style.top = '-1.6dvh';
    else section.style.top = '0dvh';
    section.innerHTML = htmlList.join("");
};
// 내려온 블록 굳히기
export const lockBlock = (block) => {
    let cor_y = block.position.y;
    let cor_x = block.position.x;
    blocks[block.type][block.rotation].forEach((row, i) => {
        row.forEach((col, j) => {
            if((cor_x + j) >= 0 && (cor_y + i) >= 0 && col === 1){
                tetrisMap[cor_y + i][cor_x + j] = tetromino.indexOf(block.type);
            }
        });
    });
};
// 돌릴 때 부딪히면 벽차기 direction은 "left"/"right"
export const wallKick = (block, direction) => {
    let model = (block.type === "I_block")?
        wallkickModelForI[direction][block.rotation] : wallKickModel[direction][block.rotation];
    for(let i = 0; i < model.length; i++){  
        let n = (i + 1) % model.length;
        block.position.x += model[n].x - model[i].x;
        block.position.y += model[n].y - model[i].y;
        if(!block.isCrash()) return true;
    }
    return false;
};
// 일곱 가지 tetromino를 무작위 순서로 담을 배열
const nextBlocks = [];
// nextBlocks의 마지막 블록 꺼내기
const popNewBlock = () => {
    if(nextBlocks.length === 0)
        generateRandomPermutation(tetromino.length)
            .map((num) => tetromino[num])
            .forEach((value) => {nextBlocks.push(value)});
    // console.log(nextBlocks);
    return nextBlocks.pop();
};
// 숫자 0부터 n-1까지 무작위 배열 만들기
const generateRandomPermutation = (n) => {
    let permutation = Array.from({length : n}, (v, i) => i);
    permutation.sort(() => Math.random() - 0.5);
    // console.log(permutation);
    return permutation;
};
// 줄이 꽉 찼는지 여부 리턴
const isFull = (row) => {
    for(let el of row){
        if(el === -1) return false;
    }
    return true;
};
// 간단한 모델用
// const makeOffsetModel = (block, direction) => {
//     let model = (block.type === "I_block")? wallkickModelForI : wallKickModel;
//     let index = block.rotation;
//     let prevIndex = (direction === 'right')? (index + model.length - 1) % model.length : 
//                     (direction === 'left')?  (index + 1) % model.length : index;
//     let offset = [];
//     for(let i = 0; i < model[index].left; i++)
//         offset.push({x: model[prevIndex].x - model[index].x, y: model[prevIndex].y - model[index].y});

//     return offset;    
// };
const deepCopy = (object) => {
    if(object === null || typeof object !== "object")
        return object;
    
    let new_object = (Array.isArray(object))? [] : {};
    
    for(let key of Object.keys(object))
        new_object[key] = deepCopy(object[key]);
    
    return new_object;
};