import React from 'react';
import type { Block, BlockComponentProps } from '../types';
import { ParagraphBlock, HeaderBlock, ImageBlock, QuoteBlock } from './blocks';

interface BlockRendererProps {
  block: Block;
  index: number;
  isSelected: boolean;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  onSelect: () => void;
  onCreateBlock?: (type: string, index: number, data?: any) => void;
}

const BLOCK_COMPONENTS: Record<string, React.ComponentType<BlockComponentProps>> = {
  paragraph: ParagraphBlock,
  header: HeaderBlock,
  image: ImageBlock,
  quote: QuoteBlock,
};

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  index,
  isSelected,
  onUpdate,
  onDelete,
  onSelect,
  onCreateBlock
}) => {
  const BlockComponent = BLOCK_COMPONENTS[block.type];

  if (!BlockComponent) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
        알 수 없는 블록 타입: {block.type}
      </div>
    );
  }

  // ParagraphBlock에만 onCreateBlock prop 전달
  if (block.type === 'paragraph') {
    return (
      <ParagraphBlock
        block={block}
        index={index}
        isSelected={isSelected}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onSelect={onSelect}
        onCreateBlock={onCreateBlock}
      />
    );
  }

  return (
    <BlockComponent
      block={block}
      index={index}
      isSelected={isSelected}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onSelect={onSelect}
    />
  );
}; 