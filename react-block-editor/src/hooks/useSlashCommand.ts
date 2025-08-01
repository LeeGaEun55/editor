import { useState, useCallback, useMemo } from 'react';
import type { SlashCommand, SlashCommandState } from '../types';

// 사용 가능한 슬래시 명령어들
const AVAILABLE_COMMANDS: SlashCommand[] = [
  {
    id: 'paragraph',
    type: 'paragraph',
    name: '문단',
    description: '일반 텍스트 문단',
    icon: '¶',
    keywords: ['문단', '텍스트', 'paragraph', 'text']
  },
  {
    id: 'header1',
    type: 'header',
    name: '제목 1',
    description: '큰 제목',
    icon: 'H1',
    keywords: ['제목', '큰제목', 'header', 'h1', 'title']
  },
  {
    id: 'header2',
    type: 'header',
    name: '제목 2',
    description: '중간 제목',
    icon: 'H2',
    keywords: ['제목', '중간제목', 'header', 'h2', 'subtitle']
  },
  {
    id: 'header3',
    type: 'header',
    name: '제목 3',
    description: '작은 제목',
    icon: 'H3',
    keywords: ['제목', '작은제목', 'header', 'h3', 'small']
  },
  {
    id: 'image',
    type: 'image',
    name: '이미지',
    description: '이미지 삽입',
    icon: '🖼',
    keywords: ['이미지', '사진', 'image', 'photo', 'picture']
  },
  {
    id: 'quote',
    type: 'quote',
    name: '인용문',
    description: '인용 블록',
    icon: '"',
    keywords: ['인용', '인용문', 'quote', 'citation']
  }
];

export const useSlashCommand = () => {
  const [state, setState] = useState<SlashCommandState>({
    isVisible: false,
    searchTerm: '',
    selectedIndex: 0,
    commands: AVAILABLE_COMMANDS,
    position: null
  });

  // 노션 스타일 슬래시 명령어 감지
  const detectSlashCommand = useCallback((text: string): boolean => {
    // 빈 블록에서 슬래시 입력
    if (text === '/') return true;
    
    // 슬래시가 맨 앞에 있는 경우
    if (text.startsWith('/')) return true;
    
    // 텍스트 + 공백 + 슬래시 패턴
    if (text.match(/\s\/$/)) return true;
    
    return false;
  }, []);

  // 슬래시 명령어 메뉴 표시
  const showSlashMenu = useCallback((position: { x: number; y: number }) => {
    setState(prev => ({
      ...prev,
      isVisible: true,
      searchTerm: '',
      selectedIndex: 0,
      commands: AVAILABLE_COMMANDS,
      position
    }));
  }, []);

  // 슬래시 명령어 메뉴 숨기기
  const hideSlashMenu = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: false,
      searchTerm: '',
      selectedIndex: 0,
      position: null
    }));
  }, []);

  // 검색어 업데이트
  const updateSearchTerm = useCallback((searchTerm: string) => {
    const filteredCommands = AVAILABLE_COMMANDS.filter(command =>
      command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      command.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      command.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setState(prev => ({
      ...prev,
      searchTerm,
      selectedIndex: 0,
      commands: filteredCommands
    }));
  }, []);

  // 선택된 명령어 변경
  const selectCommand = useCallback((direction: 'up' | 'down') => {
    setState(prev => {
      if (prev.commands.length === 0) return prev;
      
      let newIndex = prev.selectedIndex;
      if (direction === 'up') {
        newIndex = newIndex > 0 ? newIndex - 1 : prev.commands.length - 1;
      } else {
        newIndex = newIndex < prev.commands.length - 1 ? newIndex + 1 : 0;
      }
      
      return {
        ...prev,
        selectedIndex: newIndex
      };
    });
  }, []);

  // 현재 선택된 명령어 가져오기
  const selectedCommand = useMemo(() => {
    if (!state.isVisible || state.commands.length === 0) return null;
    return state.commands[state.selectedIndex] || null;
  }, [state.isVisible, state.commands, state.selectedIndex]);

  return {
    state,
    detectSlashCommand,
    showSlashMenu,
    hideSlashMenu,
    updateSearchTerm,
    selectCommand,
    selectedCommand
  };
}; 