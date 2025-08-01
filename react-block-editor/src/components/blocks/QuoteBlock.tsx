import React, { useState, useEffect } from 'react';
import type { BlockComponentProps } from '../../types';

export const QuoteBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onUpdate,
  onSelect
}) => {
  const [text, setText] = useState(block.data.text || '');
  const [author, setAuthor] = useState(block.data.author || '');

  useEffect(() => {
    setText(block.data.text || '');
    setAuthor(block.data.author || '');
  }, [block.data.text, block.data.author]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onUpdate({ text: newText });
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthor = e.target.value;
    setAuthor(newAuthor);
    onUpdate({ author: newAuthor });
  };

  return (
    <div 
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 rounded-r">
        {/* 인용문 텍스트 */}
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="인용문을 입력하세요..."
          className="w-full min-h-[2em] p-2 border-none outline-none resize-none bg-transparent text-gray-900 placeholder-gray-400 italic text-lg"
          style={{ 
            minHeight: '2em',
            lineHeight: '1.6'
          }}
        />
        
        {/* 인용문 저자 */}
        <input
          type="text"
          value={author}
          onChange={handleAuthorChange}
          placeholder="저자명 (선택사항)"
          className="w-full p-2 border-none outline-none bg-transparent text-gray-600 placeholder-gray-400 text-sm"
        />
      </div>
      
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
}; 