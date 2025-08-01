import React, { useState, useEffect, useRef } from 'react';
import type { BlockComponentProps } from '../../types';
import { useSlashCommand } from '../../hooks/useSlashCommand';
import { SlashCommand } from '../SlashCommand';

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
  
  const {
    state: slashState,
    detectSlashCommand,
    showSlashMenu,
    hideSlashMenu,
    updateSearchTerm,
    selectCommand,
    selectedCommand
  } = useSlashCommand();

  useEffect(() => {
    setText(block.data.text || '');
  }, [block.data.text]);

  // 블록이 선택되었을 때 자동으로 포커스
  useEffect(() => {
    console.log('포커스 useEffect 실행:', { 
      isSelected, 
      blockId: block.id, 
      hasTextareaRef: !!textareaRef.current 
    });
    
    if (isSelected && textareaRef.current) {
      console.log('포커스 설정 시도:', block.id);
      // 다음 렌더링 사이클에서 포커스 설정
      setTimeout(() => {
        console.log('setTimeout 실행:', { 
          blockId: block.id, 
          hasTextareaRef: !!textareaRef.current 
        });
        if (textareaRef.current) {
          textareaRef.current.focus();
          console.log('포커스 설정 완료:', block.id);
        } else {
          console.log('textareaRef가 null:', block.id);
        }
      }, 0);
    }
  }, [isSelected, block.id]);

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

    // 슬래시 명령어 감지
    if (detectSlashCommand(newText)) {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: rect.left,
        y: rect.bottom + 5
      };
      showSlashMenu(position);
      
      // 슬래시 이후 텍스트를 검색어로 설정
      const slashIndex = newText.lastIndexOf('/');
      if (slashIndex !== -1) {
        const searchTerm = newText.substring(slashIndex + 1);
        updateSearchTerm(searchTerm);
      }
    } else {
      hideSlashMenu();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 슬래시 명령어 메뉴가 열려있을 때의 키 처리
    if (slashState.isVisible) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectCommand('up');
        return;
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectCommand('down');
        return;
      }
      
      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedCommand) {
          handleCommandSelect(selectedCommand);
        }
        return;
      }
      
      if (e.key === 'Escape') {
        e.preventDefault();
        hideSlashMenu();
        return;
      }
    }

    // 일반 Enter 키 처리
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
      
      {/* 슬래시 명령어 팝업 */}
      {slashState.isVisible && (
        <SlashCommand
          state={slashState}
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