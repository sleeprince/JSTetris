const textLayer = document.getElementById("textLayer");
var isAnimationOn = false;

export const showLevelUpAnimation = async (scores, duration) => {
    isAnimationOn = false;
    removeAllTextAnimation();
    let nodes = addLevelUpNode(scores);
    nodes.forEach(node => {
        node.style.opacity = "0";
        textLayer.appendChild(node);
    });
    if(nodes.length > 0) isAnimationOn = true;
    let end = await playTextAnimation(nodes, duration*0.2)
            .then((result) => {
                if(result){
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            isAnimationOn = false;
                            removeAllTextAnimation();
                            resolve(result);
                        }, duration*0.8);
                    });
                }else{
                    return result;
                }
            });
    return end;
};
export const showScoreTextAnimation = async (scores, duration) => {
    isAnimationOn = false;
    removeAllTextAnimation();
    let nodes = addScoreNodes(scores);
    nodes.forEach(node => {
        node.style.opacity = "0";
        textLayer.appendChild(node);
    });
    if(nodes.length > 0) isAnimationOn = true;
    let end = await playTextAnimation(nodes, duration*0.2)
            .then((result) => {
                if(result){
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            isAnimationOn = false;
                            removeAllTextAnimation();
                            resolve(result);
                        }, duration*0.8);
                    });               
                }else{
                    return result;
                }
            });
    return end;
};
const removeAllTextAnimation = () => {
    while(textLayer.hasChildNodes())
        textLayer.removeChild(textLayer.firstChild);
};
const addScoreNodes = (scores) => {
    let node_array = [];
    for(let score of scores) {
        let text = score.text;
        let point = score.point;
        if(point !== 0){
            let textNode = document.createElement("p");
            let pointNode = document.createElement("p");
            //콤보, 퍼펙트클리어, 백투백 노트 더하기
            if(text.includes("COMBO")){
                textNode.className = 'combo';
                textNode.innerHTML = text;
                pointNode.className = 'point';
                pointNode.innerHTML = `+${point}`;
                node_array.push(textNode);
                node_array.push(pointNode);
                continue;
            }else if(text.includes("PERFECT CLEAR")){
                textNode.className = 'perfect';
                textNode.innerHTML = text;
                pointNode.className = 'bonus';
                pointNode.innerHTML = `+${point}`;
                node_array.push(textNode);
                node_array.push(pointNode);
                continue;
            }else if(text.includes("BACK‐TO‐BACK")){
                let backtobackNode = document.createElement("p");
                backtobackNode.className = 'backtoback';
                backtobackNode.innerHTML = 'BACK‐TO‐BACK';
                text = text.slice("BACK‐TO‐BACK ".length);
                node_array.push(backtobackNode);
            }
            // T스핀, 테트리스 노드 더하기
            if(text.includes("T‐SPIN"))                
                textNode.className = 'tspin';               
            else if(text.includes("TETRIS"))
                textNode.className = 'tetris';
            else
                textNode.className = 'lineClear';

            textNode.innerHTML = text;
            pointNode.innerHTML = `+${point}`;
            pointNode.className = 'point';
            node_array.push(textNode);
            node_array.push(pointNode);
        }
    }
    return node_array;
};
const addLevelUpNode = (scores) => {
    let node_array = [];
    for(let score of scores){
        let text = score.text;
        if(text.includes('LEVEL')){
            let node = document.createElement("p");
            node.className = 'levelup';
            node.innerHTML = text;
            node_array.push(node);
        }
    }
    return node_array;    
};
const playTextAnimation = async (nodes, duration) => {
    let isAllTrue = (arr) => {
        for(let e of arr)
            if(!e) return false;
        return true;
    };
    let end = await Promise.all(
                                [appearingAnimation(nodes, duration), 
                                raisingAnimation(nodes, duration), 
                                enlargingAnimation(nodes, duration)]
                            )
                            .then((results) => {                                
                                return isAllTrue(results);
                            });
    return end;
};
const appearingAnimation = (nodes, duration) => {
    let opacity = 0;
    let final_opacity = 1;
    let stride = 0.1;
    return makeAnimation(opacity, final_opacity, stride, nodes, duration, setNodesOpacity);
};
const raisingAnimation = (nodes, duration) => {
    let top = 53;
    let final_top = 50;
    let stride = 0.3;
    return makeAnimation(top, final_top, stride, nodes, duration, setNodesTop);
};
const enlargingAnimation = (nodes, duration) => {
    let ratio = 0.9;
    let final = 1;
    let stride = 0.01;
    return makeAnimation(ratio, final, stride, nodes, duration, setNodesFontSizeByRatio);
};
const makeAnimation = (initial_state, final_state, stride, nodes, duration, callback) => {
    let present_state = initial_state;
    let direction = (initial_state > final_state)? -1 : 1;
    stride = direction * stride;
    let delay = duration * stride / (final_state - initial_state);
    return new Promise(resolve => {
        let timerId = setTimeout(function animation(){
            if(isAnimationOn){
                present_state = parseFloat((present_state + stride).toFixed(3));
                if(direction * present_state < direction * final_state){
                    callback(nodes, present_state);
                    timerId = setTimeout(animation, delay);
                }else{
                    present_state = final_state;
                    callback(nodes, present_state);
                    resolve(true);
                }
            }else{
                clearTimeout(timerId);
                resolve(false);
            }
        }, delay);
    })
};
const setNodesOpacity = (_nodes, _opacity) => {
    _nodes.forEach(node => {
        node.style.opacity = _opacity;
    });
};
const setNodesTop = (_nodes, _top) => {
    _nodes.forEach(node => {
        node.style.top = `${_top}%`;
    });
};
const setNodesFontSizeByRatio = (_nodes, _ratio) => {
    let size;
    _nodes.forEach(node => {
        switch(node.className){
            case 'lineClear':
                size = 2.6;
                break;
            case 'perfect':
            case 'levelup':
                size = 3.7;
                break;
            case 'point':
                size = 2.5;
                break;
            case 'bonus':
                size = 3;
                break;
            default:
                size = 2.8;
        }
        node.style.fontSize = `${size*_ratio}dvh`;
    });
};