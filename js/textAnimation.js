import { makeAnimation, isAllTrue } from "./utility.js";
import {getLanguage, getTheCardinalNumerals, translateScoreText} from "./option.js";

/** 글줄 적는 곳
 * @constant textLayer
 * @type {HTMLElement} */
const textLayer = document.getElementById("textLayer");
/** 글줄 애니메이션 동작 상태를 가리킨다.
 * @type {boolean} */
var animationOn = false;
/** 글줄 애니메이션의 동작 상태 얻기
 * @function isAnimationOn
 * @returns {boolean} 애니메이션을 이어 할 때는 True를, 그칠 때는 False를 돌려 준다. */
const isAnimationOn = () => {
    return animationOn;
};
/** 글줄 애니메이션의 동작 상태 설정
 * @function setAnimationOn
 * @param {boolean} value 애니메이션을 이어 하려거든 True를, 그치려거든 False를 넣는다. */
const setAnimationOn = (value) => {
    if(typeof value === 'boolean')
        animationOn = value;
};
/** 레벨업 글줄 떠오르고 사라지는 애니메이션
 * @async
 * @function showLevelUpAnimation
 * @param {{text: string, point: number}[]} scores text:점수 항목, point:점수
 * @param {number} duration 애니메이션 재생 시간(ms)
 * @returns {Promise<boolean>} 애니메이션이 마치면 True를, 미처 못 마치고 그치면 False를 돌려 준다. */
export const showLevelUpAnimation = async (scores, duration) => {
    return showTextAnimation(scores, duration, 0.8, addLevelUpNode);
};
/** 점수 글줄 떠오르고 사라지는 애니메이션
 * @async
 * @function showScoreTextAnimation
 * @param {{text: string, point: number}[]} scores text:점수 항목, point:점수
 * @param {number} duration 애니메이션 재생 시간(ms)
 * @returns {Promise<boolean>} 애니메이션이 마치면 True를, 미처 못 마치고 그치면 False를 돌려 준다. */
export const showScoreTextAnimation = async (scores, duration) => {
    return showTextAnimation(scores, duration, 0.7, addScoreNodes);
};
/** 글줄이 담긴 HTML노드를 만드는 콜백 함수
 * @callback addNodes
 * @param {{text: string, point: number}[]} scores text:점수 항목, point:점수
 * @returns {HTMLParagraphElement[]} 항목에 따라 문구가 적힌 HTML요소를 돌려 준다.
 */
/** 글줄이 떠오르고 사라지는 애니메이션 공통 함수
 * @async
 * @function showTextAnimation
 * @param {{text: string, point: number}[]} scores text:점수 항목, point:점수 
 * @param {number} duration 애니메이션 재생 시간(ms) 
 * @param {number} ratio 떠오른 글줄이 사라지기까지의 재생 시간 비율(0–1)
 * @param {addNodes} addNodes 글줄이 담긴 HTML노드를 만드는 콜백 함수
 * @returns {Promise<boolean>} 애니메이션이 마치면 True를, 미처 못 마치고 그치면 False를 돌려 준다. */ 
const showTextAnimation = async (scores, duration, ratio, addNodes) => {
    setAnimationOn(false);
    removeAllTextAnimation();
    let nodes = addNodes(scores);
    nodes.forEach(node => {
        node.style.opacity = "0";
        textLayer.appendChild(node);
    });
    if(nodes.length > 0) setAnimationOn(true);
    let end = await playTextAnimation(nodes, duration*(1 - ratio))
            .then((result) => {
                if(result){
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            setAnimationOn(false);
                            removeAllTextAnimation();
                            resolve(result);
                        }, duration*ratio);
                    });               
                }else{
                    return result;
                }
            });
    return end;
};
/** 카운트다운 애니메이션
 * @async
 * @function countDownTextAnimation
 * @returns {Promise<boolean>} 애니메이션이 마치면 True를 돌려 준다. */
