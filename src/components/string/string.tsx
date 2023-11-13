import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import styles from "./string.module.css";
import { getLetterState, getReversingString } from "./utils";
import { DELAY_IN_MS, SHORT_DELAY_IN_MS } from "../../constants/delays";
export const StringComponent: React.FC = () => {
  const [values, setValues] = useState("");
  const [letters, setLetters] = useState<string[]>([]);
  const [highlightedIndexes, setHighlightedIndexes] = useState<number[]>([]);
  const [changingIndexes, setChangingIndexes] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [startAnimation, setStartAnimation] = useState<boolean>(false);
  const [isAnimationDone, setIsAnimationDone] = useState<boolean>(false);
  const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isAnimationDone) {
      setStartAnimation(false);
      setHighlightedIndexes([]);
      setChangingIndexes([]);
      setIsAnimationDone(false);
    }
    setValues(event.target.value);
  };
  const handleButtonClick = () => {
    setLetters(values.split(""));

    setIsSorting(true);
    setStartAnimation(true);

    setTimeout(() => {
      const reversedSteps = getReversingString(values);
      reversedSteps.forEach((step, index) => {
        const timeoutChanging = setTimeout(() => {
          setChangingIndexes([index, values.length - 1 - index]);
          const timeoutModified = setTimeout(() => {
            setLetters(step);
            setChangingIndexes([]);
            setHighlightedIndexes((prevIndexes) => [
              ...prevIndexes,
              index,
              values.length - 1 - index,
            ]);
          }, SHORT_DELAY_IN_MS);
          setTimeouts((prevTimeouts) => [...prevTimeouts, timeoutModified]);
        }, index * DELAY_IN_MS);
        setTimeouts((prevTimeouts) => [...prevTimeouts, timeoutChanging]);
      });

      setTimeout(() => {
        setIsSorting(false);
        setIsAnimationDone(true);
        setHighlightedIndexes(
          Array.from({ length: values.length }, (_, i) => i)
        );
      }, reversedSteps.length * DELAY_IN_MS);
    }, SHORT_DELAY_IN_MS);
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleButtonClick();
  };

  useEffect(() => {
    if (startAnimation) {
      setLetters(values.split(""));
      setHighlightedIndexes([]);
      setChangingIndexes([]);
    }
  }, [startAnimation]);

  useEffect(() => {
    if (!startAnimation) {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      setTimeouts([]);
    }
  }, [startAnimation]);

  return (
    <SolutionLayout title="Строка">
      <form onSubmit={handleSubmit} className={styles.mainBox}>
        <Input maxLength={11} isLimitText={true} onChange={onInputChange} />
        <Button
          text="Развернуть"
          type="submit"
          isLoader={isSorting}
          disabled={isSorting}
        />
      </form>

      <div className={styles.circleBox}>
        {startAnimation &&
          letters.map((letter, index) => (
            <Circle
              key={index}
              letter={letter}
              state={getLetterState(index, highlightedIndexes, changingIndexes)}
            />
          ))}
      </div>
    </SolutionLayout>
  );
};
