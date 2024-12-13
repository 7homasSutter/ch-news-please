export class Placeholder {

    next = 1

    init() {
        this.next = 1
    }

    getNext() {
        return `$${this.next++}`
    }
}
