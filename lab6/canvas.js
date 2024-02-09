const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const numberOfBallsInput = document.querySelector('#numberOfBalls');
const thresholdInput = document.querySelector('#threshold');
const startBtn = document.querySelector('#startButton');
const resetBtn = document.querySelector('#resetButton');
const fpsDisplay = document.querySelector('#fps');
const numberOfBallsOutput = document.querySelector('#numberOfBallsOutput');
const thresholdOutput = document.querySelector('#thresholdOutput');

let balls = [];
let running = false;
let frameCount = 0;
let lastTimestamp = 0;

class Ball {
	constructor(x, y, vx, vy, radius, color) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.radius = radius;
		this.color = color;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	update() {
		this.x += this.vx;
		this.y += this.vy;

		if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
			this.vx *= -1;
		}

		if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
			this.vy *= -1;
		}
	}
}

function connectBalls(b1, b2, threshold) {
	const distance = Math.hypot(b1.x - b2.x, b1.y - b2.y);
	if (distance < threshold) {
		ctx.beginPath();
		ctx.moveTo(b1.x, b1.y);
		ctx.lineTo(b2.x, b2.y);
		ctx.stroke();
	}
}

function createBalls(count) {
	balls = [];

	for (let i = 0; i < count; i++) {
		const radius = Math.random() * 20 + 10;
		const x = Math.random() * (canvas.width - radius * 2) + radius;
		const y = Math.random() * (canvas.height - radius * 2) + radius;
		const vx = (Math.random() - 0.5) * 10;
		const vy = (Math.random() - 0.5) * 10;
		const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
			Math.random() * 256
		)})`;
		balls.push(new Ball(x, y, vx, vy, radius, color));
	}
}

function updateFPS(timestamp) {
	frameCount++;
	const delta = (timestamp - lastTimestamp) / 1000;
	lastTimestamp = timestamp;

	if (delta >= 1) {
		fpsDisplay.textContent = `FPS: ${Math.round(frameCount / delta)}`;
		frameCount = 0;
	}
}

function draw(timestamp) {
	if (!running) return;
	updateFPS(timestamp);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const threshold = (canvas.width * thresholdInput.value) / 100;

	balls.forEach((ball, i) => {
		ball.draw();
		ball.update();

		for (let j = i + 1; j < balls.length; j++) {
			connectBalls(ball, balls[j], threshold);
		}
	});

	requestAnimationFrame(draw);
}

function start() {
	if (running) return;
	createBalls(numberOfBallsInput.value);
	running = true;
	requestAnimationFrame(draw);
}

function reset() {
	running = false;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

numberOfBallsInput.addEventListener('input', () => {
	numberOfBallsOutput.value = numberOfBallsInput.value;
});

thresholdInput.addEventListener('input', () => {
	thresholdOutput.value = thresholdInput.value;
});

startBtn.addEventListener('click', start);
resetBtn.addEventListener('click', reset);
