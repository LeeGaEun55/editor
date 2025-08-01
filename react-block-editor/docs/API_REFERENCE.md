# React Block Editor - API Reference

## BlockEditor Props

### 기본 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `'내용을 입력하세요...'` | 빈 에디터에 표시될 플레이스홀더 |
| `readOnly` | `boolean` | `false` | 읽기 전용 모드 활성화 |
| `onChange` | `(data: EditorData) => void` | - | 데이터 변경 시 호출되는 콜백 |
| `onReady` | `() => void` | - | 에디터 초기화 완료 시 호출되는 콜백 |
| `className` | `string` | `''` | 추가 CSS 클래스 |

### 예시

```tsx
<BlockEditor
  placeholder="글을 작성해보세요..."
  readOnly={false}
  onChange={(data) => console.log('Data changed:', data)}
  onReady={() => console.log('Editor ready!')}
  className="my-custom-editor"
/>
```

## useEditor Hook

### 반환값

```typescript
const {
  data,              // EditorData
  selectedBlock,     // Block | null
  selectedBlockId,   // string | null
  addBlock,          // (type: string, index?: number) => void
  updateBlock,       // (blockId: string, data: BlockData) => void
  deleteBlock,       // (blockId: string) => void
  moveBlock,         // (blockId: string, direction: 'up' | 'down') => void
  selectBlock,       // (blockId: string | null) => void
  setData            // (data: EditorData) => void
} = useEditor(config);
```

### 사용 예시

```tsx
import { useEditor } from './hooks/useEditor';

function MyComponent() {
  const editor = useEditor({
    onChange: (data) => console.log(data),
    onReady: () => console.log('Ready')
  });

  const handleAddParagraph = () => {
    editor.addBlock('paragraph');
  };

  return (
    <div>
      <button onClick={handleAddParagraph}>문단 추가</button>
      {/* 에디터 컴포넌트 */}
    </div>
  );
}
```

## 타입 정의

### EditorData

```typescript
interface EditorData {
  time: number;      // 타임스탬프
  blocks: Block[];   // 블록 배열
  version: string;   // 버전 정보
}
```

### Block

```typescript
interface Block {
  id: string;        // 고유 식별자
  type: string;      // 블록 타입
  data: BlockData;   // 블록 데이터
}
```

### BlockData

```typescript
interface BlockData {
  [key: string]: any; // 블록 타입별 데이터
}
```

### EditorConfig

```typescript
interface EditorConfig {
  placeholder?: string;
  readOnly?: boolean;
  tools?: {
    [toolName: string]: BlockToolConfig;
  };
  onChange?: (data: EditorData) => void;
  onReady?: () => void;
}
```

## 블록 컴포넌트 Props

### BlockComponentProps

```typescript
interface BlockComponentProps {
  block: Block;                    // 현재 블록
  index: number;                   // 블록 인덱스
  isSelected: boolean;             // 선택 상태
  onUpdate: (data: BlockData) => void;  // 데이터 업데이트
  onDelete: () => void;            // 블록 삭제
  onSelect: () => void;            // 블록 선택
}
```

### 커스텀 블록 컴포넌트 예시

```tsx
import React from 'react';
import type { BlockComponentProps } from '../types';

export const CustomBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onUpdate,
  onSelect
}) => {
  const handleChange = (value: string) => {
    onUpdate({ text: value });
  };

  return (
    <div 
      className={`custom-block ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <input
        value={block.data.text || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="커스텀 블록..."
      />
    </div>
  );
};
```

## 이벤트 시스템

### 주요 이벤트

#### onChange
데이터가 변경될 때마다 호출됩니다.

```tsx
const handleChange = (data: EditorData) => {
  // 데이터 저장 로직
  saveToDatabase(data);
};
```

#### onReady
에디터가 초기화를 완료했을 때 호출됩니다.

```tsx
const handleReady = () => {
  // 에디터 준비 완료 후 로직
  console.log('Editor is ready for use');
};
```

### 블록 이벤트

#### onUpdate
블록 데이터가 업데이트될 때 호출됩니다.

```tsx
const handleBlockUpdate = (blockId: string, newData: BlockData) => {
  console.log(`Block ${blockId} updated:`, newData);
};
```

#### onDelete
블록이 삭제될 때 호출됩니다.

```tsx
const handleBlockDelete = (blockId: string) => {
  console.log(`Block ${blockId} deleted`);
};
```

#### onSelect
블록이 선택될 때 호출됩니다.

```tsx
const handleBlockSelect = (blockId: string) => {
  console.log(`Block ${blockId} selected`);
};
```

## 유틸리티 함수

### 블록 ID 생성

```typescript
const generateBlockId = (): string => {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
```

### 블록 타입 검증

```typescript
const isValidBlockType = (type: string): boolean => {
  const validTypes = ['paragraph', 'header', 'list', 'image', 'quote'];
  return validTypes.includes(type);
};
```

### 데이터 검증

```typescript
const validateEditorData = (data: any): data is EditorData => {
  return (
    typeof data === 'object' &&
    typeof data.time === 'number' &&
    Array.isArray(data.blocks) &&
    typeof data.version === 'string'
  );
};
```

## 에러 처리

### 일반적인 에러

```typescript
try {
  const editor = useEditor(config);
} catch (error) {
  console.error('Editor initialization failed:', error);
}
```

### 블록 렌더링 에러

```typescript
const BlockRenderer: React.FC<BlockRendererProps> = ({ block, ...props }) => {
  try {
    const BlockComponent = BLOCK_COMPONENTS[block.type];
    
    if (!BlockComponent) {
      throw new Error(`Unknown block type: ${block.type}`);
    }
    
    return <BlockComponent block={block} {...props} />;
  } catch (error) {
    return (
      <div className="error-block">
        <p>블록 렌더링 오류: {error.message}</p>
      </div>
    );
  }
};
```

## 성능 최적화 팁

### React.memo 사용

```tsx
export const ParagraphBlock = React.memo<BlockComponentProps>(({
  block,
  isSelected,
  onUpdate,
  onSelect
}) => {
  // 컴포넌트 구현
});
```

### useCallback 사용

```tsx
const handleUpdate = useCallback((newData: BlockData) => {
  onUpdate(newData);
}, [onUpdate]);
```

### useMemo 사용

```tsx
const blockStyle = useMemo(() => ({
  backgroundColor: isSelected ? '#f0f0f0' : 'transparent'
}), [isSelected]);
``` 