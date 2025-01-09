import {
    MAP_WIDTH,
    MAP_HEIGHT,
    BLOCKS,
    tetrisMap,
    WALL_KICK_RELATIVE_MODEL,
    WALL_KICK_RELATIVE_MODEL_FOR_I,
    WALL_KICK_ABSOLUTE_MODEL,
    WALL_KICK_ABSOLUTE_MODEL_FOR_I
} from "./model.js";

import { 
    deepCopy 
} from "./utility.js";

/** 테트로미노의 종류 목록
 * @constant
 * @type {string[]} 
 * @description "model.BLOCKS"의 키 값와 같다. */
const tetromino = Object.keys(BLOCKS);

/** 테트로미노 블록 객체
 * @constructor
 * @namespace block
 * @property {string} type — 블록의 종류
 * @property {number} rotation — 블록의 회전 상태
 * @property {{x: number, y: number}} position — 블록의 좌표 */
export class block {
    constructor(){
        /** 블록의 종류 이름
         * @type {"O_block"|"L_block"|"J_block"|"I_block"|"S_block"|"Z_block"|"T_block"}
         * @memberof block
         * @instance block#type으로 호출 */
        this.type = popNewBlock();
        /** 블록의 회전 상태
         * @type {number}
         * @memberof block
         * @instance block#rotation으로 호출 */
        this.rotation = 0;
        /** 블록의 좌표
         * @memberof block 
         * @instance block#position으로 호출 */
        this.position = {
            /** 테트로미노의 x좌표
             * @type {number}
             * @alias position.x
             * @memberof! block */
            x: MAP_WIDTH/2 - Math.floor(this.centerX()) - 1,
            /** 테트로미노의 y좌표 
             * @type {number} 
             * @alias position.y
             * @memberof! block */
            y: 1
        };
    }
    /** 테트로미노 객체 위치, 회전 초기화 
     * @function initiate 
     * @memberof block
     * @instance block#initiate로 호출 */
    initiate(){
        this.rotation = 0;
        this.position = {
            x: MAP_WIDTH/2 - Math.floor(this.centerX()) - 1,
            y: 1
        };
    }
    /** 테트로미노 한 눈 위로 올리기
     * @function moveUp 
     * @memberof block
     * @instance block#moveUp으로 호출 */
    moveUp(){
        this.position.y--;
    }
    /** 테트로미노 한 눈 아래로 내리기
     * @function moveDown 
     * @memberof block
     * @instance block#moveDown으로 호출 */
    moveDown(){
        this.position.y++;
    }
    /** 테트로미노 한 눈 왼쪽으로 옮기기 
     * @function moveLeft 
     * @memberof block
     * @instance block#moveLeft로 호출 */
    moveLeft(){
        this.position.x--;
    }
    /** 테트로미노 한 눈 오른쪽으로 옮기기
     * @function moveRight
     * @memberof block
     * @instance block#moveRight로 호출 */
    moveRight(){
        this.position.x++;
    }
    /** 테트로미노 오른쪽으로 돌리기
     * @function rotateR
     * @memberof block
     * @instance block#rotateR로 호출 */
    rotateR() {
        this.rotation++;
        this.rotation %= BLOCKS[this.type].length;
    }
    /** 테트로미노 왼쪽으로 돌리기
     * @function rotateL
     * @memberof block
     * @instance block#rotateL로 호출 */
    rotateL() {
        this.rotation--;
        this.rotation += BLOCKS[this.type].length;
        this.rotation %= BLOCKS[this.type].length;
    }
    /** 하드 드롭 
     * @function hardDrop
     * @memberof block
     * @instance block#hardDrop으로 호출 */
    hardDrop(){
        while(!this.isCrash()){
            this.moveDown();
        }
        this.moveUp();
    }
    /** 테트로미노가 땅이나 벽에 겹치는지 보기
     * @function isCrash
     * @memberof block
     * @instance block#isCrash로 호출 
     * @returns {boolean} 땅이나 벽에 겹치면 true를, 아니면 false를 돌려 준다. */
    isCrash(){
        let test_case = BLOCKS[this.type][this.rotation];
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
    /** 테트로미노가 땅 바로 위에 있는지 보기
     * @function willCrash
     * @memberof block
     * @instance block#willCrash로 호출
     * @returns {boolean} 땅 바로 위에 있으면 true를, 아니면 false를 돌려 준다. */
    willCrash(){
        this.moveDown();
        let result = this.isCrash();
        this.moveUp();
        return result;
    }
    /** T-미노의 세 모서리가 차 있는지 보기
     * @function is3CornerT
     * @memberof block
     * @instance block#is3CornerT로 호출
     * @returns {boolean} 세 모서리 이상 차 있다면 True, 아니라면 False를 돌려 준다. */
    is3CornerT(){
        if(this.type !== 'T_block') return false;
        let corner = 0;
        for(let i = 0; i < 4; i += 2){
            for(let j = 1; j < 4; j += 2){
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
    /** 테트로미노의 가로 중심 찾기
     * @function centerX
     * @memberof block
     * @instance block#centerX로 호출
     * @returns {number} 테트로미노 모양을 기준으로 가로 중심 좌표를 돌려 준다.
     */
    centerX(){
        let leftmost = 3;
        let rightmost = 0;
        BLOCKS[this.type][this.rotation].forEach((row, i) => {
            row.forEach((col, j) => {
                if(col === 1){
                    if(j < leftmost) leftmost = j;
                    if(j > rightmost) rightmost = j;
                }
            });
        });
        return (leftmost + rightmost)/2;
    }
    /** 테트로미노의 세로 중심 찾기
     * @function centerY
     * @memberof block
     * @instance block#centerY로 호출
     * @returns {number} 테트로미노 모양을 기준으로 세로 중심 좌표를 돌려 준다. 
     */
    centerY(){
        let uppermost = 3;
        let downmost = 0;
        BLOCKS[this.type][this.rotation].forEach((row, i) => {
            row.forEach((col, j) => {
                if(col === 1){
                    if(j < uppermost) uppermost = j;
                    if(j > downmost) downmost = j;
                }
            });
        });
        return (uppermost + downmost)/2;
    }
    /** 테트로미노의 그림자(Ghost piece) 좌표
     * @function positionOfShadow
     * @memberof block
     * @instance block#positionOfShadow로 호출
     * @returns {{x: number, y: number}} */
    positionOfShadow(){
        let block_position = deepCopy(this.position);
        this.hardDrop();
        let shadow_position = this.position;
        this.position = block_position;
        return shadow_position;
    }
};
/** 땅 모양(tetrisMap), 다음 블록 리스트(nextBlocks) 초기화
 * @function initiateTetrisMap */
export const initiateTetrisMap = () => {
    tetrisMap.forEach((row, i) => {
        row.forEach((col, j) => {
            tetrisMap[i][j] = -1;
        });
    });
    while(nextBlocks.length > 0){
        nextBlocks.pop();
    }
};
/** 격자 무늬 배경 그리기
 * @function drawBackBoard */
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
/** 땅 모양(tetrisMap) 그리기 
 * @function drawGameBoard */
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
/** 땅 모양(tetrisMap) 지우기
 * @function removeGameBoard */
export const removeGameBoard = () => {
    document.getElementById("blockBoard").innerHTML = ``;
}
/** 떨어지는 블록 그리기
 * @function drawPlayingBlock
 * @param {block} block */
export const drawPlayingBlock = (block) => {
    let sizeOfMap = MAP_WIDTH * MAP_HEIGHT;
    let hidden = 2 * MAP_WIDTH - 1;
    //실제 블록의 위치
    let index = block.position.y*MAP_WIDTH + block.position.x;
    //그림자 블록의 위치
    let shadow_position = block.positionOfShadow();
    let shadow_index = shadow_position.y*MAP_WIDTH + shadow_position.x;

    //그리기
    BLOCKS[block.type][block.rotation].forEach((row, i) => {
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
/** 떨어지는 블록 지우기 
 * @function removePlayingBlock
 * @param {block} block */
export const removePlayingBlock = (block) => {
    let sizeOfMap = MAP_WIDTH * MAP_HEIGHT;
    let hidden = 2*MAP_WIDTH - 1;
    //실제 블록의 위치
    let index = block.position.y*MAP_WIDTH + block.position.x;
    //그림자 블록의 위치
    let shadow_position = block.positionOfShadow();
    let shadow_index = shadow_position.y*MAP_WIDTH + shadow_position.x;

    //지우기
    BLOCKS[block.type][block.rotation].forEach((row, i) => {
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
/** 꽉 찬 줄 번호 찾기
 * @function findFilledRows 
 * @returns {number[]} 땅(tetrisMap)에서 꽉 찬 줄의 번호를 오름차순으로 돌려 준다. */
export const findFilledRows = () => {
    let filledList = [];
    tetrisMap.forEach((row, i) => {
        if(isFull(row))
            filledList.push(i);
    });
    return filledList;
};
/** 땅에서 줄 지우기
 * @function deleteRows
 * @param {number[]} rowsList 땅에서 지울 줄의 번호를 요소로 갖는 배열  */
export const deleteRows = (rowsList) => {
    for(let i of rowsList){
        for(let j = i; j > 0; j--)
            tetrisMap[j] = tetrisMap[j-1];
        tetrisMap[0] = Array.from({length: MAP_WIDTH}, () => -1); 
    }
};
/** next block 그리기 
 * @function drawNext
 * @param {block[]} blockList 다음 나올 블록들의 배열
 * @description 배경의 next block에 다음 나올 블록들을 그린다. */
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
/** next block 지우기 
 * @function removeNext */
export const removeNext = () => {
    let section = document.getElementById("nextSection");
    while(section.getElementsByClassName("small_board").length > 0){
        section.getElementsByClassName("small_board")[0].remove();
    }
};
/** hold block 그리기 
 * @function drawHold
 * @param {block} block 
 * @description 배경의 hold에 쟁여 둔 블록을 그린다.*/
export const drawHold = (block) => {
    if(block != null)
        drawSide("hold", block);
};
/** hold block 지우기 
 * @function removeHold */
export const removeHold = () => {
    document.getElementById("hold").innerHTML = ``;    
};
/** HOLD 또는 NEXT의 블록 그리기
 * @function drawSide
 * @param {string} id 그려질 곳의 HTMLElement의 id
 * @param {block} block 그릴 block 객체
 */
const drawSide = (id, block) => {
    let center = block.centerX();
    let section = document.getElementById(id);
    const htmlList = [];
    BLOCKS[block.type][block.rotation].forEach((row, i)=>{
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
/** 땅에 블록 굳히기 
 * @function lockBlock
 * @param {block} block 땅에 굳힐 블록 객체 */
export const lockBlock = (block) => {
    let cor_y = block.position.y;
    let cor_x = block.position.x;
    BLOCKS[block.type][block.rotation].forEach((row, i) => {
        row.forEach((col, j) => {
            if((cor_x + j) >= 0 && (cor_y + i) >= 0 && col === 1){
                tetrisMap[cor_y + i][cor_x + j] = tetromino.indexOf(block.type);
            }
        });
    });
};
/** 테트로미노를 돌릴 때 벽 또는 땅에 부딪히면 벽 차기 실행
 * @function
 * @param {block} block 회전할 블록
 * @param {"left"|"right"} direction 회전 방향 설정
 * @returns {boolean} 벽 차기가 일어나면 True를, 안 일어나면 False를 돌려 준다. */
export const wallKick = (block, direction) => {
    let model = (block.type === "I_block")?
        WALL_KICK_RELATIVE_MODEL_FOR_I[direction][block.rotation] : WALL_KICK_RELATIVE_MODEL[direction][block.rotation];
    for(let i = 0; i < model.length; i++){  
        let n = (i + 1) % model.length;
        block.position.x += model[n].x - model[i].x;
        block.position.y += model[n].y - model[i].y;
        if(!block.isCrash()) return true;
    }
    return false;
};
/** 퍼펙트 클리어인지 보기
 * @function isPerfectClear
 * @returns {boolean} 땅(tetrisMap)이 모두 비었으면 True를, 아니라면 False를 돌려 준다. */
export const isPerfectClear = () => {
    for(let row of tetrisMap)
        for(let el of row)
            if(el !== -1)
                return false;
    return true;
};
/** 7-bag: 일곱 가지 테트로미노 이름을 무작위 순서로 담는 배열
 * @type {string[]}  */
const nextBlocks = [];
/** nextBlocks에서 마지막 블록 꺼내기 
 * @function popNewBlock
 * @returns {string}
 * @description nextBlocks에 아무것도 없으면, nextBlocks에 무작위 배열을 다시 넣고서 마지막 요소를 돌려 준다. */
const popNewBlock = () => {
    if(nextBlocks.length === 0)
        generateRandomPermutation(tetromino.length)
            .map((num) => tetromino[num])
            .forEach((value) => {nextBlocks.push(value)});
    // console.log(nextBlocks);
    return nextBlocks.pop();
};
/** 숫자 0부터 n-1까지 무작위 배열 만들기
 * @function generateRandomPermutation
 * @param {number} n 만들고자 하는 배열의 길이
 * @returns {number[]} 0부터 n-1까지의 무작위 배열 */
const generateRandomPermutation = (n) => {
    let permutation = Array.from({length : n}, (v, i) => i);
    permutation.sort(() => Math.random() - 0.5);
    // console.log(permutation);
    return permutation;
};
/** 줄이 꽉 찼는지 보기 
 * @function isFull
 * @param {number[]} row
 * @returns {boolean} 모든 요소가 -1(빈땅)이 아닌 값을 차 있다면 True, 하나라도 -1(빈땅)인 값이 있다면 False를 돌려 준다. */
const isFull = (row) => {
    for(let el of row){
        if(el === -1) return false;
    }
    return true;
};
/** 벽차기 절대 좌표 모델에서 상대 좌표 얻기 
 * @function getWallKickOffset
 * @param {block} block
 * @param {"left"|"right"} direction
 * @returns {{x:number, y:number}[]} */
const getWallKickOffset = (block, direction) => {
    let model = (block.type === "I_block")? WALL_KICK_ABSOLUTE_MODEL_FOR_I : WALL_KICK_ABSOLUTE_MODEL;
    let index = block.rotation;
    let prevIndex = (direction === 'right')? (index + model.length - 1) % model.length : 
                    (direction === 'left')?  (index + 1) % model.length : index;
    let offset = [];
    for(let i = 0; i < model[index].left; i++)
        offset.push({x: model[prevIndex].x - model[index].x, y: model[prevIndex].y - model[index].y});

    return offset;
};