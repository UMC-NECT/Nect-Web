# Code Review Style Guide

## 1. General Principles (일반 원칙)
- **DRY (Don't Repeat Yourself):** 중복 코드는 유틸리티 함수나 훅으로 분리한다.
- **Early Return:** 중첩된 if문(Deep nesting)을 피하고, 조건이 맞지 않으면 빠르게 리턴한다.
- **Immutability:** 데이터는 불변성을 유지하며 다룬다. (특히 상태 관리 시)

## 2. TypeScript Best Practices
- **No Explicit `any`:** `any` 타입 사용을 금지한다. 데이터 구조를 모를 경우 `unknown`을 사용하고 Type Guard로 좁혀서 사용한다.
- **Strict Typing:** - Props는 `interface` 또는 `type`으로 명시적으로 정의한다.
  - `React.FC` 사용을 지양하고, 함수 인자에 직접 타입을 지정한다.
    > **Good:** `export const MyComponent = ({ title }: MyComponentProps) => ...`
- **Utility Types:** `Pick`, `Omit`, `Partial` 등을 적극 활용하여 타입 중복을 줄인다.

## 3. Naming Conventions (명명 규칙)
- 변수명은 그 자체로 의도를 드러내야 한다. (`data`, `temp`, `val` 사용 금지)
- 함수는 동사로 시작한다. (`getUserData`, `isValidEmail`)
- 변수명, 함수명은 CamelCase 문법을 사용
- 컴포넌트명은 PascalCase 문법을 사용
- 상수명은 SCREAMING_SNAKE 문법을 사용
- 폴더명은 kebab-case 문법을 사용
- 인터페이스, 타입 선언은 PascalCase 문법을 사용

## 4. React Components & Hooks
- **Component Structure:**
  - 컴포넌트는 오직 **Rendering**에만 집중한다.
  - 복잡한 로직, 데이터 변환, API 호출은 **Custom Hook**으로 분리한다.
- **Hooks Rules:**
  - `useEffect` 사용을 최소화한다. 데이터 fetching은 `React Query`를 사용하고, 파생 상태(Derived State)는 변수로 계산하거나 `useMemo`를 사용한다.
  - `useEffect`, `useCallback`, `useMemo`의 의존성 배열(Dependency Array)은 거짓말을 하지 않아야 한다(모든 의존성을 포함).
- **Fragments:** 불필요한 `div` 래퍼 대신 `<>` (Fragment)를 사용한다.

## 5. Error Handling (에러 처리)
- **DON'T:**
  ```javascript
  try { ... } catch (e) { console.log(e); } // 절대 금지

  ## 5. Styling (Tailwind CSS)
- **Consistency:** 색상, 간격 등은 하드코딩하지 않고 `tailwind.config.js`의 테마 변수를 활용한다.
- **Libraries:** 조건부 스타일링 시 `clsx` 또는 `tailwind-merge`를 사용한다.

- 모든 리뷰는 한국어로 진행
- 가독성을 고려한 코드인지 확인