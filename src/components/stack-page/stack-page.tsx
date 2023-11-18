import React, { useState, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./stack-page.module.css";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Stack, StackArr } from "./stach-class";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS, pause } from "../../constants/delays";
import { Circle } from "../ui/circle/circle";
export const StackPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [symbol, setSymbol] = useState<string>("");
  const [stackArray, setStackArray] = useState<StackArr[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [deleteDisabled, setDeleteDisabled] = useState<boolean>(false);
  const stack = new Stack();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(event.target.value);
  };

  const handleAdd = async () => {
    if (symbol !== "" && !isLoading) {
      setIsLoading(true);

      // Сначала создаем элемент со статусом Changing и добавляем его в локальный стейт
      const elementToAdd = { value: symbol, type: ElementStates.Changing };
      setStackArray((prevState) => [...prevState, elementToAdd]);

      // Добавляем значение в класс Stack
      stack.add(symbol);

      // Пауза перед сменой статуса
      await pause(SHORT_DELAY_IN_MS);

      // Затем обновляем элемент в локальном стейте, меняя его статус на Default
      setStackArray((prevState) =>
        prevState.map((item, i) =>
          i === prevState.length - 1
            ? { ...item, type: ElementStates.Default }
            : item
        )
      );

      setSymbol("");
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (stackArray.length > 0) {
      setIsLoading(true);
      const index = stackArray.length - 1;
      let newArr = [...stackArray];
      newArr[index].type = ElementStates.Changing;
      setStackArray(newArr);
      await pause(SHORT_DELAY_IN_MS);
      stack.delete();
      newArr.pop();
      setStackArray(newArr);
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setIsLoading(true);
    await stack.clear();
    setStackArray([]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (symbol === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [symbol]);
  useEffect(() => {
    if (stackArray.length > 0) {
      setDeleteDisabled(false);
    } else setDeleteDisabled(true);
  }, [stackArray]);

  return (
    <SolutionLayout title="Стек">
      <div className={styles.content}>
        <div className={styles.input}>
          <Input
            extraClass={styles.input__extra}
            maxLength={4}
            onChange={handleInputChange}
            value={symbol}
            disabled={isLoading}
          />
          <p className={styles.text}>Максимум — 4 символа</p>
        </div>
        <div className={styles.boxes}>
          <Button text="Добавить" onClick={handleAdd} disabled={disabled} />
          <Button
            text="Удалить"
            onClick={handleDelete}
            disabled={deleteDisabled}
          />
        </div>
        <Button
          text="Очистить"
          onClick={handleClear}
          disabled={deleteDisabled}
        />
      </div>
      <div className={styles.circle__container}>
        {stackArray.map((item, index) => (
          <Circle
            key={index}
            letter={item.value?.toString() || ""}
            index={index}
            head={index === stackArray.length - 1 ? "top" : null}
            state={item.type}
          />
        ))}
      </div>
    </SolutionLayout>
  );
};
