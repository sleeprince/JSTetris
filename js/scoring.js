import { getIniLevel } from "./home.js";

/* 점수표
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

/** 테트로미노가 떨어지는 속도
 * @type {number} */
var delay = 1000;
/** 점수 요소
 * @namespace mark
 * @property {number} line — 이제까지 지운 줄 수
 * @property {number} level — 레벨: 1부터 시작
 * @property {number} score — 총점
 * @property {number} combo — 콤보 횟수: 끊기면 -1부터 다시 시작
 * @property {boolean} t_spin — T-스핀이면 True를, 아니면 False를 저장
 * @property {boolean} back_to_back — 백투백이면 True를, 아니면 False를 저장 */
const mark = {
    /** 이제까지 지운 줄 수
     * @type {number} */
    line: 0,
    /** 레벨
     * @type {number}
     * @description 1부터 시작한다. */
    level: 1,
    /** 총점
     * @type {number} */
    score: 0,
    /** 콤보 횟수
     * @type {number}
     * @description 콤보가 끊기면 -1부터 다시 시작한다. */
    combo: -1,
    /** T-스핀 여부
     * @type {boolean}
     * @description T-스핀이면 True를, 아니면 False를 저장한다. */
    t_spin: false,
    /** 백투백 여부
     * @type {boolean}
     * @description 백투백이면 True를, 아니면 False를 저장한다. */
    back_to_back: false,
};
/** 점수 기준
 * @readonly
 * @constant points
 * @namespace points
 * @property {number} soft_drop — 소프트드롭
 * @property {number} hard_drop — 하드드롭
 * @property {number} single — 한 줄 지우기
 * @property {number} double — 두 줄 지우기
 * @property {number} triple — 세 줄 지우기
 * @property {number} tetris — 네 줄 지우기
 * @property {number} t_spin — T-스핀
 * @property {number} t_spin_single — T-스핀으로 한 줄 지우기
 * @property {number} t_spin_double — T-스핀으로 두 줄 지우기
 * @property {number} t_spin_triple — T-스핀으로 세 줄 지우기
 * @property {number} back_to_back_factor — 백투백일 때 곱할 점수
 * @property {number} combo_factor — 콤보 점수
 * @property {number} single_perfect_clear — 한 줄 지움으로 퍼펙트 클리어
 * @property {number} double_perfect_clear — 두 줄 지움으로 퍼펙트 클리어
 * @property {number} triple_perfect_clear — 세 줄 지움으로 퍼펙트 클리어
 * @property {number} tetris_perfect_clear — 네 줄 지움으로 퍼펙트 클리어
 * @property {number} back_to_back_tetris_perfect_clear — 백투백 테트리스로 퍼펙트 클리어 */
const points = {
    /** 소프트드롭 기준 점수
     * @type {number}
     * @description 기준 점수 × 눈 */
    soft_drop: 1,
    /** 하드드롭 기준 점수
     * @type {number} 
     * @description 기준 점수 × 눈 */
    hard_drop: 2,
    /** 한 줄 지우기 기준 점수
     * @type {number} 
     * @description 기준 점수 × 레벨 */
    single: 100,
    /** 두 줄 지우기 기준 점수
     * @type {number}
     * @description 기준 점수 × 레벨 */
    double: 300,
    /** 세 줄 지우기 기준 점수
     * @type {number}
     * @description 기준 점수 × 레벨 */
    triple: 500,
    /** 네 줄 지우기 기준 점수
     * @type {number} 
     * @description 기준 점수 × 레벨 */
    tetris: 800,
    /** T-스핀 기준 점수
     * @type {number} 
     * @description 기준 점수 × 레벨 */
    t_spin: 400,
    /** T-스핀 한 줄 지우기 기준 점수
     * @type {number} 
     * @description 기준 점수 × 레벨 */
    t_spin_single: 800,
    /** T-스핀 두 줄 지우기 기준 점수
     * @type {number} 
     * @description 기준 점수 × 레벨 */
    t_spin_double: 1200,
    /** T-스핀 세 줄 지우기 기준 점수
     * @type {number} 
     * @description 기준 점수 × 레벨 */
    t_spin_triple: 1600,
    /** 백투백 기준 점수
     * @type {number} 
     * @description 기준 점수 × 네 줄 지우기 점수/T‐스핀 점수 */
    back_to_back_factor: 1.5,
    /** 콤보 기준 점수
     * @type {number} 
     * @description 기준 점수 × 콤보 횟수 × 레벨 */
    combo_factor: 50,
    /** 한 줄 지줌으로 퍼펙트 클리어 기준 점수
     * @type {number} 
     * @description 기준 점수 × 레벨 */
    single_perfect_clear: 800,
    /** 두 줄 지줌으로 퍼펙트 클리어 기준 점수
     * @type {number} 
     * @description 기준 점수 × 레벨 */
    double_perfect_clear: 1200,
    /** 세 줄 지줌으로 퍼펙트 클리어 기준 점수
     * @type {number} 
     * @description 기준 점수 × 레벨 */
    triple_perfect_clear: 1600,
    /** 네 줄 지줌으로 퍼펙트 클리어 기준 점수
     * @type {number} 
     * @description 기준 점수 × 레벨 */
    tetris_perfect_clear: 2000,
    /** 백투백 네 줄 지줌으로 퍼펙트 클리어 기준 점수
     * @type {number} 
     * @description 기준 점수 × 레벨 */
    back_to_back_tetris_perfect_clear: 3200
};
/** 점수 요소 가져오기
 * @function getMark 
 * @returns {mark} */
