import { ListNode } from "./list-node";
import { LinkedArrElement } from "../../types/list";
import { ElementStates } from "../../types/element-states";
import { ILinkedList } from "../../types/list";

export class LinkedList<T extends LinkedArrElement> implements ILinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;

  constructor(values?: T[]) {
    if (values) {
      for (let value of values) {
        this.addToTail(value);
      }
    }
  }

  addToHead(value: T) {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
    if (!this.tail) this.tail = newNode;
  }

  addToTail(value: T) {
    const newNode = new ListNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = this.head;
    } else if (this.tail) {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  removeHead() {
    if (!this.head) return null;
    const removedValue = this.head.value;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;
    return removedValue;
  }

  removeTail() {
    if (!this.head) return null;
    if (this.head === this.tail) {
      const removedValue = this.head.value;
      this.head = this.tail = null;
      return removedValue;
    }
    let currentNode = this.head;
    while (currentNode.next && currentNode.next !== this.tail) {
      currentNode = currentNode.next;
    }
    const removedValue = currentNode.next!.value;
    currentNode.next = null;
    this.tail = currentNode;
    return removedValue;
  }

  //добавление всех узлов в массив
  toArray() {
    let arr: ListNode<T>[] = [];
    let currentNode = this.head;
    while (currentNode) {
      arr.push(currentNode);
      currentNode = currentNode.next;
    }
    return arr;
  }
  insertAtIndex(value: T, index: number) {
    // Специальные случаи: пустой список или вставка в начало
    if (index === 0 || !this.head) {
      this.addToHead(value);
      return;
    }

    // Инициализация счетчика и начального узла
    let i = 0;
    let node = this.head;

    // Перемещение к нужной позиции
    while (i < index - 1 && node.next) {
      i++;
      node = node.next;
    }

    // Вставка нового узла
    const newNode = new ListNode(value, node.next);
    node.next = newNode;

    // Обновление хвоста, если нужно
    if (newNode.next === null) {
      this.tail = newNode;
    }
  }

  removeAtIndex(index: number): LinkedArrElement | null {
    // Специальные случаи: пустой список или удаление из начала
    if (index === 0 || !this.head) {
      const removedHeadValue = this.head ? this.head.value : null;
      this.removeHead();
      return removedHeadValue;
    }

    // Инициализация счетчика и начального узла
    let i = 0;
    let node = this.head;
    let removedValue: LinkedArrElement | null = null;

    // Перемещение к нужной позиции
    while (i < index - 1 && node.next) {
      i++;
      node = node.next;
    }

    // Удаление узла
    if (node.next) {
      removedValue = node.next.value;
      node.next = node.next.next;
    }

    // Обновление хвоста, если нужно
    if (node.next === null) {
      this.tail = node;
    }

    return removedValue; // Возвращает значение удаленного узла
  }

  getLength() {
    let length = 0;
    let currentNode = this.head;

    while (currentNode !== null) {
      length++;
      currentNode = currentNode.next;
    }

    return length;
  }

  clearNodeValue(index: number) {
    const node = this.getNodeAtIndex(index);
    if (node) {
      node.value.value = "";
    }
  }

  getNodeAtIndex(index: number): ListNode<T> | null {
    if (!this.head || index < 0) {
      return null;
    }

    let node = this.head;
    for (let i = 0; i < index && node; i++) {
      if (node.next) {
        node = node.next;
      } else {
        return null;
      }
    }
    return node;
  }

  changeState(index: number, state: ElementStates) {
    const node = this.getNodeAtIndex(index);
    if (node) {
      node.value.state = state;
    }
  }

  //чтение массива

  getData() {
    const array = this.toArray();
    const tail = this.tail;
    const head = this.head;
    return { array, tail, head };
  }
}
