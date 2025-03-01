# JSTetris
[프로젝트 결과 열기](https://sleeprince.github.io/JSTetris/)
![Playing_Tetris](https://github.com/user-attachments/assets/9c442c06-c4e7-44ab-bd33-ca3a38d7fdfa)

## 프로젝트 소개
- `HTML`, `CSS`, `JavaScript`로써 정적 웹 페이지 위에 테트리스 게임을 개발
- `Hold Piece`, `Ghose Piece`, `7‐System`, `Super Rotation System` 기능 등 [테트리스 가이드라인](https://harddrop.com/wiki/Tetris_Guideline) 준수
- `options`, `how to play`, `high scores` 등 편의 기능 제공
- 모바일 환경에서 
- **영어** 및 **한국어**, **나랏말ᄊᆞᆷ** 언어 지원

## 개발 환경
- 언어: `JavaScript`
- 그래픽 도구: `HTML`, `CSS`
- 편집기: `Visual Studio code`

## 가이드라인 구현

<details>
    <summary>내용 펼치기</summary>

### ✔️ 10 × 22 모눈 필드
> 플레이필드는 열 칸 너비에 적어도 스물두 칸 높이이다. 스무 줄 높이 너머는 숨기나 막아 놓는다.\
> *Playfield is 10 cells wide and at least 22 cells tall, where rows above 20 are hidden or obstructed by the field frame.*
- 본 프로젝트의 플레이필드는 10 × 22 크기로 구현되었며, 맨 위 두 줄은 테트로미노가 있을 수 있으나 보이지 않도록 숨겨 놓았다.

### ✔️ 테트로미노 빛깔
> | I 미노 | O 미노 | T 미노 | S 미노 | Z 미노 | J 미노 | L 미노 |
> | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
> | 청록(*Cyan*) | 노랑(*Yellow*) | 보라(*Purple*) | 초록(*Green*) | 빨강(*Red*) | 파랑(*Blue*) | 주황(*Orange*) |

### ✔️ 테트로미노 시작 지점
> I미노와 O미노는 열 한가운데에서 시작한다.\
> *The I and O spawn in the middle columns.*\
> 나머지는 한가운데에서 왼쪽으로 치우쳐 시작한다.\
> *The rest spawn in the left-middle columns.*\
> 테트로미노는 가로로 놓인 모습으로 시작한다. J미노, L미노, T미노는 납작한 쪽이 먼저 나오도록 한다.\
> *The tetrominoes spawn horizontally with J, L and T spawning flat-side first.*

### ✔️ 슈퍼 로테이션 시스템(SRS)
> 슈퍼 로테이션 시스템 또는 표준 로테이션 시스템에 따라 테트로미노를 회전시킨다.\
> *Super Rotation System/Standard Rotation System (SRS) specifies tetromino rotation.*

<details>
    <summary>슈퍼 로테이션 시스템이란?</summary>
    
    - 플레이어가
</details>

### ✔️ 조작 버튼
>
> *Standard mappings for console and handheld gamepads:*\
> *- Up, Down, Left, Right on joystick perform locking hard drop, non-locking soft drop (except first frame locking in some games), left shift, and right shift respectively.*\
> *- Left fire button rotates 90 degrees counterclockwise, and right fire button rotates 90 degrees clockwise.*\
> *Standard mappings different from console/handheld gamepads for computer keyboards*
- 본 프로젝트는 PC 또는 모바일 기기가 대상이므로 키보드 입력을 아래와 같이 짝지었다.
| 오른쪽 이동(*right shift*) | 왼쪽 이동(*left shift*) | 아래쪽 이동(*soft drop*) | 즉시 낙하(*hard drop*) | 오른쪽 회전(*clockwise rotation*) | 왼쪽 회전(*counterclockwise rotation*) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 오른쪽 화살표 | 왼쪽 화살표 | 아래쪽 화살표 | Z 글쇠 | 위쪽 화살표 | C 글쇠 |

### ✔️ 랜덤 생성기(7 system)
> 
> *So-called Random Generator (also called "random bag" or "7 system")*

<details>
    <summary>세븐 시스템이란?</summary>
    
    - 플레이어가
</details>

### ✔️ 보관하기(hold piece)
>
>

### ✔️ 그림자(ghost piece)
>
>

### ✔️ 다음 조각
>
>
- 다음 다섯 조각을 미리 보여주도록 하였다.

### ✔️ 레벨 상승
>
> Player may only level up by clearing lines or performing T-Spins. Required lines depends on the game.
- 본 프로젝트에서는 오직 지운 줄의 수에 따라, 열 줄 지울 때마다 레벨이 한 다리씩 오르도록 하였다.

### ✔️ T 스핀
>
>

### ✔️ 점수 보상
>
>
- 

### ✔️ 로고
>
> *The game must use a variant of Roger Dean's Tetris logo.*

### ✔️ 배경음
> 게임은 “크로베이니키”라는 테트리스 테마 음악을 포함해야 한다.\
> *Game must include a song called Korobeiniki, which is the Tetris theme song.*
- “크로베이니키(*Korobeiniki*)” 밖에도 

### ✔️ 게임 종료
> 
> *The player tops out when a piece is spawned overlapping at least one block, or a piece locks completely above the visible portion of the playfield.*

</details>

## 실행 화면
### ⏳ 로딩
### 🏠 대문
### 🧱 게임 진행
### ✋ 일시 정지
### 🥇 점수 경신
### 💣 게임 종료
### ⚙️ 설정
### 🎮 게임 방법
### 📋 순위표
 