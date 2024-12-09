// Selectors
const startScreen = document.querySelector(".start-screen");
const quizScreen = document.querySelector(".quiz-screen");
const resultsScreen = document.querySelector(".results-screen");
const reviewScreen = document.querySelector(".review-screen");

const startButton = document.querySelector(".start-button");
const nextButton = document.querySelector(".next-button");
const submitButton = document.querySelector(".submit-button");
const restartButtons = document.querySelectorAll(
	".restart-button, .restart-button-review"
);
const reviewButton = document.querySelector(".review-button");

const questionText = document.querySelector(".question-text");
const answersContainer = document.querySelector(".answers-container");
const progressText = document.querySelector(".progress-text");
const progressBarFill = document.querySelector(".progress-bar-fill");
const finalScore = document.querySelector(".final-score");
const reviewContainer = document.querySelector(".review-container");

// Array Quiz
const questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            "Hyper Text Markup Language",
            "Home Tool Markup Language",
            "Hyperlinks and Text Markup Language"
        ],
        correct: 0
    },
    {
        question: "Which section of a webpage displays the title?",
        answers: [
            "Header section",
            "Title bar of the browser",
            "Footer section"
        ],
        correct: 1
    },
    {
        question: "What is the main purpose of CSS?",
        answers: [
            "To add interactivity to a page",
            "To design and style a webpage",
            "To structure a webpage"
        ],
        correct: 1
    },
    {
        question: "Which CSS property changes the color of text?",
        answers: [
            "font-color",
            "color",
            "text-style"
        ],
        correct: 1
    },
    {
        question: "What does the 'C' in CSS represent?",
        answers: [
            "Cascading",
            "Creative",
            "Content"
        ],
        correct: 0
    },
    {
        question: "How do you create a clickable link in a webpage?",
        answers: [
            "Using a hyperlink element",
            "Using a button",
            "Using a navigation bar"
        ],
        correct: 0
    },
    {
        question: "How do you include styles from an external file?",
        answers: [
            "Using a stylesheet link",
            "Writing styles directly in the body",
            "Saving the styles in the same folder as the webpage"
        ],
        correct: 0
    },
    {
        question: "Which CSS property sets the font style for text?",
        answers: [
            "font-family",
            "text-style",
            "font-color"
        ],
        correct: 0
    },
    {
        question: "Which type of list uses bullet points?",
        answers: [
            "Ordered list",
            "Unordered list",
            "Definition list"
        ],
        correct: 1
    },
    {
        question: "Which method adds an image to a webpage?",
        answers: [
            "Using an image tag",
            "Using a background property",
            "Using a graphic tool"
        ],
        correct: 0
    }
];

// State Variables
let currentQuestionIndex = 0;
let userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];

// Functions
function showScreen(screen) {
	const screens = document.querySelectorAll(".screen");
	screens.forEach((s) => s.classList.remove("active"));
	screen.classList.add("active");
}

function saveAnswersToStorage() {
	localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
}

function loadQuestion() {
	const currentQuestion = questions[currentQuestionIndex];
	questionText.textContent = currentQuestion.question;

	answersContainer.innerHTML = "";
	currentQuestion.answers.forEach((answer, i) => {
		const button = document.createElement("button");
		button.textContent = answer;
		button.className = "answer";
		button.onclick = function () {
			selectAnswer(i);
		};
		answersContainer.appendChild(button);
	});

	progressText.textContent = `Question ${currentQuestionIndex + 1} of ${
		questions.length
	}`;
	progressBarFill.style.width = `${
		((currentQuestionIndex + 1) / questions.length) * 100
	}%`;

	nextButton.classList.toggle(
		"hidden",
		currentQuestionIndex === questions.length - 1
	);
	submitButton.classList.toggle(
		"hidden",
		currentQuestionIndex !== questions.length - 1
	);
}

function selectAnswer(index) {
	userAnswers[currentQuestionIndex] = index;
	saveAnswersToStorage();
}

function showResults() {
	const score = userAnswers.reduce(
		(acc, answer, i) => acc + (answer === questions[i].correct ? 1 : 0),
		0
	);
	finalScore.textContent = `You scored: ${score} / ${questions.length}`;
}
// Function review
function reviewAnswers() {
    reviewContainer.innerHTML = ""; 

    questions.forEach((q, i) => {
        const userAnswer = userAnswers[i]; 
        const isAnswered = userAnswer !== undefined && userAnswer >= 0 && userAnswer < q.answers.length;
        const isCorrect = isAnswered && userAnswer === q.correct;

        const div = document.createElement("div");
        div.className = isCorrect ? "correct-answer" : "wrong-answer";
        div.innerHTML = `
            <p><strong>${q.question}</strong></p>
            <p>Your answer: ${isAnswered ? q.answers[userAnswer] : "No answer selected"}</p>
            <p>Correct answer: ${q.answers[q.correct]}</p>
        `;
        reviewContainer.appendChild(div); 
    });
}

// Event Listeners
startButton.onclick = function () {
	currentQuestionIndex = 0;
	userAnswers = Array(questions.length).fill(null);
	saveAnswersToStorage();
	showScreen(quizScreen);
	loadQuestion();
};

nextButton.onclick = function () {
	currentQuestionIndex++;
	loadQuestion();
};

submitButton.onclick = function () {
	showScreen(resultsScreen);
	showResults();
};

reviewButton.onclick = function () {
	showScreen(reviewScreen);
	reviewAnswers();
};

restartButtons.forEach((button) => {
	button.onclick = function () {
		localStorage.removeItem("userAnswers");
		showScreen(startScreen);
	};
});

// Initialize
if (userAnswers.length === questions.length) {
	showScreen(resultsScreen);
	showResults();
} else {
	showScreen(startScreen);
}
