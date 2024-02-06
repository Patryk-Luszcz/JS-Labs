const addNoteBtn = document.querySelector('.add');
const save = document.querySelector('.save');
const cancel = document.querySelector('.cancel');
const popup = document.querySelector('.popup');
const selectColor = document.querySelector('.select-color');
const description = document.querySelector('.description');
const error = document.querySelector('.error');
const noteArea = document.querySelector('.note-area');
const inputTitle = document.querySelector('.input-title');
const popupTitle = document.querySelector('.add-note-title');

let isEditingMode = false;
let selectedColor;
let notes = JSON.parse(localStorage.getItem('notes')) || [];

let editingNote;

const colors = {
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

const closePopup = () => {
	popup.style.display = 'none';
	popup.classList.toggle('popup-animation');
	selectColor.selectedIndex = '0';
	inputTitle.value = '';
	description.value = '';
	isEditingMode = false;
};

const addNote = () => {
	popupTitle.textContent = 'Add Note';
	openPopup();
};

const selectValue = () => {
	const { options, selectedIndex } = selectColor;

	selectedColor = options[selectedIndex].text.toLowerCase();
};

const saveNote = () => {
	const { options, selectedIndex } = selectColor;

	if (options[selectedIndex].value !== '0' && description.value !== '') {
		if (isEditingMode) {
			const updatedNote = {
				...editingNote,
				title: inputTitle.value,
				description: description.value,
				color: selectedColor ?? selectColor.value,
			};

			const editingNoteHtml = document.getElementById(updatedNote.id);

			const noteTitle = editingNoteHtml.querySelector('.note-title');
			const noteBody = editingNoteHtml.querySelector('.note-body');

			editingNoteHtml.style.backgroundColor = colors[updatedNote.color];
			noteTitle.textContent = updatedNote.title;
			noteBody.textContent = updatedNote.description;

			const index = notes.findIndex((note) => note.id === updatedNote.id);
			notes[index] = updatedNote;

			localStorage.setItem('notes', JSON.stringify(notes));
		} else {
			createNote();
		}
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
		color: selectColor.value,
		pin: false,
		createDate: Date.now(),
	};

	createNoteTemplate(noteData);

	notes.push(noteData);
	localStorage.setItem('notes', JSON.stringify(notes));
};

const deleteNote = (id) => {
	const noteToDelete = document.getElementById(id);

	notes = notes.filter((note) => note.id !== id);

	localStorage.setItem('notes', JSON.stringify(notes));

	noteArea.removeChild(noteToDelete);
};

const openEditPopup = (id) => {
	isEditingMode = true;

	openPopup();

	editingNote = notes.find((note) => note.id === id);

	popupTitle.textContent = 'Edit Note';

	inputTitle.value = editingNote.title;
	description.value = editingNote.description;
	selectColor.value = editingNote.color;
};

const createNoteTemplate = (note) => {
	const { id, title, color, description } = note;

	const newNote = document.createElement('div');
	newNote.classList.add('note');
	newNote.setAttribute('id', id);

	newNote.innerHTML = `
	<div class="note-header">
	<h3 class="note-title">${title}</h3>
	<div class="buttons-note">
	  <button class="edit-note" onclick="openEditPopup(${id})">
	    <i class="fa fa-paint-brush"></i>		
	  </button>
	  <button class="delete-note" onclick="deleteNote(${id})">
	    <i class="fas fa-times icon"></i>
	  </button>
	</div>
	</div>
	
	<div class="note-body">
	${description}
	</div>`;

	newNote.style.backgroundColor = colors[color];

	noteArea.appendChild(newNote);
};

const loadNotes = () => notes.forEach((note) => createNoteTemplate(note));

loadNotes();

addNoteBtn.addEventListener('click', addNote);
cancel.addEventListener('click', closePopup);
save.addEventListener('click', saveNote);
