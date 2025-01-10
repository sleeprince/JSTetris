import { block } from "./blockFunction.js";
import { makeAnimation } from "./utility.js";
import {COLORS, BLOCKS, MAP_WIDTH, MAP_HEIGHT} from "./model.js";

/** 땅이 굳기 전 애니메이션의 동작 상태를 가리킨다.
 * @type {boolean} */
var lockingOn = false;
/** 땅이 굳기 전 애니메이션의 동작 상태 얻기
 * @function isLockingOn
 * @returns {boolean} 애니메이션을 이어 할 때는 True를, 그칠 때는 False를 돌려 준다. */
const isLockingOn = () => {
    return lockingOn;
};
/** 땅에 굳기 전 애니메이션의 동작 상태 설정
 * @function setLockingOn
 * @param {boolean} value 애니메이션을 이어 하려거든 True를, 그치려거든 False를 넣는다. */
const setLockingOn = (value) => {
    lockingOn = value;
};
/** 테트로미노가 땅에 굳기 전 애니메이션
 * @async
 * @function lockingBlockAnimation
 * @param {block} block 굳힐 블록 객체
 * @param {number} duration 애니메이션 재생 시간(ms)
 * @returns {Promise<boolean>} 애니메이션을 끝까지 마쳤다면 True를, 못 마쳤다면 False를 돌려 준다. */
export const lockingBlockAnimation = async (block, duration) => {    
    setLockingOn(true);
    let elements = getBlockElements(block);
    let end = await BlackeningLockingAnimation(elements, duration);
    if(end || !end) setLockingOn(false);
    return end;
};
/** 땅에 굳기 전 애니메이션 그치기 
 * @function cancelLockingBlockAnimation */
export const cancelLockingBlockAnimation = () => {
    setLockingOn(false);    
};
/** 땅에 굳는 애니메이션
 * @async
 * @function lockedBlockAnimation
 * @param {block} block 굳는 블록 객체
 * @param {number} duration 애니메이션 재생 시간(ms)
 * @returns {Promise<boolean>} 애니메이션이 마치면 True를 돌려 준다. */
export const lockedBlockAnimation = async (block, duration) => {
    let elements = getBlockElements(block)
    let end = await whiteningAnimation(elements, duration);
    return end;
};
/** 줄 지움 애니메이션
 * @async
 * @function deletingRowsAnimation
 * @param {number[]} rows 땅의 가로줄 번호 배열
 * @param {number} duration 애니메이션 재생 시간(ms)
 * @returns {Promise<boolean>} 애니메이션이 마치면 True를 돌려 준다. */
export const deletingRowsAnimation = async (rows, duration) => {
    let whiteningDuration = 80;
    let elements = getRowElements(rows);
    let end = await whiteningAnimation(elements, whiteningDuration)
        .then((result) => {
            if(result)
                return bluringFromWhiteAnimation(elements, duration - whiteningDuration);
        });
    return end;
};
/** 하드 드롭 애니매이션
 * @async
 * @function hardDropingAnimation
 * @param {block} block 떨어뜨릴 블록 객체
 * @returns {Promise<boolean>} 애니메이션이 마치면 True를 돌려 준다. */
export const hardDropingAnimation = async (block) => {
    let tailNode = makeTailNode(block);
    let tetrominoNode = makeHardDropNode(block);
    let end = await Promise.all([longTailAnimation(tailNode, 10), dropBlockAnimation(tetrominoNode, 10)])
        .then((values) => {
            if(values[0] && values[1])
                return Promise.all([deletingNodeAnimation(tailNode, 80), deletingNodeAnimation(tetrominoNode, 100)]);
        })
        .then((values) => {
            if(values[0] && values[1])
                return true;
        });
    return end;
};
/** 블록이 땅에 굳기 전 블록이 까매지는 애니메이션
 * @async
 * @function BlackeningLockingAnimation
 * @param {HTMLElement[]} elements 대상이 되는 HTML요소의 배열
 * @param {number} duration 애니메이션 재생 시간(ms)
 * @returns {Promise<boolean>} 애니메이션이 마치면 True를, 미처 마치지 못하고 그치면 false를 돌려 준다. */
