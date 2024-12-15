var delay = 1000;
const mark = {
    line: 0,
    level: 1,
    score: 0,
    combo: -1,
    t_spin: false,
    back_to_back: false,
};
const points = {
    soft_drop: 1,
    hard_drop: 2,
    single: 100,
    double: 300,
    triple: 500,
    tetris: 800,
    t_spin: 400,
    t_spin_single: 800,
    t_spin_double: 1200,
    t_spin_triple: 1600,
    back_to_back_factor: 1.5,
    combo_factor: 50,
    single_perfect_clear: 800,
    double_perfect_clear: 1200,
    triple_perfect_clear: 1600,
    tetris_perfect_clear: 2000,
    BTB_tetris_perfect_clear: 3000
};
/*
|_______Action_____|_______Points_______|_implement_|
|     Soft Drop    |      1 × cells     |     ✔     |
|     Hard Drop    |      2 × cells     |     ✔     |
|       Single     |     100 × level    |     ✘     |
|       Double     |     300 × level    |     ✘     |
|       Triple     |     500 × level    |     ✘     |
|       Tetris     |     800 × level    |     ✘     |
|       T‐Spin     |     400 × level    |     ✘     |
|   T‐Spin Single  |     800 × level    |     ✘     |
|   T‐Spin Double  |    1200 × level    |     ✘     |
|   T‐Spin Triple  |    1600 × level    |     ✘     |
|    Back‐to‐back  | 1.5 × Tetris/T‐Spin|     ✘     |
|       Combo      | 50 × count × level |     ✘     |
| Single Perfect Clear | +  800 × level |     ✘     |
| Double Perfect Clear | + 1200 × level |     ✘     |
| Triple Perfect Clear | + 1600 × level |     ✘     |
| Tetris Perfect Clear | + 2000 × level |     ✘     |
|Back‐to‐back Tetris PC| + 3000 × level |     ✘     |
*/
// 점수들 가져오기
export const getMark = () => {
    return mark;
};
// 줄 지움 점수 갱신
export const updateMarkByLines = (n) => {
    if(n === 0){
        mark.combo = -1;
    }else{
        mark.combo++;
        mark.score += points.combo_factor * mark.combo * level;
        mark.line += n;
        mark.level = Math.floor(mark.line / 10) + 1;
    }
    if(mark.t_spin){
        console.log("티스핀!");
        switch(n){
            case 0:
                mark.score += points.t_spin * level;
                break;
            case 1:
                mark.score += points.t_spin_single * level;
                break;
            case 2:
                mark.score += points.t_spin_double * level;
                break;
            case 3:
                mark.score += points.t_spin_triple * level;
                break;
        }
        updateBTB(true);
    }else{
        updateBTB(false);
        switch(n){
            case 0:

                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:

                updateBTB(true);
                break;
        }
    }
};
// 소프트드롭 점수 갱신
export const updateMarkBySoftDrop = (distance) => {
    mark.score += points.soft_drop * distance;
};
// 하드드롭 점수 갱신
export const updateMarkByHardDrop = (distance) => {
    mark.score += points.hard_drop * distance;
};
export const updateTSpin = (bool) => {
    mark.t_spin = bool;
};
export const updateBTB = (bool) => {
    mark.back_to_back = bool;
};
const updateScore = (points) => {
    mark.score += points;
};
const updateDelay = () => {};