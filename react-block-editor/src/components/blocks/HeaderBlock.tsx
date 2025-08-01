import React, { useState, useEffect } from 'react';
import type { BlockComponentProps } from '../../types';

export const HeaderBlock = React.memo<BlockComponentProps>(({
  block,
  isSelected,
  onUpdate,
  onSelect
}) => {
  const [text, setText] = useState(block.data.text || '');
  const [level, setLevel] = useState(block.data.level || 1);

  useEffect(() => {
    setText(block.data.text || '');
    setLevel(block.data.level || 1);
  }, [block.data.text, block.data.level]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    onUpdate({ text: newText });
  };

  const handleLevelChange = (newLevel: number) => {
    setLevel(newLevel);
    onUpdate({ level: newLevel });
  };

  const getHeaderSize = () => {
    switch (level) {
      case 1: return 'text-3xl font-bold';
      case 2: return 'text-2xl font-bold';
      case 3: return 'text-xl font-semibold';
      case 4: return 'text-lg font-semibold';
      case 5: return 'text-base font-medium';
      case 6: return 'text-sm font-medium';
      default: return 'text-2xl font-bold';
    }
  };

  return (
    <div 
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="제목을 입력하세요..."
          className={`flex-1 p-2 border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 ${getHeaderSize()}`}
        />
        {isSelected && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((l) => (
              <button
                key={l}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLevelChange(l);
                }}
                className={`w-8 h-8 rounded text-xs flex items-center justify-center ${
                  level === l 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                H{l}
              </button>
            ))}
          </div>
        )}
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
}); 