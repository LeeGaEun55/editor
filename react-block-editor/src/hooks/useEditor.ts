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

  // 빈 에디터에서 기본 블록 생성
  const ensureDefaultBlock = useCallback(() => {
    setData(prev => {
      if (prev.blocks.length === 0) {
        const defaultBlock: Block = {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'paragraph',
          data: { text: '' }
        };
        
        return {
          ...prev,
          blocks: [defaultBlock],
          time: Date.now()
        };
      }
      return prev;
    });
  }, []);

  // 초기화 시 기본 블록 생성
  useEffect(() => {
    ensureDefaultBlock();
  }, [ensureDefaultBlock]);

  // 블록 추가
  const addBlock = useCallback((type: string, index?: number, initialData?: BlockData) => {
    console.log('addBlock 호출:', { type, index, initialData });
    
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: initialData || {}
    };

    console.log('새 블록 생성:', newBlock);

    setData(prev => {
      const newBlocks = [...prev.blocks];
      const insertIndex = index !== undefined ? index : newBlocks.length;
      newBlocks.splice(insertIndex, 0, newBlock);
      
      console.log('블록 배열 업데이트:', { insertIndex, totalBlocks: newBlocks.length });
      
      // 데이터 업데이트가 완료된 후 selectedBlockId 설정
      setTimeout(() => {
        console.log('selectedBlockId 설정:', newBlock.id);
        setSelectedBlockId(newBlock.id);
      }, 0);
      
      return {
        ...prev,
        blocks: newBlocks,
        time: Date.now()
      };
    });

    return newBlock.id; // 새 블록 ID 반환
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

  // 블록 삭제 (마지막 빈 블록은 보호)
  const deleteBlock = useCallback((blockId: string) => {
    setData(prev => {
      const blockToDelete = prev.blocks.find(block => block.id === blockId);
      const isLastBlock = prev.blocks.length === 1;
      const isEmptyBlock = blockToDelete?.data.text === '';
      
      // 마지막 빈 블록은 삭제하지 않고 내용만 비움
      if (isLastBlock && isEmptyBlock) {
        return {
          ...prev,
          blocks: prev.blocks.map(block =>
            block.id === blockId
              ? { ...block, data: { ...block.data, text: '' } }
              : block
          ),
          time: Date.now()
        };
      }
      
      // 일반적인 삭제
      return {
        ...prev,
        blocks: prev.blocks.filter(block => block.id !== blockId),
        time: Date.now()
      };
    });
    
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
    console.log('selectBlock 호출:', { blockId, currentSelected: selectedBlockId });
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
    setData,
    ensureDefaultBlock
  };
}; 