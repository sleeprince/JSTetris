import { makeScoreString, getTheCardinalNumerals, getTheOrdinalNumerals, putSpaceByThousand } from "./utility.js";
import { getLanguage } from "./option.js";

/** 점수 요소 보여 주기
 * @function showMark
 * @param {{line: number, level: number, score: number}} mark 지운 줄, 레벨, 점수
 * @description 화면의 LEVEL, SCORE, LINES 칸을 위 변수의 요소로 채운다. */
export const showMark = (mark) => {
    setLevelBoard(mark.level);
    setLinesBoard(mark.line);
    setScoreBoard(mark.score);
};
/** 점소 요소 숨기기
 * @function hideMark
 * @description 화면의 Line, Level, Score 칸에서 내용을 지운다. */
export const hideMark = () => {
    setLevelBoard('');
    setLinesBoard('');
    setScoreBoard('');
};
/** 일시 정지 기호 넣기
 * @function setPauseSymbol
 * @description 일시 정지 버튼에 일시 정지 기호(❙❙)를 그린다. */
export const setPauseSymbol = () => {
    document.getElementById("pauseButton").innerHTML =`<div id="pause_symbol">❙❙</div>`;
};
/** 재생 기호 넣기
 * @function setPlaySymbol
 * @description 일시 정지 버튼에 재생 기호(⏵)를 그린다. */
export const setPlaySymbol = () => {
    document.getElementById("pauseButton").innerHTML =`<div id="play_symbol">⏵</div>`;
};
/** 레벨 보여 주기
 * @function setLevelBoard
 * @param {number} level 보일 레벨 숫자
 * @description 화면의 LEVEL 칸을 위 변수로 채운다. */
const setLevelBoard = (level) => {
    document.getElementById("levelSection")
        .getElementsByClassName("content")[0]
        .innerHTML = (getLanguage() === 'old_korean')? `${getTheOrdinalNumerals(level)}` : `${level}`;
};
/** 지운 줄 보여 주기
 * @function setLinesBoard
 * @param {number} lines 보일 지운 줄 수
 * @description 화면의 LINES 칸을 위 변수로 채운다. */
const setLinesBoard = (lines) => {
    document.getElementById("linesSection")
        .getElementsByClassName("content")[0]
        .innerHTML = (getLanguage() === 'old_korean')? `${getTheCardinalNumerals(lines)}` : `${lines}`;
};
/** 점수 보여 주기
 * @function setScoreBoard
 * @param {number} score 보일 점수
 * @description 화면의 SCORE 칸을 위 변수로 채운다. */
const setScoreBoard = (score) => {
    document.getElementById("scoreSection")
        .getElementsByClassName("content")[0]
        .innerHTML = (getLanguage() === 'old_korean')? 
                `${putSpaceByThousand(getTheCardinalNumerals(score))}` 
                : `${makeScoreString(score)}`;
};