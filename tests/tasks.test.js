import test from 'node:test';
import assert from 'node:assert';
import { Store } from '../src/store.js';
import { TaskManager } from '../src/tasks.js';

class MockStorage {
    constructor() { this.data = new Map(); }
    getItem(key) { return this.data.get(key) || null; }
    setItem(key, val) { this.data.set(key, String(val)); }
    removeItem(key) { this.data.delete(key); }
}

test('TaskManager: Adds and filters tasks correctly', (t) => {
    const store = new Store(new MockStorage());
    const tm = new TaskManager(store);
    
    const task1 = tm.addTask("Audit repository", "High", "2026-12-01");
    const task2 = tm.addTask("Update DOOH specs", "Medium", null);
    
    tm.toggleTask(task1.id); // Complete task 1
    
    assert.strictEqual(tm.tasks.length, 2);
    assert.strictEqual(tm.getFilteredTasks('completed').length, 1);
    assert.strictEqual(tm.getFilteredTasks('active').length, 1);
    
    const stats = tm.getStats();
    assert.strictEqual(stats.total, 2);
    assert.strictEqual(stats.completed, 1);
    assert.strictEqual(stats.productivity, 50);
});
