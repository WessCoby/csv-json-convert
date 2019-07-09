class Queue {
    constructor() {
        this.items = {};
        this.counter = 0;
        this.pointer = 0;
    }

    enqueue(element) {
        this.items[this.counter] = element;
        this.counter++;
    }
    
    dequeue() {
        if(this.is_empty()) return undefined;
        const dequeuedElement = this.items[this.pointer];
        delete this.items[this.pointer];
        this.pointer++;
        return dequeuedElement;
    }

    peek() {
        if(this.is_empty()) return undefined;
        return this.items[this.pointer];
    }

    size() {
        return this.counter - this.pointer;
    }

    is_empty() {
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

module.exports = new Queue();