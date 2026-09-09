import { Stack } from './stack';

describe('Stack (LIFO)', () => {
  it('returns the most recently pushed element first', () => {
    const stack = new Stack<string>();
    stack.push('a');
    stack.push('b');
    stack.push('c');

    expect(stack.pop()).toBe('c');
    expect(stack.pop()).toBe('b');
    expect(stack.pop()).toBe('a');
    expect(stack.pop()).toBeUndefined();
  });

  it('peek() returns the top without removing it', () => {
    const stack = new Stack<number>([1, 2]);
    expect(stack.peek()).toBe(2);
    expect(stack.size).toBe(2);
  });

  it('toArrayLifo() lists the newest element first', () => {
    const stack = new Stack<number>([1, 2, 3]);
    expect(stack.toArray()).toEqual([1, 2, 3]);
    expect(stack.toArrayLifo()).toEqual([3, 2, 1]);
  });

  it('does not mutate the initial collection', () => {
    const source = [1, 2];
    const stack = new Stack<number>(source);
    stack.push(3);
    expect(source).toEqual([1, 2]);
  });
});
