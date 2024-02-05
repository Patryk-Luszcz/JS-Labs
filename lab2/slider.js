const images = document.querySelectorAll('img');
const slideContainer = document.querySelector('.slides');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const dotsContainer = document.querySelector('.dots');

let currentSlide = 0;

images.forEach((_, index) => {
	let dot = document.createElement('span');

	dot.classList.add('dot');
	dot.addEventListener('click', () => moveToSlide(index));
	dotsContainer.appendChild(dot);
});

const updateDots = () => {
	Array.from(dotsContainer.children).forEach((dot, index) => {
		dot.classList.toggle('active', index === currentSlide);
	});
};

const moveToSlide = (slideIndex) => {
	currentSlide = slideIndex;
	slideContainer.style.transform = `translateX(-${slideIndex * 100}%)`;

	updateDots();
};

const moveToNextSlide = () => (currentSlide === images.length - 1 ? moveToSlide(0) : moveToSlide(currentSlide + 1));
const moveToPrevSlide = () => (currentSlide === 0 ? moveToSlide(images.length - 1) : moveToSlide(currentSlide - 1));

prevButton.addEventListener('click', moveToPrevSlide);
nextButton.addEventListener('click', moveToNextSlide);

updateDots();
