# 🌐 Nect Web

> **Nect Web** 프로젝트의 프론트엔드 레포지토리입니다.
---

## 🛠 Tech Stack

### Core & Build
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### State Management & Data Fetching
![Zustand](https://img.shields.io/badge/Zustand_5-orange?style=for-the-badge)
![React Query](https://img.shields.io/badge/React_Query_5-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Styling
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Routing & Forms
![React Router](https://img.shields.io/badge/React_Router_7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form_7-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)

### DX & Linting
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Husky](https://img.shields.io/badge/Husky-brown?style=for-the-badge&logo=npm&logoColor=white)

---

## 📂 Project Structure

```
src/
├── api             # API 호출 함수 및 인스턴스
├── assets          # 정적 자산 (이미지, 아이콘, 폰트)
├── components      # 공통 컴포넌트
│   └── layout      # 레이아웃 관련 컴포넌트
├── constants       # 상수 정의 (Enum, 고정값)
├── contexts        # React Context API
├── hooks           # Custom Hooks
├── pages           # 페이지 단위 컴포넌트
├── stores          # Zustand 전역 상태 스토어
├── types           # TypeScript 전역 타입 정의
└── utils           # 공통 유틸리티 함수
```
---

## 📝 Naming Convention (네이밍 규칙)

| 분류 | 규칙 | 예시 | 비고 |
| :--- | :--- | :--- | :--- |
| **변수/함수** | `camelCase` | `const userInfo`, `getUserData()` | 동사로 시작 권장 |
| **컴포넌트** | `PascalCase` | `LoginModal.tsx`, `UserProfile.tsx` | 파일명과 컴포넌트명 일치 |
| **상수** | `SCREAMING_SNAKE` | `MAX_COUNT`, `API_URL` | `const`로 선언된 고정값 |
| **폴더** | `kebab-case` | `user-profile`, `login-page` | (또는 소문자 사용) |
| **인터페이스** | `PascalCase` | `IProps`, `UserType` | `I` 접두사 사용 여부 결정 |
---

## 💾 Git & Commit Convention

### 브랜치 전략

브랜치는 기능과 목적에 따라 다음과 같이 명명합니다

- `feature/이슈번호-기능명` : 새로운 기능 개발
- `fix/이슈번호-버그내용` : 버그 수정
- `refactor/내용` : 코드 리팩토링

| 타입 | 설명 | 예시 |
| :--- | :--- | :--- |
|**feature**|새로운 기능 개발|`feature/101-login-page`|
|**fix**|버그 수정|`fix/102-typo-correction`|
|**refactor**|코드 리팩토링|`refactor/auth-context-optimization`|

### 💬 Commit Message

Conventional Commits 규칙을 따릅니다 `태그: 제목`

### 태그 종류
| 태그 | 설명 |
| :--- | :--- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `design` | UI/CSS 디자인 변경 |
| `refactor` | 코드 리팩토링 |
| `chore` | 빌드 업무 수정, 패키지 매니저 설정 등 |


**예시**

```
feat: 로그인 페이지 구현
fix: API 호출 시 에러 핸들링 추가
refactor: AuthContext 구조 개선
```
---

## 개발 환경 설정

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 린트 실행
npm run lint
```
