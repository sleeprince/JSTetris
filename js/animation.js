import {tetromino, colors, blocks, MAP_WIDTH, MAP_HEIGHT} from "./model.js";

var blurTimer;
var isBluringOn = false;
var deletingTimer;

export const bluringBlockAnimation = (duration) => {    
    let opacity = 1;
    let final_opacity = 0;
    let decrement = 0.01;
    let delay = duration*decrement/(opacity - final_opacity);
    isBluringOn = true;
    let startTime = Date.now();
    let blockBoard = document.getElementById(`blockBoard`);
    return new Promise((resolve) => {
        blurTimer = setTimeout(function blur(){
            if(isBluringOn){
                opacity = parseFloat((opacity - decrement).toFixed(3));
                if(opacity > 0){
                    console.log(opacity);
                    blockBoard.style.opacity = opacity;
                    blurTimer = setTimeout(blur, delay);
                }else{
                    opacity = 0;
                    blockBoard.style.opacity = opacity;
                    isBluringOn = false;
                    console.log(`${Date.now() - startTime}밀리초: 애니메이션 동작`);
                    resolve(true);
                }
            }else{
                resolve(false);
            }
        }, delay);
    });
};
export const cancelBluringBlockAnimation = () => {
    isBluringOn = false;
    clearTimeout(blurTimer);
};

export const deletingRowsAnimation = (rows, duration) => {

};