import { useState, useCallback, useEffect, useRef } from 'react';
import type { EditorData, Block, BlockData, EditorConfig } from '../types';

export const useEditor = (config: EditorConfig) => {
  const [data, setData] = useState<EditorData>({
    time: Date.now(),
    blocks: [],
    version: '1.0.0'
  });
  
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const isReadyRef = useRef(false);
  const lastDataRef = useRef<EditorData | null>(null);

  // 블록 추가
  const addBlock = useCallback((type: string, index?: number) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: {}
    };

    setData(prev => {
      const newBlocks = [...prev.blocks];
      const insertIndex = index !== undefined ? index : newBlocks.length;
      newBlocks.splice(insertIndex, 0, newBlock);
      
      return {
        ...prev,
        blocks: newBlocks,
        time: Date.now()
      };
    });

    setSelectedBlockId(newBlock.id);
  }, []);

  // 블록 업데이트
  const updateBlock = useCallback((blockId: string, newData: BlockData) => {
    setData(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId
          ? { ...block, data: { ...block.data, ...newData } }
          : block
      ),
      time: Date.now()
    }));
  }, []);

  // 블록 삭제
  const deleteBlock = useCallback((blockId: string) => {
    setData(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId),
      time: Date.now()
    }));
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [selectedBlockId]);

  // 블록 이동
  const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    setData(prev => {
      const blocks = [...prev.blocks];
      const currentIndex = blocks.findIndex(block => block.id === blockId);
      
      if (currentIndex === -1) return prev;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex < 0 || newIndex >= blocks.length) return prev;
      
      [blocks[currentIndex], blocks[newIndex]] = [blocks[newIndex], blocks[currentIndex]];
      
      return {
        ...prev,
        blocks,
        time: Date.now()
      };
    });
  }, []);

  // 블록 선택
  const selectBlock = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
  }, []);

  // 선택된 블록 가져오기
  const selectedBlock = data.blocks.find(block => block.id === selectedBlockId) || null;

  // onChange 콜백 호출 (중복 방지)
  useEffect(() => {
    if (config.onChange && JSON.stringify(data) !== JSON.stringify(lastDataRef.current)) {
      lastDataRef.current = data;
      config.onChange(data);
    }
  }, [data, config.onChange]);

  // onReady 콜백 호출 (한 번만)
  useEffect(() => {
    if (config.onReady && !isReadyRef.current) {
      isReadyRef.current = true;
      config.onReady();
    }
  }, [config.onReady]);

  return {
    data,
    selectedBlock,
    selectedBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    selectBlock,
    setData
  };
}; 