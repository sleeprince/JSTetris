import {continueGame, startGame} from "./app.js"
import { openHomePage } from "./home.js";
import { getMark } from "./scoring.js";
import { getRankText, openOptionModal } from "./option.js";
import { deepCopy, 
        makeScoreString, 
        getToday,
        openModal,
        closeModal,
        addMouseInput,
        removeMouseInput,
        addKeyboardInput,
        removeKeyboardInput,
        addInputEvent,
        removeInputEvent,
        findButton,
        pseudoEncryptText,
        pseudoDecryptText,
        testObjectStructure
        } from "./utility.js";

/** 순위표 기록 개수 
 * @readonly
 * @constant RECORD_LENGTH 
 * @type {number} */
const RECORD_LENGTH = 12;

/** 일시 정지 모달 열기
 * @function openPauseModal */
export const openPauseModal = () => {
    addMouseInput(openModal("pauseModal"), clickPauseEvent);
};
/** 일시 정지 모달 닫기
 * @function closePauseModal */
const closePauseModal = () => {
    removeMouseInput(closeModal("pauseModal"), clickPauseEvent);
};
/** 일시 정지 모달 마우스클릭 콜백 함수
 * @function clickPauseEvent
 * @param {MouseEvent} event 
 * @description resume을 누르면 일시 정지 모달이 닫히고서 게임이 이어지고, option을 누르면 옵션 모달이 열리고, 
 * how to play를 누르면 하는 법 모달이 열리고, high scores를 누르면 기록 보기 모달이 열리고,
 * quit을 누르면 그만두기 모달이 열린다. */
const clickPauseEvent = function(event){
    switch(findButton(event)){
        case 'resume':
            closePauseModal();
            continueGame();
            break;
        case 'option':
            openOptionModal();
            break;
        case 'howtoplay':
            break;
        case 'highscores':
            openHighScoresModal();
            break;
        case 'quit':
            closePauseModal();
            openQuitModal();
            break;
    }
};
/** 점수에 따라 기록 갱신 모달 또는 게임 종료 모달 열기
 * @function manageGameOverModal
 * @description 현재 점수가 기록 순위 안에 들면 기록 갱신 모달을 열고, 아니라면 게임 종료 모달을 연다. */
export const manageGameOverModal = () => {
    let mark = getMark();
    let score_list = getRecord();
    if(isNewRecord(mark.score, score_list))
        openNewRecordModal(mark);
    else
        openGameOverModal();
};
/** 게임 종료 모달 열기
 * @function openGameOverModal */
const openGameOverModal = () => {
    addMouseInput(openModal("gameoverModal"), clickGameOver);
};
/** 게임 종료 모달 닫기
 *  @function closeGameOverModal */ 
const closeGameOverModal = () => {
   removeMouseInput(closeModal("gameoverModal"), clickGameOver);
};
/** 게임 종료 모달 마우스클릭 콜백 함수
 * @function clickGameOver
 * @param {MouseEvent} event
 * @description replay를 누르면 다시 게임을 시작하고, option을 누르면 옵션 모달이 열리고, highscores를 누르면 점수 보기 모달이 열리고, exit를 누르면 대문으로 나간다. */
const clickGameOver = function(event){
    switch(findButton(event)){
        case 'replay':
            closeGameOverModal();
            startGame();
            break;
        case 'option':
            break;
        case 'highscores':
            openHighScoresModal();
            break;
        case 'exit':
            closeGameOverModal();
            openHomePage();
            break;
    }
};
/** 그만두기 모달 열기
 * @function openQuitModal */
const openQuitModal = () => {
    addMouseInput(openModal("quitModal"), clickQuit);
};
/** 그만두기 모달 닫기
 * @function closeQuitModal */
const closeQuitModal = () => {
    removeMouseInput(closeModal("quitModal"), clickQuit);
};
/** 그만두기 모달 마우스클릭 콜백 함수
 * @function clickQuit
 * @param {MouseEvent} event
 * @description OK 버튼을 누르면 그만두기 모달이 닫히고 대문으로 나간다. CANCEL 버튼을 누르면 그만두기 모달이 닫히고 일시 정지 모달이 열린다. */
const clickQuit = function(event){
    switch(findButton(event)){
        case 'quitOK':
            closeQuitModal();
            openHomePage();
            break;
        case 'quitCancel':
            closeQuitModal();
            openPauseModal();
            break;
    }
};
/** 기록 보기 모달 열기 
 * @function openHighScoresModal */
export const openHighScoresModal = () => {
    addMouseInput(openModal("highscore"), clickHighScoreOK);
    showHighScores();
};
/** 기록 보기 모달 닫기
 * @function closeHighScoresModal */
