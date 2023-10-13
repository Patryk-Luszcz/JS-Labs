const countBtn = document.querySelector('.count-btn');
const addFieldBtn = document.querySelector('.add-field-btn');
const removeFieldBtn = document.querySelector('.remove-field-btn');
const inputsContainer = document.querySelector('.inputs-container');

let inputs = [...document.querySelectorAll('input')];

const sumInfo = document.querySelector('.sum');
const averageInfo = document.querySelector('.average');
const minInfo = document.querySelector('.min');
const maxInfo = document.querySelector('.max');

const countSum = (inputsArray) => {
	let counter = 0;

	inputsArray.forEach((input) => (counter += input));

	return counter;
};

const countAvarage = (inputsArray) => countSum(inputsArray) / inputsArray.length;
const checkMinValue = (inputsArray) => Math.min(...inputsArray);
const checkMaxValue = (inputsArray) => Math.max(...inputsArray);

const countResults = () => {
	const filteredArray = inputs.map((input) => parseInt(input.value)).filter((item) => !isNaN(item));

	const sum = countSum(filteredArray);
	const max = checkMaxValue(filteredArray);
	const min = checkMinValue(filteredArray);
	const average = countAvarage(filteredArray);

	sumInfo.innerText = sum;
	maxInfo.innerText = max;
	minInfo.innerText = min;
	averageInfo.innerText = average;
};

const addNewField = () => {
	const newInput = document.createElement('input');

	newInput.classList.add('input');
	newInput.type = 'text';

	inputs.push(newInput);
	inputsContainer.appendChild(newInput);

	newInput.addEventListener('input', countResults);

	countResults();
};

const removeEmptyFields = () => {
	inputs = inputs.filter((element) => {
		if (element.value === '') {
			inputsContainer.removeChild(element);
			return false;
		}
		return true;
	});

	countResults();
};

countBtn.addEventListener('click', countResults);
addFieldBtn.addEventListener('click', addNewField);
removeFieldBtn.addEventListener('click', removeEmptyFields);

inputs.forEach((input) => {
	input.addEventListener('input', countResults);
});
