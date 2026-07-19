import { describe, expect, it } from 'vitest';
import { evalExpression, hasOperator } from './calc';

describe('evalExpression', () => {
  it('returns a plain number unchanged', () => {
    expect(evalExpression('42')).toBe(42);
    expect(evalExpression('  7 ')).toBe(7);
  });

  it('honours operator precedence', () => {
    expect(evalExpression('2 + 3 * 4')).toBe(14);
    expect(evalExpression('10 - 6 / 2')).toBe(7);
  });

  it('respects parentheses', () => {
    expect(evalExpression('(2 + 3) * 4')).toBe(20);
    expect(evalExpression('2 * (3 + (4 - 1))')).toBe(12);
  });

  it('handles decimals', () => {
    expect(evalExpression('12.50 + 5')).toBeCloseTo(17.5, 5);
    expect(evalExpression('0.1 + 0.2')).toBeCloseTo(0.3, 5);
  });

  it('handles unary minus', () => {
    expect(evalExpression('-5')).toBe(-5);
    expect(evalExpression('3 + -2')).toBe(1);
    expect(evalExpression('-(2 + 3)')).toBe(-5);
  });

  it('returns null for division by zero', () => {
    expect(evalExpression('5 / 0')).toBeNull();
    expect(evalExpression('1 / (2 - 2)')).toBeNull();
  });

  it('returns null for garbage or incomplete input', () => {
    expect(evalExpression('2 +')).toBeNull();
    expect(evalExpression('* 3')).toBeNull();
    expect(evalExpression('2 3')).toBeNull();
    expect(evalExpression('(2 + 3')).toBeNull();
    expect(evalExpression('abc')).toBeNull();
    expect(evalExpression('1.2.3')).toBeNull();
    expect(evalExpression('2 ** 3')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(evalExpression('')).toBeNull();
    expect(evalExpression('   ')).toBeNull();
  });
});

describe('hasOperator', () => {
  it('detects arithmetic operators', () => {
    expect(hasOperator('2 + 3')).toBe(true);
    expect(hasOperator('4 * 5')).toBe(true);
    expect(hasOperator('10 - 1')).toBe(true);
  });

  it('treats a bare number (incl. leading minus) as not an expression', () => {
    expect(hasOperator('42')).toBe(false);
    expect(hasOperator('-5')).toBe(false);
    expect(hasOperator('3.14')).toBe(false);
  });
});
