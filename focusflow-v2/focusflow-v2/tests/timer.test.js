import test from 'node:test';
import assert from 'node:assert';
import { Timer } from '../src/timer.js';

test('Timer: Format conversion is correct', (t) => {
    const timer = new Timer(() => {}, () => {});
    assert.strictEqual(timer.format(1500), "25:00");
    assert.strictEqual(timer.format(305), "05:05");
    assert.strictEqual(timer.format(0), "00:00");
});

test('Timer: Mode switching resets duration', (t) => {
    const timer = new Timer(() => {}, () => {});
    assert.strictEqual(timer.mode, 'pomodoro');
    assert.strictEqual(timer.remaining, 1500);
    
    timer.setMode('shortBreak');
    assert.strictEqual(timer.mode, 'shortBreak');
    assert.strictEqual(timer.remaining, 300);
});
