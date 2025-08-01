// 블록 에디터의 핵심 타입 정의

export interface BlockData {
  [key: string]: any;
}

export interface Block {
  id: string;
  type: string;
  data: BlockData;
}

export interface EditorData {
  time: number;
  blocks: Block[];
  version: string;
}

export interface BlockTool {
  name: string;
  icon?: string;
  title?: string;
  shortcut?: string;
}

export interface BlockToolConfig {
  [key: string]: any;
}

export interface EditorConfig {
  placeholder?: string;
  readOnly?: boolean;
  tools?: {
    [toolName: string]: BlockToolConfig;
  };
  onChange?: (data: EditorData) => void;
  onReady?: () => void;
}

export interface BlockComponentProps {
  block: Block;
  index: number;
  isSelected: boolean;
  onUpdate: (data: BlockData) => void;
  onDelete: () => void;
  onSelect: () => void;
}

export interface ToolbarProps {
  selectedBlock: Block | null;
  onAddBlock: (type: string) => void;
  onDeleteBlock: () => void;
  onMoveBlock: (direction: 'up' | 'down') => void;
} 