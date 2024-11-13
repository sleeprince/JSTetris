var tetrisMap = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, 6, -1, -1, -1, -1, -1, -1],
    [0, 0, 2, 6, 6, 6, 4, 5, 5, -1],
    [-1, 1, 2, 1, 3, 3, 4, 4, 5, 5]
];

const model = ["o_block", "l_block", "j_block", "i_block", "s_block", "z_block", "t_block"];

const blocks = {
    o_block : 
    [
        [
            [0, 0, 0, 0],
            [0, 1, 1, 0], 
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ]
    ],
    l_block : 
    [
        [            
            [0, 1, 0, 0],
            [0, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 1, 1, 1],
            [0, 0, 0, 1],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ]
    ],
    j_block : 
    [
        [
            [0, 0, 0, 1],
            [0, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 1, 1, 1],
            [0, 1, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ]
    ],
    i_block : 
    [
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0]
        ]
    ],
    s_block :
    [
        [
            [0, 0, 1, 1],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 1],
            [0, 0, 0, 0]
        ]        
    ],
    z_block :
    [
        [
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ]
    ],
    t_block :
    [
        [
            [0, 0, 1, 0],
            [0, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 1, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ]
    ]
};

export class block {
    constructor(position, type){
        this.position = position;
        this.type = type;
        this.rotation = 0;
    }
    rotateR() {
        if(!isCrash){
            this.rotation++;
            this.rotation %= blocks[type].length;
        }
    }
    rotateL() {
        if(!isCrash){
            this.rotation--;
            this.rotation += blocks[type].length;
            this.rotation %= blocks[type].length;
        }
    }
};

const isCrash = () => {};
const detour = () => {}; // 충돌일 때
const isFull = (row) => {};
export const deleteRows = () => {};
const shadow = () => {};
export const ground = () => {};
// 굳은 부분 그리기
const drawMap = () => {
    let innerScript = "";
    tetrisMap.forEach((row, i)=>{
        console.log(row);
        row.forEach((num, j) => {
            if(num > -1)
                innerScript += `<div class="block ${model[num]}" id="co_${i}_${j}"></div>\n`;
            else
                innerScript += `<div class="block" id="co_${i}_${j}"></div>\n`;
        })
    });
    document.getElementById("board").innerHTML = innerScript;
}
// 블록 그리기
const drawBlock = (block) => {

};

const inputkey = (e) =>{};

export const drawGameBoard = () => {
    // 굳은 부분 그리기
    drawMap();
    //
};

// for(let i = 0; i < model.length; i++)
//     console.log(blocks[model[i]]);