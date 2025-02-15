// Game configuration
const config = {
    gameDuration: 60,
    baseScore: 10,
    penaltyScore: 5,
    comboThreshold: 2,
    comboMultiplier: 2,
    levels: {
        1: { requiredScore: 0, timeLimit: 60 },
        2: { requiredScore: 50, timeLimit: 55 },
        3: { requiredScore: 100, timeLimit: 50 },
        4: { requiredScore: 200, timeLimit: 45 },
        5: { requiredScore: 300, timeLimit: 40 }
    }
};

// Game state
let gameState = {
    score: 0,
    highScore: localStorage.getItem('holiGameHighScore') || 0,
    level: 1,
    timeLeft: config.gameDuration,
    isActive: false,
    comboCount: 0,
    currentMix: [],
    powerUps: {
        timeBoost: { active: false, cooldown: false },
        scoreMultiplier: { active: false, cooldown: false }
    }
};

// Color combinations and their results
const colorMixes = {
    'red,blue': { name: 'Purple', rgb: '#800080' },
    'blue,red': { name: 'Purple', rgb: '#800080' },
    'blue,yellow': { name: 'Green', rgb: '#008000' },
    'yellow,blue': { name: 'Green', rgb: '#008000' },
    'red,yellow': { name: 'Orange', rgb: '#FFA500' },
    'yellow,red': { name: 'Orange', rgb: '#FFA500' }
};

// DOM Elements
const elements = {
    score: document.getElementById('score'),
    highScore: document.getElementById('high-score'),
    level: document.getElementById('level'),
    timer: document.getElementById('timer'),
    timeProgress: document.getElementById('time-progress'),
    mixingBowl: document.getElementById('mixing-bowl'),
    targetColorDisplay: document.getElementById('target-color-display'),
    targetColorName: document.getElementById('target-color-name'),
    startButton: document.getElementById('start-game'),
    resetMixButton: document.getElementById('reset-mix'),
    comboDisplay: document.getElementById('combo-display'),
    comboCount: document.getElementById('combo-count'),
    gameOverModal: document.getElementById('game-over'),
    finalScore: document.getElementById('final-score'),
    playAgainButton: document.getElementById('play-again'),
    shareScoreButton: document.getElementById('share-score'),
    timeBoostButton: document.getElementById('time-boost'),
    scoreMultiplierButton: document.getElementById('score-multiplier'),
    musicToggle: document.getElementById('toggle-music'),
    tutorial: document.getElementById('tutorial')
};

// Initialize particles.js
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        move: {
            enable: true,
            speed: 3,
            direction: "none",
            random: true,
            out_mode: "out"
        }
    }
});

// Sound effects
const sounds = {
    background: new Audio('path/to/background-music.mp3'),
    correct: new Audio('path/to/correct.mp3'),
    wrong: new Audio('path/to/wrong.mp3'),
    combo: new Audio('path/to/combo.mp3'),
    gameOver: new Audio('path/to/game-over.mp3')
};

// Game functions
function startGame() {
    gameState = {
        ...gameState,
        score: 0,
        level: 1,
        timeLeft: config.levels[1].timeLimit,
        isActive: true,
        comboCount: 0,
        currentMix: []
    };
    
    updateUI();
    setNewTarget();
    startTimer();
    elements.startButton.disabled = true;
    elements.gameOverModal.classList.add('hidden');
    enablePowerUps();
}

function endGame() {
    gameState.isActive = false;
    sounds.gameOver.play();
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('holiGameHighScore', gameState.score);
    }
    
    elements.finalScore.textContent = gameState.score;
    elements.gameOverModal.classList.remove('hidden');
    elements.startButton.disabled = false;
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (!gameState.isActive) {
            clearInterval(timerInterval);
            return;
        }

        gameState.timeLeft--;
        updateTimerUI();

        if (gameState.timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function updateTimerUI() {
    elements.timer.textContent = gameState.timeLeft;
    elements.timeProgress.style.width = `${(gameState.timeLeft / config.levels[gameState.level].timeLimit) * 100}%`;
}

function setNewTarget() {
    const targets = Object.values(colorMixes);
    const randomTarget = targets[Math.floor(Math.random() * targets.length)];
    elements.targetColorDisplay.style.backgroundColor = randomTarget.rgb;
    elements.targetColorName.textContent = randomTarget.name;
}

// Drag and Drop handlers
elements.mixingBowl.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.mixingBowl.classList.add('active');
});

elements.mixingBowl.addEventListener('dragleave', () => {
    elements.mixingBowl.classList.remove('active');
});

elements.mixingBowl.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!gameState.isActive) return;

    elements.mixingBowl.classList.remove('active');
    const color = e.dataTransfer.getData('color');
    handleColorDrop(color);
});

