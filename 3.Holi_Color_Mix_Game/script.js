// Game state
let gameActive = false;
let score = 0;
let timeLeft = 60;
let timer;
let currentTarget;

// Color combinations
const colorMixes = {
    'red,blue': 'purple',
    'blue,red': 'purple',
    'blue,yellow': 'green',
    'yellow,blue': 'green',
    'red,yellow': 'orange',
    'yellow,red': 'orange'
};

const targetColors = [
    { name: 'Purple', rgb: '#800080', mix: ['red', 'blue'] },
    { name: 'Green', rgb: '#008000', mix: ['blue', 'yellow'] },
    { name: 'Orange', rgb: '#FFA500', mix: ['red', 'yellow'] }
];

// DOM Elements
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const mixingBowl = document.getElementById('mixing-bowl');
const startButton = document.getElementById('start-game');
const resetMixButton = document.getElementById('reset-mix');
const gameOverModal = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const playAgainButton = document.getElementById('play-again');
const targetColorName = document.getElementById('target-color-name');
const targetColorDisplay = document.getElementById('target-color-display');

// Current mixing state
let currentMix = [];

// Game functions
function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 60;
    updateScore();
    setNewTarget();
    startTimer();
    startButton.disabled = true;
    gameOverModal.classList.add('hidden');
}

function endGame() {
    gameActive = false;
    clearInterval(timer);
    finalScoreElement.textContent = score;
    gameOverModal.classList.remove('hidden');
    startButton.disabled = false;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function setNewTarget() {
    currentTarget = targetColors[Math.floor(Math.random() * targetColors.length)];
    targetColorName.textContent = currentTarget.name;
    targetColorDisplay.style.backgroundColor = currentTarget.rgb;
}

function updateScore() {
    scoreElement.textContent = score;
}

function createSplashEffect(x, y, color) {
    const splash = document.createElement('div');
    splash.className = 'splash';
    splash.style.left = `${x}px`;
    splash.style.top = `${y}px`;
    splash.style.backgroundColor = color;
    document.body.appendChild(splash);
    setTimeout(() => splash.remove(), 500);
}

// Event Listeners
startButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', startGame);

resetMixButton.addEventListener('click', () => {
    currentMix = [];
    mixingBowl.style.backgroundColor = '#ffffff';
    mixingBowl.innerHTML = '<p>Drop colors here to mix!</p>';
});

// Drag and Drop functionality
const colors = document.querySelectorAll('.color');

colors.forEach(color => {
    color.addEventListener('dragstart', (e) => {
        if (!gameActive) return;
        e.dataTransfer.setData('color', color.dataset.color);
    });
});

mixingBowl.addEventListener('dragover', (e) => {
    if (!gameActive) return;
    e.preventDefault();
    mixingBowl.classList.add('active');
});

mixingBowl.addEventListener('dragleave', () => {
    mixingBowl.classList.add('active');
});

mixingBowl.addEventListener('drop', (e) => {
    if (!gameActive) return;
    e.preventDefault();
    mixingBowl.classList.remove('active');

    const color = e.dataTransfer.getData('color');
    if (currentMix.length >= 2) return;

    currentMix.push(color);
    createSplashEffect(e.clientX, e.clientY, color);

    if (currentMix.length === 2) {
        const mixResult = colorMixes[currentMix.join(',')];
        if (mixResult === currentTarget.name.toLowerCase()) {
            // Correct mix
            score += 10;
            updateScore();
            mixingBowl.style.backgroundColor = currentTarget.rgb;
            setTimeout(() => {
                currentMix = [];
                mixingBowl.style.backgroundColor = '#ffffff';
                mixingBowl.innerHTML = '<p>Drop colors here to mix!</p>';
                setNewTarget();
            }, 1000);
        } else {
            // Wrong mix
            score = Math.max(0, score - 5);
            updateScore();
            mixingBowl.style.backgroundColor = '#ff0000';
            setTimeout(() => {
                currentMix = [];
                mixingBowl.style.backgroundColor = '#ffffff';
                mixingBowl.innerHTML = '<p>Drop colors here to mix!</p>';
            }, 1000);
        }
    } else {
        mixingBowl.style.backgroundColor = color;
    }
});

// How to play modal
const howToPlayButton = document.getElementById('how-to-play');
howToPlayButton.addEventListener('click', () => {
    alert(`
        How to Play:
        1. Drag and drop colors into the mixing bowl
        2. Mix two colors to match the target color
        3. Correct mix = +10 points
        4. Wrong mix = -5 points
        5. Complete as many matches as you can in 60 seconds!
    `);
});