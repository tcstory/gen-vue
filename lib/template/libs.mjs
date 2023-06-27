import { last } from 'radash'

export function createStack() {
    const list = []
    return {
        add(item) {
            list.push(item)
        },
        pop() {
            return list.pop()
        },
        peek() {
            return last(list)
        }
    }
}