const BlackeningLockingAnimation = (elements, duration) => {
    let ratio = 0;
    let final_ratio = 1;
    let stride = 0.05;
    return makeAnimation(ratio, final_ratio, stride, elements, duration,
        (nodes, property) => {setBlockColor(nodes, {r:0, g:0, b:0}, property, 1)},
        isLockingOn
    );
};
/** 블록이 하얘지는 애니메이션
 * @async
 * @function whiteningAnimation
 * @param {HTMLElement[]} elements 대상이 되는 HTML요소의 배열
 * @param {number} duration 애니메이션 재생 시간(ms)
 * @returns {Promise<boolean>} 애니메이션이 마치면 True를 돌려 준다. */
const whiteningAnimation = (elements, duration) => {
    let ratio = 0;
    let final_ratio = 1;
    let stride = 0.05;
    return makeAnimation(ratio, final_ratio, stride, elements, duration,
        (nodes, property) => {setBlockColor(nodes, {r: 255, g: 255, b: 255}, property, 1)},
        () => true
    );
};
/** 꽉 찬 줄을 지울 때, 블록이 흐려지며 사라지는 애니메이션
 * @async
 * @function bluringFromWhiteAnimation
 * @param {HTMLElement[]} elements 대상이 되는 HTML요소의 배열
 * @param {number} duration 애니메이션 재생 시간(ms)
 * @returns {Promise<boolean>} 애니메이션이 마치면 True를 돌려 준다. */
const bluringFromWhiteAnimation = (elements, duration) => {
    let ratio = 1;
    let final_ratio = 0;
    let stride = 0.05;
    return makeAnimation(ratio, final_ratio, stride, elements, duration,
        (nodes, property) => {setBlockColor(nodes, {r: 255, g: 255, b: 255}, property, property)},
        () => true
    );
};
/** 블록의 빛깔 바꾸기
 * @function setBlockColor
 * @param {HTMLElement[]} elements 대상이 되는 HTML요소의 배열
 * @param {{r:number, g:number, b:number}} rgb 넣을 빛깔(0–255)
 * @param {number} ratio 본래 빛깔과 넣을 빛깔의 비율(0–1)
 * @param {number} opacity 불투명도(0–1) */
const setBlockColor = (elements, rgb, ratio, opacity) => {
    elements.forEach((element) => {
        let blockType = element.className.split(" ")[1];
        element.style.backgroundColor = `rgba(${rgb.r*ratio + COLORS[blockType].r*(1-ratio)},
            ${rgb.g*ratio + COLORS[blockType].g*(1-ratio)},
            ${rgb.b*ratio + COLORS[blockType].b*(1-ratio)},
            ${opacity})`;
    });
};
/** HTML요소의 빛깔 섞기
 * @function mixTwoColors
 * @param {HTMLElement[]} elements 바꿀 HTML요소의 배열
 * @param {{r:number, g:number, b:number}} rgb_now 본래의 빛깔(0–255)
 * @param {{r:number, g:number, b:number}} rgb_then 섞을 빛깔(0–255)
 * @param {number} ratio rgb_now 대 rgb_then의 비율(0–1)
 * @param {number} opacity 불투명도(0–1) */
const mixTwoColors = (elements, rgb_now, rgb_then, ratio, opacity) => {
    elements.forEach((element) => {
        element.style.backgroundColor = `rgba(${rgb_then.r*ratio + rgb_now.r*(1-ratio)},
            ${rgb_then.g*ratio + rgb_now.g*(1-ratio)},
            ${rgb_then.b*ratio + rgb_now.b*(1-ratio)},
            ${opacity})`;
    });
};
/** 테트로미노가 그려진 HTML요소 얻기
 * @function getBlockElements
 * @param {block} block 찾을 블록 객체
 * @returns {HTMLElement[]} */
