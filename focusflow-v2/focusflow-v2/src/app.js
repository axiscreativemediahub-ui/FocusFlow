import { Store } from './store.js';
import { TaskManager } from './tasks.js';
import { Timer } from './timer.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const store = new Store();
    const taskManager = new TaskManager(store);
    
    let uiInstance;
    const timer = new Timer(
        (timeStr) => {
            const display = document.getElementById('timer-display');
            if (display) display.textContent = timeStr;
            document.title = `${timeStr} | FocusFlow`;
        },
        () => {
            if(uiInstance) uiInstance.showError("Session Complete!", true);
            // Notification API requires user permission, handled safely if missing
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("FocusFlow Timer Complete!");
            }
        }
    );
    
    uiInstance = new UI(taskManager, timer, store);

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
});
