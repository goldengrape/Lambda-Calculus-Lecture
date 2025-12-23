// A simple simulator for the specific tutorial examples to ensure they run smoothly visually
// without the overhead of a full recursive descent parser for this specific demo scope.

export const simulateReduction = (expressionType: 'IDENTITY' | 'TRUE' | 'FALSE' | 'SCOPE_FREE' | 'SCOPE_BOUND' | 'SYMBOLIC' | 'ASSOCIATIVITY' | 'CHURCH_ADD_1_1' | 'CHURCH_ADD_1_2' | 'PAIR_CONSTRUCT' | 'PAIR_FIRST' | 'PAIR_SECOND' | 'LOGIC_NOT' | 'LOGIC_AND' | 'LOGIC_IF' | 'RECURSION_OMEGA' | 'RECURSION_Y') => {
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

  if (expressionType === 'PAIR_CONSTRUCT') {
    return [
      {
        before: 'pair a b',
        action: '展开 pair 的定义: (λx.λy.λz. z x y) a b',
        after: '(λx.λy.λz. z x y) a b'
      },
      {
        before: '(λx.λy.λz. z x y) a b',
        action: '应用第一个参数 a 替换 x',
        after: '(λy.λz. z a y) b'
      },
      {
        before: '(λy.λz. z a y) b',
        action: '应用第二个参数 b 替换 y',
        after: 'λz. z a b'
      },
      {
        before: 'λz. z a b',
        action: '完成。这是一个等待函数 z 的结构，它准备把 a 和 b 传给 z。',
        after: 'λz. z a b'
      }
    ];
  }

  if (expressionType === 'PAIR_FIRST') {
    return [
      {
        before: 'first (pair a b)',
        action: '我们已知 (pair a b) 等价于 λz. z a b。代入 first 定义 (λp. p (λx.λy.x))。',
        after: '(λp. p (λx.λy.x)) (λz. z a b)'
      },
      {
        before: '(λp. p (λx.λy.x)) (λz. z a b)',
        action: '将 pair (λz. z a b) 代入 p。',
        after: '(λz. z a b) (λx.λy.x)'
      },
      {
        before: '(λz. z a b) (λx.λy.x)',
        action: '神奇的一步：这里 (λx.λy.x) 其实就是选择器 True（选择第一个）。把它代入 z。',
        after: '(λx.λy.x) a b'
      },
      {
        before: '(λx.λy.x) a b',
        action: '选择器 True 选择了第一个参数 a。',
        after: 'a'
      }
    ];
  }

  if (expressionType === 'PAIR_SECOND') {
    return [
      {
        before: 'second (pair a b)',
        action: '我们已知 (pair a b) 等价于 λz. z a b。代入 second 定义 (λp. p (λx.λy.y))。',
        after: '(λp. p (λx.λy.y)) (λz. z a b)'
      },
      {
        before: '(λp. p (λx.λy.y)) (λz. z a b)',
        action: '将 pair (λz. z a b) 代入 p。',
        after: '(λz. z a b) (λx.λy.y)'
      },
      {
        before: '(λz. z a b) (λx.λy.y)',
        action: '神奇的一步：这里 (λx.λy.y) 其实就是选择器 False（选择第二个）。把它代入 z。',
        after: '(λx.λy.y) a b'
      },
      {
        before: '(λx.λy.y) a b',
        action: '选择器 False 选择了第二个参数 b。',
        after: 'b'
      }
    ];
  }

  if (expressionType === 'LOGIC_NOT') {
    return [
      {
        before: 'not true',
        action: '展开 not 定义: (λp. p false true) true',
        after: '(λp. p false true) true'
      },
      {
        before: '(λp. p false true) true',
        action: '将 true 代入 p: true false true',
        after: 'true false true'
      },
      {
        before: 'true false true',
        action: '展开 true (λx.λy.x): (λx.λy.x) false true',
        after: '(λx.λy.x) false true'
      },
      {
        before: '(λx.λy.x) false true',
        action: 'True 选择第一个参数: false',
        after: 'false'
      }
    ];
  }

  if (expressionType === 'LOGIC_AND') {
    return [
      {
        before: 'and true false',
        action: '展开 and 定义: (λp.λq. p q p) true false',
        after: '(λp.λq. p q p) true false'
      },
       {
        before: '(λp.λq. p q p) true false',
        action: '代入参数 p=true, q=false: true false true',
        after: 'true false true'
      },
      {
        before: 'true false true',
        action: '展开 true 为选择器: (λx.λy.x) false true',
        after: '(λx.λy.x) false true'
      },
      {
        before: '(λx.λy.x) false true',
        action: '选择第一个参数: false',
        after: 'false'
      }
    ];
  }

  if (expressionType === 'LOGIC_IF') {
     return [
      {
        before: 'if true a b',
        action: '展开 if 定义: (λp.λa.λb. p a b) true a b',
        after: '(λp.λa.λb. p a b) true a b'
      },
      {
        before: '(λp.λa.λb. p a b) true a b',
        action: '代入所有参数: true a b',
        after: 'true a b'
      },
      {
        before: 'true a b',
        action: '展开 true: (λx.λy.x) a b',
        after: '(λx.λy.x) a b'
      },
      {
        before: '(λx.λy.x) a b',
        action: 'True 选择第一个参数: a',
        after: 'a'
      }
    ];
  }

  if (expressionType === 'RECURSION_OMEGA') {
    return [
      {
        before: '(λx.(x x)) (λx.(x x))',
        action: '应用第一个函数到第二个函数。将第二个 (λx.(x x)) 代入第一个函数体内的 x。',
        after: '(λx.(x x)) (λx.(x x))'
      },
      {
        before: '(λx.(x x)) (λx.(x x))',
        action: '等等，结果怎么和输入一样？',
        after: '(λx.(x x)) (λx.(x x))'
      },
      {
        before: '(λx.(x x)) (λx.(x x))',
        action: '这就是 ω combinator。一个死循环，或者说自旋。',
        after: 'ω ω'
      }
    ];
  }

  if (expressionType === 'RECURSION_Y') {
    const yPart = '(λx.λy.( y (x x y)))';
    return [
      {
        before: `Y foo`,
        action: `展开 Y 的定义 (由两个相同的 Ypart 组成): ${yPart} ${yPart} foo`,
        after: `${yPart} ${yPart} foo`
      },
      {
        before: `${yPart} ${yPart} foo`,
        action: `将第二个 Ypart 代入第一个 Ypart 的 x 中。`,
        after: `(λy.( y (${yPart} ${yPart} y))) foo`
      },
      {
        before: `(λy.( y (${yPart} ${yPart} y))) foo`,
        action: `将 foo 代入 y 中。`,
        after: `foo (${yPart} ${yPart} foo)`
      },
      {
        before: `foo (${yPart} ${yPart} foo)`,
        action: `观察括号内部： ${yPart} ${yPart} 其实就是原来的 Y。`,
        after: `foo (Y foo)`
      },
      {
        before: `foo (Y foo)`,
        action: `我们得到了递归！ Y foo 变成了 foo (Y foo)。可以无限展开为 foo (foo (Y foo))...`,
        after: `foo (foo (Y foo))`
      }
    ];
  }

  return [];
};