import React, { useState, useEffect } from 'react';
import type { BlockComponentProps } from '../../types';

export const ParagraphBlock = React.memo<BlockComponentProps>(({
  block,
  isSelected,
  onUpdate,
  onSelect
}) => {
  const [text, setText] = useState(block.data.text || '');

  useEffect(() => {
    setText(block.data.text || '');
  }, [block.data.text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onUpdate({ text: newText });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { 
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // 새로운 문단 블록 추가 로직은 상위 컴포넌트에서 처리
    }
  };

  return (
    <div 
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <textarea
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="문단을 입력하세요..."
        className="w-full min-h-[1.5em] p-2 border-none outline-none resize-none bg-transparent text-gray-900 placeholder-gray-400"
        style={{ 
          minHeight: '1.5em',
          lineHeight: '1.5'
        }}
      />
      {isSelected && (
        <div className="absolute -left-8 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-xs flex items-center justify-center">
            ↑
          </button>
          <button className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-xs flex items-center justify-center">
            ↓
          </button>
          <button className="w-6 h-6 bg-red-200 hover:bg-red-300 rounded text-xs flex items-center justify-center">
            ×
          </button>
        </div>
      )}
    </div>
  );
}); 