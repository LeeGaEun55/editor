import React, { useState, useEffect } from 'react';
import type { BlockComponentProps } from '../../types';

export const ImageBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onUpdate,
  onSelect
}) => {
  const [url, setUrl] = useState(block.data.url || '');
  const [caption, setCaption] = useState(block.data.caption || '');

  useEffect(() => {
    setUrl(block.data.url || '');
    setCaption(block.data.caption || '');
  }, [block.data.url, block.data.caption]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    onUpdate({ url: newUrl });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCaption = e.target.value;
    setCaption(newCaption);
    onUpdate({ caption: newCaption });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUrl(result);
        onUpdate({ url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className="space-y-2">
        {/* 이미지 URL 입력 */}
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="이미지 URL을 입력하세요..."
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
        
        {/* 파일 업로드 */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
        
        {/* 이미지 표시 */}
        {url && (
          <div className="relative">
            <img
              src={url}
              alt={caption || '이미지'}
              className="max-w-full h-auto rounded border border-gray-200"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* 캡션 입력 */}
            <input
              type="text"
              value={caption}
              onChange={handleCaptionChange}
              placeholder="이미지 설명을 입력하세요..."
              className="w-full mt-2 p-2 border border-gray-300 rounded text-sm"
            />
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
}; 