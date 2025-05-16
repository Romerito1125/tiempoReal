export class Stack<T> {
  private items: T[] = [];

  push(value: T): void {
    this.items.push(value);
  }

  pop(): T | null {
    return this.items.length > 0 ? this.items.pop()! : null;
  }

  peek(): T | null {
    return this.items.length > 0 ? this.items[this.items.length - 1] : null;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  print(): void {
    [...this.items].reverse().forEach((item) => console.log(item));
  }

  getAll(): T[] {
    return [...this.items];
  }
}
