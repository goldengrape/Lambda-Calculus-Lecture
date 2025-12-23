import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ChevronRight, Terminal } from 'lucide-react';
import { LessonStep } from '../types';

interface LambdaConsoleProps {
  data: LessonStep;
}

export const LambdaConsole: React.FC<LambdaConsoleProps> = ({ data }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [displayExpr, setDisplayExpr] = useState(data.expression);

  // Reset when data changes
  useEffect(() => {
    setCurrentStepIndex(-1);
    setDisplayExpr(data.expression);
  }, [data]);

  const handleNext = () => {
    if (currentStepIndex < data.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setDisplayExpr(data.steps[nextIndex].after);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(-1);
    setDisplayExpr(data.expression);
  };

  const isComplete = currentStepIndex === data.steps.length - 1;
  
  // Safety check: ensure currentStepIndex is within bounds of the current data.steps
  // This prevents crashes if data changes before state resets
  const currentStep = (currentStepIndex >= 0 && currentStepIndex < data.steps.length) 
    ? data.steps[currentStepIndex] 
    : null;
    
  const currentAction = currentStep ? currentStep.action : "准备演算。";

  return (
    <div className="mt-8 bg-slate-900 rounded-lg overflow-hidden shadow-2xl border border-slate-700 font-mono text-sm sm:text-base">
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal size={16} />
          <span className="font-semibold">Lambda 解释器 (LCI)</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Display Screen */}
        <div className="bg-black/50 p-4 rounded border border-slate-700/50 min-h-[80px] flex items-center">
          <span className="text-green-400 mr-2">λ &gt;</span>
          <span className="text-white text-lg tracking-wide">{displayExpr}</span>
          <span className="animate-pulse ml-1 inline-block w-2 h-5 bg-green-500"></span>
        </div>

        {/* Explanation Area */}
        <div className="bg-slate-800/50 p-4 rounded border-l-4 border-blue-500">
          <h4 className="text-blue-400 text-xs uppercase tracking-wider font-bold mb-1">系统输出</h4>
          <p className="text-slate-300 leading-relaxed">
            {currentAction}
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center pt-2">
          <div className="text-slate-500 text-xs">
            第 {currentStepIndex + 1} 步 / 共 {data.steps.length} 步
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={16} />
              重置
            </button>
            <button
              onClick={handleNext}
              disabled={isComplete}
              className={`flex items-center gap-2 px-6 py-2 rounded font-medium transition-all ${
                isComplete
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
              }`}
            >
              {isComplete ? '完成' : currentStepIndex === -1 ? '开始演算' : '下一步'}
              {!isComplete && <Play size={16} fill="currentColor" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};