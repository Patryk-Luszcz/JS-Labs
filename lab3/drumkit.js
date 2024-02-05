const recordBtns = [...document.querySelectorAll('.record')];
const playBtns = [...document.querySelectorAll('.play')];
const checkboxes = [...document.querySelectorAll('.checkbox')];
const playAllBtn = document.querySelector('.playAll');
const playSelectedBtn = document.querySelector('.playSelected');
const metronomeInput = document.querySelector('#metronomeInput');
const metronomeBtn = document.querySelector('#metronomeBtn');

let isRecording = false;
const channels = new Array(4).fill().map(() => ({ endTime: 0, soundTrack: [], checked: false }));

let intervalId;
let beatsPerMinute = null;
let isMetronomePlaying = false;

const KeyToSound = {
	a: '#s1',
	s: '#s2',
	d: '#s3',
	f: '#s4',
	g: '#s5',
	h: '#s6',
	j: '#s7',
	k: '#s8',
	l: '#s9',
};

const playSound = (soundId) => {
	const soundElement = document.querySelector(soundId);
	soundElement.play();
};

const onKeyPress = (channel) => (event) => {
	const soundId = KeyToSound[event.key];
	if (soundId) {
		const sound = { soundId, timeStamp: Date.now() };

		channel.soundTrack.push(sound);

		playSound(soundId);
	}
};

const recordTrack = (channel, recordBtn) => {
	isRecording = !isRecording;
	recordBtn.textContent = isRecording ? 'Stop Record' : 'Start Record';

	if (isRecording) {
		channel.soundTrack = [];
		document.addEventListener('keypress', onKeyPress(channel));

		channel.stopRecording = () => {
			document.removeEventListener('keypress', onKeyPress(channel));
			channel.endTime = Date.now();
		};
	} else {
		channel.stopRecording();
	}
};

const playTrack = (playBtn, channel) => {
	const { soundTrack, endTime } = channel;

	if (soundTrack.length > 0) {
		const oldTextContent = playBtn.textContent;
		playBtn.textContent = 'Playing...';
		let lastSoundTime = 0;

		soundTrack.forEach(({ soundId, timeStamp }) => {
			const timeToPlay = endTime - timeStamp;

			setTimeout(() => {
				playSound(soundId);
			}, timeToPlay);

			if (timeToPlay > lastSoundTime) {
				lastSoundTime = timeToPlay;
			}
		});

		setTimeout(() => {
			playBtn.textContent = oldTextContent;
		}, lastSoundTime);
	}
};

const checkChannel = (channel) => (channel.checked = !channel.checked);

const playMetronomeBeat = () => playSound(KeyToSound['f']);

const toggleMetronome = () => {
	if (isMetronomePlaying) {
		clearInterval(intervalId);

		isMetronomePlaying = false;
	} else if (beatsPerMinute) {
		isMetronomePlaying = true;
		const intervalDuration = 60000 / beatsPerMinute;

		intervalId = setInterval(playMetronomeBeat, intervalDuration);
	}
};

recordBtns.forEach((recordBtn, index) => {
	recordBtn.addEventListener('click', () => recordTrack(channels[index], recordBtn));
});

playBtns.forEach((playBtn, index) => {
	playBtn.addEventListener('click', () => playTrack(playBtn, channels[index]));
});

checkboxes.forEach((checkbox, index) => checkbox.addEventListener('click', () => checkChannel(channels[index])));

playAllBtn.addEventListener('click', () => channels.forEach((channel) => playTrack(playAllBtn, channel)));

playSelectedBtn.addEventListener('click', () =>
	channels.forEach((channel) => channel.checked && playTrack(playSelectedBtn, channel))
);

metronomeInput.addEventListener('input', (e) => (beatsPerMinute = +e.target.value));
metronomeBtn.addEventListener('click', toggleMetronome);
