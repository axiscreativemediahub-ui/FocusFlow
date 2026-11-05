export class TaskManager {
    constructor(store) {
        this.store = store;
        this.tasks = this.store.getTasks();
    }

    addTask(title, priority, dueDate) {
        const task = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            title: title.trim(),
            priority,
            dueDate: dueDate || null,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.tasks.unshift(task);
        this.store.saveTasks(this.tasks);
        return task;
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.store.saveTasks(this.tasks);
        }
        return task;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.store.saveTasks(this.tasks);
    }

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const productivity = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { total, completed, productivity };
    }

    getFilteredTasks(filter) {
        if (filter === 'active') return this.tasks.filter(t => !t.completed);
        if (filter === 'completed') return this.tasks.filter(t => t.completed);
        return this.tasks;
    }

    loadDemoData() {
        const demoTasks = [
            { id: 'demo1', title: 'Complete competitive intelligence teardown', priority: 'High', completed: false, dueDate: new Date().toISOString().split('T')[0] },
            { id: 'demo2', title: 'Review DOOH network gaps', priority: 'Medium', completed: true, dueDate: null },
            { id: 'demo3', title: 'Plan Q4 gallery pop-up logistics', priority: 'High', completed: false, dueDate: null }
        ];
        this.tasks = demoTasks;
        this.store.saveTasks(this.tasks);
    }
}
