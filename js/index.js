import { startGame } from "./app.js";
import { openHighScoresModal,
        } from "./modalController.js";
import { openModal, closeModal, addMouseInput, removeMouseInput, findButton } from "./utility.js";

// 대문 열기
export const openHomePage = () => {
    closeModal("ingame");
    addMouseInput(openModal("home"), clickMenuEvent);
};
// 대문 닫기
const closeHomePage = () => {
    removeMouseInput(closeModal("home"), clickMenuEvent);
};
// 메뉴 클릭 이벤트
const clickMenuEvent = (event) => {
    switch(findButton(event)){
        case 'play':
            closeHomePage();
            openModal("ingame");
            startGame();
            break;
        case 'levelup':
            break;
        case 'option':
            break;
        case 'howtoplay':
            break;
        case 'highscores':
            openHighScoresModal();
            break;
    }
};
openHomePage();