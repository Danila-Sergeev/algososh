import {
  state__default,
  state__changing,
  cyHead,
  cyTail,
  cyCircle,
  cyAddQueue,
} from "../constants";
import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";

describe("Queue Page", () => {
  beforeEach(() => {
    cy.visit("queue");
  });

  it("Проверка доступности кнопки при пустом поле ввода", () => {
    cy.get("input").should("have.value", "");
    cy.get(cyAddQueue).should("be.disabled");
  });

  it("Проверка добавления элемента в очередь", () => {
    const char = "A";
    cy.get("input").type(char);
    cy.get(cyAddQueue).click();

    cy.get(cyCircle)
      .contains(char)
      .parent() // Выбираем родительский элемент
      .should("have.css", "border-color", state__changing);

    cy.wait(SHORT_DELAY_IN_MS);

    cy.get(cyCircle)
      .contains(char)
      .parent() // Выбираем родительский элемент
      .should("have.css", "border-color", state__default);

    cy.get(cyHead).should("exist");
    cy.get(cyTail).should("exist");
  });

  it("Проверка что при удалении удаляется всегда первый символ из очереди", () => {
    const chars = ["A", "B", "C"];
    chars.forEach((char) => {
      cy.get("input").type(char);
      cy.get(cyAddQueue).click();
      cy.wait(SHORT_DELAY_IN_MS);
    });

    chars.forEach((char, index) => {
      // Проверка, что кружок с текущим индексом содержит текущий символ
      cy.get(cyCircle).eq(index).should("contain.text", char);

      // Проверка, что все кружки перед текущим индексом пусты
      for (let i = 0; i < index; i++) {
        cy.get(cyCircle).eq(i).should("not.contain.text", chars[i]);
      }

      // Удаляем первый элемент очереди
      cy.get('button[data-test-id="removeFromQueue"]').click();
      cy.wait(SHORT_DELAY_IN_MS);

      // Проверка, что все последующие элементы сохранили свои символы
      chars.slice(index + 1).forEach((remainingChar, remainingIndex) => {
        cy.wait(SHORT_DELAY_IN_MS);
        cy.get(cyCircle)
          .eq(remainingIndex + index + 1)
          .should("contain.text", remainingChar);
      });
    });
  });

  it("Проверка очистки очереди", () => {
    const chars = ["A", "B"];
    chars.forEach((char) => {
      cy.get("input").type(char);
      cy.get(cyAddQueue).click();
      cy.wait(SHORT_DELAY_IN_MS);
    });

    cy.get('button[data-test-id="clearQueue"]').click();
    cy.wait(SHORT_DELAY_IN_MS);

    cy.get(cyCircle).should("have.length", 7); // Убедимся, что все 7 кружков присутствуют
    cy.get(cyCircle).each(($circle) => {
      expect($circle.text().trim()).to.be.empty; // Убедимся, что каждый кружок пуст
    });
  });
});
