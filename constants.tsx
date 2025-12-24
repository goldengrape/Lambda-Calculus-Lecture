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
    title: "一生二",
    type: LessonType.PAIRS,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">一生二：数据结构 (Part 6)</h2>
        <p className="text-slate-700">
          有了 Church Numeral 以后，非负整数都可以定义了。但编程还需要数据结构。
          最基本的数据结构就是<strong>数据对 (Pair)</strong>。
        </p>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <div>
                <h3 className="font-bold text-slate-900">1. 构造 (Pair)</h3>
                <code className="block bg-slate-100 p-2 rounded mt-1 font-mono text-sm text-blue-700">pair = λx.λy.λz.(z x y)</code>
                <p className="text-xs text-slate-500 mt-1">pair a b 的结果是 λz.z a b。它保存了 a 和 b，等待一个函数 z 来处理它们。</p>
            </div>
            <div>
                <h3 className="font-bold text-slate-900">2. 取第一个 (First)</h3>
                <code className="block bg-slate-100 p-2 rounded mt-1 font-mono text-sm text-blue-700">first = λp.p (λx.λy.x)</code>
                <p className="text-xs text-slate-500 mt-1">这里 λx.λy.x 就是 True (选择第一个)。first 把 True 喂给 pair。</p>
            </div>
            <div>
                <h3 className="font-bold text-slate-900">3. 取第二个 (Second)</h3>
                <code className="block bg-slate-100 p-2 rounded mt-1 font-mono text-sm text-blue-700">second = λp.p (λx.λy.y)</code>
                <p className="text-xs text-slate-500 mt-1">这里 λx.λy.y 就是 False (选择第二个)。second 把 False 喂给 pair。</p>
            </div>
        </div>

        <p className="text-slate-700">
            仔细看看这定义，简直是无中生有。有了 Pair，我们就可以构造链表（List = Pair Head Tail），甚至复数、有理数。
            只要有相应的运算法则，万物皆可构造。
        </p>
      </div>
    ),
    interactive: {
      id: 'pair-construct',
      expression: 'pair a b',
      explanation: '构造一个数据对。',
      steps: simulateReduction('PAIR_CONSTRUCT')
    }
  },
  {
    title: "二生三",
    type: LessonType.LOGIC,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">二生三：逻辑运算 (Part 7)</h2>
        <p className="text-slate-700">
          也许是我见得少，物理学的公式里为什么都是连续函数，一个分段函数都没有？
          甚至，量子力学的出现就是为了解决黑体辐射中出现的分段函数。
        </p>

        <p className="text-slate-700">
          但只要出了理论物理，世界就需要<strong>三叉分支结构</strong>：
          一支接收条件判断，一支指向真值时的操作，一支指向假值时的操作：
        </p>

        <div className="bg-slate-100 border-l-4 border-slate-500 p-4 font-mono text-sm">
           if True/False then This else That
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
           <div>
               <h3 className="font-bold text-slate-900 mb-2">基础定义</h3>
               <ul className="space-y-2 text-sm font-mono text-blue-700">
                 <li className="bg-slate-50 p-2 rounded">true = λx.λy.x <span className="text-slate-500 text-xs ml-2">// 选择前一个</span></li>
                 <li className="bg-slate-50 p-2 rounded">false = λx.λy.y <span className="text-slate-500 text-xs ml-2">// 选择后一个 (同 0)</span></li>
               </ul>
           </div>
           <div>
               <h3 className="font-bold text-slate-900 mb-2">逻辑运算</h3>
               <ul className="space-y-2 text-sm font-mono text-purple-700">
                 <li className="bg-slate-50 p-2 rounded">and = λp.λq.(p q p)</li>
                 <li className="bg-slate-50 p-2 rounded">not = λp.(p false true)</li>
                 <li className="bg-slate-50 p-2 rounded">if = λp.λa.λb.(p a b) <span className="text-slate-500 text-xs ml-2">// 其实就是 pair</span></li>
               </ul>
           </div>
        </div>

        <p className="text-slate-700">
           看 <code>not</code> 的结构，它把输入的 <code>p</code> 放到前面来调用。
           如果 <code>p</code> 是 <code>true</code>，它就会选择前面的 <code>false</code>。
           如果 <code>p</code> 是 <code>false</code>，它就会选择后面的 <code>true</code>。
           精巧！
        </p>
      </div>
    ),
    interactive: {
      id: 'logic-not',
      expression: 'not true',
      explanation: '演示逻辑非运算：not true = false',
      steps: simulateReduction('LOGIC_NOT')
    }
  },
  {
    title: "三生万物",
    type: LessonType.RECURSION,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">三生万物：Y Combinator (Part 8)</h2>
        <p className="text-slate-700">
          有数据、数据结构、分支结构，就差<strong>循环</strong>了。
        </p>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
             <p className="text-sm text-slate-800">
                <strong>Y Combinator vs YC:</strong> 创业孵化器 Y Combinator 的名字正是来源于此。
                创始人 Paul Graham 也是一位黑客和 Lisp 爱好者，他认为 λ 演算可以 Hack 世界。
             </p>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mt-4">匿名递归的挑战</h3>
        <p className="text-slate-700">
            通常我们写递归函数是这样的（例如 Fibonacci）：
        </p>
        <pre className="bg-slate-800 text-slate-200 p-3 rounded text-sm overflow-x-auto">
{`定义函数 fib(n):
    如果 n < 2，返回 n
    否则，返回 fib(n-1) + fib(n-2)`}
        </pre>
        <p className="text-slate-700">
            但在 λ 演算中，函数是匿名的。你不能在函数内部调用函数自己，因为它没有名字。
            <br/>
            <em>"我叫你的名字你敢答应么？" —— "呵呵，我没名字。"</em>
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-4">Ω (Omega) 与 Y</h3>
        <p className="text-slate-700">
            虽然没有名字，但我们可以把自己传给自己。
            <code>ω = (λx.x x)</code>，那么 <code>ω ω</code> 就会变成 <code>(λx.x x) (λx.x x)</code>，无限循环。
            但这只是死循环。
        </p>
        <p className="text-slate-700">
            我们需要 <strong>Y Combinator</strong>，它能把外来的函数塞进循环里，实现真正的递归。
        </p>
        <div className="bg-purple-50 p-4 rounded border border-purple-200 font-mono text-sm text-purple-900 break-all">
            Y = λf.(λx.f (x x)) (λx.f (x x))
        </div>
        <p className="text-slate-700">
            <code>Y foo</code> 会展开成 <code>foo (Y foo)</code>，也就是 <code>foo (foo (Y foo))</code>...
            递归出现了！
        </p>

        <div className="mt-8 border-t pt-6 text-center">
            <h4 className="text-lg font-bold text-slate-900">道生一，一生二，二生三，三生万物。</h4>
            <p className="text-slate-600 mt-2">少年，你可以去创造世界了。</p>
        </div>
      </div>
    ),
    interactive: {
      id: 'recursion-omega',
      expression: '(λx.x x) (λx.x x)',
      explanation: 'Ω (Omega) Combinator：最简单的死循环。',
      steps: simulateReduction('RECURSION_OMEGA')
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
  },
  {
    title: "实验场 (Playground)",
    type: LessonType.PLAYGROUND,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Lambda 实验场</h2>
        <p className="text-slate-700">
            在这里，你可以输入任意的 Lambda 表达式，看看它会如何一步步归约。
            请随意尝试！
        </p>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-sm text-purple-900">
            <h4 className="font-bold mb-2">小贴士：</h4>
            <ul className="list-disc pl-5 space-y-1">
                <li>可以使用 <code>λ</code> 或 <code>\</code> 来定义函数。</li>
                <li>变量名可以是任意字母数字组合（如 <code>foo</code>, <code>x</code>）。</li>
                <li>注意结合律：<code>x y z</code> 等于 <code>(x y) z</code>。</li>
                <li>如果遇到无限循环（如 Ω），系统会在 50 步后自动停止。</li>
            </ul>
        </div>
      </div>
    )
  }
];