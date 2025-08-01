import React, { useState, useEffect, useRef } from 'react';
import type { BlockComponentProps } from '../../types';
import { useSlashCommand } from '../../hooks/useSlashCommand';
import { SlashCommand } from '../SlashCommand';

export const QuoteBlock = React.memo<BlockComponentProps>(({
  block,
  isSelected,
  onUpdate,
  onSelect,
  onCreateBlock,
  index
}) => {
  const [text, setText] = useState(block.data.text || '');
  const [author, setAuthor] = useState(block.data.author || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);

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
    setAuthor(block.data.author || '');
  }, [block.data.text, block.data.author]);

  // 블록이 선택되었을 때 자동으로 포커스
  useEffect(() => {
    console.log('QuoteBlock 포커스 useEffect 실행:', { 
      isSelected, 
      blockId: block.id, 
      hasTextareaRef: !!textareaRef.current 
    });
    
    if (isSelected && textareaRef.current) {
      console.log('QuoteBlock 포커스 설정 시도:', block.id);
      // 다음 렌더링 사이클에서 포커스 설정
      setTimeout(() => {
        console.log('QuoteBlock setTimeout 실행:', { 
          blockId: block.id, 
          hasTextareaRef: !!textareaRef.current 
        });
        if (textareaRef.current) {
          textareaRef.current.focus();
          console.log('QuoteBlock 포커스 설정 완료:', block.id);
        } else {
          console.log('QuoteBlock textareaRef가 null:', block.id);
        }
      }, 0);
    }
  }, [isSelected, block.id]);

  // 자동 높이 조정
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthor = e.target.value;
    setAuthor(newAuthor);
    
    // 슬래시 명령어 감지
    if (detectSlashCommand(newAuthor)) {
      showSlashMenu({ x: 0, y: 0 }); // 임시 위치
    } else {
      hideSlashMenu();
    }
    
    onUpdate({ author: newAuthor });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
    const cleanAuthor = author.replace(/\/$/, '');
    
    // 현재 블록을 슬래시가 제거된 텍스트로 업데이트
    onUpdate({ text: cleanText, author: cleanAuthor });
    
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

  return (
    <div 
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="인용문을 입력하세요..."
          className="w-full resize-none border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 text-lg italic"
          rows={1}
        />
        
        {author && (
          <div className="mt-2">
            <input
              ref={authorRef}
              type="text"
              value={author}
              onChange={handleAuthorChange}
              onKeyDown={handleKeyDown}
              placeholder="작성자"
              className="w-full border-none outline-none bg-transparent text-gray-600 placeholder-gray-400 text-sm"
            />
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