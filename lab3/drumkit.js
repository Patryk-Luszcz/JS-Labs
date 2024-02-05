document.addEventListener('keypress', onKeyPress);

const KeyToSound = {
	a: document.querySelector('#s1'),
	s: document.querySelector('#s2'),
	d: document.querySelector('#s3'),
	f: document.querySelector('#s4'),
	g: document.querySelector('#s5'),
	h: document.querySelector('#s6'),
	j: document.querySelector('#s7'),
	k: document.querySelector('#s8'),
	l: document.querySelector('#s9'),
};

function onKeyPress(event) {
	const sound = KeyToSound[event.key];
	playSound(sound);
}
function playSound(sound) {
	sound.currentTime = 0;
	sound.play();
}
