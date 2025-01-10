/** 땅 너비 
 * @readonly
 * @constant MAP_WIDTH
 * @type {number} */ 
export const MAP_WIDTH = 10;
/** 하늘 높이
 * @readonly
 * @constant MAP_HEIGHT
 * @type {number} */
export const MAP_HEIGHT = 22;

/** tetromino의 종류, 모양, 회전 상태를 정의
 * @readonly
 * @constant BLOCKS 
 * @description BLOCKS[종류][회전 상태][세로 축][가로 축]을 나타낸다. */
export const BLOCKS = {
    /** O_block의 회전 상태 및 모양
     * @constant O_block
     * @type {number[][][]} — O_block[회전 상태][세로 축][가로 축] */
    O_block : 
    [
        [
            [0, 1, 1, 0],
            [0, 1, 1, 0], 
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    ],
    /** L_block의 회전 상태 및 모양
     * @constant L_block
     * @type {number[][][]} — L_block[회전 상태][세로 축][가로 축] */
    L_block : 
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
    /** J_block의 회전 상태 및 모양
     * @constant J_block
     * @type {number[][][]} — J_block[회전 상태][세로 축][가로 축] */
    J_block : 
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
    /** I_block의 회전 상태 및 모양
     * @constant I_block
     * @type {number[][][]} — I_block[회전 상태][세로 축][가로 축] */
    I_block : 
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
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ]
    ],
    /** S_block의 회전 상태 및 모양
     * @constant S_block
     * @type {number[][][]} — S_block[회전 상태][세로 축][가로 축] */
    S_block :
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
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 1, 1],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ]
    ],
    /** Z_block의 회전 상태 및 모양
     * @constant Z_block
     * @type {number[][][]} — Z_block[회전 상태][세로 축][가로 축] */
    Z_block :
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
        ],
        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0]
        ]
    ],
    /** T_block의 회전 상태 및 모양
     * @constant T_block
     * @type {number[][][]} — T_block[회전 상태][세로 축][가로 축] */
    T_block :
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

/** tetromino 빛깔 정의 
 * @readonly
 * @constant COLORS
 * @description 테트로미노 저마다의 빛깔을 rgba 값으로 나타낸다. */
export const COLORS = {
    /** O_block의 빛깔
     * @constant O_block
     * @type {{r: number, g: number, b: number, a: number}} — r, g, b: 0–255; a: 0–1 */
    O_block: {
        r: 255,
        g: 211,
        b: 0,
        a: 1
    },
    /** L_block의 빛깔
     * @constant L_block
     * @type {{r: number, g: number, b: number, a: number}} — r, g, b: 0–255; a: 0–1 */
    L_block: {
        r: 255,
        g: 140,
        b: 0,
        a: 1
    },
    /** J_block의 빛깔
     * @constant J_block
     * @type {{r: number, g: number, b: number, a: number}} — r, g, b: 0–255; a: 0–1 */
    J_block: {
        r: 0,
        g: 82,
        b: 147,
        a: 1
    },
    /** I_block의 빛깔
     * @constant I_block
     * @type {{r: number, g: number, b: number, a: number}} — r, g, b: 0–255; a: 0–1 */
    I_block: {
        r: 255,
        g: 211,
        b: 0,
        a: 1
    },
    /** S_block의 빛깔
     * @constant S_block
     * @type {{r: number, g: number, b: number, a: number}} — r, g, b: 0–255; a: 0–1 */
    S_block: {
        r: 0,
        g: 159,
        b: 107,
        a: 1
    },
    /** Z_block의 빛깔
     * @constant Z_block
     * @type {{r: number, g: number, b: number, a: number}} — r, g, b: 0–255; a: 0–1 */
    Z_block: {
        r: 196,
        g: 2,
        b: 51,
        a: 1
    },
    /** T_block의 빛깔
     * @constant T_block
     * @type {{r: number, g: number, b: number, a: number}} — r, g, b: 0–255; a: 0–1 */
    T_block: {
        r: 153,
        g: 50,
        b: 204,
        a: 1
    }
}

/** 테트리스 땅 모양 10 × 22 
 * @type {number[][]} — 들 값: -1 (빈땅), 0 (O-mino 조각), 1 (L-mino 조각), 2 (J-mino 조각), 3 (I-mino 조각), 4 (S-mino 조각), 5 (Z-mino 조각), 6 (T-mino 조각)
*/
export const tetrisMap = Array.from({length: MAP_HEIGHT}, 
                    () => Array.from({length: MAP_WIDTH}, () => -1));

/** 벽 차기(Wall Kick) 상대 좌표 모델
 * @readonly
 * @constant WALL_KICK_RELATIVE_MODEL 
 * @property {{x: number, y: number}[][]} right — 오른쪽 회전의 벽차기 모델
 * @property {{x: number, y: number}[][]} left — 왼쪽 회전의 벽차기 모델
 * @description WALL_KICK_RELATIVE_MODEL[회전 방향][회전 상태][시험 값][x/y좌표]를 나타낸다.
 */
