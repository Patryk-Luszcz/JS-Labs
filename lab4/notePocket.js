const add = document.querySelector('.add');
const save = document.querySelector('.save');
const cancel = document.querySelector('.cancel');
const popup = document.querySelector('.popup');
const selectColor = document.querySelector('.select-color');
const description = document.querySelector('.description');
const error = document.querySelector('.error');
const noteArea = document.querySelector('.note-area');
const inputTitle = document.querySelector('.input-title');

let selectedColor;
let noteID = 0;

let notes = JSON.parse(localStorage.getItem('notes')) || [];

let colors = {
	blue: 'rgb(0, 170, 255)',
	red: 'rgb(255, 0, 0)',
	green: 'rgb(0, 128, 0)',
	orange: 'rgb(255, 165, 0)',
	purple: 'rgb(128, 0, 128)',
};

const openPopup = () => {
	popup.style.display = 'block';
	popup.classList.toggle('popup-animation');
};

const cancelPopup = () => {
	popup.style.display = 'none';
	popup.classList.toggle('popup-animation');
	selectColor.selectedIndex = 0;
	inputTitle.value = '';
	description.value = '';
};

const saveNote = () => {
	const { options, selectedIndex } = selectColor;

	if (options[selectedIndex].value !== '0' && description.value !== '') {
		createNote();
		error.style.visibility = 'hidden';
	} else {
		error.style.visibility = 'visible';
	}
};

const createNote = () => {
	const noteData = {
		id: Math.random(),
		title: inputTitle.value,
		description: description.value,
		color: selectedColor,
		pin: false,
		createDate: Date.now(),
	};

	createNoteTemplate(noteData);

	notes.push(noteData);
	localStorage.setItem('notes', JSON.stringify(notes));
};

const selectValue = () => {
	const { options, selectedIndex } = selectColor;

	selectedColor = options[selectedIndex].text.toLowerCase();
};

const deleteNote = (id) => {
	const noteToDelete = document.getElementById(id);

	const restNotes = notes.filter((note) => note.id !== id);

	localStorage.setItem('notes', JSON.stringify(restNotes));

	noteArea.removeChild(noteToDelete);
};

const loadNotes = () => notes.forEach((note) => createNoteTemplate(note));

const createNoteTemplate = (note) => {
	const { id, title, color, description } = note;

	const newNote = document.createElement('div');
	newNote.classList.add('note');
	newNote.setAttribute('id', id);

	newNote.innerHTML = `
	<div class="note-header">
			<h3 class="none-title">${title}</h3>
			<button class="edit-note">
				<i class="fa-solid fa-pen-to-square"></i>				
			</button>
			<button class="delete-note" onclick="deleteNote(${id})">
					<i class="fas fa-times icon"></i>
			</button>
	</div>

	<div class="note-body">
			${description}
	</div>`;

	newNote.style.backgroundColor = colors[color];

	noteArea.appendChild(newNote);
};

loadNotes();

add.addEventListener('click', openPopup);
cancel.addEventListener('click', cancelPopup);
save.addEventListener('click', saveNote);
