export class Store {
    constructor(storage = window.localStorage) {
        this.storage = storage;
        this.TASKS_KEY = 'focusflow_tasks_v2';
        this.PREFS_KEY = 'focusflow_prefs_v2';
    }

    getTasks() {
        try {
            const data = this.storage.getItem(this.TASKS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Storage read error", e);
            return [];
        }
    }

    saveTasks(tasks) {
        this.storage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    }

    getTheme() {
        return this.storage.getItem(this.PREFS_KEY) || 'dark';
    }

    setTheme(theme) {
        this.storage.setItem(this.PREFS_KEY, theme);
    }

    validateAndImport(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (!Array.isArray(data)) throw new Error("Imported data must be an array of tasks.");
            
            const validPriorities = ['Low', 'Medium', 'High'];
            const validated = data.map((task, index) => {
                if (!task.id || typeof task.id !== 'string') throw new Error(`Task at index ${index} missing valid ID.`);
                if (!task.title || typeof task.title !== 'string') throw new Error(`Task at index ${index} missing valid title.`);
                if (!validPriorities.includes(task.priority)) throw new Error(`Task '${task.title}' has invalid priority.`);
                if (typeof task.completed !== 'boolean') throw new Error(`Task '${task.title}' completion status must be boolean.`);
                
                return {
                    id: task.id,
                    title: task.title.trim(),
                    priority: task.priority,
                    dueDate: task.dueDate || null,
                    completed: task.completed,
                    createdAt: task.createdAt || new Date().toISOString()
                };
            });
            
            this.saveTasks(validated);
            return { success: true, count: validated.length };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    clearAll() {
        this.storage.removeItem(this.TASKS_KEY);
        this.storage.removeItem(this.PREFS_KEY);
    }
}
