# React Block Editor - Project Structure

## 디렉토리 구조

```
react-block-editor/
├── docs/                          # 문서
│   ├── BASE_CONCEPTS.md          # 기본 개념
│   ├── API_REFERENCE.md          # API 참조
│   └── PROJECT_STRUCTURE.md      # 프로젝트 구조 (이 파일)
├── src/                          # 소스 코드
│   ├── components/               # React 컴포넌트
│   │   ├── blocks/              # 블록 컴포넌트들
│   │   │   ├── ParagraphBlock.tsx
│   │   │   ├── HeaderBlock.tsx
│   │   │   └── index.ts
│   │   ├── BlockEditor.tsx      # 메인 에디터 컴포넌트
│   │   ├── BlockRenderer.tsx    # 블록 렌더링 컴포넌트
│   │   └── Toolbar.tsx          # 툴바 컴포넌트
│   ├── hooks/                   # 커스텀 훅
│   │   └── useEditor.ts         # 에디터 상태 관리 훅
│   ├── types/                   # TypeScript 타입 정의
│   │   └── index.ts
│   ├── utils/                   # 유틸리티 함수 (향후)
│   ├── styles/                  # 스타일 파일 (향후)
│   ├── App.tsx                  # 메인 앱 컴포넌트
│   ├── App.css                  # 앱 스타일
│   ├── index.css                # 글로벌 스타일
│   └── main.tsx                 # 앱 진입점
├── public/                      # 정적 파일
├── dist/                        # 빌드 결과물 (자동 생성)
├── node_modules/                # 의존성 (자동 생성)
├── package.json                 # 프로젝트 설정
├── package-lock.json            # 의존성 잠금 파일
├── tsconfig.json                # TypeScript 설정
├── tsconfig.app.json            # 앱 TypeScript 설정
├── tsconfig.node.json           # Node.js TypeScript 설정
├── vite.config.ts               # Vite 설정
├── tailwind.config.js           # Tailwind CSS 설정
├── postcss.config.js            # PostCSS 설정
├── eslint.config.js             # ESLint 설정
├── .gitignore                   # Git 무시 파일
└── README.md                    # 프로젝트 README
```

## 핵심 파일 설명

### 1. 컴포넌트 구조

#### `/src/components/BlockEditor.tsx`
메인 에디터 컴포넌트입니다. 전체 에디터의 상태를 관리하고 하위 컴포넌트들을 조율합니다.

**주요 기능:**
- 에디터 상태 관리
- 블록 추가/삭제/이동
- 이벤트 핸들링
- 읽기 전용 모드 지원

#### `/src/components/Toolbar.tsx`
에디터 상단의 도구 모음입니다. 블록 추가와 선택된 블록 조작 기능을 제공합니다.

**주요 기능:**
- 블록 타입별 추가 버튼
- 선택된 블록 이동/삭제
- 반응형 디자인

#### `/src/components/BlockRenderer.tsx`
블록 타입에 따라 적절한 컴포넌트를 렌더링하는 중간자 역할을 합니다.

**주요 기능:**
- 블록 타입별 컴포넌트 매핑
- 에러 처리
- 일관된 인터페이스 제공

### 2. 블록 컴포넌트

#### `/src/components/blocks/ParagraphBlock.tsx`
일반 텍스트 문단을 위한 블록 컴포넌트입니다.

**특징:**
- 자동 높이 조절 textarea
- Enter 키 처리
- 플레이스홀더 지원

#### `/src/components/blocks/HeaderBlock.tsx`
제목(H1-H6)을 위한 블록 컴포넌트입니다.

**특징:**
- 헤더 레벨 선택 도구
- 반응형 폰트 크기
- 인라인 편집

#### `/src/components/blocks/index.ts`
블록 컴포넌트들을 한 곳에서 export하는 인덱스 파일입니다.

### 3. 훅과 타입

#### `/src/hooks/useEditor.ts`
에디터의 상태 관리를 담당하는 커스텀 훅입니다.

**주요 기능:**
- 블록 CRUD 작업
- 선택 상태 관리
- 이벤트 콜백 처리

#### `/src/types/index.ts`
TypeScript 타입 정의들을 모아놓은 파일입니다.

**주요 타입:**
- `EditorData`: 전체 에디터 데이터
- `Block`: 개별 블록
- `BlockComponentProps`: 블록 컴포넌트 props
- `EditorConfig`: 에디터 설정

### 4. 설정 파일

#### `package.json`
프로젝트 메타데이터와 의존성을 정의합니다.

**주요 의존성:**
- React 18+
- TypeScript
- Vite
- Tailwind CSS

#### `vite.config.ts`
Vite 빌드 도구 설정입니다.

**주요 설정:**
- TypeScript 지원
- React 플러그인
- 개발 서버 설정

#### `tailwind.config.js`
Tailwind CSS 설정 파일입니다.

**주요 설정:**
- 컨텐츠 경로
- 테마 커스터마이징
- 플러그인

## 확장 지점

### 1. 새로운 블록 추가

새로운 블록을 추가하려면:

1. `/src/components/blocks/` 디렉토리에 새 컴포넌트 생성
2. `/src/components/blocks/index.ts`에 export 추가
3. `/src/components/BlockRenderer.tsx`에 매핑 추가
4. `/src/components/Toolbar.tsx`에 버튼 추가

### 2. 새로운 훅 추가

새로운 훅을 추가하려면:

1. `/src/hooks/` 디렉토리에 새 훅 파일 생성
2. 필요한 타입을 `/src/types/index.ts`에 추가

### 3. 유틸리티 함수 추가

유틸리티 함수를 추가하려면:

1. `/src/utils/` 디렉토리 생성
2. 기능별로 파일 분리 (예: `blockUtils.ts`, `validationUtils.ts`)

## 빌드 프로세스

### 개발 모드
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

### 타입 체크
```bash
npm run type-check
```

### 린트
```bash
npm run lint
```

## 배포 준비

### npm 패키지로 배포하기

1. `package.json` 수정:
   ```json
   {
     "name": "react-block-editor",
     "version": "1.0.0",
     "main": "dist/index.js",
     "types": "dist/index.d.ts",
     "exports": {
       ".": {
         "import": "./dist/index.js",
         "types": "./dist/index.d.ts"
       }
     }
   }
   ```

2. 빌드 설정 추가:
   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       lib: {
         entry: 'src/index.ts',
         name: 'ReactBlockEditor',
         fileName: 'index'
       },
       rollupOptions: {
         external: ['react', 'react-dom'],
         output: {
           globals: {
             react: 'React',
             'react-dom': 'ReactDOM'
           }
         }
       }
     }
   });
   ```

3. 진입점 파일 생성:
   ```typescript
   // src/index.ts
   export { BlockEditor } from './components/BlockEditor';
   export { useEditor } from './hooks/useEditor';
   export type * from './types';
   ```

## 테스트 구조 (향후)

```
tests/
├── unit/                    # 단위 테스트
│   ├── components/         # 컴포넌트 테스트
│   ├── hooks/             # 훅 테스트
│   └── utils/             # 유틸리티 테스트
├── integration/            # 통합 테스트
└── e2e/                   # E2E 테스트
```

## 문서 구조

```
docs/
├── BASE_CONCEPTS.md        # 기본 개념
├── API_REFERENCE.md        # API 참조
├── PROJECT_STRUCTURE.md    # 프로젝트 구조
├── GETTING_STARTED.md      # 시작 가이드 (향후)
├── EXAMPLES.md             # 사용 예시 (향후)
└── CONTRIBUTING.md         # 기여 가이드 (향후)
``` 