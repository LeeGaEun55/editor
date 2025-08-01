import React, { useState, useEffect, useRef } from 'react';
import type { BlockComponentProps } from '../../types';
import { useSlashCommand } from '../../hooks/useSlashCommand';
import { SlashCommand } from '../SlashCommand';

export const ImageBlock = React.memo<BlockComponentProps>(({
  block,
  isSelected,
  onUpdate,
  onSelect,
  onCreateBlock,
  index
}) => {
  const [url, setUrl] = useState(block.data.url || '');
  const [caption, setCaption] = useState(block.data.caption || '');
  const [isEditing, setIsEditing] = useState(!url);
  const inputRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLInputElement>(null);

  const {
    state: slashCommandState,
    detectSlashCommand,
    showSlashMenu,
    hideSlashMenu,
    updateSearchTerm,
    selectCommand
  } = useSlashCommand();

  useEffect(() => {
    setUrl(block.data.url || '');
    setCaption(block.data.caption || '');
    setIsEditing(!block.data.url);
  }, [block.data.url, block.data.caption]);

  // 블록이 선택되었을 때 자동으로 포커스
  useEffect(() => {
    console.log('ImageBlock 포커스 useEffect 실행:', { 
      isSelected, 
      blockId: block.id, 
      hasInputRef: !!inputRef.current 
    });
    
    if (isSelected && inputRef.current && isEditing) {
      console.log('ImageBlock 포커스 설정 시도:', block.id);
      // 다음 렌더링 사이클에서 포커스 설정
      setTimeout(() => {
        console.log('ImageBlock setTimeout 실행:', { 
          blockId: block.id, 
          hasInputRef: !!inputRef.current 
        });
        if (inputRef.current) {
          inputRef.current.focus();
          console.log('ImageBlock 포커스 설정 완료:', block.id);
        } else {
          console.log('ImageBlock inputRef가 null:', block.id);
        }
      }, 0);
    }
  }, [isSelected, block.id, isEditing]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    // 슬래시 명령어 감지
    if (detectSlashCommand(newUrl)) {
      showSlashMenu({ x: 0, y: 0 }); // 임시 위치
    } else {
      hideSlashMenu();
    }
    
    onUpdate({ url: newUrl });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCaption = e.target.value;
    setCaption(newCaption);
    
    // 슬래시 명령어 감지
    if (detectSlashCommand(newCaption)) {
      showSlashMenu({ x: 0, y: 0 }); // 임시 위치
    } else {
      hideSlashMenu();
    }
    
    onUpdate({ caption: newCaption });
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
    const cleanText = isEditing ? url.replace(/\/$/, '') : caption.replace(/\/$/, '');
    
    if (isEditing) {
      onUpdate({ url: cleanText });
    } else {
      onUpdate({ caption: cleanText });
    }
    
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUrl(base64);
        setIsEditing(false);
        onUpdate({ url: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (isSelected) {
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <div className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 URL
              </label>
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={handleUrlChange}
                onKeyDown={handleKeyDown}
                placeholder="이미지 URL을 입력하거나 파일을 업로드하세요"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                파일 업로드
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                캡션
              </label>
              <input
                ref={captionRef}
                type="text"
                value={caption}
                onChange={handleCaptionChange}
                onKeyDown={handleKeyDown}
                placeholder="이미지 설명을 입력하세요"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {url && (
            <div className="mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                완료
              </button>
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
      </div>
    );
  }

  return (
    <div 
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className="space-y-2">
        <img
          src={url}
          alt={caption}
          className="max-w-full h-auto rounded cursor-pointer"
          onClick={handleImageClick}
        />
        {caption && (
          <div className="text-sm text-gray-600 text-center italic">
            {caption}
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