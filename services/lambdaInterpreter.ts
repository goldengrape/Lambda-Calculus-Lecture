// A lightweight Lambda Calculus Interpreter
// Supports:
// - Variables: x, y, foo
// - Abstraction: λx.x or \x.x
// - Application: x y
// - Parentheses: (x y)

// --- AST ---
export type Term =
  | { type: 'VAR'; name: string }
  | { type: 'ABS'; param: string; body: Term }
  | { type: 'APP'; func: Term; arg: Term };

// --- Printer ---
export const printTerm = (term: Term): string => {
  switch (term.type) {
    case 'VAR':
      return term.name;
    case 'ABS':
      return `λ${term.param}.${printTerm(term.body)}`;
    case 'APP':
      // Add parens if needed to respect associativity/precedence
      const funcStr =
        term.func.type === 'ABS' ? `(${printTerm(term.func)})` : printTerm(term.func);
      const argStr =
        term.arg.type === 'APP' || term.arg.type === 'ABS'
          ? `(${printTerm(term.arg)})`
          : printTerm(term.arg);
      return `${funcStr} ${argStr}`;
  }
};

// --- Parser ---
const tokenize = (input: string): string[] => {
  return input
    .replace(/λ/g, ' \\ ')
    .replace(/\\/g, ' \\ ')
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .replace(/\./g, ' . ')
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);
};

export const parseLambda = (input: string): Term => {
  const tokens = tokenize(input);
  let current = 0;

  const peek = () => tokens[current];
  const consume = () => tokens[current++];
  const isEnd = () => current >= tokens.length;

  // Atom: (Expression) or Var
  const parseAtom = (): Term => {
    if (isEnd()) throw new Error("Unexpected end of input");
    const token = peek();

    if (token === '(') {
      consume();
      const expr = parseExpression();
      if (consume() !== ')') throw new Error("Missing closing parenthesis");
      return expr;
    } 
    
    if (token === '\\') {
       // Lambda inside parens or at start of expression context
       return parseAbs();
    }

    if (/^[a-zA-Z0-9_]+$/.test(token)) {
      return { type: 'VAR', name: consume() };
    }

    throw new Error(`Unexpected token: ${token}`);
  };

  // Application: Atom Atom ...
  const parseApplication = (): Term => {
    let left = parseAtom();
    while (!isEnd() && peek() !== ')' && peek() !== '\\' && peek() !== '.') {
       const right = parseAtom();
       left = { type: 'APP', func: left, arg: right };
    }
    return left;
  };

  // Abstraction: \x. Expression
  const parseAbs = (): Term => {
    consume(); // skip \
    const param = consume();
    if (peek() === '.') consume();
    const body = parseExpression();
    return { type: 'ABS', param, body };
  };

  // Expression: Abstraction | Application
  const parseExpression = (): Term => {
    if (peek() === '\\') {
      return parseAbs();
    }
    return parseApplication();
  };

  const result = parseExpression();
  if (!isEnd()) throw new Error("Unexpected tokens after expression");
  return result;
};

// --- Reduction (Beta Reduction with Alpha Conversion) ---

// Get free variables of a term
const getFreeVars = (term: Term): Set<string> => {
  switch (term.type) {
    case 'VAR':
      return new Set([term.name]);
    case 'ABS':
      const vars = getFreeVars(term.body);
      vars.delete(term.param);
      return vars;
    case 'APP':
      return new Set([...getFreeVars(term.func), ...getFreeVars(term.arg)]);
  }
};

let uniqueId = 0;
const freshVar = (base: string) => `${base}_${++uniqueId}`;

// Substitution: term[v := replacement]
const substitute = (term: Term, v: string, replacement: Term): Term => {
  switch (term.type) {
    case 'VAR':
      return term.name === v ? replacement : term;
    case 'APP':
      return {
        type: 'APP',
        func: substitute(term.func, v, replacement),
        arg: substitute(term.arg, v, replacement),
      };
    case 'ABS':
      if (term.param === v) return term; // bound, no subst
      
      const freeInRep = getFreeVars(replacement);
      if (freeInRep.has(term.param)) {
        // Alpha conversion needed to avoid capture
        const newParam = freshVar(term.param);
        const newBody = substitute(term.body, term.param, { type: 'VAR', name: newParam });
        return {
          type: 'ABS',
          param: newParam,
          body: substitute(newBody, v, replacement),
        };
      }
      return {
        type: 'ABS',
        param: term.param,
        body: substitute(term.body, v, replacement),
      };
  }
};

// Single step reduction (Normal Order: Leftmost Outermost)
export const reduceStep = (term: Term): { term: Term; reduced: boolean; action?: string } => {
  switch (term.type) {
    case 'VAR':
    case 'ABS':
      // Normal order doesn't reduce inside abstraction unless argument is applied
      // But for visualization we might want to reduce inside if top is done?
      // Standard Normal Order: stop at lambda.
      // But let's try to reduce body if we can't do anything else, for user friendliness?
      // No, let's stick to standard strict normal order for now, maybe deep reduce if needed.
      // Actually, standard Normal Strategy reduces inside lambda ONLY if applied.
      // Let's implement deep reduction to show more progress for things like `\x.((\y.y) z)`
      if (term.type === 'ABS') {
          const bodyRed = reduceStep(term.body);
          if (bodyRed.reduced) {
              return { term: { ...term, body: bodyRed.term }, reduced: true, action: bodyRed.action };
          }
      }
      return { term, reduced: false };
      
    case 'APP':
      // If func is ABS, Reduce! (Beta Reduction)
      if (term.func.type === 'ABS') {
        const action = `Apply (${printTerm(term.arg)}) to λ${term.func.param}`;
        const newTerm = substitute(term.func.body, term.func.param, term.arg);
        return { term: newTerm, reduced: true, action };
      }
      
      // Try to reduce func side first (Leftmost)
      const funcRed = reduceStep(term.func);
      if (funcRed.reduced) {
        return { term: { ...term, func: funcRed.term }, reduced: true, action: funcRed.action };
      }
      
      // Try to reduce arg side
      const argRed = reduceStep(term.arg);
      if (argRed.reduced) {
        return { term: { ...term, arg: argRed.term }, reduced: true, action: argRed.action };
      }
      
      return { term, reduced: false };
  }
};

export const runInterpreterSteps = (input: string, maxSteps = 50) => {
  const steps = [];
  try {
    let currentTerm = parseLambda(input);
    let stepCount = 0;
    
    // Initial State
    // steps.push({ before: '', action: 'Start', after: printTerm(currentTerm) });

    while (stepCount < maxSteps) {
      const beforeStr = printTerm(currentTerm);
      const result = reduceStep(currentTerm);
      
      if (!result.reduced) break;
      
      steps.push({
        before: beforeStr,
        action: result.action || 'Reduction',
        after: printTerm(result.term)
      });
      
      currentTerm = result.term;
      stepCount++;
    }
    
    if (stepCount >= maxSteps) {
      steps.push({ before: printTerm(currentTerm), action: '停止：达到最大步数限制', after: '...' });
    }
    
    return { success: true, steps };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};