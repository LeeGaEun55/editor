import React from 'react';
import type { SlashCommandState } from '../types';

interface SlashCommandProps {
  state: SlashCommandState;
  onSelectCommand: (command: any) => void;
}

export const SlashCommand: React.FC<SlashCommandProps> = ({
  state,
  onSelectCommand
}) => {
  if (!state.isVisible || !state.position) {
    return null;
  }

  return (
    <div
      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-w-xs"
      style={{
        left: state.position.x,
        top: state.position.y
      }}
    >
      <div className="p-2 border-b border-gray-100">
        <div className="text-sm text-gray-500 font-medium">
          블록 타입 선택
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {state.commands.length === 0 ? (
          <div className="p-3 text-sm text-gray-500 text-center">
            일치하는 명령어가 없습니다
          </div>
        ) : (
          state.commands.map((command, index) => (
            <button
              key={command.id}
              className={`w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                index === state.selectedIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
              onClick={() => onSelectCommand(command)}
            >
              <div className="w-8 h-8 flex items-center justify-center text-lg bg-gray-100 rounded">
                {command.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {command.name}
                </div>
                <div className="text-sm text-gray-500">
                  {command.description}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      
      {state.searchTerm && (
        <div className="p-2 border-t border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-500">
            검색: "{state.searchTerm}"
          </div>
        </div>
      )}
    </div>
  );
}; 