function handleColorDrop(color) {
    if (gameState.currentMix.length >= 2) return;

    gameState.currentMix.push(color);
    createSplashEffect(elements.mixingBowl);
    updateMixingBowlDisplay();

    if (gameState.currentMix.length === 2) {
        checkMixResult();
    }
}

function checkMixResult() {
    const mixKey = gameState.currentMix.join(',');
    const targetColor = elements.targetColorName.textContent;
    const mixed = colorMixes[mixKey];

    if (mixed && mixed.name === targetColor) {
        handleCorrectMix();
    } else {
        handleWrongMix();
    }
}

function handleCorrectMix() {
    sounds.correct.play();
    gameState.comboCount++;
    
    let points = config.baseScore;
    if (gameState.comboCount >= config.comboThreshold) {
        points *= config.comboMultiplier;
        showComboEffect();
    }
    
    if (gameState.powerUps.scoreMultiplier.active) {
        points *= 2;
    }
    
    gameState.score += points;
    checkLevelProgress();
    updateUI();
    
    setTimeout(() => {
        resetMix();
        setNewTarget();
    }, 1000);
}

function handleWrongMix() {
    sounds.wrong.play();
    gameState.score = Math.max(0, gameState.score - config.penaltyScore);
    gameState.comboCount = 0;
    updateUI();
    
    elements.mixingBowl.classList.add('shake');
    setTimeout(() => {
        elements.mixingBowl.classList.remove('shake');
        resetMix();
    }, 1000);
}

function checkLevelProgress() {
    const nextLevel = gameState.level + 1;
    if (config.levels[nextLevel] && gameState.score >= config.levels[nextLevel].requiredScore) {
        gameState.level = nextLevel;
        showLevelUpEffect();
    }
}

// Visual effects
function createSplashEffect(element) {
    const splash = document.createElement('div');
    splash.className = 'ripple-effect';
    element.appendChild(splash);
    setTimeout(() => splash.remove(), 1000);
}

function showComboEffect() {
    elements.comboCount.textContent = gameState.comboCount;
    elements.comboDisplay.classList.remove('hidden');
    setTimeout(() => {
        elements.comboDisplay.classList.add('hidden');
    }, 2000);
}

function showLevelUpEffect() {
    const levelUp = document.createElement('div');
    levelUp.className = 'level-up-effect';
    levelUp.textContent = `Level ${gameState.level}!`;
    document.body.appendChild(levelUp);
    setTimeout(() => levelUp.remove(), 2000);
}

// Power-ups
function enablePowerUps() {
    elements.timeBoostButton.disabled = false;
    elements.scoreMultiplierButton.disabled = false;
}

elements.timeBoostButton.addEventListener('click', () => {
    if (!gameState.powerUps.timeBoost.cooldown) {
        activateTimeBoost();
    }
});

elements.scoreMultiplierButton.addEventListener('click', () => {
    if (!gameState.powerUps.scoreMultiplier.cooldown) {
        activateScoreMultiplier();
    }
});

function activateTimeBoost() {
    gameState.timeLeft += 10;
    gameState.powerUps.timeBoost.cooldown = true;
    elements.timeBoostButton.disabled = true;
    updateTimerUI();
    
    setTimeout(() => {
        gameState.powerUps.timeBoost.cooldown = false;
        elements.timeBoostButton.disabled = false;
    }, 30000);
}

function activateScoreMultiplier() {
    gameState.powerUps.scoreMultiplier.active = true;
    gameState.powerUps.scoreMultiplier.cooldown = true;
    elements.scoreMultiplierButton.disabled = true;
    
    setTimeout(() => {
        gameState.powerUps.scoreMultiplier.active = false;
    }, 10000);
    
    setTimeout(() => {
        gameState.powerUps.scoreMultiplier.cooldown = false;
        elements.scoreMultiplierButton.disabled = false;
    }, 30000);
}

// UI Updates
function updateUI() {
    elements.score.textContent = gameState.score;
    elements.highScore.textContent = gameState.highScore;
    elements.level.textContent = gameState.level;
}

function resetMix() {
    gameState.currentMix = [];
    elements.mixingBowl.style.backgroundColor = '#ffffff';
    elements.mixingBowl.innerHTML = '<div class="bowl-content"><p>Drop colors here to mix!</p></div>';
}

// Event Listeners
elements.startButton.addEventListener('click', startGame);
elements.playAgainButton.addEventListener('click', startGame);
elements.resetMixButton.addEventListener('click', resetMix);
elements.shareScoreButton.addEventListener('click', () => {
    // Implement share functionality
});

elements.musicToggle.addEventListener('click', () => {
    if (sounds.background.paused) {
        sounds.background.play();
        sounds.background.loop = true;
    } else {
        sounds.background.pause();
    }
});

// Initialize drag events for colors
document.querySelectorAll('.color').forEach(color => {
    color.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('color', color.dataset.color);
    });
});

// Initialize the game
updateUI();
showTutorial();