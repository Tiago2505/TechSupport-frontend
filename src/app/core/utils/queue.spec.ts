import { Queue } from './queue';

describe('Queue (FIFO)', () => {
  it('serves elements in the order they were enqueued', () => {
    const queue = new Queue<string>();
    queue.enqueue('a');
    queue.enqueue('b');
    queue.enqueue('c');

    expect(queue.dequeue()).toBe('a');
    expect(queue.dequeue()).toBe('b');
    expect(queue.dequeue()).toBe('c');
    expect(queue.dequeue()).toBeUndefined();
  });

  it('accepts an initial collection and copies it', () => {
    const source = [1, 2, 3];
    const queue = new Queue<number>(source);
    queue.dequeue();

    expect(source).toEqual([1, 2, 3]);
    expect(queue.toArray()).toEqual([2, 3]);
  });

  it('peek() returns the head without removing it', () => {
    const queue = new Queue<number>([10, 20]);
    expect(queue.peek()).toBe(10);
    expect(queue.size).toBe(2);
  });

  it('tracks size and emptiness', () => {
    const queue = new Queue<number>();
    expect(queue.isEmpty).toBeTrue();
    queue.enqueue(1);
    expect(queue.isEmpty).toBeFalse();
    expect(queue.size).toBe(1);
  });
});
