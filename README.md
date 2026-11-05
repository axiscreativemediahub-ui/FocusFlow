FocusFlow V2
A complete, zero-dependency personal productivity dashboard built with semantic HTML, native CSS, and vanilla JavaScript ES Modules. Engineered for strict performance, data privacy, and accurate focus session management.
Features
Strict Data Validation: JSON import validates all schemas securely, preventing local storage corruption.
Offline First: Zero reliance on Tailwind CDNs or Google Fonts. Completely offline capable using system fonts.
Timestamp Timer: Pomodoro countdown relies on absolute timestamp calculation (`Date.now()`), entirely eliminating browser-throttling desync when the application tab is suspended.
Automated Testing: Business logic abstracted from the DOM allowing for clean execution of tests via Node.js native test runner.
Quick Start
Clone the repository: `git clone https://github.com/axiscreativemediahub-ui/focusflow.git`
Serve via a local web server (required for ES Modules to bypass CORS): `npx serve .` or `python -m http.server`
Run tests locally: `npm test`
F o c u s F l o w
