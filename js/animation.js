import {colors, blocks, MAP_WIDTH, MAP_HEIGHT} from "./model.js";

var lockingTimer;
var islockingingOn = false;

export const lockingBlockAnimation = async (block, duration) => {    
    islockingingOn = true;
    let elements = getBlockElements(block);
    let end = await BlackeningLockingAnimation(elements, duration);
    if(end || !end) islockingingOn = false;
    return end;
};
export const cancelLockingBlockAnimation = () => {
    islockingingOn = false;    
};
export const lockedBlockAnimation = async (block, duration) => {
    let elements = getBlockElements(block)
    let end = await whiteningAnimation(elements, duration);
    return end;
};
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
const BlackeningLockingAnimation = (elements, duration) => {
    let ratio = 0;
    let final_ratio = 1;
    let decrement = 0.05;
    let delay = duration*decrement/(final_ratio - ratio);
    return new Promise((resolve) => {
        lockingTimer = setTimeout(function lock(){
            if(islockingingOn){
                ratio = parseFloat((ratio + decrement).toFixed(3));
                if(ratio < final_ratio){
                    setBlockColor(elements, {r: 0, g: 0, b: 0}, ratio, 1);
                    lockingTimer = setTimeout(lock, delay);
                }else{
                    ratio = final_ratio;
                    setBlockColor(elements, {r: 0, g: 0, b: 0}, ratio, 1);
                    resolve(true);
                }
            }else{
                clearTimeout(lockingTimer);
                resolve(false);
            }
        }, delay);
    });
};
const BlackToWhiteLockingAnimation = (elements, duration) => {
    let ratio = 0;
    let final_ratio = 1;
    let decrement = 0.05;
    let delay = duration*decrement/(final_ratio - ratio);
    return new Promise((resolve) => {
        lockingTimer = setTimeout(function lock(){
            if(islockingingOn){
                ratio = parseFloat((ratio + decrement).toFixed(3));
                if(ratio < final_ratio){
                    setOtherColor(elements, {r: 0, g: 0, b: 0}, {r: 255, g: 255, b: 255}, ratio, 1);
                    lockingTimer = setTimeout(lock, delay);
                }else{
                    ratio = final_ratio;
                    setOtherColor(elements, {r: 0, g: 0, b: 0}, {r: 255, g: 255, b: 255}, ratio, 1);                    
                    resolve(true);
                }
            }else{
                clearTimeout(lockingTimer);
                resolve(false);
            }
        }, delay);
    });
};
const whiteningAnimation = (elements, duration) => {
    let ratio = 0;
    let final_ratio = 1;
    let decrement = 0.05;
    let delay = duration*decrement/(final_ratio - ratio);    
    return new Promise((resolve) => {
        setTimeout(function whiten(){
            ratio = parseFloat((ratio + decrement).toFixed(3));
            if(ratio < final_ratio){
                setBlockColor(elements, {r: 255, g: 255, b: 255}, ratio, 1);
                setTimeout(whiten, delay);
            }else{
                ratio = final_ratio;
                setBlockColor(elements, {r: 255, g: 255, b: 255}, ratio, 1);                    
                resolve(true);
            }
        }, delay);
    });
};
const bluringFromWhiteAnimation = (elements, duration) => {
    let ratio = 1;
    let final_ratio = 0;
    let decrement = 0.05;
    let delay = duration*decrement/(ratio - final_ratio);
    return new Promise((resolve) => {
        setTimeout(function whiten(){
            ratio = parseFloat((ratio - decrement).toFixed(3));
            if(ratio > final_ratio){
                setBlockColor(elements, {r: 255, g: 255, b: 255}, ratio, ratio);
                setTimeout(whiten, delay);
            }else{
                ratio = final_ratio;
                setBlockColor(elements, {r: 255, g: 255, b: 255}, ratio, ratio);                    
                resolve(true);
            }
        }, delay);
    });
};
const setBlockColor = (elements, rgb, ratio, opacity) => {
    elements.forEach((element) => {
        let blockType = element.className.split(" ")[1];
        element.style.backgroundColor = `rgba(${rgb.r*ratio + colors[blockType].r*(1-ratio)},
            ${rgb.g*ratio + colors[blockType].g*(1-ratio)},
            ${rgb.b*ratio + colors[blockType].b*(1-ratio)},
            ${opacity})`;
    });
};
const setOtherColor = (elements, rgb_now, rgb_then, ratio, opacity) => {
    elements.forEach((element) => {
        element.style.backgroundColor = `rgba(${rgb_then.r*ratio + rgb_now.r*(1-ratio)},
            ${rgb_then.g*ratio + rgb_now.g*(1-ratio)},
            ${rgb_then.b*ratio + rgb_now.b*(1-ratio)},
            ${opacity})`;
    });
};
const getBlockElements = (block) => {
    let elements = [];
    let sizeOfMap = MAP_WIDTH * MAP_HEIGHT;
    let hidden = 2 * MAP_WIDTH - 1;
    let index = block.position.y*MAP_WIDTH + block.position.x;
    blocks[block.type][block.rotation].forEach((row, i) => {
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
const getRowElements = (rows) => {
    let elements = [];
    rows.forEach((row) => {
        for(let i = 0; i < MAP_WIDTH; i++)
            elements.push(document.getElementById(`block_${row*MAP_WIDTH + i}`));
    });
    return elements;
};
const longTailAnimation = (node, duration) => {
    let length = 0;
    let final_length = 100;
    let decrement = 20;
    let delay = duration*decrement/(final_length - length);
    setNodeLength(node, length);
    return new Promise((resolve) => {
        setTimeout(function longer(){
            length += decrement;
            if(length < final_length){
                setNodeLength(node, length);
                setTimeout(longer, delay);
            }else{
                setNodeLength(node, final_length);
                resolve(true);
            }
        }, delay);
    });
};
const dropBlockAnimation = (node, duration) => {
    let length = Number(node.style.getPropertyValue("height").replace("%", ""));
    let final_length = 100;
    let stages = 5;
    let decrement = (final_length - length)/stages;
    let delay = duration / stages;
    return new Promise((resolve) => {
        setTimeout(function longer(){
            length += decrement;
            if(length < final_length){
                setNodeLength(node, length);
                setTimeout(longer, delay);
            }else{
                setNodeLength(node, final_length);
                resolve(true);
            }
        }, delay);
    });
};
const makeTailNode = (block) => {
    let left = MAP_WIDTH;
    let right = 1;
    let top = MAP_HEIGHT - 2;
    let bottom = 20;
    let bottomList = Array.from({length:blocks[block.type][block.rotation].length}, () => 0);
    let cor_y = block.position.y - 1;
    let cor_x = block.position.x + 1;
    let cor_y_shadow = block.positionOfShadow().y - 1;
    // 꼬리가 그려질 곳의 테두리(왼쪽, 오른쪽, 위, 아래)
    blocks[block.type][block.rotation].forEach((row, i) => {
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
const makeHardDropNode = (block) => {
    let left = MAP_WIDTH;
    let right = 1;
    let top = MAP_HEIGHT - 2;
    let bottom = 1;
    let cor_y = block.position.y - 1;
    let cor_x = block.position.x + 1;
    let cor_y_shadow = block.positionOfShadow().y - 1;
    // 떨어지는 블록이 그려질 곳의 테두리(왼쪽, 오른쪽, 위, 아래)
    blocks[block.type][block.rotation].forEach((row, i) => {
        row.forEach((col, j) => {
            if(col === 1){
                if(left > cor_x + j) left = cor_x + j;
                if(right < cor_x + j) right = cor_x + j;
                if(top > cor_y + i) top = cor_y + i;
                if(bottom < cor_y_shadow + i) bottom = cor_y_shadow + i;
            }
        });
    });
    // 애니메이션 보드에 하드 드랍 노드 추가
    let aniLayer = document.getElementById("animationBoard");
    let hardDropNode = document.createElement("div");
    hardDropNode.style.display = `flex`;
    hardDropNode.style.flexFlow = `row wrap`;
    hardDropNode.style.justifyContent = `flex-start`;
    hardDropNode.style.alignContent = `flex-end`;
    hardDropNode.style.gridColumn = `${left}/${right+1}`;
    hardDropNode.style.gridRow = `${(top > 0)? top : 1}/${bottom+1}`;
    hardDropNode.style.height = `${(bottom - cor_y_shadow - top + cor_y + 1) / (bottom - ((top > 0)? top : 1) + 1) * 100}%`;    
    // 하드드랍 노드 안에 하얘진 테트로미노 추가
    for(let i = top - cor_y; i <= bottom - cor_y_shadow; i++){
        for(let j = left - cor_x; j <= right - cor_x; j++){
            let blockNode = document.createElement("div");
            blockNode.style.width = `calc(100% / ${right - left + 1} - 2px)`;
            blockNode.style.aspectRatio = `1`;
            if(blocks[block.type][block.rotation][i][j] === 1){
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
const deletingNodeAnimation = (node, duration) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            node.remove();
            resolve(true);
        }, duration);
    });
};
const setNodeLength = (node, length) => {
    node.style.height = `${length}%`;
};
