import React from 'react';
import { LessonContent, LessonType } from './types';
import { simulateReduction } from './services/lambdaService';

export const LESSONS: LessonContent[] = [
  {
    title: "简介",
    type: LessonType.INTRO,
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">面向眼科医生的λ演算入门教程 (1)</h1>
        <p className="text-lg text-slate-700 leading-relaxed">
          与计算机语言有关，当然要写 <strong>Hello World</strong>！
          Lambda Calculus（λ演算）的运算只做一件事情，就是字符替换，很类似于 Word 里面用 <kbd className="bg-white px-2 py-0.5 rounded border border-blue-200 text-sm">Ctrl+H</kbd> 做查找与替换。
        </p>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Lambda 演算做什么？</h3>
          <p className="text-blue-800">
             它本质上只做一件事：<strong>字符替换</strong>。
          </p>
        </div>
        <p className="text-slate-600">
          我们将使用一个模拟的 <strong>LCI (Lambda Calculus Interpreter)</strong> 解释器来演示这些操作。
        </p>
      </div>
    )
  },
  {
    title: "Hello World",
    type: LessonType.HELLO_WORLD,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">你的第一个表达式</h2>
        <p className="text-slate-700">
          在数学中我们写 <code>f(x) = x</code>。在 Lambda 演算中，我们用希腊字母 λ (lambda) 定义匿名函数。
        </p>
        <div className="bg-slate-100 p-4 rounded-md font-mono text-sm border-l-4 border-slate-400">
          λx.x
        </div>
        <ul className="list-disc pl-5 space-y-2 text-slate-700">
          <li><strong>λ</strong>: 表示要定义一个函数（匿名函数）。</li>
          <li><strong>x</strong>: 这是一个 ID，表示这个函数的变量是 x。</li>
          <li><strong>.</strong> (点): 表示这个点的右侧要定义函数的具体内容了。</li>
          <li>最后的 <strong>x</strong>: 函数体。这个函数返回 <code>x</code> 本身。</li>
        </ul>
        <p className="text-slate-700">
          所以，<code>(λx.x) HelloWorld</code> 的意思是：把 "HelloWorld" 这个字符串作为参数，替换掉函数体内的自变量 x。
        </p>
      </div>
    ),
    interactive: {
      id: 'hello-world',
      expression: '(λx.x) HelloWorld',
      explanation: '恒等函数应用于字符串。',
      steps: simulateReduction('IDENTITY')
    }
  },
  {
    title: "选择逻辑",
    type: LessonType.SELECTORS,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">复杂的替换</h2>
        <p className="text-slate-700">
          Lambda 表达式（expression）是可以嵌套的。这看起来很晕，但它允许我们构建像“如果为真”或“如果为假”这样的逻辑器件。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">选择器 1 (True)</h3>
                <code className="block bg-slate-100 p-2 rounded mb-2">λx.λy.x</code>
                <p className="text-sm text-slate-600">起到选择器件的作用，给它两个参数，它就会选择出<strong>第一个</strong>。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">选择器 2 (False)</h3>
                <code className="block bg-slate-100 p-2 rounded mb-2">λx.λy.y</code>
                <p className="text-sm text-slate-600">起到另一个选择器件的作用，给它两个参数，它就会选择出<strong>第二个</strong>。</p>
            </div>
        </div>

        <p className="text-slate-700">
          让我们看看把 <code>Hello World</code> 喂给这些函数时会发生什么。
          <br/>
          <em>注意：这里我们将 "Hello" 和 "World" 视为两个独立的参数。</em>
        </p>
      </div>
    ),
    interactive: {
      id: 'selectors',
      expression: '(λx.λy.x) Hello World',
      explanation: '此函数选择第一个参数。',
      steps: simulateReduction('TRUE')
    }
  },
  {
    title: "变量的区别",
    type: LessonType.VARIABLES,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">变量的区别 (Part 3)</h2>
        <p className="text-slate-700 leading-relaxed">
          上回说到 Lambda Calculus 其实只有一种操作，就是字符替换。但是具体怎么替换还是有些讲究的。
          我们先回到熟悉的中学数学。
        </p>
        
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <p className="font-serif italic text-lg text-slate-800 text-center mb-2">f(x) = ax² + bx + c</p>
            <p className="text-sm text-slate-600 mt-4">
                在这个函数中，<strong>x</strong> 是定义在括号里的，叫做 <strong>Metavariable</strong>（元变量）。
                而等式右边的 <strong>x</strong> 被绑定到了 Metavariable 上，这叫 <strong>Bound Variable</strong>（约束变量）。
            </p>
            <p className="text-sm text-slate-600 mt-2">
                而 <strong>a, b, c</strong> 并不在函数 f 的参数定义里，它们是 <strong>Free Variables</strong>（自由变量）。
                如果要对 f(x) 进行求值（例如求 f(2)），我们只替换 Bound Variables (x)，而不替换 Free Variables (a, b, c)。
            </p>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mt-6">Lambda Calculus 中的体现</h3>
        <p className="text-slate-700">
            在 <code>λx. ...</code> 中：
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li><strong>Metavariable</strong> 是写在 λ 和点 (.) 之间的那个字符。</li>
            <li>函数体里和 Metavariable 绑定的那个是 <strong>Bound Variable</strong>。</li>
            <li>函数体里没有被绑住的都是 <strong>Free Variables</strong>，它们的值要去上一层找。</li>
        </ul>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
            <h4 className="font-bold text-yellow-800">变量符号的小历史</h4>
            <p className="text-yellow-900 text-sm mt-1">
                中国古代也有类似概念。北宋蒋周和李冶创立了“天元术”，用“天元、地元、人元”表示未知数（Bound Variables）。
                在欧洲，弗朗索瓦·韦达（François Viète）首先使用符号区分了未知数和已知数。
                <br/><br/>
                <em>将未知数和符号引入数学，是不亚于仓颉造字的大事。</em>
            </p>
        </div>
      </div>
    ),
    interactive: {
      id: 'vars-free',
      expression: '(λx.(x (λy.x))) HelloWorld',
      explanation: '演示自由变量的替换。内部的 x 引用外部的 x。',
      steps: simulateReduction('SCOPE_FREE')
    }
  },
  {
    title: "语法规则",
    type: LessonType.SYNTAX,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">语法规则与歧义消除 (Part 4)</h2>
        <p className="text-slate-700">
          就像过山车慢慢爬到了顶端，接下来我们讲讲 Lambda 表达式（Expression，用 E 表示）的 4 种合法写法。
        </p>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Lambda Expression (E) 的 4 条规则</h3>
            <ol className="list-decimal pl-5 space-y-3 text-slate-700">
                <li><span className="font-mono bg-slate-100 px-2 py-1 rounded">E 是 ID</span>：例如 <code>x</code>, <code>HelloWorld</code>, <code>1</code>。</li>
                <li><span className="font-mono bg-slate-100 px-2 py-1 rounded">E 是 λID. E</span> (Abstraction)：即函数定义。例如 <code>λx.x</code>。</li>
                <li><span className="font-mono bg-slate-100 px-2 py-1 rounded">E 是 E E</span> (Application)：即函数调用。例如 <code>x y</code>。</li>
                <li><span className="font-mono bg-slate-100 px-2 py-1 rounded">E 是 (E)</span>：加括号也是合法的。</li>
            </ol>
        </div>

        <div className="space-y-4">
             <h3 className="text-lg font-bold text-slate-900">符号 vs 数学</h3>
             <p className="text-slate-700">
                Lambda 演算中并没有天然的数字概念。<code>(λx.x + 1) 1</code> 不会等于 2，而是等于 <code>1 + 1</code>。
                因为解释器只把 <code>1</code> 和 <code>+</code> 当作符号（ID）进行替换，而不进行数学计算。
             </p>

             <h3 className="text-lg font-bold text-slate-900">消除歧义</h3>
             <p className="text-slate-700">
                <code>λx.λy.x x y</code> 这种写法有歧义，我们约定：
             </p>
             <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li><strong>左结合</strong>：<code>x y z</code> 等价于 <code>((x y) z)</code>。</li>
                <li><strong>λ 范围延伸</strong>：<code>λx.</code> 后面的范围尽可能长。例如 <code>λx.y z</code> 等价于 <code>λx.(y z)</code>。</li>
             </ul>
             <p className="text-slate-700">
                所以 <code>λx.λy.x x y</code> 正确的加括号方式是 <code>((λx.(λy.x)) x) y</code>，最终结果是 <code>x</code>。
             </p>
        </div>
      </div>
    ),
    interactive: {
      id: 'syntax-symbolic',
      expression: '(λx.x + 1) 1',
      explanation: '演示符号替换而非数学计算。',
      steps: simulateReduction('SYMBOLIC')
    }
  },
  {
    title: "道生一",
    type: LessonType.CHURCH_NUMERALS,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">道生一：Church Numerals (Part 5)</h2>
        <p className="text-slate-700">
          恭喜你，过山车已经开始俯冲了！
          Lambda Calculus 里没有天然的 1, 2, 3, True, False, + 号。这一切都是<strong>构造</strong>出来的。
        </p>

        <div className="bg-slate-900 text-slate-200 p-6 rounded-lg font-mono text-sm space-y-3 shadow-xl">
            <div>
                <span className="text-green-400">0</span> = λf.λx.x <span className="text-slate-500">// 没有 f</span>
            </div>
            <div>
                <span className="text-green-400">1</span> = λf.λx.f x <span className="text-slate-500">// 1个 f</span>
            </div>
            <div>
                <span className="text-green-400">2</span> = λf.λx.f (f x) <span className="text-slate-500">// 2个 f</span>
            </div>
            <div>
                <span className="text-green-400">3</span> = λf.λx.f (f (f x)) <span className="text-slate-500">// 3个 f</span>
            </div>
            <div className="border-t border-slate-700 pt-3 mt-3">
                <span className="text-blue-400">add</span> = λm.λn.λf.λx.m f (n f x)
            </div>
        </div>

        <p className="text-slate-700">
            所谓数字 n，就是把函数 f 在 x 上应用 n 次。
            而 <code>add</code> 函数的魔法在于，它把 m 个 f 和 n 个 f 拼接在了一起。
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
             <p className="text-blue-900 text-sm">
                 "我不知道你第一次看到这个结果时是怎样想的，我的感觉大概是看到有人折了一个纸鹤，然后吹了一口气，纸鹤自己拍拍翅膀飞走了！魔法啊，你说它是一它就真的是一啊！"
             </p>
        </div>
      </div>
    ),
    interactive: {
      id: 'church-add-1-1',
      expression: 'add 1 1',
      explanation: '演示 Church Numerals 的加法：1 + 1 = 2。',
      steps: simulateReduction('CHURCH_ADD_1_1')
    }
  },
  {
    title: "历史与背景",
    type: LessonType.HISTORY,
    content: (
      <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">为什么会有这个东西？</h2>
            <p className="text-slate-700 mb-4">
            大卫·希尔伯特 (David Hilbert)，一位伟大的德国数学家，提出了一个你在学初中几何时梦想的问题：
            <strong> 有没有一种程序，你给它一道几何题（或任意数学命题），它就能自动判断出命题是真还是假？</strong>
            </p>
            <div className="p-6 bg-slate-900 text-white rounded-xl italic text-center text-lg">
            "Wir müssen wissen, wir werden wissen."<br/>
            <span className="text-slate-400 text-base not-italic mt-2 block">"我们必须知道，我们必将知道！"</span>
            </div>
        </div>

        <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">计算之神</h3>
            <p className="text-slate-700 mb-6">
                希尔伯特的梦想破灭了，但这次失败催生了现代计算机科学。
            </p>
            
            <div className="grid gap-6">
               {/* Content generated in App.tsx maps to HistoryCard */}
            </div>
        </div>
      </div>
    )
  }
];