const getBlockElements = (block) => {
    let elements = [];
    let sizeOfMap = MAP_WIDTH * MAP_HEIGHT;
    let hidden = 2 * MAP_WIDTH - 1;
    let index = block.position.y*MAP_WIDTH + block.position.x;
    BLOCKS[block.type][block.rotation].forEach((row, i) => {
        row.forEach((col, j) => {
            let id_num = index + j;
            if(id_num >= 0 && id_num > hidden && id_num < sizeOfMap && col === 1){
                elements.push(document.getElementById(`block_${id_num}`));
            }
        });
        index += MAP_WIDTH;
    });
    return elements;
};
/** 가로줄 번호로 땅을 이루는 HTML요소 얻기 
 * @function getRowElements
 * @param {number[]} rows 땅의 가로줄 번호 배열
 * @returns {HTMLElement[]} */
const getRowElements = (rows) => {
    let elements = [];
    rows.forEach((row) => {
        for(let i = 0; i < MAP_WIDTH; i++)
            elements.push(document.getElementById(`block_${row*MAP_WIDTH + i}`));
    });
    return elements;
};
/** 하드 드롭의 꼬리를 그리는 애니메이션
 * @async
 * @function longTailAnimation
 * @param {HTMLDivElement} node 꼬리 애니메이션이 들어갈 노드  
 * @param {number} duration 애니메이션 진행 시간(ms) 
 * @returns {Promise<boolean>} 애니메이션을 끝마치면 True를 돌려 준다. */
const longTailAnimation = (node, duration) => {
    let length = 0;
    let final_length = 100;
    let stride = 20;
    setNodeLength(node, length);
    return makeAnimation(length, final_length, stride, node, duration, setNodeLength, ()=>true);
};
/** 하드 드롭으로 테트로미노가 떨어지는 애니메이션
 * @async
 * @function dropBlockAnimation
 * @param {HTMLDivElement} node 하드 드롭 애니메이션이 들어갈 노드
 * @param {number} dureation 애니메이션 진행 시간(ms)
 * @returns {Promise<boolean>} 애니메이션을 끝마치면 True를 돌려 준다. */
const dropBlockAnimation = (node, duration) => {
    let length = Number(node.style.getPropertyValue("height").replace("%", ""));
    let final_length = 100;
    let stages = 5;
    let stride = (final_length - length)/stages;
    return makeAnimation(length, final_length, stride, node, duration, setNodeLength, ()=>true);
};
/** 하드 드롭으로 떨어지는 테트로미노의 꼬리를 그릴 애니메이션 노드 만들기 
 * @function makeTailNode
 * @param {block} block 떨어지는 블록 객체
 * @returns {HTMLDivElement} 테트로미노의 꼬리가 그려질 애니메이션 노드를 돌려 준다. */
const makeTailNode = (block) => {
    let left = MAP_WIDTH;
    let right = 1;
    let top = MAP_HEIGHT - 2;
    let bottom = 20;
    let bottomList = Array.from({length:BLOCKS[block.type][block.rotation].length}, () => 0);
    let cor_y = block.position.y - 1;
    let cor_x = block.position.x + 1;
    let cor_y_shadow = block.positionOfShadow().y - 1;
    // 꼬리가 그려질 곳의 테두리(왼쪽, 오른쪽, 위, 아래)
    BLOCKS[block.type][block.rotation].forEach((row, i) => {
        row.forEach((col, j) => {
            if(col === 1){
                if(left > cor_x + j) left = cor_x + j;
                if(right < cor_x + j) right = cor_x + j;
                if(top > cor_y + i) top = cor_y + i;
                if(bottomList[j] < cor_y_shadow + i) bottomList[j] = cor_y_shadow + i;
            }
        });
    });
    bottomList.forEach((value) => {
        if(value !== 0)
            if(bottom > value) bottom = value;
    });
    // 애니메이션 보드에 꼬리 노드 추가
    let aniLayer = document.getElementById("animationBoard");
    let tailNode = document.createElement("div");
    tailNode.style.backgroundImage = "linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8))";
    tailNode.style.gridColumn = `${left}/${right+1}`;
    tailNode.style.gridRow = `${(top > 0)? top : 1}/${bottom+1}`;    
    aniLayer.appendChild(tailNode);
    return tailNode;
};
/** 하드 드롭으로 테트로미노가 떨어지는 애니메이션이 들어갈 노드 만들기
 * @function makeHardDropNode
 * @param {block} block 떨어지는 블록 객체
 * @returns {HTMLDivElement} 하드 드롭 애니메이션 노드를 돌려 준다. */
