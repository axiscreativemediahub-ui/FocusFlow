import test from 'node:test';
import assert from 'node:assert';
import { Store } from '../src/store.js';

// Mock localStorage for Node environment
class MockStorage {
    constructor() { this.data = new Map(); }
    getItem(key) { return this.data.get(key) || null; }
    setItem(key, val) { this.data.set(key, String(val)); }
    removeItem(key) { this.data.delete(key); }
}

test('Store: validateAndImport rejects malformed JSON', (t) => {
    const store = new Store(new MockStorage());
    const result = store.validateAndImport('{"not":"an array"}');
    assert.strictEqual(result.success, false);
    assert.match(result.error, /must be an array/);
});

test('Store: validateAndImport rejects invalid priority', (t) => {
    const store = new Store(new MockStorage());
    const badData = JSON.stringify([{ id: "1", title: "Test", priority: "SuperHigh", completed: false }]);
    const result = store.validateAndImport(badData);
    assert.strictEqual(result.success, false);
    assert.match(result.error, /invalid priority/);
});

test('Store: validateAndImport succeeds with valid data', (t) => {
    const store = new Store(new MockStorage());
    const goodData = JSON.stringify([{ id: "1", title: "Valid Task", priority: "High", completed: true }]);
    const result = store.validateAndImport(goodData);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.count, 1);
});
