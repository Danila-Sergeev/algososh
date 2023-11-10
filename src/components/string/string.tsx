import React, { ChangeEvent, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import styles from "./string.module.css";

export const StringComponent: React.FC = () => {
  let arr: string[] = [""];
  const [values, setValues] = useState("");
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues(event.target.value);
  };
  const onClick = () => {
    console.log(values);
    arr = values.split("");
    arr.map((value) => console.log(value));
    return <Circle letter={values} />;
  };
  return (
    <SolutionLayout title="Строка">
      <div className={styles.mainBox}>
        <Input maxLength={11} isLimitText={true} onChange={onInputChange} />
        <Button text="Развернуть" onClick={onClick} />
      </div>
      {values ? arr.map((value) => <Circle letter={value} />) : ""}
    </SolutionLayout>
  );
};