export const countDownTextAnimation = async () => {
    setAnimationOn(false);
    removeAllTextAnimation();
    let nodes = Array.from({length: 4}, (v, i) => {
        let node = document.createElement("p");
        if(i < 3){
            node.innerHTML = getTheCardinalNumerals(3 - i);
        }else{
            switch(getLanguage()){
                case "english":
                    node.innerHTML = 'START!';
                    break;
                case "korean":
                    node.innerHTML = '시작!';
                    break;
                case "old_korean":
                    node.innerHTML = '비르스쇼셔&nbsp;';
                    break;
                default:
                    node.innerHTML = 'START!';
            }
        }            
        node.className = 'information';
        node.style.opacity = '0';
        return node;
    });
    for(let i = 0; i < nodes.length; i++){
        setAnimationOn(true);
        textLayer.appendChild(nodes[i]);
        let fontSize = (i < nodes.length  - 1)? 2*i + 7 : 8;
        let result = (i < 3)? 
            // 3, 2, 1 카운트 다운 애니메이션
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
            // START! 애니메이션
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
/** 글줄 애니메이션 노드 모두 지우기
 * @function removeAllTextAnimation */
const removeAllTextAnimation = () => {
    while(textLayer.hasChildNodes())
        textLayer.removeChild(textLayer.firstChild);
};
/** 점수 노드 얻기
 * @function addScoreNodes
 * @param {{text: string, point: number}[]} scores text:점수 항목, point:점수
 * @returns {HTMLParagraphElement[]} 점수와 항목에 따른 문구가 적힌 HTML요소를 돌려 준다. */
const addScoreNodes = (scores) => {
    let node_array = [];
    for(let score of scores) {
        let text = score.text;
        let point = score.point;
        if(point !== 0){
            let textNode = document.createElement("p");
            let pointNode = document.createElement("p");
            //콤보, 퍼펙트클리어, 백투백 노드 더하기
            if(text.includes("COMBO")){
                textNode.className = 'combo';
                textNode.innerHTML = translateScoreText(text);
                pointNode.className = 'point';
                pointNode.innerHTML = `+${point}`;
                node_array.push(textNode);
                node_array.push(pointNode);
                continue;
            }else if(text.includes("PERFECT CLEAR")){
                textNode.className = 'perfect';
                textNode.innerHTML = translateScoreText(text);
                pointNode.className = 'bonus';
                pointNode.innerHTML = `+${point}`;
                node_array.push(textNode);
                node_array.push(pointNode);
                continue;
            }else if(text.includes("BACK‐TO‐BACK")){
                let backtobackNode = document.createElement("p");
                backtobackNode.className = 'backtoback';
                backtobackNode.innerHTML = translateScoreText('BACK‐TO‐BACK');
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

            textNode.innerHTML = translateScoreText(text);
            pointNode.innerHTML = `+${point}`;
            pointNode.className = 'point';
            node_array.push(textNode);
            node_array.push(pointNode);
        }
    }
    return node_array;
};
/** 레벨업 노드 얻기
 * @function addLevelUpNode
 * @param {{text: string, point: number}[]} scores text:점수 항목, point:점수
 * @returns {HTMLParagraphElement[]} 점수와 항목에 따른 문구가 적힌 HTML요소를 돌려 준다. */
const addLevelUpNode = (scores) => {
    let node_array = [];
    for(let score of scores){
        let text = score.text;
        if(text.includes('LEVEL')){
            let node = document.createElement("p");
            node.className = 'levelup';
            node.innerHTML = translateScoreText(text);
            node_array.push(node);
        }
    }
    return node_array;    
};
/** 레벨업 및 점수 획득 애니메이션
 * @async
 * @function playTextAnimation
 * @param {HTMLElement[]} nodes 애니메이션이 동작할 HTMLElement의 배열
 * @param {number} duration 애니메이션 재생 시간(ms) 
 * @returns {Promise<boolean>} 애니메이션이 마치면 True를, 미처 못 마치고 그치면 False를 돌려 준다. */
const playTextAnimation = async (nodes, duration) => {
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
/** 노드의 불투명도 설정
 * @function setNodesOpacity
 * @param {HTMLElement[]} _nodes 대상이 되는 노드 배열
 * @param {number} _opacity 불투명도(0–1) */
const setNodesOpacity = (_nodes, _opacity) => {
    _nodes.forEach(node => {
        node.style.opacity = _opacity;
    });
};
/** 가운데부터의 거리(dvh)로 노드의 top 속성값 설정
 * @function setNodesTopFromMiddle
 * @param {HTMLElement[]} _nodes 대상이 되는 노드 배열
 * @param {number} _distance 가운데부터의 거리 */
const setNodesTopFromMiddle = (_nodes, _distance) => {
    _nodes.forEach(node => {
        node.style.top = `calc(50% - ${_distance}dvh)`;
    });
};
/** 퍼센트(%)로 노드의 top 속성값 설정
 * @function setNodesTopByPercent
 * @param {HTMLElement[]} _nodes 대상이 되는 노드 배열
 * @param {number} _top 설정할 top 속성값 */
const setNodesTopByPercent = (_nodes, _top) => {
    _nodes.forEach(node => {
        node.style.top = `${_top}%`;
    });
};
/** 글꼴 크기 설정
 * @function setNodeFontSize
 * @param {HTMLElement[]} _nodes 대상이 되는 노드 배열
 * @param {number} _size 설정할 글꼴 크기 */
const setNodeFontSize = (_nodes, _size) => {
    _nodes.forEach(node => {
        node.style.fontSize = `${_size}dvh`;
    });
};
/** 본래 크기 대비 비율로 글꼴 크기 설정
 * @function setNodesFontSizeByRatio
 * @param {HTMLElement[]} _nodes 대상이 되는 노드 배열
 * @param {number} _ratio 설정할 글꼴 비율  */
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