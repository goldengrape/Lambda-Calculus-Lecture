// A simple simulator for the specific tutorial examples to ensure they run smoothly visually
// without the overhead of a full recursive descent parser for this specific demo scope.

export const simulateReduction = (expressionType: 'IDENTITY' | 'TRUE' | 'FALSE' | 'SCOPE_FREE' | 'SCOPE_BOUND' | 'SYMBOLIC' | 'ASSOCIATIVITY' | 'CHURCH_ADD_1_1' | 'CHURCH_ADD_1_2') => {
  if (expressionType === 'IDENTITY') {
    return [
      {
        before: '(λx.x) HelloWorld',
        action: '识别函数 (λx.x) 和参数 "HelloWorld"。将 x 替换为 HelloWorld。',
        after: 'HelloWorld'
      }
    ];
  }

  if (expressionType === 'TRUE') {
    return [
      {
        before: '(λx.λy.x) Hello World',
        action: '将 "Hello" 应用于第一个函数 (λx...)。在函数体 (λy.x) 中将 x 替换为 "Hello"。',
        after: '(λy.Hello) World'
      },
      {
        before: '(λy.Hello) World',
        action: '将 "World" 应用于剩余函数 (λy...)。在 "Hello" 中替换 y。找不到 y，总是返回 "Hello"。',
        after: 'Hello'
      }
    ];
  }

  if (expressionType === 'FALSE') {
    return [
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
    ];
  }

  if (expressionType === 'SCOPE_FREE') {
    return [
      {
        before: '(λx.(x (λy.x))) HelloWorld',
        action: '识别外部函数 λx...。将函数体中的 x 替换为 "HelloWorld"。',
        after: 'HelloWorld (λy.HelloWorld)'
      },
      {
        before: 'HelloWorld (λy.HelloWorld)',
        action: '注意内部的 λy.x 中的 x 是自由变量（Free Variable），它引用了外部的 x，因此也被替换了。',
        after: 'HelloWorld (λy.HelloWorld)'
      }
    ];
  }

  if (expressionType === 'SCOPE_BOUND') {
    return [
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
    ];
  }

  if (expressionType === 'SYMBOLIC') {
    return [
      {
        before: '(λx.x + 1) 1',
        action: '将函数体 x + 1 中的 x 替换为 1。',
        after: '1 + 1'
      },
      {
        before: '1 + 1',
        action: '注意：这不会计算成 2。因为在这里 "+" 和 "1" 都只是普通的符号 ID，没有数学加法的定义。',
        after: '1 + 1'
      }
    ];
  }

  if (expressionType === 'ASSOCIATIVITY') {
    return [
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
    ];
  }

  if (expressionType === 'CHURCH_ADD_1_1') {
    return [
      {
        before: 'add 1 1',
        action: '展开 add 的定义: (λm.λn.λf.λx. m f (n f x)) 1 1',
        after: '(λm.λn.λf.λx. m f (n f x)) 1 1'
      },
      {
        before: '(λm.λn.λf.λx. m f (n f x)) 1 1',
        action: '将第一个 1 代入 m: λn.λf.λx. 1 f (n f x)',
        after: '(λn.λf.λx. 1 f (n f x)) 1'
      },
      {
        before: '(λn.λf.λx. 1 f (n f x)) 1',
        action: '将第二个 1 代入 n: λf.λx. 1 f (1 f x)',
        after: 'λf.λx. 1 f (1 f x)'
      },
      {
        before: 'λf.λx. 1 f (1 f x)',
        action: '展开内部的 1 (1 = λf.λx.f x)。 1 f x 等价于 f x。',
        after: 'λf.λx. 1 f (f x)'
      },
      {
        before: 'λf.λx. 1 f (f x)',
        action: '展开外部的 1。 1 f (f x) 也就是将 f 应用于 (f x) 一次。',
        after: 'λf.λx. f (f x)'
      },
      {
        before: 'λf.λx. f (f x)',
        action: '注意这个结构：f 被应用了两次。这就是 Church Numeral 的 "2"。1 + 1 真的等于 2！',
        after: '2'
      }
    ];
  }

  if (expressionType === 'CHURCH_ADD_1_2') {
    return [
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
    ];
  }

  return [];
};