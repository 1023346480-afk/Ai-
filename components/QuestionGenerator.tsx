
import React, { useState } from 'react';
import { Difficulty, QuestionType, Question } from '../types';
import { generateQuestions } from '../services/geminiService';
import QuestionCard from './QuestionCard';

const QuestionGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([QuestionType.CHOICE]);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const toggleType = (type: QuestionType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return alert('请输入知识点');
    if (selectedTypes.length === 0) return alert('请至少选择一种题型');

    setLoading(true);
    try {
      const result = await generateQuestions(topic, difficulty, selectedTypes, 3);
      setQuestions(result);
    } catch (error) {
      console.error(error);
      alert('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">智能题目生成</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">知识点或关键词</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：勾股定理、光合作用、二次函数..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">难度设置</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {Object.values(Difficulty).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      difficulty === d ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">题型选择</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(QuestionType).map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedTypes.includes(t)
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
            }`}
          >
            {loading ? '正在魔法生成中...' : '生成题目'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {questions.length > 0 && (
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-700">生成结果 ({questions.length})</h3>
            <button 
              onClick={() => setQuestions([])}
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              清空
            </button>
          </div>
        )}
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
        {!loading && questions.length === 0 && topic && (
          <div className="text-center py-12 text-slate-400">
            <p>输入知识点并点击生成，为您定制专属练习</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionGenerator;
