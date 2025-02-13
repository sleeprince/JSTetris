import { continueGame, startGame } from "./app.js"
import { openHomePage } from "./home.js";
import { getMark } from "./scoring.js";
import { getLanguage, openOptionModal } from "./option.js";
import { playHoldSFX, playMovingSFX } from "./soundController.js";
import { openHowToPlayModal } from "./howtoplay.js";
import { makeScoreString, 
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
        testObjectStructure,
        addMouseClick,
        removeMouseClick,
        getDateText,
        getRankText, 
        getTheCardinalNumerals, 
        getTheNumeralPrenouns, 
        putSpaceByThousand
        } from "./utility.js";

/** 순위표 기록 개수 
 * @readonly
 * @constant RECORD_LENGTH 
 * @type {number} */
const RECORD_LENGTH = 12;
/***************************** 일시 정지 모달 *****************************/
/** 일시 정지 모달 열기
 * @function openPauseModal */
export const openPauseModal = () => {
    addMouseInput(openModal("pauseModal"), clickPauseEvent, overPauseEvent);
};
/** 일시 정지 모달 닫기
 * @function closePauseModal */
const closePauseModal = () => {
    removeMouseInput(closeModal("pauseModal"), clickPauseEvent, overPauseEvent);
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
            playMovingSFX();
            closePauseModal();
            continueGame();
            break;
        case 'option':
            playMovingSFX();
            openOptionModal();
            break;
        case 'howtoplay':
            playMovingSFX();
            openHowToPlayModal();
            break;
        case 'highscores':
            playMovingSFX();
            openHighScoresModal();
            break;
        case 'quit':
            playMovingSFX();
            closePauseModal();
            openQuitModal();
            break;
    }
};
let last_button = '';
/** 일시 정지 모달 마우스오버 콜백 함수
 * @function overPauseEvent
 * @param {MouseEvent} event */
const overPauseEvent = function(event){
    let button = findButton(event)
    switch(button){
        case last_button:
            break;
        case 'resume':
        case 'option':
        case 'howtoplay':
        case 'highscores':
        case 'quit':
            playHoldSFX();
            last_button = button;
            break;
        default:
            last_button = '';
    }
};
/***************************** 게임 종료 모달 *****************************/
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
    addMouseInput(openModal("gameoverModal"), clickGameOver, overGameOver);
};
/** 게임 종료 모달 닫기
 *  @function closeGameOverModal */ 
const closeGameOverModal = () => {
    removeMouseInput(closeModal("gameoverModal"), clickGameOver, overGameOver);
};
/** 게임 종료 모달 마우스클릭 콜백 함수
 * @function clickGameOver
 * @param {MouseEvent} event
 * @description replay를 누르면 다시 게임을 시작하고, option을 누르면 옵션 모달이 열리고, highscores를 누르면 점수 보기 모달이 열리고, exit를 누르면 대문으로 나간다. */
const clickGameOver = function(event){
    switch(findButton(event)){
        case 'replay':
            playMovingSFX();
            closeGameOverModal();
            startGame();
            break;
        case 'option':
            playMovingSFX();
            openOptionModal();
            break;
        case 'highscores':
            playMovingSFX();
            openHighScoresModal();
            break;
        case 'exit':
            playMovingSFX();
            closeGameOverModal();
            openHomePage();
            break;
    }
};
/** 게임 종료 모달 마우스오버 콜백 함수
 * @function overGameOver
 * @param {MouseEvent} event */
const overGameOver = function(event){
    let button = findButton(event)
    switch(button){
        case last_button:
            break;
        case 'replay':
        case 'option':
        case 'highscores':
        case 'exit':
            playHoldSFX();
            last_button = button;
            break;
        default:
            last_button = '';
    }
};
/** 그만두기 모달 열기
 * @function openQuitModal */
const openQuitModal = () => {
    addMouseInput(openModal("quitModal"), clickQuit, overQuit);
};
/** 그만두기 모달 닫기
 * @function closeQuitModal */
