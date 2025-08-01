import React, { useState, useCallback } from 'react';
import { BlockEditor } from './components/BlockEditor';
import type { EditorData } from './types';
import './App.css';

function App() {
  const [editorData, setEditorData] = useState<EditorData | null>(null);

  const handleEditorChange = useCallback((data: EditorData) => {
    setEditorData(data);
    // 개발 모드에서만 로그 출력
    if (import.meta.env.DEV) {
      console.log('Editor data changed:', data);
    }
  }, []);

  const handleEditorReady = useCallback(() => {
    // 개발 모드에서만 로그 출력
    if (import.meta.env.DEV) {
      console.log('Editor is ready!');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          React Block Editor
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <BlockEditor
            placeholder="에디터를 시작하려면 위의 도구를 사용하세요..."
            onChange={handleEditorChange}
            onReady={handleEditorReady}
            className="border border-gray-300 rounded-lg shadow-sm"
          />
          
          {editorData && (
            <div className="mt-8 p-4 bg-white border border-gray-300 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">에디터 데이터 (JSON)</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(editorData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
