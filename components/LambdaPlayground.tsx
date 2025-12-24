import React, { useState } from 'react';
import { Play, RotateCcw, AlertCircle, Terminal } from 'lucide-react';
import { runInterpreterSteps } from '../services/lambdaInterpreter';

export const LambdaPlayground: React.FC = () => {
  const [input, setInput] = useState('(λx.λy.x y) (λz.z) a');
  const [steps, setSteps] = useState<{ before: string; action: string; after: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const handleRun = () => {
    setError(null);
    setCurrentStepIndex(-1);
    const result = runInterpreterSteps(input);
    if (result.success && result.steps) {
      setSteps(result.steps);
      if (result.steps.length === 0) {
          setError("该表达式已经是化简形式，或无法进一步归约。");
      }
    } else {
      setSteps([]);
      setError(result.error || '解析错误');
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(-1);
  };

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const displayExpr = currentStep ? currentStep.after : (steps.length > 0 ? steps[0].before : input);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Terminal size={20} className="text-blue-600"/>
            输入 Lambda 表达式
        </h3>
        <div className="flex gap-2 mb-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="例: (λx.x) y"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <button
                onClick={handleRun}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
                <Play size={18} />
                演算
            </button>
        </div>
        <p className="text-xs text-slate-500">
            支持语法: <code>λ</code> 或 <code>\</code> 表示 lambda。例: <code>(\x.x) y</code>
        </p>
        
        {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2 border border-red-200">
                <AlertCircle size={16} />
                {error}
            </div>
        )}
      </div>

      {/* Output Console (Reused visual style from LambdaConsole) */}
      {steps.length > 0 && (
        <div className="bg-slate-900 rounded-lg overflow-hidden shadow-2xl border border-slate-700 font-mono text-sm sm:text-base animate-fadeIn">
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                <span className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Playground Output</span>
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                 {/* Display Screen */}
                <div className="bg-black/50 p-4 rounded border border-slate-700/50 min-h-[80px] flex items-center relative overflow-hidden">
                    <span className="text-purple-400 mr-2 select-none">λ &gt;</span>
                    <span className="text-white text-lg tracking-wide break-all">
                        {displayExpr}
                    </span>
                </div>

                {/* Info Panel */}
                <div className="bg-slate-800/50 p-4 rounded border-l-4 border-purple-500">
                    <h4 className="text-purple-400 text-xs uppercase tracking-wider font-bold mb-1">
                        {currentStepIndex === -1 ? 'Ready' : `Step ${currentStepIndex + 1}`}
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                        {currentStep ? currentStep.action : "准备就绪。点击“下一步”开始单步执行。"}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex justify-between items-center pt-2">
                    <div className="text-slate-500 text-xs">
                        {currentStepIndex + 1} / {steps.length} Steps
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
                        disabled={currentStepIndex >= steps.length - 1}
                        className={`flex items-center gap-2 px-6 py-2 rounded font-medium transition-all ${
                            currentStepIndex >= steps.length - 1
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/20'
                        }`}
                        >
                        {currentStepIndex >= steps.length - 1 ? '结束' : '下一步'}
                        {currentStepIndex < steps.length - 1 && <Play size={16} fill="currentColor" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};