export const WALL_KICK_RELATIVE_MODEL = {
    /** 오른쪽 회전의 벽차기 모델 
     * @constant right
     * @type {{x: number, y: number}[][]} — right[회전 상태][시험 값]{x: x좌표, y: y좌표} */
    right: [
        [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: +1}, {x: 0, y: -2}, {x: -1, y: -2}], // L > 0
        [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: +2}, {x: -1, y: +2}], // 0 > R
        [{x: 0, y: 0}, {x: +1, y: 0}, {x: +1, y: +1}, {x: 0, y: -2}, {x: +1, y: -2}], // R > 2
        [{x: 0, y: 0}, {x: +1, y: 0}, {x: +1, y: -1}, {x: 0, y: +2}, {x: +1, y: +2}]  // 2 > L
    ],
    /** 왼쪽 회전의 벽차기 모델
     * @constant left
     * @type {{x: number, y: number}[][]} — left[회전 상태][시험 값]{x: x좌표, y: y좌표} */
    left: [
        [{x: 0, y: 0}, {x: +1, y: 0}, {x: +1, y: +1}, {x: 0, y: -2}, {x: +1, y: -2}], // R > 0
        [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: +2}, {x: -1, y: +2}], // 2 > R
        [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: +1}, {x: 0, y: -2}, {x: -1, y: -2}], // L > 2
        [{x: 0, y: 0}, {x: +1, y: 0}, {x: +1, y: -1}, {x: 0, y: +2}, {x: +1, y: +2}]  // 0 > L
    ]    
};

/**I-미노의 벽 차기(Wall Kick) 상대 좌표 모델
 * @readonly
 * @constant WALL_KICK_RELATIVE_MODEL_FOR_I 
 * @property {{x: number, y: number}[][]} right — 오른쪽 회전의 벽차기 모델
 * @property {{x: number, y: number}[][]} left — 왼쪽 회전의 벽차기 모델
 * @description WALL_KICK_RELATIVE_MODEL_FOR_I[회전 방향][회전 상태][시험 값][x/y좌표]를 나타낸다.
 */
export const WALL_KICK_RELATIVE_MODEL_FOR_I = {
    /** 오른쪽 회전의 벽차기 모델 
     * @constant right
     * @type {{x: number, y: number}[][]} — right[회전 상태][시험 값]{x: x좌표, y: y좌표} */
    right: [
        [{x: 0, y: 0}, {x: +1, y: 0}, {x: -2, y: 0}, {x: +1, y: +2}, {x: -2, y: -1}], // L > 0
        [{x: 0, y: 0}, {x: -2, y: 0}, {x: +1, y: 0}, {x: -2, y: +1}, {x: +1, y: -2}], // 0 > R
        [{x: 0, y: 0}, {x: -1, y: 0}, {x: +2, y: 0}, {x: -1, y: -2}, {x: +2, y: +1}], // R > 2
        [{x: 0, y: 0}, {x: +2, y: 0}, {x: -1, y: 0}, {x: +2, y: -1}, {x: -1, y: +2}]  // 2 > L
    ],
    /** 왼쪽 회전의 벽차기 모델
     * @constant left
     * @type {{x: number, y: number}[][]} — left[회전 상태][시험 값]{x: x좌표, y: y좌표} */
    left: [
        [{x: 0, y: 0}, {x: +2, y: 0}, {x: -1, y: 0}, {x: +2, y: -1}, {x: -1, y: +2}], // R > 0
        [{x: 0, y: 0}, {x: +1, y: 0}, {x: -2, y: 0}, {x: +1, y: +2}, {x: -2, y: -1}], // 2 > R
        [{x: 0, y: 0}, {x: -2, y: 0}, {x: +1, y: 0}, {x: -2, y: +1}, {x: +1, y: -2}], // L > 2
        [{x: 0, y: 0}, {x: -1, y: 0}, {x: +2, y: 0}, {x: -1, y: -2}, {x: +2, y: +1}]  // 0 > L
    ]
};

/** 벽 차기(Wall Kick) 절대 좌표 모델
 * @readonly
 * @constant WALL_KICK_ABSOLUTE_MODEL 
 * @type {{x: number, y: number}[][]}
 * @description WALL_KICK_ABSOLUTE_MODEL[회전 상태][시험 값]을 나타낸다.
 */
export const WALL_KICK_ABSOLUTE_MODEL = [
    [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}], // 0 state
    [{x: 0, y: 0}, {x: +1, y: 0}, {x: +1, y: +1}, {x: 0, y: -2}, {x: +1, y: -2}], // R state
    [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}], // 2 state
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: +1}, {x: 0, y: -2}, {x: -1, y: 0}]  // L state
];

/**I-미노의 벽 차기(Wall Kick) 절대 좌표 모델
 * @readonly 
 * @constant WALL_KICK_ABSOLUTE_MODEL_FOR_I
 * @type {{x: number, y: number}[][]} 
 * @description WALL_KICK_ABSOLUTE_MODEL_FOR_I[회전 상태][시험 값]을 나타낸다.
 */
export const WALL_KICK_ABSOLUTE_MODEL_FOR_I = [
    [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}], // 0 state
    [{x: 0, y: 0}, {x: +2, y: 0}, {x: -1, y: 0}, {x: +2, y: -1}, {x: -1, y: +2}], // R state
    [{x: 0, y: 0}, {x: +3, y: 0}, {x: -3, y: 0}, {x: +3, y: +1}, {x: -3, y: +1}], // 2 state
    [{x: 0, y: 0}, {x: +1, y: 0}, {x: -2, y: 0}, {x: +1, y: +2}, {x: -2, y: -1}]  // L state
];