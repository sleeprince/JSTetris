var line = 0;
var level = 0;
var score = 0;
var combo = 0;
var delay = 1000;

export const addLines = (n) => {
    line += n;
    level = Math.floor(line / 10);
    if(n === 0) combo = 0;
    else combo++;
};

const tSpin = (block) => {

};

const isBackToBack = () => {}


/*

|_____Action____|_______Points_______|_implement_|
|   Soft Drop   |      1 × cells     |     ✘     |
|   Hard Drop   |      2 × cells     |     ✘     |
|     Single    |     100 × level    |     ✘     |
|     Double    |     300 × level    |     ✘     |
|     Triple    |     500 × level    |     ✘     |
|     Tetris    |     800 × level    |     ✘     |
|     T‐Spin    |     400 × level    |     ✘     |
| T‐Spin Single |     800 × level    |     ✘     |
| T‐Spin Double |    1200 × level    |     ✘     |
| T‐Spin Triple |    1600 × level    |     ✘     |
|  Back‐to‐back | 1.5 × Tetris/T‐Spin|     ✘     |
|     Combo     | 50 × count × level |     ✘     |

| Single Perfect Clear |  + 800 × level |     ✘     |
| Double Perfect Clear | + 1200 × level |     ✘     |
| Triple Perfect Clear | + 1600 × level |     ✘     |
| Tetris Perfect Clear | + 2000 × level |     ✘     |
|Back‐to‐back Tetris PC| + 3200 × level |     ✘     |

*/