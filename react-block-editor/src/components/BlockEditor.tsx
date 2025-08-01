import React from 'react';
import type { EditorConfig } from '../types';
import { useEditor } from '../hooks/useEditor';
import { Toolbar } from './Toolbar';
import { BlockRenderer } from './BlockRenderer';

interface BlockEditorProps extends EditorConfig {
  className?: string;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  className = '',
  placeholder = '내용을 입력하세요...',
  readOnly = false,
  onChange,
  onReady,
  ...config
}) => {
  const {
    data,
    selectedBlock,
    selectedBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    selectBlock
  } = useEditor({ onChange, onReady, ...config });

  const handleAddBlock = (type: string) => {
    if (readOnly) return;
    
    const currentIndex = selectedBlockId 
      ? data.blocks.findIndex(block => block.id === selectedBlockId)
      : data.blocks.length;
    
    addBlock(type, currentIndex + 1);
  };

  const handleCreateBlock = (type: string, index: number, data?: any) => {
    if (readOnly) return;
    
    // addBlock 함수를 사용하여 새 블록 생성 (초기 데이터 포함)
    addBlock(type, index, data);
  };

  const handleDeleteBlock = () => {
    if (readOnly || !selectedBlockId) return;
    deleteBlock(selectedBlockId);
  };

  const handleMoveBlock = (direction: 'up' | 'down') => {
    if (readOnly || !selectedBlockId) return;
    moveBlock(selectedBlockId, direction);
  };

  const handleBlockUpdate = (blockId: string, newData: any) => {
    if (readOnly) return;
    updateBlock(blockId, newData);
  };

  const handleBlockDelete = (blockId: string) => {
    if (readOnly) return;
    deleteBlock(blockId);
  };

  const handleBlockSelect = (blockId: string) => {
    if (readOnly) return;
    selectBlock(blockId);
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectBlock(null);
    }
  };

  return (
    <div className={`block-editor ${className}`}>
      {!readOnly && (
        <Toolbar
          selectedBlock={selectedBlock}
          onAddBlock={handleAddBlock}
          onDeleteBlock={handleDeleteBlock}
          onMoveBlock={handleMoveBlock}
        />
      )}
      
      <div 
        className="min-h-[400px] p-4 bg-white"
        onClick={handleEditorClick}
      >
        <div className="space-y-2">
          {data.blocks.map((block, index) => (
            <BlockRenderer
              key={block.id}
              block={block}
              index={index}
              isSelected={block.id === selectedBlockId}
              onUpdate={(newData) => handleBlockUpdate(block.id, newData)}
              onDelete={() => handleBlockDelete(block.id)}
              onSelect={() => handleBlockSelect(block.id)}
              onCreateBlock={handleCreateBlock}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 