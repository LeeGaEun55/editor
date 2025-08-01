# React Block Editor

Editor.js를 롤모델로 하는 React 기반 블록 에디터입니다. 각 콘텐츠 요소가 독립적인 블록으로 관리되며, JSON 형태의 깔끔한 데이터 구조를 제공합니다.

## ✨ 특징

- 🧱 **블록 기반 아키텍처**: 각 콘텐츠 요소가 독립적인 블록으로 관리
- 📝 **깔끔한 데이터 구조**: Editor.js와 유사한 JSON 형태의 데이터
- 🎨 **확장 가능한 디자인**: 새로운 블록 타입을 쉽게 추가
- ⚡ **TypeScript 지원**: 완전한 타입 안정성
- 🎯 **React 18 최적화**: 최신 React 기능 활용
- 🎨 **Tailwind CSS**: 빠르고 일관된 스타일링
- 📦 **npm 패키지 준비**: 다른 프로젝트에서 쉽게 사용 가능

## 🚀 빠른 시작

### 설치

```bash
npm install react-block-editor
```

### 기본 사용법

```tsx
import React from 'react';
import { BlockEditor } from 'react-block-editor';

function App() {
  const handleChange = (data) => {
    console.log('Editor data:', data);
  };

  return (
    <BlockEditor
      placeholder="내용을 입력하세요..."
      onChange={handleChange}
      onReady={() => console.log('Editor ready!')}
    />
  );
}
```

## 📚 문서

- [기본 개념](./docs/BASE_CONCEPTS.md) - 에디터의 핵심 개념과 아키텍처
- [API 참조](./docs/API_REFERENCE.md) - 상세한 API 문서
- [프로젝트 구조](./docs/PROJECT_STRUCTURE.md) - 코드 구조와 확장 방법

## 🧩 지원하는 블록 타입

### 현재 지원
- **문단 (Paragraph)**: 일반 텍스트 문단
- **제목 (Header)**: H1-H6 제목

### 향후 지원 예정
- **목록 (List)**: 순서 있는/없는 목록
- **이미지 (Image)**: 이미지 업로드 및 관리
- **인용문 (Quote)**: 인용 블록
- **코드 (Code)**: 코드 블록
- **테이블 (Table)**: 데이터 테이블

## 🎯 데이터 구조

```json
{
  "time": 1635603431943,
  "blocks": [
    {
      "id": "header-1",
      "type": "header",
      "data": {
        "text": "제목",
        "level": 1
      }
    },
    {
      "id": "paragraph-1",
      "type": "paragraph",
      "data": {
        "text": "내용"
      }
    }
  ],
  "version": "1.0.0"
}
```

## 🔧 커스터마이징

### 새로운 블록 타입 추가

```tsx
import React from 'react';
import type { BlockComponentProps } from 'react-block-editor';

export const CustomBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onUpdate,
  onSelect
}) => {
  return (
    <div onClick={onSelect}>
      <input
        value={block.data.text || ''}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="커스텀 블록..."
      />
    </div>
  );
};
```

### 커스텀 훅 사용

```tsx
import { useEditor } from 'react-block-editor';

function MyComponent() {
  const editor = useEditor({
    onChange: (data) => console.log(data),
    onReady: () => console.log('Ready')
  });

  const handleAddBlock = () => {
    editor.addBlock('paragraph');
  };

  return (
    <div>
      <button onClick={handleAddBlock}>블록 추가</button>
      {/* 에디터 컴포넌트 */}
    </div>
  );
}
```

## 🛠️ 개발

### 요구사항

- Node.js 18+
- npm 8+

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 타입 체크
npm run type-check

# 린트
npm run lint
```

### 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── blocks/         # 블록 컴포넌트들
│   ├── BlockEditor.tsx # 메인 에디터
│   ├── BlockRenderer.tsx
│   └── Toolbar.tsx
├── hooks/              # 커스텀 훅
├── types/              # TypeScript 타입
└── utils/              # 유틸리티 함수
```

## 🤝 기여하기

1. 이 저장소를 Fork 합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [Editor.js](https://editorjs.io/) - 영감과 데이터 구조 참고
- [React](https://reactjs.org/) - 훌륭한 UI 라이브러리
- [TypeScript](https://www.typescriptlang.org/) - 타입 안정성
- [Tailwind CSS](https://tailwindcss.com/) - 빠른 스타일링

## 📞 연락처

프로젝트에 대한 질문이나 제안사항이 있으시면 [이슈](https://github.com/your-username/react-block-editor/issues)를 생성해주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
