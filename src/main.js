// ===== src/main.js =====
import { App } from './App.js';
import '@styles/main.css';

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Add version info to console
console.log(`🧠 AI Playground v${__APP_VERSION__} - Built ${__BUILD_DATE__}`);
console.log('Built with ❤️ for Devanshi and friends! ✨');