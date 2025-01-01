import {continueGame, startGame} from "./app.js"
import { getMark } from "./scoring.js";

// 점수판 기록 갯수
const RECORD_LENGTH = 12;
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
    let element = openModal("newRecord");
    let input = document.getElementById("yourName");
    input.focus();
    document.getElementById("yourScore").innerHTML = makeScoreString(mark.score);
    addInputEvent(input, inputEvent);
    addKeyboardInput(input, keydownEnterYourName);
    addMouseInput(element, clickNewRecordOK);
};
// 기록 갱신 모달 닫기
const closeNewRecordModal = () => {
    let input = document.getElementById("yourName");
    removeInputEvent(input, inputEvent);
    removeKeyboardInput(input, keydownEnterYourName);
    removeMouseInput(closeModal("newRecord"), clickNewRecordOK);
    closeNameErrorDialog();
};
// 기록 갱신 모달 클릭 이벤트
const clickNewRecordOK = function(event){
    switch(findButton(event)){
        case 'newRecordOK':
            updateAndCloseNewRecord();
            break;
    }
};
// 기록 갱신 이름 엔터키 이벤트
const keydownEnterYourName = function(event){
    if(event.code === 'Enter')
        updateAndCloseNewRecord();
};
// 기록 갱신 이름 입력 이벤트
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
// 기록 갱신한 뒤 모달 닫기
const updateAndCloseNewRecord = () => {
    let name = document.getElementById("yourName").value;
    let mark = getMark();
    addNewRecord(name, mark.score, mark.line);
    closeNewRecordModal();
    openGameOverModal();
};
// 로컬스토리지에서 기록 불러오기
const getRecord = () => {
    return JSON.parse(localStorage.getItem("record"));
};
// 로컬스토리지에 기록 저장
const setRecord = (scoreList) => {
    localStorage.removeItem("record");
    localStorage.setItem("record", JSON.stringify(scoreList));
};
// 기록 갱신 여부
const isNewRecord = (newScore, scoreList) => {
    let list = (scoreList != undefined)? scoreList : (getRecord() != null)? getRecord() : [];
    if(list.length < RECORD_LENGTH)
        return true;
    if(list[list.length - 1].score < newScore)
        return true;
    else
        return false;
};
// 기록 갱신하기
const addNewRecord = (name, score, lines, scoreList) => {
    let list = (scoreList != undefined)? scoreList : (getRecord() != null)? getRecord() : [];
    let tmp_list = [];
    let record = {
        name: name,
        score: makeScoreString(score),
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
// 기록 보여주기
const showHighScores = (scoreList) => {
    let list = (scoreList != undefined)? scoreList : (getRecord() != null)? getRecord() : [];
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
const openNameErrorDialog = () => {
    document.getElementById("name_error").show();
    addMouseInput(document.getElementById("closeDialog"), clickCloseDialog);
};
const closeNameErrorDialog = () => {
    document.getElementById("name_error").close();
    removeMouseInput(document.getElementById("closeDialog"), clickCloseDialog);
};
const clickCloseDialog = (event) => {
    event.preventDefault();
    closeNameErrorDialog();
};
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
// 키보드 입력 추가
const addKeyboardInput = (element, callback) => {
    element.addEventListener("keydown", callback);
};
// 키보드 입력 삭제
const removeKeyboardInput = (element, callback) => {
    element.removeEventListener("keydown", callback);
};
// 인풋 입력 추가
const addInputEvent = (element, callback) => {
    element.addEventListener("input", callback);
};
// 인풋 입력 삭제
const removeInputEvent = (element, callback) => {
    element.removeEventListener("input", callback);
};
// 클래스 이름으로 버튼 반환
const findButton = (event) => {
    event.preventDefault();
    let button = (event.target.className !== '')? event.target.className : event.target.parentElement.className;
    let classes = (button !== '')? button.split(' ') : [];
    return button = (classes.length !== 0)? classes[classes.length - 1] : '';
};
// 숫자형을 쉼표로 구분된 문자열로
const makeScoreString = (score) => {
    let str = (score === '')? '' : score.toString();
    let text = '';
    for(let i = str.length; i > 0; i -= 3){
        text = (text === '')? str.substring(i - 3, i) : str.substring(i - 3, i) + ',' + text;
    }
    return text;
};
// 오늘 날짜 받아오기
const getToday = () => {
    return new Date()
            .toISOString()
            .split("T")[0];
};