export class UI {
    constructor(taskManager, timer, store) {
        this.tm = taskManager;
        this.timer = timer;
        this.store = store;
        this.currentFilter = 'all';
        this.initDOM();
        this.bindEvents();
        this.render();
        this.applyTheme(this.store.getTheme());
    }

    initDOM() {
        this.els = {
            taskList: document.getElementById('task-list'),
            taskForm: document.getElementById('task-form'),
            titleInput: document.getElementById('task-title'),
            priorityInput: document.getElementById('task-priority'),
            dateInput: document.getElementById('task-date'),
            timerDisplay: document.getElementById('timer-display'),
            statTotal: document.getElementById('stat-total'),
            statCompleted: document.getElementById('stat-completed'),
            headerProd: document.getElementById('header-productivity'),
            errorToast: document.getElementById('error-message'),
            navBtns: document.querySelectorAll('.nav-btn'),
            views: document.querySelectorAll('.view-section'),
            viewTitle: document.getElementById('view-title')
        };
    }

    bindEvents() {
        // Navigation
        this.els.navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.els.navBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.els.views.forEach(v => v.classList.add('hidden'));
                document.getElementById(`view-${view}`).classList.remove('hidden');
                
                this.els.viewTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1);
            });
        });

        // Tasks
        this.els.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.tm.addTask(this.els.titleInput.value, this.els.priorityInput.value, this.els.dateInput.value);
            this.els.taskForm.reset();
            this.render();
        });

        this.els.taskList.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle-task')) {
                this.tm.toggleTask(e.target.dataset.id);
                this.render();
            } else if (e.target.classList.contains('delete-task')) {
                this.tm.deleteTask(e.target.dataset.id);
                this.render();
            }
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        // Timer
        document.getElementById('btn-pomodoro').addEventListener('click', () => this.timer.setMode('pomodoro'));
        document.getElementById('btn-short-break').addEventListener('click', () => this.timer.setMode('shortBreak'));
        document.getElementById('btn-long-break').addEventListener('click', () => this.timer.setMode('longBreak'));
        
        document.getElementById('btn-timer-start').addEventListener('click', (e) => {
            if (this.timer.isRunning) {
                this.timer.pause();
                e.target.textContent = 'Resume';
            } else {
                this.timer.start();
                e.target.textContent = 'Pause';
            }
        });
        document.getElementById('btn-timer-reset').addEventListener('click', () => {
            this.timer.reset();
            document.getElementById('btn-timer-start').textContent = 'Start';
        });

        // Settings & Data
        document.getElementById('toggle-theme').addEventListener('click', () => {
            const newTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            this.applyTheme(newTheme);
            this.store.setTheme(newTheme);
        });

        document.getElementById('btn-export').addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.tm.tasks, null, 2));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", "focusflow_backup.json");
            dlAnchorElem.click();
        });

        document.getElementById('file-import').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = this.store.validateAndImport(event.target.result);
                if (result.success) {
                    this.tm.tasks = this.store.getTasks();
                    this.showError(`Successfully imported ${result.count} tasks.`, true);
                    this.render();
                } else {
                    this.showError(`Import failed: ${result.error}`);
                }
            };
            reader.readAsText(file);
        });

        document.getElementById('btn-load-demo').addEventListener('click', () => {
            this.tm.loadDemoData();
            this.render();
            this.showError("Demo data loaded.", true);
        });

        document.getElementById('btn-clear-data').addEventListener('click', () => {
            if(confirm("Are you sure you want to permanently delete all data?")) {
                this.store.clearAll();
                this.tm.tasks = [];
                this.render();
            }
        });
    }

    applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
    }

    showError(msg, isSuccess = false) {
        this.els.errorToast.textContent = msg;
        this.els.errorToast.style.backgroundColor = isSuccess ? 'var(--success)' : 'var(--danger)';
        this.els.errorToast.classList.remove('hidden');
        setTimeout(() => this.els.errorToast.classList.add('hidden'), 4000);
    }

    render() {
        // Render Tasks
        const tasks = this.tm.getFilteredTasks(this.currentFilter);
        this.els.taskList.innerHTML = tasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="toggle-task" data-id="${task.id}" ${task.completed ? 'checked' : ''} aria-label="Toggle completion">
                <div class="task-content" style="flex-grow:1;">
                    <div class="task-text">${this.escapeHTML(task.title)}</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.25rem;">
                        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                        ${task.dueDate ? `<span style="margin-left:0.5rem;">Due: ${this.escapeHTML(task.dueDate)}</span>` : ''}
                    </div>
                </div>
                <button class="danger-btn delete-task" data-id="${task.id}" aria-label="Delete task">Delete</button>
            </li>
        `).join('');

        // Render Stats
        const stats = this.tm.getStats();
        this.els.statTotal.textContent = stats.total;
        this.els.statCompleted.textContent = stats.completed;
        this.els.headerProd.textContent = `Productivity: ${stats.productivity}%`;
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}