const makeHardDropNode = (block) => {
    let left = MAP_WIDTH;
    let right = 1;
    let top = MAP_HEIGHT - 2;
    let bottom = 1;
    let cor_y = block.position.y - 1;
    let cor_x = block.position.x + 1;
    let cor_y_shadow = block.positionOfShadow().y - 1;
    // 떨어지는 블록이 그려질 곳의 테두리(왼쪽, 오른쪽, 위, 아래)
    BLOCKS[block.type][block.rotation].forEach((row, i) => {
        row.forEach((col, j) => {
            if(col === 1){
                if(left > cor_x + j) left = cor_x + j;
                if(right < cor_x + j) right = cor_x + j;
                if(top > cor_y + i) top = cor_y + i;
                if(bottom < cor_y_shadow + i) bottom = cor_y_shadow + i;
            }
        });
    });
    // 애니메이션 보드에 하드 드롭 노드 추가
    let aniLayer = document.getElementById("animationBoard");
    let hardDropNode = document.createElement("div");
    hardDropNode.style.display = `flex`;
    hardDropNode.style.flexFlow = `row wrap`;
    hardDropNode.style.justifyContent = `flex-start`;
    hardDropNode.style.alignContent = `flex-end`;
    hardDropNode.style.gridColumn = `${left}/${right+1}`;
    hardDropNode.style.gridRow = `${(top > 0)? top : 1}/${bottom+1}`;
    hardDropNode.style.height = `${(bottom - cor_y_shadow - top + cor_y + 1) / (bottom - ((top > 0)? top : 1) + 1) * 100}%`;    
    // 하드 드롭 노드 안에 하얘진 테트로미노 추가
    for(let i = top - cor_y; i <= bottom - cor_y_shadow; i++){
        for(let j = left - cor_x; j <= right - cor_x; j++){
            let blockNode = document.createElement("div");
            blockNode.style.width = `calc(100% / ${right - left + 1} - 2px)`;
            blockNode.style.aspectRatio = `1`;
            if(BLOCKS[block.type][block.rotation][i][j] === 1){
                blockNode.className = `block white`;
                blockNode.innerHTML = `<div class="innerBlock"></div>`;
            }else{
                blockNode.className = `blank`;
            }
            hardDropNode.appendChild(blockNode);
        }
    }
    aniLayer.appendChild(hardDropNode);
    return hardDropNode;
}
/** 애니메이션 노드 지우기
 * @async
 * @function deletingNodeAnimation
 * @param {HTMLElement} node 대상이 되는 노드
 * @param {number} duration 지울 시간 예약(ms)
 * @returns {Promise<boolean>} 완료되면 true를 돌려 준다. */
const deletingNodeAnimation = (node, duration) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            node.remove();
            resolve(true);
        }, duration);
    });
};
/** 노드 길이 설정
 * @function setNodeLength
 * @param {HTMLElement} node 대상이 되는 노드
 * @param {number} length 설정할 노드의 길이 */
const setNodeLength = (node, length) => {
    node.style.height = `${length}%`;
};