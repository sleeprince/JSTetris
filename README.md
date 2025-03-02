# JSTetris
[프로젝트 결과 열기](https://sleeprince.github.io/JSTetris/)
![Playing_Tetris](https://github.com/user-attachments/assets/9c442c06-c4e7-44ab-bd33-ca3a38d7fdfa)

## 프로젝트 소개
- `HTML`, `CSS`, `JavaScript`로써 정적 웹 페이지 위에 테트리스 게임을 개발
- `Hold piece`, `Ghost piece`, `7 system`, `Super Rotation System` 기능 등 [테트리스 가이드라인](https://harddrop.com/wiki/Tetris_Guideline) 준수
- `options`, `how to play`, `high scores` 등 편의 기능 제공
- **영어** 및 **한국어**, **나랏말ᄊᆞᆷ** 언어 지원
- **모바일** 기기용 터치 버튼 구현

## 개발 환경
- 언어: `JavaScript`
- 그래픽 도구: `HTML`, `CSS`
- 편집기: `Visual Studio code`

## 가이드라인 구현

### ✔️ 10 × 22 모눈 영역
> 플레이필드는 열 칸 너비에 적어도 스물두 칸 높이이다. 스무 줄 높이 너머는 숨기나 막아 놓는다.\
> *Playfield is 10 cells wide and at least 22 cells tall, where rows above 20 are hidden or obstructed by the field frame.*
- 이에 플레이필드는 10 × 22 크기로 구현되었며, 맨 위 두 줄은 테트로미노가 있을 수 있으나 보이지 않도록 숨겨 놓았다.

### ✔️ 테트로미노 빛깔
> | I 미노 | O 미노 | T 미노 | S 미노 | Z 미노 | J 미노 | L 미노 |
> | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
> | 청록(*Cyan*) | 노랑(*Yellow*) | 보라(*Purple*) | 초록(*Green*) | 빨강(*Red*) | 파랑(*Blue*) | 주황(*Orange*) |

### ✔️ 테트로미노 시작 지점
> I 미노와 O 미노는 열 한가운데에서 시작한다.\
> *The I and O spawn in the middle columns.*\
> 나머지는 한가운데에서 왼쪽으로 치우쳐 시작한다.\
> *The rest spawn in the left-middle columns.*\
> 테트로미노는 가로로 놓인 모습으로 시작한다. J 미노, L 미노, T 미노는 납작한 쪽이 먼저 나오도록 한다.\
> *The tetrominoes spawn horizontally with J, L and T spawning flat-side first.*

### ✔️ 슈퍼 로테이션 시스템(SRS)
> 슈퍼 로테이션 시스템 또는 표준 로테이션 시스템에 따라 테트로미노를 회전시킨다.\
> *Super Rotation System/Standard Rotation System (SRS) specifies tetromino rotation.*

<details>
    <summary>슈퍼 로테이션 시스템이란?</summary>

#### 1. 회전 상태
- 슈퍼 로테이션 시스템에서 테트로미노는 아래 네 가지 상태를 오가며 회전을 이룬다.
    - 0: 처음 상태
    - R: 처음 상태에서 오른쪽(시계 방향)으로 돌린 상태
    - L: 처음 상태에서 왼쪽(반시계 방향)으로 돌린 상태
    - 2: 어느 쪽이든 두 번 잇달아 돌린 상태
<div align="center">
| 상태 | I 미노 | O 미노 | T 미노 | S 미노 | Z 미노 | J 미노 | L 미노 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0** | ░ ░ ░ ░<br/>█ █ █ █<br/>░ ░ ░ ░<br/>░ ░ ░ ░ | ░ ░ ░ ░<br/>░ █ █ ░<br/>░ █ █ ░<br/>░ ░ ░ ░ | ░ █ ░<br/>█ █ █<br/>░ ░ ░ | ░ █ █<br/>█ █ ░<br/>░ ░ ░ | █ █ ░<br/>░ █ █<br/>░ ░ ░ | █ ░ ░<br/>█ █ █<br/>░ ░ ░ | ░ ░ █<br/>█ █ █<br/>░ ░ ░ |
| **R** | ░ ░ █ ░<br/>░ ░ █ ░<br/>░ ░ █ ░<br/>░ ░ █ ░ | ░ ░ ░ ░<br/>░ █ █ ░<br/>░ █ █ ░<br/>░ ░ ░ ░ | ░ █ ░<br/>░ █ █<br/>░ █ ░ | ░ █ ░<br/>░ █ █<br/>░ ░ █ | ░ ░ █<br/>░ █ █<br/>░ █ ░ | ░ █ █<br/>░ █ ░<br/>░ █ ░ | ░ █ ░<br/>░ █ ░<br/>░ █ █ |
| **2** | ░ ░ ░ ░<br/>░ ░ ░ ░<br/>█ █ █ █<br/>░ ░ ░ ░ | ░ ░ ░ ░<br/>░ █ █ ░<br/>░ █ █ ░<br/>░ ░ ░ ░ | ░ ░ ░<br/>█ █ █<br/>░ █ ░ | ░ ░ ░<br/>░ █ █<br/>█ █ ░ | ░ ░ ░<br/>█ █ ░<br/>░ █ █ | ░ ░ ░<br/>█ █ █<br/>░ ░ █ | ░ ░ ░<br/>█ █ █<br/>█ ░ ░ |
| **L** | ░ █ ░ ░<br/>░ █ ░ ░<br/>░ █ ░ ░<br/>░ █ ░ ░ | ░ ░ ░ ░<br/>░ █ █ ░<br/>░ █ █ ░<br/>░ ░ ░ ░ | ░ █ ░<br/>█ █ ░<br/>░ █ ░ | █ ░ ░<br/>█ █ ░<br/>░ █ ░ | ░ █ ░<br/>█ █ ░<br/>█ ░ ░ | ░ █ ░<br/>░ █ ░<br/>█ █ ░ | █ █ ░<br/>░ █ ░<br/>░ █ ░ |
</div>
#### 2. 담 차기(Wall Kicks)
- 그러나 회전 상태에 따라 테트로미노를 돌렸을 때 땅·담 따위와 겹쳐 돌지 못한다면, 마치 땅·담을 차듯 자리를 옮겨 회전시킨다.
- 테트로미노가 회전할 수 있는 자리를 찾아서 아래의 다섯 가지 자리를 차례대로 판가름해 본다. 다섯 자리에서 모두 땅 또는 담 따위에 겹친다면 회전은 일어나지 않는다.
- 괄호 안의 순서쌍은 옮길 만큼의 x, y 좌표를 뜻하며, x좌표에서 +는 오른쪽을, y좌표에서 +는 위쪽을 가리킨다.
<div align="center">
**<ins>T, S, Z, J, L 테트로미노 담 차기</ins>**
|    | 자리1 | 자리2 | 자리3 | 자리4 | 자리5 |
| :---: | :---: | :---: | :---: | :---: | :---: |
|**0 → R** | (0, 0) | (−1, 0) | (−1, +1) | (0, −2) | (−1, −2) |
|**R → 2** | (0, 0) | (+1, 0) | (+1, −1) | (0, +2) | (+1, +2) |
|**2 → L** | (0, 0) | (+1, 0) | (+1, +1) | (0, −2) | (+1, −2) |
|**L → 0** | (0, 0) | (−1, 0) | (−1, −1) | (0, +2) | (−1, +2) |
|**0 → L** | (0, 0) | (+1, 0) | (+1, +1) | (0, −2) | (+1, −2) |
|**L → 2** | (0, 0) | (−1, 0) | (−1, −1) | (0, +2) | (−1, +2) |
|**2 → R** | (0, 0) | (−1, 0) | (−1, +1) | (0, −2) | (−1, −2) |
|**R → 0** | (0, 0) | (+1, 0) | (+1, −1) | (0, +2) | (+1, +2) |

**<ins>I 테트로미노 담 차기</ins>**
|    | 자리1 | 자리2 | 자리3 | 자리4 | 자리5 |
| :---: | :---: | :---: | :---: | :---: | :---: |
|**0 → R** | (0, 0) | (−2, 0) | (+1, 0) | (−2, −1) | (+1, +2) |
|**R → 2** | (0, 0) | (−1, 0) | (+2, 0) | (−1, +2) | (+2, −1) |
|**2 → L** | (0, 0) | (+2, 0) | (−1, 0) | (+2, +1) | (−1, −2) |
|**L → 0** | (0, 0) | (+1, 0) | (−2, 0) | (+1, −2) | (−2, +1) |
|**0 → L** | (0, 0) | (−1, 0) | (+2, 0) | (−1, +2) | (+2, −1) |
|**L → 2** | (0, 0) | (−2, 0) | (+1, 0) | (−2, −1) | (+1, +2) |
|**2 → R** | (0, 0) | (+1, 0) | (−2, 0) | (+1, −2) | (−2, +1) |
|**R → 0** | (0, 0) | (+2, 0) | (−1, 0) | (+2, +1) | (−1, −2) |
</div>
</details>

### ✔️ 조작 버튼
> 콘솔 및 게임 패드의 표준 입력은 다음과 같다.\
> *Standard mappings for console and handheld gamepads:*
> - 조이스틱의 위, 아래, 왼쪽, 오른쪽 조작은 제가끔 (바로 땅으로 굳는)**즉시 낙하**, **아래쪽 이동**, **왼쪽 이동**, **오른쪽 이동**을 일으킨다.
> - *Up, Down, Left, Right on joystick perform locking hard drop, non-locking soft drop (except first frame locking in some games), left shift, and right shift respectively.*
> - 왼쪽 쏘기 버튼은 테트로미노를 반시계 방향으로 90도만큼 돌리고, 오른쪽 쏘기 버튼은 시계 방향으로 90도만큼 돌린다.
> - *Left fire button rotates 90 degrees counterclockwise, and right fire button rotates 90 degrees clockwise.*
> 컴퓨터 자판은 콘솔 및 게임 패드의 표준 입력과 다를 수 있다.\
> *Standard mappings different from console/handheld gamepads for computer keyboards*
- 여기에서는 PC 또는 모바일 기기가 대상이므로 아래와 같이 키보드 입력을 짝지었다.
<div align="center">
| 오른쪽 이동 | 왼쪽 이동 | 아래쪽 이동 | 즉시 낙하 | 오른쪽 회전 | 왼쪽 회전 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 오른쪽 화살표 | 왼쪽 화살표 | 아래쪽 화살표 | Z 글쇠 | 위쪽 화살표 | C 글쇠 |
</div>
### ✔️ 랜덤 생성기(7 system)
> 이른바 랜덤 생성기(“랜덤 가방” 또는 “7 시스템”으로도 불린다.)로써 테트로미노를 낸다.\
> *So-called Random Generator (also called "random bag" or "7 system")*

<details>
    <summary>세븐 시스템이란?</summary>
  
- 세븐 시스템의 랜덤 생성기는 (I, O, T, S, Z, J, L) 한 바퀴
- 다시 말해, 
</details>

### ✔️ 보관하기(hold piece)
>
>

### ✔️ 그림자(ghost piece)
>
>

### ✔️ 다음 조각(next piece)
>
>
- 다음 다섯 조각을 미리 보여주도록 하였다.

### ✔️ 레벨 상승
> 플레이어의 레벨은 오로지 지운 줄의 개수 또는 T 스핀의 실행 횟수로 오른다. 레벨이 오르는 데 드는 줄의 개수는 게임에 따라 다를 수 있다.\
> Player may only level up by clearing lines or performing T-Spins. Required lines depends on the game.
- 본 프로젝트에서는 오직 지운 줄의 수에 따라, 열 줄 지울 때마다 레벨이 한 다리씩 오르도록 하였다.

### ✔️ T 스핀
> **(3-corner T)** A T-spin bonus is awarded if all of the following are true:
> 1. Tetromino being locked is T.
> 2. Last successful movement of the tetromino was a rotate, as opposed to sideways movement, downward movement, or falling due to gravity.
> 3. Three of the 4 squares diagonally adjacent to the T's center are occupied.

- `T의 세 귀 규칙(3‐corner T)`
    - 게임에 따라 담차기 불인정(no kick), 담 불인정(no wall) 따위로 덧붙는 여러 변칙 기준들이 있으나, 여기에서는 오로지 **세 귀 규칙**만으로 T 스핀을 판가름한다.
- `미니 T 스핀(Mini T‐Sprin)`
    - 게임에 따라 T 스핀을 ‘일반 T 스핀’과 ‘미니 T 스핀’으로 나누기도 한다.
    - 그러나 가이드라인은 ‘일반 T 스핀’과 ‘미니 T 스핀’을 가르는 뚜렷한 기준을 주지 않으므로, 여기에서는 구태여 나누지 않기로 한다. 

### ✔️ 점수 보상
> **<ins>Guideline scoring system</ins>**
> | Action | Points(2006) | | Action | Points(2006) |
> | :---: | :---: | :---: | :---: | :---: | 
> | Soft drop | 1 × cells | | ~~Mini T-Spin Double~~ | ~~400 x level~~ |
> | Hard drop | 2 × cells | | T‐Spin | 400 × level|
> | Single | 100 × level | | T‐Spin Single | 800 × level |
> | Double | 300 × level | | T‐Spin Double | 1200 × level |
> | Triple | 500 × level | | T‐Spin Triple | 1600 × level |
> | Tetris | 800 × level | | Back‐to‐back | 1.5 × Tetris/T‐Spin |
> | ~~Mini T‐Spin~~ | ~~100 x level~~ | | Combo | 50 × count × level |
> | ~~Mini T-Spin Single~~ | ~~100 x level~~ | | | |

- `미니 T 스핀(Mini T‐Sprin)`을 따로 가름하지 않으므로 `T 스핀`과 같은 점수를 보상한다.
- 


### ✔️ 로고
> 게임은 로저 딘의 테트리스 로고의 변형을 써야 한다.\
> *The game must use a variant of Roger Dean's Tetris logo.*

### ✔️ 배경음
> 게임은 “크로베이니키”라는 테트리스 테마 음악을 포함해야 한다.\
> *Game must include a song called Korobeiniki, which is the Tetris theme song.*\
> 게임은 “카츄샤” 또는 “칼린카” 음악을 포함할 것을 권장한다.\
> *Game should include the songs Katjusha, or Kalinka.(Recommended but non-mandatory)*
- “크로베이니키(*Korobeiniki*)”를 비롯해 “로긴스카(*Loginska*)”, “브래딘스키(*Bradinsky*)”, “칼린카(*Kalinka*)”, “트로이카(*Troika*)” 다섯 가지 배경 음악을 담았다.

### ✔️ 게임 종료
> 새로 나온 테트로미노의 일부분가 다른 블록과 겹치거나, 보이는 모눈 영역 위로 완전히 벗어나 굳을 때까지 진행됩니다.\
> *The player tops out when a piece is spawned overlapping at least one block, or a piece locks completely above the visible portion of the playfield.*

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
 