export const closeHighScoresModal = () => {
    removeMouseInput(closeModal("highscore"), clickHighScoreOK);
};
/** 기록 보기 모달 마우스클릭 콜백 함수
 * @function clickHighScoreOK
 * @param {MouseEvent} event
 * @description OK 버튼을 누르면 기록 보기 모달이 닫힌다. */
const clickHighScoreOK = function(event){
    switch(findButton(event)){
        case 'scoreOK':
            closeHighScoresModal();
            break;
    }
};
/** 기록 갱신 모달 열기
 * @function openNewRecordModal */
const openNewRecordModal = (mark) => {
    let element = openModal("newRecord");
    let input = document.getElementById("yourName");
    input.focus();
    document.getElementById("yourScore").innerHTML = makeScoreString(mark.score);
    addInputEvent(input, inputEvent);
    addKeyboardInput(input, keydownEnterYourName);
    addMouseInput(element, clickNewRecordOK);
};
/** 기록 갱신 모달 닫기
 * @function closeNewRecordModal
 * @description 이름 입력란을 초기화하고 기록 갱신 모달을 닫는다. */
const closeNewRecordModal = () => {
    let input = document.getElementById("yourName");
    removeInputEvent(input, inputEvent);
    removeKeyboardInput(input, keydownEnterYourName);
    removeMouseInput(closeModal("newRecord"), clickNewRecordOK);
    input.value = '';
    closeNameErrorDialog();
};
/** 기록 갱신 모달 마우스클릭 콜백 함수
 * @function clickNewRecordOK
 * @param {MouseEvent} event
 * @description OK 버튼을 누르면 기록이 갱신되고 기록 갱신 모달이 닫힌다. */
const clickNewRecordOK = function(event){
    switch(findButton(event)){
        case 'newRecordOK':
            updateAndCloseNewRecord();
            break;
    }
};
/** 기록 갱신 이름 입력란 엔터키 콜백 함수
 * @function keydownEnterYourName
 * @param {KeyboardEvent} event
 * @description 엔터키를 누르면 기록이 갱신되고 기록 갱신 모달이 닫힌다. */
const keydownEnterYourName = function(event){
    if(event.code === 'Enter')
        updateAndCloseNewRecord();
}; 
/** 기록 갱신 이름 입력란 오류 발생 콜백 함수
 * @function inputEvent
 * @param {InputEvent} event 
 * @description 이름이 너무 길어지면, 입력을 막고, 오류를 알리는 말풍선을 띄운다. */
const inputEvent = function(event){
    let max_width = document.getElementById("score_table")
                            .getElementsByTagName("th")[1]
                            .getBoundingClientRect()
                            .width;
    let element = document.getElementById("nameCopy");
    let text = event.target.value;
    element.innerHTML = text;
    let name_width = element.getBoundingClientRect().width;
    let isTooLong = false;
    closeNameErrorDialog();

    while(name_width > max_width){
        text = element.innerHTML.slice(0, -1);
        event.target.value = text;
        element.innerHTML = text;
        name_width = element.getBoundingClientRect().width;
        isTooLong = true;
    }

    if(isTooLong){
        openNameErrorDialog();
        event.target.focus();
    }
};
/** 점수 기록 갱신한 뒤 모달 닫기
 * @function updateAndCloseNewRecord
 * @description 새 기록을 로컬스토리지에 갱신한 뒤, new record 모달을 닫고, game over 모달을 연다. */
const updateAndCloseNewRecord = () => {
    let name = document.getElementById("yourName").value;
    let mark = getMark();
    addNewRecord(name, mark.score, mark.line);
    closeNewRecordModal();
    openGameOverModal();
};
/** 로컬스토리지에서 점수 기록 불러오기
 * @function getRecord
 * @returns {{name: string, score: number, lines: number, date: string}[]}  */
const getRecord = () => {
    let record = {
        name: "noname",
        score: 0,
        lines: 0,
        date: "2000-01-01"
    };
    // 기록이 있는지 확인
    let scores = localStorage.getItem("record");
    if(scores === null) return null;
    // 바람직한 값인지 확인
    scores = JSON.parse(pseudoDecryptText(scores));
    for(let key of Object.keys(scores)){
        if(!testObjectStructure(scores[key], record))
            return null;
    }
    return scores;
};
/** 로컬스토리지에 점수 기록 저장
 * @function setRecord
 * @param {{name: string, score: number, lines: number, date: string}[]} scoreList score에 따라 오름차순으로 벌인 점수 기록 배열 */
