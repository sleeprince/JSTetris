import {colors, blocks, MAP_WIDTH, MAP_HEIGHT} from "./model.js";

var lockingTimer;
var islockingingOn = false;
var deletingTimer;

export const lockingBlockAnimation = async (block, duration) => {    
    islockingingOn = true;
    let whiteningDuration = 160;
    let elements = getBlockElements(block);
    let end = await BlackeningAnimation(elements, (duration - whiteningDuration > 0)? duration - whiteningDuration : duration)
        .then((result) => {
            if(result)                
                return BlackToWhiteAnimation(elements, whiteningDuration);
            else
                return Promise.resolve(false);            
        });

    if(end || !end) islockingingOn = false;
    return end;
};
export const cancelLockingBlockAnimation = () => {
    islockingingOn = false;    
};
export const deletingRowsAnimation = async (rows, duration) => {
    let whiteningDuration = 80;
    let elements = getRowElements(rows);
    console.log(elements);
    let end = await whiteningAnimation(elements, whiteningDuration)
        .then((result) => {
            if(result)
                return bluringFromWhiteAnimation(elements, duration - whiteningDuration);
        });
    return end;
};
const BlackeningAnimation = (elements, duration) => {
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
const BlackToWhiteAnimation = (elements, duration) => {
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
    let decrement = 0.1;
    let delay = duration*decrement/(final_ratio - ratio);
    return new Promise((resolve) => {
        deletingTimer = setTimeout(function whiten(){
            ratio = parseFloat((ratio + decrement).toFixed(3));
            if(ratio < final_ratio){
                setBlockColor(elements, {r: 255, g: 255, b: 255}, ratio, 1);
                deletingTimer = setTimeout(whiten, delay);
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
        deletingTimer = setTimeout(function whiten(){
            ratio = parseFloat((ratio - decrement).toFixed(3));
            if(ratio > final_ratio){
                setBlockColor(elements, {r: 255, g: 255, b: 255}, ratio, ratio);
                deletingTimer = setTimeout(whiten, delay);
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
const getRowElements = (rows) => {
    let elements = [];
    rows.forEach((row) => {
        for(let i = 0; i < MAP_WIDTH; i++)
            elements.push(document.getElementById(`block_${row*MAP_WIDTH + i}`));
    });
    return elements;
};
const deepCopy = (object) => {
    if(object === null || typeof object !== "object")
        return object;
    
    let new_object = (Array.isArray(object))? [] : {};
    
    for(let key of Object.keys(object))
        new_object[key] = deepCopy(object[key]);
    
    return new_object;
};