const closeQuitModal = () => {
    removeMouseInput(closeModal("quitModal"), clickQuit, overQuit);
};
/** 그만두기 모달 마우스클릭 콜백 함수
 * @function clickQuit
 * @param {MouseEvent} event
 * @description OK 버튼을 누르면 그만두기 모달이 닫히고 대문으로 나간다. CANCEL 버튼을 누르면 그만두기 모달이 닫히고 일시 정지 모달이 열린다. */
const clickQuit = function(event){
    switch(findButton(event)){
        case 'quitOK':
            playMovingSFX();
            closeQuitModal();
            openHomePage();
            break;
        case 'quitCancel':
            playMovingSFX();
            closeQuitModal();
            openPauseModal();
            break;
    }
};
/** 그만두기 모달 마우스클릭 콜백 함수
 * @function overQuit
 * @param {MouseEvent} event */
const overQuit = function(event){
    let button = findButton(event);
    switch(button){
        case last_button:
            break;
        case 'quitOK':
        case 'quitCancel':
            playHoldSFX();
            last_button = button;
            break;
        default:
            last_button = '';
    }
};
/***************************** 기록 보기 모달 *****************************/
/** 기록 보기 모달 열기 
 * @function openHighScoresModal */
export const openHighScoresModal = () => {
    addMouseInput(openModal("highscore"), clickHighScoreOK, overHighScoreOK);
    showHighScores();
};
/** 기록 보기 모달 닫기
 * @function closeHighScoresModal */
export const closeHighScoresModal = () => {
    removeMouseInput(closeModal("highscore"), clickHighScoreOK, overHighScoreOK);
};
/** 기록 보기 모달 마우스클릭 콜백 함수
 * @function clickHighScoreOK
 * @param {MouseEvent} event
 * @description OK 버튼을 누르면 기록 보기 모달이 닫힌다. */
const clickHighScoreOK = function(event){
    switch(findButton(event)){
        case 'scoreOK':
            playMovingSFX();
            closeHighScoresModal();
            break;
    }
};
/** 기록 보기 모달 마우스클릭 콜백 함수
 * @function overHighScoreOK
 * @param {MouseEvent} event */
const overHighScoreOK = function(event){
    let button = findButton(event);
    switch(button){
        case last_button:
            break;
        case 'scoreOK':
            playHoldSFX();
            last_button = button;
            break;
        default:
            last_button = '';
    }
    removeSpeechBubble();
    if(getLanguage() === 'old_korean'){
        switch(button){
            case 'scoreStr':
                addSpeechBubble(putSpaceByThousand(getTheNumeralPrenouns(Number.parseInt(event.target.innerHTML.replaceAll(',', '')), '돈'),' '), event.target);
                break;
            case 'linesStr':
                addSpeechBubble(getTheCardinalNumerals(Number.parseInt(event.target.innerHTML)), event.target);
                break;
            case 'dateStr':            
                addSpeechBubble(getDateText(event.target.innerHTML).replace('ᄒᆡ', 'ᄒᆡ&NewLine;'), event.target);
                break;
        }
    }
};
/** 옛말 모드에서 말풍선 띄우기
 * @function addSpeechBubble
 * @param {string} str 말풍선에 들어갈 말
 * @param {HTMLElement} element 말풀선이 들어갈 요소 */
const addSpeechBubble = (str, element) => {
    if(str !== ''){
        let parent = document.getElementById('score_table').parentElement;
        let bubble = document.createElement('div');
        bubble.className = 'detail_bubble';
        bubble.innerHTML = str;
        parent.appendChild(bubble);
        bubble.style.left = `${(element.getBoundingClientRect().left + element.getBoundingClientRect().right)/2 - parent.getBoundingClientRect().left - bubble.getBoundingClientRect().width/2}px`;
        bubble.style.top = `${element.getBoundingClientRect().bottom - parent.getBoundingClientRect().top}px`;
    }
};
/** 옛말 모드에서 말풍선 지우기
 * @function removeSpeechBubble */
