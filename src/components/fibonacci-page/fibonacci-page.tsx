import React, { useEffect, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import styles from "./fibonacci-page.module.css";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { calculateFibonacci } from "./utils";
import { Circle } from "../ui/circle/circle";

export const FibonacciPage: React.FC = () => {
  const [number, setNumber] = useState(0);
  const [fibonacciSequence, setFibonacciSequence] = useState<number[]>([]);
  const [displayedIndexes, setDisplayedIndexes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);
  const [disabled, setDisabled] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setNumber(value);
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleClick();
  };
  const handleClick = async () => {
    if (number < 0 || number > 19) {
      alert("Введенное число должно быть от 1 до 19");
      return;
    }
    setIsLoading(true);
    const sequence = await calculateFibonacci(number);
    setFibonacciSequence(sequence);
    displayNumbers(0, sequence.length);
  };

  const displayNumbers = (index: number, total: number) => {
    if (index < total) {
      const id = window.setTimeout(() => {
        // сохранение ID таймера
        setDisplayedIndexes((prev) => [...prev, index]);
        displayNumbers(index + 1, total);
      }, SHORT_DELAY_IN_MS);
      setTimeoutId(id); // обновление состояния с новым ID
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fibonacciSequence.length > 0) {
      displayNumbers(0, fibonacciSequence.length);
    }
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [fibonacciSequence, timeoutId]);

  useEffect(() => {
    if (!number) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [number]);

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <form onSubmit={handleSubmit} className={styles.mainBox}>
        <Input
          isLimitText={true}
          maxLength={19}
          max={19}
          onChange={handleChange}
          type="number"
        />
        <Button
          text="Рассчитать"
          type="submit"
          onClick={handleClick}
          isLoader={isLoading}
          disabled={disabled}
        />
      </form>
      <div className={styles.circleBox}>
        {fibonacciSequence.map(
          (num, index) =>
            displayedIndexes.includes(index) && (
              <Circle key={index} letter={num.toString()} index={index} />
            )
        )}
      </div>
    </SolutionLayout>
  );
};
