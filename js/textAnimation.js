const textLayer = document.getElementById("textLayer");
var timerId;

export const showScoreText = async (scores) => {
    removeAllScoreText();
    clearTimeout(timerId);
    let nodes = addScoreNodes(scores);
};

const removeAllScoreText = () => {
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
                textNode.innerHTML = text;
                textNode.className = 'combo';
                pointNode.innerHTML = `+${point}`;
                pointNode.className = 'point';
                node_array.push(textNode);
                node_array.push(pointNode);
                continue;
            }else if(text.includes("PERFECT CLEAR")){
                textNode.innerHTML = text;
                textNode.className = 'perfect';
                pointNode.innerHTML = `+${point}`;
                pointNode.className = 'bonus';
                node_array.push(textNode);
                node_array.push(pointNode);
                continue;
            }else if(text.includes("BACK‐TO‐BACK")){
                let backtobackNode = document.createElement("p");
                backtobackNode.innerHTML = 'BACK‐TO‐BACK';
                backtobackNode.className = 'backtoback';
                text = text.slice("BACK‐TO‐BACK ".length);
                node_array.push(backtobackNode);
            }
            // T스핀, 테트리스 노드 더하기
            if(text.includes("T‐SPIN")){

            }else if(text.includes("TETRIS")){

            }
            
        }
    }

    return node_array;
}