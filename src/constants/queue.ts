import { ElementStates } from "../types/element-states";

export interface IQueue {
  queueArray: (string | null)[];
  add(symbol: string | null): number | null;
  delete(): number | null;
  clear(): void;
}
export type StackArr = {
  value: string | number | null;
  type?: ElementStates;
};
export type NullableStackArr = StackArr | null;
