import React, { useState, useEffect, useRef } from 'react';
import type { BlockComponentProps } from '../../types';

interface ParagraphBlockProps extends BlockComponentProps {
  onCreateBlock?: (type: string, index: number, data?: any) => void;
}

export const ParagraphBlock = React.memo<ParagraphBlockProps>(({
  block,
  index,
  isSelected,
  onUpdate,
  onSelect,
  onCreateBlock
}) => {
  const [text, setText] = useState(block.data.text || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(block.data.text || '');
  }, [block.data.text]);

  // 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onUpdate({ text: newText });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      // 현재 텍스트를 현재 블록에 저장
      const target = e.currentTarget as HTMLTextAreaElement;
      const currentText = text.substring(0, target.selectionStart);
      const remainingText = text.substring(target.selectionStart);
      
      // 현재 블록 업데이트
      onUpdate({ text: currentText });
      
      // 새 블록 생성
      if (onCreateBlock) {
        onCreateBlock('paragraph', index + 1, { text: remainingText });
      }
    }
    
    // 빈 블록에서 Backspace 입력 시 이전 블록으로 이동
    if (e.key === 'Backspace' && text === '' && index > 0) {
      e.preventDefault();
      // 이전 블록으로 이동하는 로직 (나중에 구현)
      console.log('이전 블록으로 이동 필요');
    }
  };

  const handleFocus = () => {
    onSelect();
  };

  return (
    <div 
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
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