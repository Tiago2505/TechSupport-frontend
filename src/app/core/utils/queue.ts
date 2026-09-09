/**
 * Minimal generic **FIFO queue** (First In, First Out).
 *
 * Used by the technician support queue (PRD §12): the first ticket that entered
 * the queue is always the first one to be served.
 */
export class Queue<T> {
  private readonly items: T[];

  constructor(initial: readonly T[] = []) {
    this.items = [...initial];
  }

  /** Adds an element at the tail of the queue. */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /** Removes and returns the element at the head (the oldest one). */
  dequeue(): T | undefined {
    return this.items.shift();
  }

  /** Returns the head element without removing it. */
  peek(): T | undefined {
    return this.items[0];
  }

  get size(): number {
    return this.items.length;
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  /** Snapshot of the queue from head (oldest) to tail (newest). */
  toArray(): T[] {
    return [...this.items];
  }
}
