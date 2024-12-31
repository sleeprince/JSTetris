import {continueGame, startGame} from "./app.js"
import { getMark } from "./scoring.js";

const RECORD_LENGTH = 12;
// id로 모달 열기
const openModal = (id) => {
    let element = document.getElementById(id);
    element.style.visibility = 'visible';
    return element;
};
// id로 모달 닫기
const closeModal = (id) => {
    let element = document.getElementById(id);
    element.style.visibility = 'hidden';
    return element;
};
// 마우스 입력 추가
const addMouseInput = (element, callback) => {
    element.addEventListener("click", callback);
};
// 마우스 입력 삭제
const removeMouseInput = (element, callback) => {
    element.removeEventListener("click", callback);
};
const findButton = (event) => {
    event.preventDefault();
    let button = (event.target.className !== '')? event.target.className : event.target.parentElement.className;
    let classes = (button !== '')? button.split(' ') : [];
    return button = (classes.length !== 0)? classes[classes.length - 1] : '';
};
// 일시 정지 모달 열기
export const openPauseModal = () => {
    addMouseInput(openModal("pauseModal"), clickEvent);
};
// 일시 정지 모달 닫기
const closePauseModal = () => {
    removeMouseInput(closeModal("pauseModal"), clickEvent);
};
// 일시 정지 모달 클릭 이벤트
const clickEvent = function(event){
    switch(findButton(event)){
        case 'resume':
            closePauseModal();
            continueGame();
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
// 게임 오버 컨트롤러
export const manageGameOverModal = () => {
    let mark = getMark();
    let score_list = getRecord();
    if(isNewRecord(mark.score, score_list))
        openNewRecordModal(mark);
    else
        openGameOverModal();
};
// 게임 오버 모달 열기
const openGameOverModal = () => {
    openModal("gameoverModal");
};
// 게임 오버 모달 닫기
const closeGameOverModal = () => {
   closeModal("gameoverModal");
};
// 그만두기 모달 열기
const openQuitModal = () => {
    addMouseInput(openModal("quitModal"), clickQuit);
};
// 그만두기 모달 닫기
const closeQuitModal = () => {
    removeMouseInput(closeModal("quitModal"), clickQuit);
};
// 그만두기 모달 클릭 이벤트
const clickQuit = function(event){
    switch(findButton(event)){
        case 'quitOK':
            // fill later properly
            closeQuitModal();
            startGame();
            break;
        case 'quitCancel':
            closeQuitModal();
            openPauseModal();
            break;
    }
};
// 기록 보기 모달 열기
const openHighScoresModal = () => {
    addMouseInput(openModal("highscore"), clickHighScoreOK);
    showHighScores();
};
// 기록 보기 모달 닫기
const closeHighScoresModal = () => {
    removeMouseInput(closeModal("highscore"), clickHighScoreOK);
};
// 기록 보기 모달 클릭 이벤트
const clickHighScoreOK = function(event){
    switch(findButton(event)){
        case 'scoreOK':
            closeHighScoresModal();
            break;
    }
};
// 기록 갱신 모달 열기
const openNewRecordModal = (mark) => {
    let element = openModal("newRecord")
    addMouseInput(element, clickNewRecordOK);
    document.getElementById("yourScore").innerHTML = mark.score;
};
// 기록 갱신 모달 닫기
const closeNewRecordModal = () => {
    removeMouseInput(closeModal("newRecord"), clickNewRecordOK);
};
// 기록 갱신 모달 클릭 이벤트
const clickNewRecordOK = function(event){
    switch(findButton(event)){
        case 'newRecordOK':
            let name = document.getElementById("yourName").value;
            let mark = getMark();
            addNewRecord(name, mark.score, mark.line);
            closeNewRecordModal();
            openGameOverModal();
            break;
    }
}
const getRecord = () => {
    return JSON.parse(localStorage.getItem("record"));
};
const setRecord = (scoreList) => {
    localStorage.removeItem("record");
    localStorage.setItem("record", JSON.stringify(scoreList));
};
const isNewRecord = (newScore, scoreList) => {
    let list = (scoreList == undefined)? getRecord() : scoreList;
    if(list.length < RECORD_LENGTH)
        return true;
    if(list[list.length - 1].score < newScore)
        return true;
    else
        return false;
};
const addNewRecord = (name, score, lines, scoreList) => {
    let list = (scoreList == undefined)? getRecord() : scoreList;
    let tmp_list = [];
    let record = {
        name: name,
        score: makeScoreString(score),
        lines: lines,
        date: getToday()
    };
    while(list[list.length - 1].score < score)
        tmp_list.push(list.pop());

    list.push(record);
    
    while(tmp_list.length > 0 && list.length <= RECORD_LENGTH)
        list.push(tmp_list.pop());
    
    setRecord(list);
};
const showHighScores = (scoreList) => {
    let list = (scoreList !== undefined)? scoreList : (getRecord() !== null)? getRecord() : [];
    let len = list.length;
    let table = document.getElementById("score_table_body");
    while(table.hasChildNodes())
        table.removeChild(table.firstChild);

    for(let i = 0; i < RECORD_LENGTH; i++){
        let rank = i + 1;
        let suffix = (rank > 3)? 'th' : (rank === 1)? 'st' : (rank === 2)? 'nd' : 'rd';
        let record = (len > i)? list[i] : {name: "", score: "", lines: "", date: ""};
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${rank}${suffix}</td>\n
                        <td>${record.name}</td>\n
                        <td>${record.score}</td>\n
                        <td>${record.lines}</td>\n
                        <td>${record.date}</td>`;
        table.appendChild(tr);
    }
};
const makeScoreString = (score) => {
    let str = (score === '')? '' : score.toString();
    let text = '';
    for(let i = str.length; i > 0; i -= 3){
        text = (text === '')? str.substring(i - 3, i) : str.substring(i - 3, i) + ',' + text;
    }
    return text;
};
const getToday = () => {
    return new Date()
            .toISOString()
            .split("T")[0];
};