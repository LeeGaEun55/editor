import React from 'react';
import type { ToolbarProps } from '../types';

const AVAILABLE_BLOCKS = [
  { type: 'paragraph', name: '문단', icon: '¶' },
  { type: 'header', name: '제목', icon: 'H' },
  { type: 'list', name: '목록', icon: '•' },
  { type: 'image', name: '이미지', icon: '🖼' },
  { type: 'quote', name: '인용', icon: '"' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedBlock,
  onAddBlock,
  onDeleteBlock,
  onMoveBlock
}) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 border-b border-gray-200">
      {/* 블록 추가 버튼들 */}
      <div className="flex items-center gap-1">
        {AVAILABLE_BLOCKS.map((block) => (
          <button
            key={block.type}
            onClick={() => onAddBlock(block.type)}
            className="px-3 py-1 text-sm bg-white hover:bg-gray-50 border border-gray-300 rounded flex items-center gap-1"
            title={block.name}
          >
            <span className="text-lg">{block.icon}</span>
            <span className="hidden sm:inline">{block.name}</span>
          </button>
        ))}
      </div>

      {/* 구분선 */}
      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* 블록 조작 버튼들 */}
      {selectedBlock && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveBlock('up')}
            className="px-2 py-1 text-sm bg-white hover:bg-gray-50 border border-gray-300 rounded"
            title="위로 이동"
          >
            ↑
          </button>
          <button
            onClick={() => onMoveBlock('down')}
            className="px-2 py-1 text-sm bg-white hover:bg-gray-50 border border-gray-300 rounded"
            title="아래로 이동"
          >
            ↓
          </button>
          <button
            onClick={onDeleteBlock}
            className="px-2 py-1 text-sm bg-red-50 hover:bg-red-100 border border-red-300 rounded text-red-600"
            title="삭제"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}; 