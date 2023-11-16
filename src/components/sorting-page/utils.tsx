import { ElementStates } from '../../types/element-states';

export enum ArrayData {
	minLength = 3,
	maxLength = 17,
	minValue = 0,
	maxValue = 100,
}

export interface ISort {
	value: number;
	state: ElementStates;
}

export const sorting = (
	array: Array<ISort>,
	prev: number,
	next: number
): Array<ISort> => {
	let temp = array[prev].value;
	array[prev].value = array[next].value;
	array[next].value = temp;
	return array;
};
