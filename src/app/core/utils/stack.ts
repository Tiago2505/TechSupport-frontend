/**
 * Minimal generic **LIFO stack** (Last In, First Out).
 *
 * Used by the ticket management history (PRD §13): the most recent action a
 * technician performs is always shown on top of the pile.
 */
export class Stack<T> {
  private readonly items: T[];

  constructor(initial: readonly T[] = []) {
    this.items = [...initial];
  }

  /** Pushes an element on top of the stack. */
  push(item: T): void {
    this.items.push(item);
  }

  /** Removes and returns the top element. */
  pop(): T | undefined {
    return this.items.pop();
  }

  /** Returns the top element without removing it. */
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  /** Snapshot in insertion order (bottom of the stack first). */
  toArray(): T[] {
    return [...this.items];
  }

  /** Snapshot in LIFO order (top / most recent element first). */
  toArrayLifo(): T[] {
    return [...this.items].reverse();
  }
}
