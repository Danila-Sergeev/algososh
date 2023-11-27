import React, { useEffect, useState } from 'react';
import { SolutionLayout } from '../ui/solution-layout/solution-layout';
import styles from './sorting-page.module.css';
import { RadioInput } from '../ui/radio-input/radio-input';
import { Button } from '../ui/button/button';
import { Direction } from '../../types/direction';
import { ElementStates } from '../../types/element-states';
import { ArrayElement } from '../../types/sortingArr';
import { ArrayData, ISort, sorting } from './utils';
import { Column } from '../ui/column/column';
import { SHORT_DELAY_IN_MS } from '../../constants/delays';
import { setDelay } from '../../utils';
export const SortingPage: React.FC = () => {
	const [array, setArray] = React.useState<ISort[]>([]);
	const [sortType, setSortType] = React.useState<'bubble' | 'selection'>(
		'selection'
	);
	const [isLoading, setIsLoading] = React.useState({
		ascending: false,
		descending: false,
		update: false,
		input: false,
	});

	React.useEffect(() => {
		randomArr();
	}, []);

	const randomArr = async () => {
		setIsLoading({ ...isLoading, input: true, update: true });

		const length =
			Math.random() * (ArrayData.maxLength - ArrayData.minLength) +
			ArrayData.minLength;
		const newArray = [];
		for (let i = 0; i < length; i++) {
			newArray.push({
				value: Math.floor(
					Math.random() * (ArrayData.maxValue - ArrayData.minValue) +
						ArrayData.minValue
				),
				state: ElementStates.Default,
			});
		}
		await setDelay(SHORT_DELAY_IN_MS);
		setArray(newArray);
		setIsLoading({
			ascending: false,
			descending: false,
			update: false,
			input: false,
		});
	};

	const bubbleSort = async (direction: Direction) => {
		if (direction === Direction.Ascending) {
			setIsLoading({ ...isLoading, input: true, ascending: true });
		} else {
			setIsLoading({ ...isLoading, input: true, descending: true });
		}

		const newArray = [...array];
		for (let i = 0; i < newArray.length; i++) {
			for (let j = 0; j < newArray.length - i - 1; j++) {
				newArray[j].state = ElementStates.Changing;
				newArray[j + 1].state = ElementStates.Changing;
				await setDelay(SHORT_DELAY_IN_MS);
				setArray([...newArray]);
				if (
					direction === Direction.Descending
						? newArray[j].value < newArray[j + 1].value
						: newArray[j].value > newArray[j + 1].value
				) {
					setArray(sorting(newArray, j, j + 1).slice(0));
				}
				newArray[j].state = ElementStates.Default;
			}
			newArray[newArray.length - i - 1].state = ElementStates.Modified;
			setArray([...newArray]);
		}
		setIsLoading({
			ascending: false,
			descending: false,
			update: false,
			input: false,
		});
	};

	const selectionSort = async (direction: Direction) => {
		if (direction === Direction.Ascending) {
			setIsLoading({ ...isLoading, input: true, ascending: true });
		} else {
			setIsLoading({ ...isLoading, input: true, descending: true });
		}

		const newArray = [...array];
		for (let i = 0; i < newArray.length - 1; i++) {
			newArray[i].state = ElementStates.Changing;
			let temp = i;
			for (let j = i + 1; j < newArray.length; j++) {
				newArray[j].state = ElementStates.Changing;
				setArray([...newArray]);
				await setDelay(SHORT_DELAY_IN_MS);
				if (
					direction === Direction.Descending
						? newArray[j].value > newArray[temp].value
						: newArray[j].value < newArray[temp].value
				) {
					temp = j;
				}
				newArray[j].state = ElementStates.Default;
			}
			setArray(sorting(newArray, temp, i).slice(0));
			newArray[i].state = ElementStates.Modified;
		}
		newArray[newArray.length - 1].state = ElementStates.Modified;
		setArray([...newArray]);
		setIsLoading({
			ascending: false,
			descending: false,
			update: false,
			input: false,
		});
	};

	const handleSort = (direction: Direction) => {
		const newArray = [...array];
		for (let i = 0; i < newArray.length; i++) {
			newArray[i].state = ElementStates.Default;
		}
		setArray([...newArray]);
		sortType === 'selection' ? selectionSort(direction) : bubbleSort(direction);
	};

	return (
		<SolutionLayout title="Сортировка массива">
			<form className={styles.form}>
				<RadioInput
					label="Выбор"
					name="sort"
					value="selection"
					checked={sortType === 'selection'}
					onChange={() => setSortType('selection')}
					disabled={isLoading.input}
				/>
				<RadioInput
					label="Пузырёк"
					name="sort"
					value="bubble"
					checked={sortType === 'bubble'}
					onChange={() => setSortType('bubble')}
					disabled={isLoading.input}
				/>
				<Button
					extraClass={styles.buttonFirst}
					text="По возрастанию"
					sorting={Direction.Ascending}
					isLoader={isLoading.ascending}
					onClick={() => handleSort(Direction.Ascending)}
					disabled={isLoading.descending || isLoading.update}
				/>
				<Button
					extraClass={styles.button}
					text="По убыванию"
					sorting={Direction.Descending}
					isLoader={isLoading.descending}
					onClick={() => handleSort(Direction.Descending)}
					disabled={isLoading.ascending || isLoading.update}
				/>
				<Button
					text="Новый массив"
					extraClass={styles.buttonLast}
					isLoader={isLoading.update}
					onClick={randomArr}
					disabled={isLoading.ascending || isLoading.descending}
				/>
			</form>
			<ul className={styles.columns}>
				{array.map((item, index) => {
					return (
						<li key={index}>
							<Column
								index={item.value}
								key={index}
								state={item.state}
							/>
						</li>
					);
				})}
			</ul>
		</SolutionLayout>
	);
};
