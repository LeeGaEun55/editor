# React Block Editor - Base Concepts

## 개요

React Block Editor는 Editor.js를 롤모델로 하는 블록 기반 에디터입니다. 각 콘텐츠 요소가 독립적인 블록으로 관리되며, JSON 형태의 깔끔한 데이터 구조를 제공합니다.

## 핵심 개념

### 1. 블록 (Block)

블록은 에디터의 기본 구성 단위입니다. 각 블록은 고유한 ID, 타입, 데이터를 가집니다.

```typescript
interface Block {
  id: string;        // 고유 식별자
  type: string;      // 블록 타입 (paragraph, header, list 등)
  data: BlockData;   // 블록의 실제 데이터
}
```

#### 블록 타입
- **paragraph**: 일반 텍스트 문단
- **header**: 제목 (H1-H6)
- **list**: 목록 (향후 구현 예정)
- **image**: 이미지 (향후 구현 예정)
- **quote**: 인용문 (향후 구현 예정)

### 2. 에디터 데이터 구조

Editor.js와 유사한 JSON 구조를 사용합니다:

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

### 3. 컴포넌트 아키텍처

#### 핵심 컴포넌트

1. **BlockEditor**: 메인 에디터 컴포넌트
2. **Toolbar**: 블록 추가/조작 도구
3. **BlockRenderer**: 블록 타입별 렌더링
4. **Block Components**: 각 블록 타입별 구현체

#### 컴포넌트 구조
```
BlockEditor
├── Toolbar
└── BlockRenderer
    ├── ParagraphBlock
    ├── HeaderBlock
    ├── ListBlock (향후)
    ├── ImageBlock (향후)
    └── QuoteBlock (향후)
```

### 4. 상태 관리

`useEditor` 훅을 통해 에디터의 상태를 관리합니다:

```typescript
const {
  data,              // 현재 에디터 데이터
  selectedBlock,     // 선택된 블록
  selectedBlockId,   // 선택된 블록 ID
  addBlock,          // 블록 추가
  updateBlock,       // 블록 업데이트
  deleteBlock,       // 블록 삭제
  moveBlock,         // 블록 이동
  selectBlock        // 블록 선택
} = useEditor(config);
```

### 5. 이벤트 시스템

#### 주요 이벤트
- **onChange**: 데이터 변경 시 호출
- **onReady**: 에디터 초기화 완료 시 호출

#### 블록 이벤트
- **onUpdate**: 블록 데이터 업데이트
- **onDelete**: 블록 삭제
- **onSelect**: 블록 선택

## 확장성

### 1. 새로운 블록 타입 추가

1. 블록 컴포넌트 생성
2. `BlockRenderer`에 등록
3. `Toolbar`에 추가

```typescript
// 새로운 블록 컴포넌트
export const ImageBlock: React.FC<BlockComponentProps> = ({ ... }) => {
  // 구현
};

// BlockRenderer에 등록
const BLOCK_COMPONENTS = {
  paragraph: ParagraphBlock,
  header: HeaderBlock,
  image: ImageBlock, // 새로 추가
};
```

### 2. 커스텀 도구

각 블록 타입별로 고유한 도구를 추가할 수 있습니다:

```typescript
// 헤더 레벨 변경 도구
const HeaderTools = ({ level, onLevelChange }) => (
  <div className="header-tools">
    {[1, 2, 3, 4, 5, 6].map(l => (
      <button onClick={() => onLevelChange(l)}>H{l}</button>
    ))}
  </div>
);
```

## 사용법

### 기본 사용법

```tsx
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

### 읽기 전용 모드

```tsx
<BlockEditor
  readOnly={true}
  data={existingData}
/>
```

## 데이터 처리

### 저장

에디터 데이터는 JSON 형태로 저장됩니다:

```typescript
const saveData = async (data: EditorData) => {
  await fetch('/api/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};
```

### 로드

저장된 데이터를 에디터에 로드:

```typescript
const loadData = async () => {
  const response = await fetch('/api/content');
  const data = await response.json();
  editor.setData(data);
};
```

## 성능 최적화

### 1. 가상화 (향후 구현)

긴 문서의 경우 블록 가상화를 통해 성능을 최적화할 수 있습니다.

### 2. 지연 로딩

이미지나 복잡한 블록은 필요할 때만 로드합니다.

### 3. 메모이제이션

React.memo를 사용하여 불필요한 리렌더링을 방지합니다.

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 라이센스

MIT License

## 기여하기

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 