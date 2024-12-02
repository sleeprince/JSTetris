import {tetromino, colors, blocks, MAP_WIDTH, MAP_HEIGHT} from "./model.js";

var lockingTimer;
var islockingingOn = false;
var deletingTimer;

export const lockingBlockAnimation = (block, duration) => {
    
    let elements = getBlockElements(block);
    BlackeningAnimation(block, duration/0.8);

    
};
export const cancelLockingBlockAnimation = (block) => {
    let elements = getBlockElements(block);
    islockingingOn = false;
    clearTimeout(lockingTimer);
};
const BlackeningAnimation = (block, duration) => {
    let opacity = 0;
    let final_opacity = 1;
    let decrement = 0.01;
    let delay = duration*decrement/(final_opacity - opacity);
    islockingingOn = true;
    return new Promise((resolve) => {
        lockingTimer = setTimeout(function lock(){
            if(islockingingOn){
                opacity = parseFloat((opacity + decrement).toFixed(3));
                if(opacity < final_opacity){
                    setBlockBlack(elements, block.type, opacity);
                    lockingTimer = setTimeout(lock, delay);
                }else{
                    opacity = final_opacity;
                    setBlockBlack(elements, block.type, opacity);
                    islockingingOn = false;
                    resolve(true);
                }
            }else{
                resolve(false);
            }
        }, delay);
    });
};
const setBlockBlack = (elements, blockType, opacity) => {
    // let shadow_opacity = (0.5 - (opacity/2)).toFixed(3);
    elements.forEach((element) => {
        element.style.backgroundColor = `rgba(${colors[blockType].r*(1 - opacity)}, ${colors[blockType].g*(1 - opacity)}, ${colors[blockType].b*(1 - opacity)}, 1)`;
        // element.firstElementChild.style.boxShadow = `2px 2px rgba(0, 0, 0, ${shadow_opacity}), -2px -2px rgba(255, 255, 255, ${shadow_opacity})`
    });
};
const setBlackToWhite = (elements, opacity) => {
    elements.forEach((element) => {
        element.style.backgroundColor = `rgba(${255*opacity}, ${255*opacity}, ${255*opacity}, 1)`;
    });
};
const changeBlockColor = (elements, blockType, rgba, opacity) => {
    elements.forEach((element) => {
        element.style.backgroundColor = `rgba(${rgba.r*opacity + colors[blockType].r*(1-opacity)}, 
            ${rgba.g*opacity + colors[blockType].g*(1-opacity)},
            ${rgba.b*opacity + colors[blockType].b*(1-opacity)},
            ${rgba.a*opacity + colors[blockType].a*(1-opacity)})`;
    });
};
const changeColor = (elements, rgba_now, rgba_then, opacity) => {
    elements.forEach((element) => {
        element.style.backgroundColor = `rgba(${rgba_then.r*opacity + rgba_now.r*(1-opacity)}, 
            ${rgba_then.g*opacity + rgba_now.g*(1-opacity)},
            ${rgba_then.b*opacity + rgba_now.b*(1-opacity)},
            ${rgba_then.a*opacity + rgba_now.a*(1-opacity)})`;
    });
};
const getBlockElements = (block) => {
    let elements = [];
    let sizeOfMap = MAP_WIDTH * MAP_HEIGHT;
    let hidden = 2 * MAP_WIDTH - 1;
    let index = block.position - MAP_WIDTH - 2;
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

export const deletingRowsAnimation = (rows, duration) => {

};

const deepCopy = (object) => {
    if(object === null || typeof object !== "object")
        return object;
    
    let new_object = (Array.isArray(object))? [] : {};
    
    for(let key of Object.keys(object))
        new_object[key] = deepCopy(object[key]);
    
    return new_object;
};