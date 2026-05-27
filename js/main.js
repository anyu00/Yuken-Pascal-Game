// Pascal's Law Adventure - Game Logic

const pushBtn = document.getElementById('push-btn');
const leftPiston = document.getElementById('left-piston');
const rightPiston = document.getElementById('right-piston');
const leftFluid = document.getElementById('left-fluid');
const rightFluid = document.getElementById('right-fluid');
const pressureValue = document.getElementById('pressure-value');
const lawText = document.getElementById('law-text');
const pressureWave = document.getElementById('pressure-wave');
const factText = document.getElementById('fact-text');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('next-btn');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');

let pressure = 0;
let score = 0;
let pushCount = 0;
let currentQuestion = 0;
let quizStarted = false;

const facts = [
    "Pascal's Law was discovered by Blaise Pascal in 1647! He was only 18 when he started studying fluids.",
    "Hydraulic car lifts use Pascal's Law — a small force creates a huge lifting force!",
    "Your heart uses Pascal's Law to pump blood equally through your whole body!",
    "Brakes in cars use Pascal's Law to stop safely — pressing the pedal sends equal pressure to all 4 wheels!",
    "Pascal's Law says: pressure applied to a fluid in a closed container is transmitted equally in ALL directions.",
    "Hydraulic machines can multiply force — push with 10 units of force, lift hundreds of units of weight!"
];

const messages = [
    "Great push! See how the pressure travels through the fluid!",
    "Pascal's Law: Pressure spreads EQUALLY in all directions in a fluid!",
    "The fluid carries your push all the way to the other side!",
    "Look! The right piston rises because the fluid pressure pushes it up!",
    "You're a Pascal's Law expert! Pressure = Force ÷ Area"
];

const questions = [
    {
        q: "What does Pascal's Law say about pressure in a fluid?",
        options: [
            "Pressure stays only where you push",
            "Pressure spreads equally in all directions ✅",
            "Pressure disappears in fluids",
            "Pressure only goes up"
        ],
        answer: 1
    },
    {
        q: "Which of these machines uses Pascal's Law?",
        options: [
            "A bicycle chain",
            "A hydraulic car lift ✅",
            "A wind turbine",
            "A clock"
        ],
        answer: 1
    },
    {
        q: "If you push on a small piston, what happens to the large piston?",
        options: [
            "Nothing happens",
            "It goes down",
            "It rises up ✅",
            "It spins around"
        ],
        answer: 2
    },
    {
        q: "Who discovered Pascal's Law?",
        options: [
            "Isaac Newton",
            "Albert Einstein",
            "Blaise Pascal ✅",
            "Galileo Galilei"
        ],
        answer: 2
    },
    {
        q: "What kind of substance does Pascal's Law apply to?",
        options: [
            "Only gases",
            "Only solids",
            "Fluids (liquids and gases) ✅",
            "Only metals"
        ],
        answer: 2
    }
];

function animatePressure() {
    pressureWave.classList.remove('animate');
    void pressureWave.offsetWidth; // reflow
    pressureWave.classList.add('animate');
}

function updateFluidLevels() {
    const leftHeight = Math.max(20, 60 - pressure * 8);
    const rightHeight = Math.min(150, 60 + pressure * 8);
    leftFluid.style.height = leftHeight + 'px';
    rightFluid.style.height = rightHeight + 'px';
}

pushBtn.addEventListener('click', () => {
    pushCount++;
    pressure = Math.min(pushCount, 10);

    leftPiston.classList.add('pushing');
    setTimeout(() => leftPiston.classList.remove('pushing'), 400);

    setTimeout(() => {
        animatePressure();
        updateFluidLevels();
        rightPiston.classList.add('rising');
        setTimeout(() => rightPiston.classList.remove('rising'), 500);
    }, 200);

    pressureValue.textContent = pressure;
    lawText.textContent = messages[Math.min(pushCount - 1, messages.length - 1)];
    factText.textContent = facts[Math.floor(Math.random() * facts.length)];

    if (pushCount === 3 && !quizStarted) {
        quizStarted = true;
        setTimeout(loadQuestion, 600);
    }

    if (pressure >= 10) {
        pushCount = 0;
        pressure = 0;
        setTimeout(() => {
            pressureValue.textContent = 0;
            leftFluid.style.height = '60px';
            rightFluid.style.height = '60px';
        }, 800);
    }
});

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        quizQuestion.textContent = "🎉 Amazing! You've completed all questions!";
        quizOptions.innerHTML = '';
        quizFeedback.textContent = `Final Score: ${score} / ${questions.length} ⭐`;
        nextBtn.style.display = 'none';
        return;
    }

    const q = questions[currentQuestion];
    quizQuestion.textContent = `Q${currentQuestion + 1}: ${q.q}`;
    quizFeedback.textContent = '';
    nextBtn.style.display = 'none';

    quizOptions.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.textContent = opt.replace(' ✅', '');
        btn.addEventListener('click', () => checkAnswer(i, q.answer));
        quizOptions.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    const buttons = quizOptions.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    if (selected === correct) {
        buttons[selected].classList.add('correct');
        quizFeedback.textContent = '✅ Correct! Well done!';
        score++;
        scoreEl.textContent = score;
    } else {
        buttons[selected].classList.add('wrong');
        buttons[correct].classList.add('correct');
        quizFeedback.textContent = '❌ Not quite! The green one is correct.';
    }

    nextBtn.style.display = 'inline-block';
}

nextBtn.addEventListener('click', () => {
    currentQuestion++;
    loadQuestion();
});

// Load first question on page load (after a short delay)
setTimeout(loadQuestion, 800);
