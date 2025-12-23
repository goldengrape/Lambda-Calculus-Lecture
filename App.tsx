import React, { useState } from 'react';
import { LESSONS } from './constants';
import { LessonType } from './types';
import { LambdaConsole } from './components/LambdaConsole';
import { HistoryCard } from './components/HistoryCard';
import { BookOpen, Monitor, ChevronRight, Menu, X, BrainCircuit } from 'lucide-react';

// Specific History Data used in the history section
const HISTORY_DATA = [
  {
    name: "David Hilbert",
    role: "梦想家 (The Dreamer)",
    description: "提出了判定性问题 (Entscheidungsproblem)。他想用程序替代所有的数学家，让数学证明自动化。",
    quote: "我们必须知道，我们必将知道！"
  },
  {
    name: "Kurt Gödel",
    role: "破壁者 (The Rule Breaker)",
    description: "证明了哥德尔不完备定理：存在一类命题，既无法证明也无法证伪。不存在一种算法能够判定所有的命题是真还是假。",
  },
  {
    name: "Alan Turing",
    role: "架构师 (The Architect)",
    description: "发明了图灵机（纸带和读写头）来严格定义“运算”。解决了停机问题。大众更熟悉他破解 Enigma 密码机的故事。",
  },
  {
    name: "Alonzo Church",
    role: "创造者 (The Creator)",
    description: "几乎与图灵同时创造了 Lambda Calculus。他展示了仅仅利用字符替换这么一个操作，就可以构造出大千世界。",
    quote: "通常被归功于 Lambda 演算的发明者。"
  }
];

