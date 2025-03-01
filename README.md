# JSTetris
[프로젝트 결과 열기](https://sleeprince.github.io/JSTetris/)
![Playing_Tetris](https://github.com/user-attachments/assets/9c442c06-c4e7-44ab-bd33-ca3a38d7fdfa)

## 프로젝트 소개
- `HTML`, `CSS`, `JavaScript`로써 정적 웹 페이지 위에 테트리스 게임을 개발
- `7‐System`, `Super Rotation System`, `Wall Kick` 기능 등 [테트리스 가이드라인](https://harddrop.com/wiki/Tetris_Guideline) 준수
- `options`, `how to play`, `high scores` 등 편의 기능 제공
- 모바일 환경에서 
- **영어** 및 **한국어**, **나랏말ᄊᆞᆷ** 언어 지원

## 개발 환경
- 언어: `JavaScript`
- 그래픽 도구: `HTML`, `CSS`
- 편집기: `Visual Studio code`

## 가이드라인 구현

### ✔️ 10 × 22 모눈 필드
> 플레이필드는 열 칸 너비에 적어도 스물두 칸 높이이다. 스물 줄 높이 너머는 가리거나 막아 놓는다.
> *Playfield is 10 cells wide and at least 22 cells tall, where rows above 20 are hidden or obstructed by the field frame*

### ✔️ 테트로미노 빛깔 지정
| I미노 | O미노 | T미노 | S미노 | Z미노 | J미노 | L미노 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 청록(*cyan*) | 노랑(*yellow*) | 보라(*Purple*) | 초록(*Green*) | 빨강(*Red*) | 파랑(*Blue*) | 주황(*Orange*) |

### ✔️ 테트로미노 시작 지점
> I미노와 O미노는 열 한가운데에서 시작한다.
> *The I and O spawn in the middle columns*
> 나머지는 한가운데에서 왼쪽으로 치우쳐 시작한다.
> *The rest spawn in the left-middle columns*
> 테트로미노는 가로로 놓인 모습으로 시작한다. J미노, L미노, T미노는 납작한 쪽이 아래를 보도록 한다.
> *The tetrominoes spawn horizontally with J, L and T spawning flat-side first.*

## 실행 화면
### ⏳로딩
### 🚪대문
### 🧱게임 진행
### ✋일시 정지
### 🥇점수 경신
### 💣게임 종료
### ⚙️설정
### 🎮게임 방법
### 📋순위표
 