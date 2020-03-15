class Queue {
  items: any;
  counter: number;
  pointer: number;

  constructor() {
    this.items = {};
    this.counter = 0;
    this.pointer = 0;
  }

  enqueue(element: any): void {
    this.items[this.counter] = element;
    this.counter++;
  }
    
  dequeue(): Queue['items'] | undefined {
    if(this.is_empty()) return undefined;

    const dequeuedElement = this.items[this.pointer];
    delete this.items[this.pointer];
    this.pointer++;
    return dequeuedElement;
  }

  peek(): Queue['items'] | undefined {
    if(this.is_empty()) return undefined;
    return this.items[this.pointer];
  }

  size(): number {
    return this.counter - this.pointer;
  }

  is_empty(): boolean {
    return this.size() === 0;
  }

  toString() {
    if(this.is_empty()) return '';
    let objectString = `${this.items[this.pointer]}`;
    for(let i = this.pointer + 1; i < this.counter; i++) {
        objectString += `, ${this.items[i]}`;
    }
    return objectString;
  }

  clear() {
    this.items = {};
    this.counter = 0;
    this.pointer = 0;
  }
}

export default new Queue();