export const getMark = () => {
    return mark;
};
/** 점수 요소 초기화
 * @function initiateMark */
export const initiateMark = () => {
    mark.line = 0;
    mark.level = getIniLevel();
    mark.score = 0;
    mark.combo = -1;
    mark.t_spin = false;
    mark.back_to_back = false;
    updateDelay(mark.level);
};
/** 지운 줄 수에 따라 점수 요소 갱신
 * @function updateMarkByLines
 * @param {number} lines 지운 줄 수
 * @returns {{text: string, point: number}} text: 점수 항목, point: 점수 */
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
/** 소프트드롭 점수 갱신
 * @function updateMarkBySoftDrop
 * @param {number} distance 지나간 눈 수 */
export const updateMarkBySoftDrop = (distance) => {
    mark.score += points.soft_drop * distance;
};
/** 하드드롭 점수 갱신
 * @function updateMarkBySoftDrop
 * @param {number} distance 지나간 눈 수 */
export const updateMarkByHardDrop = (distance) => {
    mark.score += points.hard_drop * distance;
};
/** 퍼펙트 클리어 점수 갱신
 * @function updateScoreByPerfectClear
 * @param {number} lines 지운 줄 수
 * @returns {{text: string, point: number}} text: 점수 항목, point: 점수 */
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
/** T‐Spin 여부 갱신 
 * @function updateTSpin
 * @param {boolean} bool T-스핀이면 True를, 아니면 False를 넣는다. */
export const updateTSpin = (bool) => {
    mark.t_spin = bool;
};
/** 백투백 여부 갱신
 * @function updateBTB
 * @param {boolean} bool 백투백이면 True를, 아니면 False를 넣는다. */
const updateBTB = (bool) => {
    mark.back_to_back = bool;
};
/** 점수 갱신
 * @function updateScore
 * @param {number} points 총점에 더할 점수 */
const updateScore = (points) => {
    mark.score += points;
};
/** 테트로미노가 떨어지는 속도 얻기
 * @function getDelay
 * @returns {number} 테트로미노가 떨어지는 속도 */
export const getDelay = () => {
    return delay;
};
/** 이제까지 지운 줄 수에 따라 레벨 갱신
 * @function updateLevel
 * @param {number} lines 이제까지 지운 줄 수
 * @returns {boolean} 레벨이 올랐으면 True를, 안 올랐으면 False를 돌려 준다. */
const updateLevel = (lines) => {
    let newLevel = Math.floor(lines / 10) + getIniLevel();
    if(mark.level < newLevel){
        mark.level = newLevel;
        return true;
    }else{
        return false;
    }
};
/** 레벨에 따라 테트로미노가 떨어지는 속도 갱신
 * @function updateDelay
 * @param {number} level 레벨*/
const updateDelay = (level) => {
    let new_delay = 1000 * (1 - Math.log10((9 * level + 10) / 19));
    delay = (new_delay > 0)? new_delay : 0;
};