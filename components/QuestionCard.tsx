
import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { generateQuestionImage } from '../services/geminiService';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (question.needsImage && question.imagePrompt) {
      setLoadingImage(true);
      generateQuestionImage(question.imagePrompt)
        .then(url => setImageUrl(url))
        .finally(() => setLoadingImage(false));
    }
  }, [question]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md uppercase">
          {question.type}
        </span>
        <span className="text-slate-400 text-sm">ID: {question.id}</span>
      </div>

      <p className="text-slate-800 text-lg mb-4 font-medium">{question.content}</p>

      {loadingImage && (
        <div className="w-full h-48 bg-slate-50 flex items-center justify-center rounded-lg mb-4 animate-pulse">
          <span className="text-slate-400">正在生成辅助素材图片...</span>
        </div>
      )}

      {imageUrl && (
        <div className="mb-4">
          <img src={imageUrl} alt="素材图" className="w-full max-h-64 object-contain rounded-lg border border-slate-100" />
        </div>
      )}

      {question.options && question.options.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {question.options.map((opt, idx) => (
            <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-700">
              {opt}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          {showAnswer ? '隐藏答案' : '点击查看答案与解析'}
        </button>
        
        {showAnswer && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100 animate-fadeIn">
            <div className="mb-2">
              <span className="font-bold text-green-800">标准答案：</span>
              <span className="text-green-700">{question.answer}</span>
            </div>
            <div>
              <span className="font-bold text-green-800">详细解析：</span>
              <p className="text-green-700 text-sm mt-1">{question.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
