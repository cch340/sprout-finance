/**
 * A tiny, dependency-free arithmetic evaluator for the amount field — lets users
 * type sums like "12.50 + 5 * 2" instead of reaching for a calculator. No eval /
 * Function: a hand-rolled tokenizer + recursive-descent parser keeps it safe.
 *
 * Supports numbers (with decimals), + - * /, parentheses, unary minus and
 * whitespace. Returns null for anything invalid, incomplete, a division by zero,
 * or a non-finite result. A bare number simply returns itself.
 */

type Token =
  | { type: 'num'; value: number }
  | { type: 'op'; value: '+' | '-' | '*' | '/' }
  | { type: 'lparen' }
  | { type: 'rparen' };

/** Split the input into tokens, or null if it contains an unexpected character. */
function tokenize(input: string): Token[] | null {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (ch === ' ' || ch === '\t') {
      i++;
      continue;
    }
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }
    // A number: digits with at most one decimal point.
    if ((ch >= '0' && ch <= '9') || ch === '.') {
      let j = i;
      let dots = 0;
      while (j < input.length && ((input[j] >= '0' && input[j] <= '9') || input[j] === '.')) {
        if (input[j] === '.') dots++;
        j++;
      }
      const slice = input.slice(i, j);
      if (dots > 1 || slice === '.') return null;
      tokens.push({ type: 'num', value: parseFloat(slice) });
      i = j;
      continue;
    }
    return null; // unexpected character
  }
  return tokens;
}

/**
 * Grammar (lowest → highest precedence):
 *   expr   := term (('+' | '-') term)*
 *   term   := factor (('*' | '/') factor)*
 *   factor := '-' factor | '(' expr ')' | number
 */
function parse(tokens: Token[]): number | null {
  let pos = 0;
  let failed = false;

  const peek = () => tokens[pos];
  const fail = (): null => {
    failed = true;
    return null;
  };

  const parseFactor = (): number | null => {
    const t = peek();
    if (!t) return fail();
    if (t.type === 'op' && t.value === '-') {
      pos++;
      const v = parseFactor();
      return v === null ? null : -v;
    }
    if (t.type === 'lparen') {
      pos++;
      const v = parseExpr();
      if (v === null) return null;
      if (peek()?.type !== 'rparen') return fail();
      pos++;
      return v;
    }
    if (t.type === 'num') {
      pos++;
      return t.value;
    }
    return fail();
  };

  const parseTerm = (): number | null => {
    let v = parseFactor();
    if (v === null) return null;
    while (peek()?.type === 'op' && ((peek() as { value: string }).value === '*' || (peek() as { value: string }).value === '/')) {
      const op = (peek() as { value: '*' | '/' }).value;
      pos++;
      const rhs = parseFactor();
      if (rhs === null) return null;
      if (op === '/') {
        if (rhs === 0) return fail();
        v = v / rhs;
      } else {
        v = v * rhs;
      }
    }
    return v;
  };

  function parseExpr(): number | null {
    let v = parseTerm();
    if (v === null) return null;
    while (peek()?.type === 'op' && ((peek() as { value: string }).value === '+' || (peek() as { value: string }).value === '-')) {
      const op = (peek() as { value: '+' | '-' }).value;
      pos++;
      const rhs = parseTerm();
      if (rhs === null) return null;
      v = op === '+' ? v + rhs : v - rhs;
    }
    return v;
  }

  const result = parseExpr();
  if (failed || result === null) return null;
  if (pos !== tokens.length) return null; // trailing tokens = malformed
  return result;
}

/**
 * Evaluate an arithmetic expression string. Returns the numeric result, or null
 * for empty, invalid, incomplete, div-by-zero or non-finite input.
 */
export function evalExpression(input: string): number | null {
  if (input.trim() === '') return null;
  const tokens = tokenize(input);
  if (tokens === null || tokens.length === 0) return null;
  const result = parse(tokens);
  if (result === null || !Number.isFinite(result)) return null;
  return result;
}

/** True when the string carries an arithmetic operator (so it's an expression). */
export function hasOperator(input: string): boolean {
  // A leading unary minus alone (e.g. "-5") doesn't count as an expression.
  return /[+*/]/.test(input) || /\d\s*-/.test(input);
}
