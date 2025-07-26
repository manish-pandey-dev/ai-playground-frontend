// ===== src/main.js (Updated for Routing) =====
import { App } from './App.js';
import { JigyasaPage } from './pages/JigyasaPage.js';
import { router } from './services/router.js';
import './styles/main.css';

// Register routes
router.addRoute('/', App, 'AI Playground - Chat with Multiple AI Models');
router.addRoute('/jigyasa', JigyasaPage, 'Jigyasa - Audio Q&A Generator');

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧠 AI Playground v3.0 - Built for Devanshi and friends! ✨');
    console.log('🎙️ Jigyasa - Audio Q&A Generator added! 🎉');

    // Router will auto-initialize and load the correct route
});