export class Timer {
    constructor(onTick, onComplete) {
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.durationMap = { pomodoro: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
        this.mode = 'pomodoro';
        this.duration = this.durationMap[this.mode];
        this.remaining = this.duration;
        this.isRunning = false;
        this.endTime = null;
        this.interval = null;
    }

    setMode(mode) {
        if (this.durationMap[mode]) {
            this.mode = mode;
            this.duration = this.durationMap[mode];
            this.reset();
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        // Rely on absolute timestamp for background reliability
        this.endTime = Date.now() + (this.remaining * 1000);
        
        this.interval = setInterval(() => {
            const now = Date.now();
            const left = Math.round((this.endTime - now) / 1000);
            
            if (left <= 0) {
                this.stop();
                this.remaining = 0;
                this.onTick(this.format(0));
                this.onComplete();
            } else {
                this.remaining = left;
                this.onTick(this.format(this.remaining));
            }
        }, 200); // Check frequently to update UI smoothly
    }

    pause() {
        if (!this.isRunning) return;
        this.isRunning = false;
        clearInterval(this.interval);
        // remaining is already accurate from the last interval tick
    }

    reset() {
        this.pause();
        this.remaining = this.duration;
        this.onTick(this.format(this.remaining));
    }

    format(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }
}