const setRecord = (scoreList) => {
    localStorage.setItem("record", pseudoEncryptText(JSON.stringify(scoreList)));
};
/** 새 기록 경신 확인
 * @function isNewRecord
 * @param {number} newScore 확인할 점수
 * @param {{name: string, score: number, lines: number, date: string}[]} [scoreList] score에 따라 오름차순으로 벌인 점수 기록 배열
 * @returns {boolean} 새 기록인 때에는 True를, 아닌 때에는 False를 돌려 준다. */
const isNewRecord = (newScore, scoreList) => {
    let list = (scoreList != undefined)? scoreList : (getRecord() !== null)? getRecord() : [];
    if(list.length < RECORD_LENGTH)
        return true;
    if(list[list.length - 1].score < newScore)
        return true;
    else
        return false;
};
/** 새 기록 갱신하기
 * @function addNewRecord
 * @param {string} name 갱신할 이름
 * @param {number} score 갱신할 점수
 * @param {number} lines 갱신할 지운 줄 수
 * @param {{name: string, score: number, lines: number, date: string}[]} [scoreList] score에 따라 오름차순으로 벌인 점수 기록 배열 
 * @description 새 기록을 score 오름차순으로 벌인 다음, 그 배열을 로컬스토리지에 저장한다. */ 
const addNewRecord = (name, score, lines, scoreList) => {
    let list = (scoreList != undefined)? scoreList : (getRecord() !== null)? getRecord() : [];
    let tmp_list = [];
    let record = {
        name: name,
        score: score,
        lines: lines,
        date: getToday()
    };
    while(list.length > 0 && list[list.length - 1].score < score)
        tmp_list.push(list.pop());
    
    list.push(record);
    
    while(tmp_list.length > 0 && list.length <= RECORD_LENGTH)
        list.push(tmp_list.pop());
    
    setRecord(list);
};
/** 기록 보기 모달에 표 채우기
 * @function showHighScores
 * @param {{name: string, score: number, lines: number, date: string}[]} [scoreList] score에 따라 오름차순으로 벌인 점수 기록 배열
 * @description id "score_table"로 보람된 HTMLTable에다가 로컬스토리지에서 받아온 점수 기록을 채워 넣는다. */
const showHighScores = (scoreList) => {
    let list = (scoreList != undefined)? scoreList : (getRecord() !== null)? getRecord() : [];
    let len = list.length;
    let table = document.getElementById("score_table").getElementsByTagName("tbody")[0];
    while(table.hasChildNodes())
        table.removeChild(table.firstChild);

    for(let i = 0; i < RECORD_LENGTH; i++){
        let rank = getRankText(i + 1);
        let record = (len > i)? list[i] : {name: "", score: "", lines: "", date: ""};
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${rank}</td>\n
                        <td>${record.name}</td>\n
                        <td>${makeScoreString(record.score)}</td>\n
                        <td>${record.lines}</td>\n
                        <td>${record.date}</td>`;
        table.appendChild(tr);
    }
};
/** 이름 오류 말풍선 열기
 * @function openNameErrorDialog */
const openNameErrorDialog = () => {
    document.getElementById("name_error").show();
    addMouseInput(document.getElementById("closeDialog"), clickCloseDialog);
};
/** 이름 오류 말풍선 닫기
 * @function closeNameErrorDialog */
const closeNameErrorDialog = () => {
    document.getElementById("name_error").close();
    removeMouseInput(document.getElementById("closeDialog"), clickCloseDialog);
};
/** 이름 오류 말풍선 닫기 마우스클릭 콜백 함수
 * @function clickCloseDialog
 * @param {MouseEvent} event */
const clickCloseDialog = function(event){
    event.preventDefault();
    closeNameErrorDialog();
};
/** 게임 방법 모달 열기
 * @function openHowToPlayModal */
const openHowToPlayModal = () => {
    addMouseInput(openModal("howtoplay"), clickHowToPlay);
};
/** 게임 방법 모달 닫기
 * @function closeHowToPlayModal */
const closeHowToPlayModal = () => {
    removeMouseInput(closeModal("howtoplay"), clickHowToPlay);
};
/** 게임 방법 모달 마우스클릭 콜백 함수
 * @function clickHowToPlay
 * @param {MouseEvent} event */
const clickHowToPlay = function(event){
    switch(findButton(event)){

    }
};
// 1. Tetrominos
// 2. Falling
// 3. Locking
// 4. Line Clear
// 5. Move
// 6. Ghost Piece
// 7. Next Queue
// 8. Hold Queue
// 9. Scoring
// 10. Game Over