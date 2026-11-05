# Security Policy

## Supported Versions

| Version | Supported |
| :--- | :--- |
| 2.0.x | ✅ |
| 1.0.x | ❌ |

## Security Controls

- **Cross-Site Scripting (XSS) Mitigation:** All dynamic user input rendered into the DOM uses `textContent` abstraction (via `escapeHTML` methods) to prevent arbitrary script execution.
- **No Backend:** FocusFlow operates entirely client-side. No user data is transmitted over the network.
- **Import Validation:** JSON imports undergo strict structural parsing to prevent malicious object prototype pollution or corrupted UI state.
