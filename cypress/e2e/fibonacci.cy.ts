import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { cyCircle } from "../constants";
describe("Fibonacci Page", () => {
  const fibonacci = (n: number): number => {
    if (n === 1 || n === 2) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
  };
  const fibonacciNumbers = [1, 1, 2, 3, 5, 8];

  beforeEach(() => {
    cy.visit("fibonacci");
  });

  it("Проверка корректной генерации чисел Фибоначчи", () => {
    const inputNumber = 5;

    cy.get("input").type(inputNumber.toString());
    cy.get('button[data-test-id="buttonFibonacci"]').click();

    for (let i = 0; i < inputNumber; i++) {
      cy.wait(SHORT_DELAY_IN_MS);
      cy.get(cyCircle)
        .eq(i)
        .invoke("text")
        .should("eq", fibonacciNumbers[i].toString());
    }
  });
});