const removeSpeechBubble = () => {
    for(let bubble of document.getElementsByClassName('detail_bubble'))
        bubble.remove();
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
        let record = (len > i)? list[i] : {name: "", score: "", lines: "", date: ""};
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${getRankText(i + 1, getLanguage())}</td>\n
                        <td>${record.name}</td>\n
                        <td class="scoreStr">${makeScoreString(record.score)}</td>\n
                        <td class="linesStr">${record.lines}</td>\n
                        <td class="dateStr">${record.date}</td>`;
        switch(getLanguage()){
            case 'old_korean':
                tr.firstElementChild.style.letterSpacing = '-0.3dvh';
                tr.firstElementChild.style.fontFamily = `'Noto Serif KR', sans-serif`;
                break;
            case 'korean':
                tr.firstElementChild.style.fontFamily = `'Noto Sans KR', sans-serif`;
                break;
        }
        table.appendChild(tr);
    }
};
/***************************** 기록 갱신 모달 *****************************/
/** 기록 갱신 모달 열기
 * @function openNewRecordModal */
const openNewRecordModal = (mark) => {
    let input = document.getElementById("yourName");
    let score = document.getElementById("yourScore");
    let scoreCopy = document.getElementById("scoreCopy");
    if(getLanguage() === 'old_korean'){
        score.innerHTML = putSpaceByThousand(getTheCardinalNumerals(mark.score), '&NewLine;');
        scoreCopy.innerHTML = score.innerHTML;
        if(scoreCopy.getBoundingClientRect().width > input.getBoundingClientRect().width){
            score.style.fontSize = '2.5dvh';
            score.style.paddingBottom = '0dvh';
            score.style.lineHeight = '2.7dvh';
            score.style.top = '-0.5dvh';
            score.style.whiteSpaceCollapse = 'preserve';
        }
    }else{
        score.innerHTML = makeScoreString(mark.score);
    }
    input.focus();
    adjustPlaceholer();
    addInputEvent(input, inputEvent);
    addKeyboardInput(input, keydownEnterYourName);
    addMouseInput(openModal("newRecord"), clickNewRecordOK, overNewRecordOK);
};
/** 기록 갱신 모달 닫기
 * @function closeNewRecordModal
 * @description 이름 입력란을 초기화하고 기록 갱신 모달을 닫는다. */
const closeNewRecordModal = () => {
    let input = document.getElementById("yourName");
    removeInputEvent(input, inputEvent);
    removeKeyboardInput(input, keydownEnterYourName);
    removeMouseInput(closeModal("newRecord"), clickNewRecordOK, overNewRecordOK);
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
            playMovingSFX();
            updateAndCloseNewRecord();
            break;
    }
};
/** 기록 갱신 모달 마우스오버 콜백 함수
 * @function overNewRecordOK
 * @param {MouseEvent} event */
const overNewRecordOK = function(event){
    let button = findButton(event);
    switch(button){
        case last_button:
            break;
        case 'newRecordOK':
            playHoldSFX();
            last_button = button;
            break;
        default:
            last_button = '';
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
    adjustPlaceholer();
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
/** 입력란의 placeholder 크기 조정
 * @function adjustPlacehole */
const adjustPlaceholer = () => {
    let element = document.getElementById('yourName');
    if(element.value === ''){
        switch(getLanguage()){
            case 'english':
                element.style.fontSize = `2.3dvh`;
                break;
            case 'korean':
            case 'old_korean':
                element.style.fontSize = `2dvh`;
                break;
        }
    }else{
        element.style.fontSize = `2.3dvh`;        
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
/** 이름 오류 말풍선 열기
 * @function openNameErrorDialog */
const openNameErrorDialog = () => {
    document.getElementById("name_error").show();
    addMouseClick(document.getElementById("closeDialog"), clickCloseDialog);
};
/** 이름 오류 말풍선 닫기
 * @function closeNameErrorDialog */
const closeNameErrorDialog = () => {
    document.getElementById("name_error").close();
    removeMouseClick(document.getElementById("closeDialog"), clickCloseDialog);
};
/** 이름 오류 말풍선 닫기 마우스클릭 콜백 함수
 * @function clickCloseDialog
 * @param {MouseEvent} event */
const clickCloseDialog = function(event){
    event.preventDefault();
    closeNameErrorDialog();
};