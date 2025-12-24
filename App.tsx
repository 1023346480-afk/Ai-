
import React, { useState } from 'react';
import QuestionGenerator from './components/QuestionGenerator';
import HomeworkGrader from './components/HomeworkGrader';

type ViewMode = 'generator' | 'grader';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('generator');

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">智</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI 智学助手
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <button 
              onClick={() => setViewMode('generator')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'generator' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              题目生成器
            </button>
            <button 
              onClick={() => setViewMode('grader')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grader' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              作业批改
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6">
        {viewMode === 'generator' ? <QuestionGenerator /> : <HomeworkGrader />}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center shadow-2xl z-40">
        <button 
          onClick={() => setViewMode('generator')}
          className={`flex flex-col items-center gap-1 transition-all ${
            viewMode === 'generator' ? 'text-blue-600 scale-110' : 'text-slate-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-xs font-medium">生成题目</span>
        </button>
        <button 
          onClick={() => setViewMode('grader')}
          className={`flex flex-col items-center gap-1 transition-all ${
            viewMode === 'grader' ? 'text-blue-600 scale-110' : 'text-slate-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="text-xs font-medium">批改作业</span>
        </button>
      </div>
    </div>
  );
};

export default App;
