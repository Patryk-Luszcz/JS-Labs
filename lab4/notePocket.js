// Selectors
const elements = {
	addNoteBtn: document.querySelector('.add'),
	saveBtn: document.querySelector('.save'),
	cancelBtn: document.querySelector('.cancel'),
	popup: document.querySelector('.popup'),
	selectColor: document.querySelector('.select-color'),
	description: document.querySelector('.description'),
	error: document.querySelector('.error'),
	noteArea: document.querySelector('.note-area'),
	inputTitle: document.querySelector('.input-title'),
	popupTitle: document.querySelector('.add-note-title'),
	checkbox: document.querySelector('.checkbox'),
};

let isEditingMode = false;
let editingNoteId;
let notes = JSON.parse(localStorage.getItem('notes')) || [];

const colors = {
	blue: 'rgb(0, 170, 255)',
	red: 'rgb(255, 0, 0)',
	green: 'rgb(173, 255, 47)',
	orange: 'rgb(255, 165, 0)',
	purple: 'rgb(184, 7, 184)',
};

// Event Listeners
elements.addNoteBtn.addEventListener('click', () => openPopup('Add Note'));
elements.cancelBtn.addEventListener('click', closePopup);
elements.saveBtn.addEventListener('click', saveNote);

// Popup Functions
function openPopup(title) {
	elements.popup.style.display = 'block';
	elements.popup.classList.add('popup-animation');
	elements.popupTitle.textContent = title;

	resetPopupFields();
}

function closePopup() {
	elements.popup.style.display = 'none';
	elements.popup.classList.remove('popup-animation');

	resetPopupFields();
}

function resetPopupFields() {
	elements.selectColor.selectedIndex = 0;
	elements.inputTitle.value = '';
	elements.description.value = '';
	elements.checkbox.checked = false;
	isEditingMode = false;
}

// Note Operations
function saveNote() {
	const title = elements.inputTitle.value.trim();
	const description = elements.description.value.trim();
	const color = elements.selectColor.value;
	const isPinned = elements.checkbox.checked;

	if (title && color !== '0' && description) {
		if (isEditingMode) {
			updateNote(title, description, color, isPinned);
		} else {
			addNewNote(title, description, color, isPinned);
		}
		elements.error.style.visibility = 'hidden';
		closePopup();
	} else {
		elements.error.style.visibility = 'visible';
	}
}

function addNewNote(title, description, color, isPinned) {
	const note = {
		id: Math.random(),
		creationDate: Date.now(),
		title,
		description,
		color,
		pin: isPinned,
	};

	isPinned ? notes.unshift(note) : notes.push(note);
	updateLocalStorage();
	renderNotes();
}

function updateNote(title, description, color, isPinned) {
	const noteIndex = notes.findIndex((note) => note.id === editingNoteId);
	if (noteIndex !== -1) {
		notes[noteIndex] = { ...notes[noteIndex], title, description, color, pin: isPinned };
		updateLocalStorage();
		renderNotes();
	}
}

function deleteNote(id) {
	notes = notes.filter((note) => note.id !== id);
	updateLocalStorage();
	renderNotes();
}

function openEditPopup(id) {
	const note = notes.find((note) => note.id === id);
	if (note) {
		openPopup('Edit Note');

		isEditingMode = true;
		editingNoteId = id;

		elements.inputTitle.value = note.title;
		elements.description.value = note.description;
		elements.selectColor.value = note.color;
		elements.checkbox.checked = note.pin;
	}
}

// Utility Functions
function updateLocalStorage() {
	localStorage.setItem('notes', JSON.stringify(notes));
}
function renderNotes() {
	const sortedNotes = notes.sort((a, b) => {
		if (a.pin === b.pin) {
			return b.creationDate - a.creationDate;
		}
		return a.pin ? -1 : 1;
	});

	elements.noteArea.innerHTML = ''; // Clear existing notes
	sortedNotes.forEach((note) => {
		const noteElement = createNoteElement(note);
		elements.noteArea.appendChild(noteElement);
	});
}

function createNoteElement(note) {
	const { id, title, color, description, pin } = note;
	const noteDiv = document.createElement('div');

	noteDiv.className = 'note';
	noteDiv.id = id;
	noteDiv.style.backgroundColor = colors[color];

	noteDiv.innerHTML = `
    <div class="note-header">
      <h3 class="note-title">${title}</h3>
      <div class="buttons-note">
        ${pin ? '<i class="fa fa-thumb-tack"></i>' : ''} 
        <button class="edit-note" onclick="openEditPopup(${id})">
          <i class="fa fa-paint-brush"></i>		
        </button>
        <button class="delete-note" onclick="deleteNote(${id})">
          <i class="fas fa-times icon"></i>
        </button>
      </div>
    </div>
    <div class="note-body">${description}</div>
  `;
	return noteDiv;
}

// Initial load
renderNotes();
