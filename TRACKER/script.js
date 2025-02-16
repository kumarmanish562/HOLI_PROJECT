// app.js
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Initialize all components
  initializeTaskManager();
  initializeTimer();
  initializeCharts();
  
  // Event listeners for theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  themeToggle.addEventListener('click', toggleTheme);
  
  // Event listeners for add task button
  const addTaskBtn = document.querySelector('.add-task-btn');
  const modal = document.getElementById('addTaskModal');
  const closeButtons = document.querySelectorAll('.close-modal');
  
  addTaskBtn.addEventListener('click', () => {
      modal.style.display = 'block';
  });
  
  closeButtons.forEach(button => {
      button.addEventListener('click', () => {
          modal.style.display = 'none';
      });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
      if (e.target === modal) {
          modal.style.display = 'none';
      }
  });

  // Initialize form submission
  const addTaskForm = document.getElementById('addTaskForm');
  addTaskForm.addEventListener('submit', handleTaskSubmission);
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const icon = this.querySelector('i');
  icon.classList.toggle('fa-moon');
  icon.classList.toggle('fa-sun');
}

// timer.js
class Timer {
  constructor() {
      this.time = 0;
      this.isRunning = false;
      this.display = document.querySelector('.timer-display');
      this.startBtn = document.querySelector('.timer-btn.start');
      this.pauseBtn = document.querySelector('.timer-btn.pause');
      this.resetBtn = document.querySelector('.timer-btn.reset');
      this.interval = null;
      this.currentTask = null;
      
      this.initializeControls();
  }
  
  initializeControls() {
      this.startBtn.addEventListener('click', () => this.start());
      this.pauseBtn.addEventListener('click', () => this.pause());
      this.resetBtn.addEventListener('click', () => this.reset());
  }
  
  start() {
      if (!this.isRunning) {
          this.isRunning = true;
          this.interval = setInterval(() => {
              this.time++;
              this.updateDisplay();
          }, 1000);
          this.startBtn.style.display = 'none';
          this.pauseBtn.style.display = 'inline-block';
      }
  }
  
  pause() {
      if (this.isRunning) {
          this.isRunning = false;
          clearInterval(this.interval);
          this.startBtn.style.display = 'inline-block';
          this.pauseBtn.style.display = 'none';
      }
  }
  
  reset() {
      this.pause();
      this.time = 0;
      this.updateDisplay();
      if (this.currentTask) {
          this.saveTaskTime();
      }
  }
  
  updateDisplay() {
      const hours = Math.floor(this.time / 3600);
      const minutes = Math.floor((this.time % 3600) / 60);
      const seconds = this.time % 60;
      
      this.display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  setTask(task) {
      if (this.currentTask) {
          this.saveTaskTime();
      }
      this.currentTask = task;
      this.reset();
  }

  saveTaskTime() {
      if (this.currentTask && this.time > 0) {
          const taskData = JSON.parse(localStorage.getItem('taskTimes')) || {};
          if (!taskData[this.currentTask.id]) {
              taskData[this.currentTask.id] = 0;
          }
          taskData[this.currentTask.id] += this.time;
          localStorage.setItem('taskTimes', JSON.stringify(taskData));
          updateTimeDistribution();
      }
  }
}

// tasks.js
class TaskManager {
  constructor() {
      this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      this.taskGrid = document.querySelector('.task-grid');
      this.timer = new Timer();
  }

  addTask(taskData) {
      const task = {
          id: Date.now(),
          name: taskData.name,
          duration: taskData.duration,
          priority: taskData.priority,
          completed: false,
          timeSpent: 0,
          createdAt: new Date().toISOString()
      };

      this.tasks.push(task);
      this.saveTasks();
      this.renderTask(task);
  }

  renderTask(task) {
      const taskElement = document.createElement('div');
      taskElement.className = 'task-card';
      taskElement.innerHTML = `
          <h3>${task.name}</h3>
          <p>Expected: ${task.duration} minutes</p>
          <p>Priority: ${task.priority}</p>
          <div class="task-progress">
              <div class="progress-bar" style="width: ${(task.timeSpent / (task.duration * 60)) * 100}%"></div>
          </div>
          <div class="task-actions">
              <button class="start-task-btn" data-id="${task.id}">
                  <i class="fas fa-play"></i> Start
              </button>
              <button class="complete-task-btn" data-id="${task.id}" ${task.completed ? 'disabled' : ''}>
                  <i class="fas fa-check"></i> Complete
              </button>
          </div>
      `;

      this.taskGrid.appendChild(taskElement);
      this.attachTaskListeners(taskElement, task);
  }

  attachTaskListeners(element, task) {
      const startBtn = element.querySelector('.start-task-btn');
      const completeBtn = element.querySelector('.complete-task-btn');

      startBtn.addEventListener('click', () => {
          this.timer.setTask(task);
          document.querySelectorAll('.start-task-btn').forEach(btn => {
              btn.classList.remove('active');
          });
          startBtn.classList.add('active');
      });

      completeBtn.addEventListener('click', () => {
          task.completed = true;
          this.saveTasks();
          completeBtn.disabled = true;
          element.classList.add('completed');
      });
  }

  saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}

// charts.js
function initializeCharts() {
  const ctx = document.querySelector('.distribution-chart').getContext('2d');
  window.timeDistributionChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: [],
          datasets: [{
              data: [],
              backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF'
              ]
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false
      }
  });
}

function updateTimeDistribution() {
  const taskTimes = JSON.parse(localStorage.getItem('taskTimes')) || {};
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  const labels = [];
  const data = [];
  
  tasks.forEach(task => {
      if (taskTimes[task.id]) {
          labels.push(task.name);
          data.push(taskTimes[task.id]);
      }
  });

  window.timeDistributionChart.data.labels = labels;
  window.timeDistributionChart.data.datasets[0].data = data;
  window.timeDistributionChart.update();
}

// Form handling
function handleTaskSubmission(e) {
  e.preventDefault();
  
  const taskData = {
      name: document.getElementById('taskName').value,
      duration: parseInt(document.getElementById('taskDuration').value),
      priority: document.getElementById('taskPriority').value
  };

  const taskManager = new TaskManager();
  taskManager.addTask(taskData);

  // Reset form and close modal
  e.target.reset();
  document.getElementById('addTaskModal').style.display = 'none';
}

// Initialize components
function initializeTaskManager() {
  const taskManager = new TaskManager();
  taskManager.tasks.forEach(task => taskManager.renderTask(task));
}

function initializeTimer() {
  window.timer = new Timer();
}