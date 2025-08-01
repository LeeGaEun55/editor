import React, { useState, useEffect, useRef } from 'react';
import type { BlockComponentProps } from '../../types';
import { useSlashCommand } from '../../hooks/useSlashCommand';
import { SlashCommand } from '../SlashCommand';

export const HeaderBlock = React.memo<BlockComponentProps>(({
  block,
  isSelected,
  onUpdate,
  onSelect,
  onCreateBlock,
  index
}) => {
  const [text, setText] = useState(block.data.text || '');
  const [level, setLevel] = useState(block.data.level || 1);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    state: slashCommandState,
    detectSlashCommand,
    showSlashMenu,
    hideSlashMenu,
    updateSearchTerm,
    selectCommand
  } = useSlashCommand();

  useEffect(() => {
    setText(block.data.text || '');
    setLevel(block.data.level || 1);
  }, [block.data.text, block.data.level]);

  // 블록이 선택되었을 때 자동으로 포커스
  useEffect(() => {
    console.log('HeaderBlock 포커스 useEffect 실행:', { 
      isSelected, 
      blockId: block.id, 
      hasInputRef: !!inputRef.current 
    });
    
    if (isSelected && inputRef.current) {
      console.log('HeaderBlock 포커스 설정 시도:', block.id);
      // 다음 렌더링 사이클에서 포커스 설정
      setTimeout(() => {
        console.log('HeaderBlock setTimeout 실행:', { 
          blockId: block.id, 
          hasInputRef: !!inputRef.current 
        });
        if (inputRef.current) {
          inputRef.current.focus();
          console.log('HeaderBlock 포커스 설정 완료:', block.id);
        } else {
          console.log('HeaderBlock inputRef가 null:', block.id);
        }
      }, 0);
    }
  }, [isSelected, block.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // 슬래시 명령어 감지
    if (detectSlashCommand(newText)) {
      showSlashMenu({ x: 0, y: 0 }); // 임시 위치
    } else {
      hideSlashMenu();
    }
    
    onUpdate({ text: newText });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (slashCommandState.isVisible) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          selectCommand('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          selectCommand('up');
          break;
        case 'Enter':
          e.preventDefault();
          const selectedCommand = slashCommandState.commands[slashCommandState.selectedIndex];
          if (selectedCommand) {
            handleCommandSelect(selectedCommand);
          }
          break;
        case 'Escape':
          e.preventDefault();
          hideSlashMenu();
          break;
      }
    }
  };

  const handleCommandSelect = (command: any) => {
    // 슬래시만 제거하고 나머지 텍스트는 유지
    const cleanText = text.replace(/\/$/, '');
    // 현재 블록을 슬래시가 제거된 텍스트로 업데이트
    onUpdate({ text: cleanText });
    // 새 블록 추가 (빈 상태로)
    if (onCreateBlock) {
      const newData: any = { text: '' }; // 빈 상태로 시작
      // 헤더 타입인 경우 레벨 설정
      if (command.type === 'header') {
        const level = parseInt(command.id.replace('header', ''));
        newData.level = level;
      }
      onCreateBlock(command.type, index + 1, newData);
    }
    hideSlashMenu();
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
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
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
      
      {/* 슬래시 명령어 메뉴 */}
      {slashCommandState.isVisible && (
        <SlashCommand
          state={slashCommandState}
          onSelectCommand={handleCommandSelect}
        />
      )}
      
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