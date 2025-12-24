
import React, { useState, useRef } from 'react';
import { gradeHomework } from '../services/geminiService';
import { GradingResult } from '../types';

const HomeworkGrader: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGrade = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const res = await gradeHomework(base64Data);
      setResult(res);
    } catch (error) {
      console.error(error);
      alert('批改失败，请尝试更清晰的图片');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">AI 智能作业批改</h2>
        
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <div className="mb-4 flex justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">点击上传作业照片或直接拍照</p>
            <p className="text-slate-400 text-sm mt-2">支持 JPG, PNG 格式</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative group">
              <img src={image} alt="作业" className="w-full max-h-[500px] object-contain rounded-xl border border-slate-200" />
              <button 
                onClick={() => { setImage(null); setResult(null); }}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {!result && (
              <button
                onClick={handleGrade}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
                  loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? '正在分析作业...' : '立即批改'}
              </button>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">批改报告</h3>
                <p className="opacity-90 mt-1">AI 老师已完成智能评阅</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black">{result.score}</span>
                <span className="text-sm opacity-80">/{result.totalPoints}</span>
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="font-bold text-slate-800 mb-2">综合评语</h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
                {result.overallFeedback}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-700 px-2">题目详情 ({result.details.length})</h4>
            {result.details.map((detail, idx) => (
              <div key={idx} className={`bg-white p-5 rounded-xl border-l-4 shadow-sm ${
                detail.isCorrect ? 'border-green-500' : 'border-red-500'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    detail.isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {detail.questionNumber}
                  </span>
                  <span className={`font-bold ${detail.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {detail.isCorrect ? '解答正确' : '存在错误'}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="text-slate-700">
                    <span className="font-semibold">AI 反馈：</span>
                    <span className="text-sm">{detail.feedback}</span>
                  </div>
                  {detail.correction && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <span className="font-semibold text-blue-800 text-sm">正确解析：</span>
                      <p className="text-blue-700 text-sm mt-1">{detail.correction}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkGrader;
