import { getIniLevel } from "./home.js";

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
    back_to_back_tetris_perfect_clear: 3200
};
/*
|________Action________|_______Points_______|_implement_|
|       Soft Drop      |      1 × cells     |     ✔     |
|       Hard Drop      |      2 × cells     |     ✔     |
|         Single       |     100 × level    |     ✔     |
|         Double       |     300 × level    |     ✔     |
|         Triple       |     500 × level    |     ✔     |
|         Tetris       |     800 × level    |     ✔     |
|         T‐Spin       |     400 × level    |     ✔     |
|     T‐Spin Single    |     800 × level    |     ✔     |
|     T‐Spin Double    |    1200 × level    |     ✔     |
|     T‐Spin Triple    |    1600 × level    |     ✔     |
|      Back‐to‐back    | 1.5 × Tetris/T‐Spin|     ✔     |
|         Combo        | 50 × count × level |     ✔     |
| Single Perfect Clear |    + 800 × level   |     ✔     |
| Double Perfect Clear |   + 1200 × level   |     ✔     |
| Triple Perfect Clear |   + 1600 × level   |     ✔     |
| Tetris Perfect Clear |   + 2000 × level   |     ✔     |
|Back‐to‐back Tetris PC|   + 3200 × level   |     ✔     |
*/
// 점수들 가져오기
export const getMark = () => {
    return mark;
};
export const initiateMark = () => {
    mark.line = 0;
    mark.level = getIniLevel();
    mark.score = 0;
    mark.combo = -1;
    mark.t_spin = false;
    mark.back_to_back = false;
    updateDelay(mark.level);
};
// 줄 지움 점수들 갱신
export const updateMarkByLines = (lines) => {
    // 백투백 인수
    let back_to_back = (mark.back_to_back)? points.back_to_back_factor : 1;
    // 점수 결과
    let result = [];
    let line_clear_text = (mark.back_to_back)? "BACK‐TO‐BACK " : "";
    let line_clear_point = 0;
    // 티스핀 여부에 따라 점수 갱신
    if(mark.t_spin){
        line_clear_text += "T‐SPIN";
        switch(lines){
            case 0:
                line_clear_point = back_to_back * points.t_spin * mark.level;
                break;
            case 1:
                line_clear_text += " SINGLE";
                line_clear_point = back_to_back * points.t_spin_single * mark.level;
                break;
            case 2:
                line_clear_text += " DOUBLE";
                line_clear_point = back_to_back* points.t_spin_double * mark.level;
                break;
            case 3:
                line_clear_text += " TRIPLE";
                line_clear_point = back_to_back * points.t_spin_triple * mark.level;
                break;
        }
        updateBTB(true);
    }else{
        switch(lines){
            case 1:
                line_clear_text = "SINGLE";
                line_clear_point = points.single * mark.level;
                break;
            case 2:
                line_clear_text = "DOUBLE";
                line_clear_point = points.double * mark.level;
                break;
            case 3:
                line_clear_text = "TRIPLE";
                line_clear_point = points.triple * mark.level;
                break;
            case 4:
                line_clear_text += "TETRIS";
                line_clear_point = back_to_back * points.tetris * mark.level;
                updateBTB(true);
                break;
        }
        if(lines < 4) updateBTB(false);
    }
    updateScore(line_clear_point);
    result.push({text: line_clear_text, point: line_clear_point});

    // 콤보, 라인, 레벨, 딜레이 갱신
    if(lines === 0){
        mark.combo = -1;
    }else{
        mark.combo++;
        // 콤보 점수
        let combo_point = points.combo_factor * mark.combo * mark.level;
        updateScore(combo_point);
        result.unshift({text:`${mark.combo} COMBO`, point: combo_point});
        // 라인, 레벨, 딜레이 갱신
        mark.line += lines;
        if(updateLevel(mark.line)){
            result.push({text: "LEVEL UP!", point: 0});
            updateDelay(mark.level);
        }
    }

    return result;
};
// 소프트드롭 점수 갱신
export const updateMarkBySoftDrop = (distance) => {
    mark.score += points.soft_drop * distance;
};
// 하드드롭 점수 갱신
export const updateMarkByHardDrop = (distance) => {
    mark.score += points.hard_drop * distance;
};
// perfect clear 점수 갱신
export const updateScoreByPerfectClear = (lines) => {
    let result = [];
    let line_clear_point = 0;
    switch(lines){
        case 1:
            line_clear_point = points.single_perfect_clear * mark.level;
            break;
        case 2:
            line_clear_point = points.double_perfect_clear * mark.level;
            break;
        case 3:
            line_clear_point = points.triple_perfect_clear * mark.level;
            break;
        case 4:
            line_clear_point = (mark.back_to_back)?
                            points.back_to_back_tetris_perfect_clear * mark.level
                            :
                            points.tetris_perfect_clear * mark.level;
            break;
    }
    updateScore(line_clear_point);
    result.push({text: "PERFECT CLEAR", point: line_clear_point});

    return result;
};
// TSpin 갱신
export const updateTSpin = (bool) => {
    mark.t_spin = bool;
};
const updateBTB = (bool) => {
    mark.back_to_back = bool;
};
const updateScore = (points) => {
    mark.score += points;
};
export const getDelay = () => {
    return delay;
};
const updateLevel = (lines) => {
    let newLevel = Math.floor(lines / 10) + getIniLevel();
    if(mark.level < newLevel){
        mark.level = newLevel;
        return true;
    }else{
        return false;
    }
};
const updateDelay = (level) => {
    let new_delay = 1000 * (1 - Math.log10((9 * level + 10) / 19));
    delay = (new_delay > 0)? new_delay : 0;
};
