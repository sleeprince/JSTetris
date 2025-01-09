import { makeAnimation } from "./utility.js";

const textLayer = document.getElementById("textLayer");
var animationOn = false;

const isAnimationOn = () => {
    return animationOn;
};
const setAnimationOn = (value) => {
    animationOn = value;
};

// 레벨업 글씨 떠오르기
export const showLevelUpAnimation = async (scores, duration) => {
    setAnimationOn(false);
    removeAllTextAnimation();
    let nodes = addLevelUpNode(scores);
    nodes.forEach(node => {
        node.style.opacity = "0";
        textLayer.appendChild(node);
    });
    if(nodes.length > 0) setAnimationOn(true);
    let end = await playTextAnimation(nodes, duration*0.2)
            .then((result) => {
                if(result){
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            setAnimationOn(false);
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
// 얻은 점수 및 콤보 글씨 떠오르기
export const showScoreTextAnimation = async (scores, duration) => {
    setAnimationOn(false);
    removeAllTextAnimation();
    let nodes = addScoreNodes(scores);
    nodes.forEach(node => {
        node.style.opacity = "0";
        textLayer.appendChild(node);
    });
    if(nodes.length > 0) setAnimationOn(true);
    let end = await playTextAnimation(nodes, duration*0.3)
            .then((result) => {
                if(result){
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            setAnimationOn(false);
                            removeAllTextAnimation();
                            resolve(result);
                        }, duration*0.7);
                    });               
                }else{
                    return result;
                }
            });
    return end;
};
// 게임하기 또는 이어하기에서 카운트 다운
export const countDownTextAnimation = async () => {
    setAnimationOn(false);
    removeAllTextAnimation();
    let nodes = Array.from({length: 4}, (v, i) => {
        let node = document.createElement("p");
        if(i < 3)
            node.innerHTML = 3 - i;
        else
            node.innerHTML = 'START!';
        node.className = 'information';
        node.style.opacity = '0';
        return node;
    });
    let isAllTrue = (arr) => {
        for(let e of arr)
            if(!e) return false;
        return true;
    };
    for(let i = 0; i < nodes.length; i++){
        setAnimationOn(true);
        textLayer.appendChild(nodes[i]);
        let fontSize = (i < nodes.length  - 1)? 2*i + 7 : 8;
        let result = (i < 3)? 
            await Promise.all([
                makeAnimation(0, 1, 0.1, [nodes[i]], 200, setNodesOpacity, isAnimationOn),
                makeAnimation(fontSize*0.6, fontSize*1.2, 0.2, [nodes[i]], 200, setNodeFontSize, isAnimationOn),
                makeAnimation(fontSize*0.6, fontSize*1.2, 0.2, [nodes[i]], 200, setNodesTopFromMiddle, isAnimationOn)
            ])
            .then((results) => {
                if(isAllTrue(results)){
                    return Promise.all([
                        makeAnimation(fontSize*1.2, fontSize, 0.2, [nodes[i]], 100, setNodeFontSize, isAnimationOn),
                        makeAnimation(fontSize*1.2 , fontSize, 0.2, [nodes[i]], 100, setNodesTopFromMiddle, isAnimationOn)
                    ]);
                }else{
                    return results;
                }
            })
            .then((results) => {
                if(isAllTrue(results)){
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(true);
                        }, 700);
                    });
                }else{
                    return results;
                }                
            })
            :
            await Promise.all([
                makeAnimation(0, 1, 0.1, [nodes[i]], 200, setNodesOpacity, isAnimationOn),
                makeAnimation(fontSize*0.6, fontSize, 0.2, [nodes[i]], 200, setNodeFontSize, isAnimationOn),
                makeAnimation(fontSize*0.6, fontSize, 0.2, [nodes[i]], 200, setNodesTopFromMiddle, isAnimationOn)
            ])
            .then((results) => {
                if(isAllTrue(results)){
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(true);
                        }, 600);
                    })
                }else{
                    return results;
                }                    
            });
        if(result){
            removeAllTextAnimation();
            setAnimationOn(false);
        }
    };
    return true;
};
// 텍스트 애니메이션 노드 지우기
const removeAllTextAnimation = () => {
    while(textLayer.hasChildNodes())
        textLayer.removeChild(textLayer.firstChild);
};
// 점수 노드 얻기
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
// 레벨업 노드 얻기
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
// 레벨업, 점수 노드 애니메이션
const playTextAnimation = async (nodes, duration) => {
    let isAllTrue = (arr) => {
        for(let e of arr)
            if(!e) return false;
        return true;
    };
    let end = await Promise.all([
                        makeAnimation(0, 1, 0.1, nodes, duration*0.6, setNodesOpacity, isAnimationOn), 
                        makeAnimation(55, 50, 0.5, nodes, duration*0.6, setNodesTopByPercent, isAnimationOn), 
                        makeAnimation(0.9, 1.2, 0.03, nodes, duration*0.6, setNodesFontSizeByRatio, isAnimationOn)
                    ])
                    .then((results) => {
                        if(isAllTrue(results)){
                            return Promise.all([
                                makeAnimation(50, 47, 0.3, nodes, duration*0.4, setNodesTopByPercent, isAnimationOn), 
                                makeAnimation(1.2, 1, 0.02, nodes, duration*0.4, setNodesFontSizeByRatio, isAnimationOn)
                            ]);
                        }else{
                            return results;
                        }
                    })
                    .then((results) => {                                               
                        return isAllTrue(results);
                    });
    return end;
};
const setNodesOpacity = (_nodes, _opacity) => {
    _nodes.forEach(node => {
        node.style.opacity = _opacity;
    });
};
const setNodesTopFromMiddle = (_nodes, _distance) => {
    _nodes.forEach(node => {
        node.style.top = `calc(50% - ${_distance}dvh)`;
    });
};
const setNodesTopByPercent = (_nodes, _top) => {
    _nodes.forEach(node => {
        node.style.top = `${_top}%`;
    });
};
const setNodeFontSize = (_nodes, _size) => {
    _nodes.forEach(node => {
        node.style.fontSize = `${_size}dvh`;
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