function App() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Reusing demoMode string state for different lessons
  // Selectors: 'TRUE' | 'FALSE'
  // Variables: 'FREE' | 'BOUND'
  // Syntax: 'SYMBOLIC' | 'ASSOCIATIVITY'
  // Church: 'ADD_1_1' | 'ADD_1_2'
  const [demoMode, setDemoMode] = useState<string>('DEFAULT');

  const currentLesson = LESSONS[currentLessonIndex];
  const isHistory = currentLesson.type === LessonType.HISTORY;
  const isSelectors = currentLesson.type === LessonType.SELECTORS;
  const isVariables = currentLesson.type === LessonType.VARIABLES;
  const isSyntax = currentLesson.type === LessonType.SYNTAX;
  const isChurch = currentLesson.type === LessonType.CHURCH_NUMERALS;

  const handleDemoToggle = (mode: string) => {
    setDemoMode(mode);
  };

  // Logic to swap interactive data based on lesson and toggle state
  let activeInteractiveData = currentLesson.interactive;

  if (isSelectors) {
    if (demoMode === 'FALSE') {
      activeInteractiveData = {
        id: 'selectors-false',
        expression: '(λx.λy.y) Hello World',
        explanation: '此函数选择第二个参数。',
        steps: [
            {
                before: '(λx.λy.y) Hello World',
                action: '将 "Hello" 应用于第一个函数 (λx...)。在函数体 (λy.y) 中替换 x。没找到 x，函数体保持 (λy.y)。',
                after: '(λy.y) World'
            },
            {
                before: '(λy.y) World',
                action: '将 "World" 应用于剩余函数 (λy...)。将 y 替换为 "World"。',
                after: 'World'
            }
        ]
      };
    } else {
        // Ensure default is TRUE content if switch back or init
        activeInteractiveData = currentLesson.interactive;
    }
  }

  if (isVariables) {
      if (demoMode === 'BOUND') {
          activeInteractiveData = {
            id: 'vars-bound',
            expression: '(λx.(x (λx.x))) HelloWorld',
            explanation: '演示变量遮蔽（Shadowing）与重命名。',
            steps: [
                {
                    before: '(λx.(x (λx.x))) HelloWorld',
                    action: '准备替换。注意：内部有一个 (λx.x)。为了避免混淆，解释器通常会将内部变量重命名（Alpha-conversion）。',
                    after: '(λx.(x (λi0.i0))) HelloWorld'
                },
                {
                    before: '(λx.(x (λi0.i0))) HelloWorld',
                    action: '现在进行替换。将外部的 x 替换为 "HelloWorld"。内部的 λi0.i0 不受影响。',
                    after: 'HelloWorld (λi0.i0)'
                },
                {
                    before: 'HelloWorld (λi0.i0)',
                    action: '也就是 HelloWorld (λx.x)。',
                    after: 'HelloWorld (λx.x)'
                }
            ]
          };
      } else {
          // Default is 'FREE' which matches the initial constant data
          activeInteractiveData = currentLesson.interactive; 
      }
  }

  if (isSyntax) {
      if (demoMode === 'ASSOCIATIVITY') {
        activeInteractiveData = {
            id: 'syntax-assoc',
            expression: 'λx.λy.x x y',
            explanation: '演示左结合律和消歧义。等价于 ((λx.(λy.x)) x) y',
            steps: [
                {
                    before: 'λx.λy.x x y',
                    action: '根据左结合律和 λ 延伸规则，这等价于 ((λx.(λy.x)) x) y。',
                    after: '((λx.(λy.x)) x) y'
                },
                {
                    before: '((λx.(λy.x)) x) y',
                    action: '第一步：应用 x 到最外层函数 (λx...)。函数体是 (λy.x)。',
                    after: '(λy.x) y'
                },
                {
                    before: '(λy.x) y',
                    action: '第二步：应用 y 到剩余函数 (λy.x)。函数体返回 x (这里的 x 是第一步传入的值)。',
                    after: 'x'
                }
            ]
        };
      } else {
        // Default is SYMBOLIC
        activeInteractiveData = currentLesson.interactive;
      }
  }

  if (isChurch) {
      if (demoMode === 'ADD_1_2') {
        activeInteractiveData = {
          id: 'church-add-1-2',
          expression: 'add 1 2',
          explanation: '演示 Church Numerals 的加法：1 + 2 = 3。',
          steps: [
            {
              before: 'add 1 2',
              action: '展开定义: (λm.λn.λf.λx. m f (n f x)) 1 2',
              after: '(λn.λf.λx. 1 f (n f x)) 2'
            },
            {
              before: '(λn.λf.λx. 1 f (n f x)) 2',
              action: '将 2 代入 n: λf.λx. 1 f (2 f x)',
              after: 'λf.λx. 1 f (2 f x)'
            },
            {
              before: 'λf.λx. 1 f (2 f x)',
              action: '展开内部的 2 (2 = λf.λx.f (f x))。 2 f x 等价于 f (f x)。',
              after: 'λf.λx. 1 f (f (f x))'
            },
            {
              before: 'λf.λx. 1 f (f (f x))',
              action: '展开外部的 1。 1 f (...) 也就是再应用一次 f。',
              after: 'λf.λx. f (f (f x))'
            },
            {
              before: 'λf.λx. f (f (f x))',
              action: 'f 被应用了三次。这就是 Church Numeral 的 "3"。纸鹤飞起来了！',
              after: '3'
            }
          ]
        };
      } else {
        // Default is ADD_1_1 (matches interactive init in constants)
        activeInteractiveData = currentLesson.interactive;
      }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2 font-bold text-slate-800">
           <BrainCircuit className="text-blue-600" />
           <span>LambdaMed</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky md:top-0 h-screen w-64 bg-white border-r border-slate-200 z-10 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100 hidden md:flex items-center gap-2">
            <BrainCircuit className="text-blue-600" size={28} />
            <h1 className="font-bold text-xl text-slate-900 tracking-tight">LambdaMed</h1>
        </div>
        
        <nav className="p-4 space-y-2">
          {LESSONS.map((lesson, index) => (
            <button
              key={lesson.type}
              onClick={() => {
                setCurrentLessonIndex(index);
                setDemoMode('DEFAULT'); // Reset demo mode on lesson change
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                index === currentLessonIndex 
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm ring-1 ring-blue-100' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {lesson.type === LessonType.HISTORY ? <BookOpen size={18} /> : <Monitor size={18} />}
              <span>{lesson.title}</span>
              {index === currentLessonIndex && <ChevronRight size={16} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-400">
            基于系列文章：“面向眼科医生的λ演算入门教程”
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-4xl mx-auto w-full">
        <div className="animate-fadeIn">
          {/* Text Content */}
          <div className="prose prose-slate prose-lg max-w-none">
            {currentLesson.content}
          </div>

          {/* Special Logic for History Section Rendering */}
          {isHistory && (
             <div className="mt-8 grid gap-6">
                {HISTORY_DATA.map((person) => (
                    <HistoryCard key={person.name} {...person} />
                ))}
             </div>
          )}

          {/* Interactive Console Section */}
          {activeInteractiveData && !isHistory && (
            <div className="mt-10">
               {isSelectors && (
                 <div className="flex gap-4 mb-4 flex-wrap">
                    <button 
                        onClick={() => handleDemoToggle('TRUE')}
                        className={`px-4 py-2 rounded text-sm font-semibold border transition-colors ${demoMode === 'TRUE' || demoMode === 'DEFAULT' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                    >
                        Try (λx.λy.x)
                    </button>
                    <button 
                        onClick={() => handleDemoToggle('FALSE')}
                        className={`px-4 py-2 rounded text-sm font-semibold border transition-colors ${demoMode === 'FALSE' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                    >
                        Try (λx.λy.y)
                    </button>
                 </div>
               )}

               {isVariables && (
                 <div className="flex gap-4 mb-4 flex-wrap">
                    <button 
                        onClick={() => handleDemoToggle('FREE')}
                        className={`px-4 py-2 rounded text-sm font-semibold border transition-colors ${demoMode === 'FREE' || demoMode === 'DEFAULT' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                    >
                        示例 1: 自由变量
                        <code className="block text-xs font-normal opacity-80 mt-1">(λx.(x (λy.x)))</code>
                    </button>
                    <button 
                        onClick={() => handleDemoToggle('BOUND')}
                        className={`px-4 py-2 rounded text-sm font-semibold border transition-colors ${demoMode === 'BOUND' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                    >
                        示例 2: 变量遮蔽
                        <code className="block text-xs font-normal opacity-80 mt-1">(λx.(x (λx.x)))</code>
                    </button>
                 </div>
               )}

               {isSyntax && (
                 <div className="flex gap-4 mb-4 flex-wrap">
                    <button 
                        onClick={() => handleDemoToggle('SYMBOLIC')}
                        className={`px-4 py-2 rounded text-sm font-semibold border transition-colors ${demoMode === 'SYMBOLIC' || demoMode === 'DEFAULT' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                    >
                        示例 1: 符号替换
                        <code className="block text-xs font-normal opacity-80 mt-1">(λx.x + 1) 1</code>
                    </button>
                    <button 
                        onClick={() => handleDemoToggle('ASSOCIATIVITY')}
                        className={`px-4 py-2 rounded text-sm font-semibold border transition-colors ${demoMode === 'ASSOCIATIVITY' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                    >
                        示例 2: 结合律
                        <code className="block text-xs font-normal opacity-80 mt-1">λx.λy.x x y</code>
                    </button>
                 </div>
               )}

               {isChurch && (
                 <div className="flex gap-4 mb-4 flex-wrap">
                    <button 
                        onClick={() => handleDemoToggle('ADD_1_1')}
                        className={`px-4 py-2 rounded text-sm font-semibold border transition-colors ${demoMode === 'ADD_1_1' || demoMode === 'DEFAULT' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                    >
                        演示 1 + 1
                        <code className="block text-xs font-normal opacity-80 mt-1">add 1 1</code>
                    </button>
                    <button 
                        onClick={() => handleDemoToggle('ADD_1_2')}
                        className={`px-4 py-2 rounded text-sm font-semibold border transition-colors ${demoMode === 'ADD_1_2' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                    >
                        演示 1 + 2
                        <code className="block text-xs font-normal opacity-80 mt-1">add 1 2</code>
                    </button>
                 </div>
               )}

               <LambdaConsole key={activeInteractiveData.id} data={activeInteractiveData} />
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between">
            <button 
                disabled={currentLessonIndex === 0}
                onClick={() => {
                    setCurrentLessonIndex(prev => prev - 1);
                    setDemoMode('DEFAULT');
                }}
                className={`text-slate-500 font-medium ${currentLessonIndex === 0 ? 'opacity-0' : 'hover:text-blue-600'}`}
            >
                &larr; 上一节
            </button>

            <button 
                disabled={currentLessonIndex === LESSONS.length - 1}
                onClick={() => {
                    setCurrentLessonIndex(prev => prev + 1);
                    setDemoMode('DEFAULT');
                }}
                className={`flex items-center gap-1 font-medium ${currentLessonIndex === LESSONS.length - 1 ? 'opacity-0' : 'text-blue-600 hover:text-blue-800'}`}
            >
                下一节 &rarr;
            </button>
        </div>
      </main>
    </div>
  );
}

export default App;