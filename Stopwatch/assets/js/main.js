// State variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapCount = 0;

// DOM Elements
const display = document.getElementById('display');
const startStopBtn = document.getElementById('start-stop-btn');
const lapBtn = document.getElementById('lap-btn');
const resetBtn = document.getElementById('reset-btn');
const lapsList = document.getElementById('laps-list');
const themeToggle = document.getElementById('theme-toggle');

// ==================== TIME FORMATTING FUNCTION ====================
function formatTime(timeInMs) {
    let hrs = Math.floor(timeInMs / 3600000);
    let mins = Math.floor((timeInMs % 3600000) / 60000);
    let secs = Math.floor((timeInMs % 60000) / 1000);
    let ms = timeInMs % 1000;

    // Pad single digits with leading zeros
    const pad = (num, size = 2) => String(num).padStart(size, '0');

    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}<span class="ms">.${pad(ms, 3)}</span>`;
}

// ==================== CORE FUNCTIONS ====================
function updateDisplay() {
    const timeToRender = isRunning ? Date.now() - startTime + elapsedTime : elapsedTime;
    display.innerHTML = formatTime(timeToRender);
}

function startStop() {
    if (!isRunning) {
        // Start State
        startTime = Date.now();
        timerInterval = setInterval(updateDisplay, 10); // Update every 10ms for smooth rendering
        startStopBtn.textContent = 'Stop';
        startStopBtn.style.opacity = '0.85';
        lapBtn.disabled = false;
        isRunning = true;
    } else {
        // Stop State
        clearInterval(timerInterval);
        elapsedTime += Date.now() - startTime;
        startStopBtn.textContent = 'Start';
        startStopBtn.style.opacity = '1';
        isRunning = false;
    }
}

function reset() {
    clearInterval(timerInterval);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    lapCount = 0;
    
    display.innerHTML = "00:00:00<span class=\"ms\">.000</span>";
    startStopBtn.textContent = 'Start';
    lapBtn.disabled = true;
    lapsList.innerHTML = '';
}

function recordLap() {
    if (!isRunning) return;
    lapCount++;
    
    const currentLapTime = Date.now() - startTime + elapsedTime;
    const li = document.createElement('li');
    
    li.innerHTML = `
        <span class="lap-index">Lap ${String(lapCount).padStart(2, '0')}</span>
        <span>${formatTime(currentLapTime)}</span>
    `;
    
    // Prepend so the newest lap is always visible at the top
    lapsList.insertBefore(li, lapsList.firstChild);
}

// ==================== THEME TOGGLE ====================
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.querySelector('.mode-icon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// ==================== EVENT LISTENERS ====================
startStopBtn.addEventListener('click', startStop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', recordLap);