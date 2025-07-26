// ===== src/services/themeService.js =====
import { storageService } from './storageService.js';

export const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
    SYSTEM: 'system'
};

class ThemeService {
    constructor() {
        this.currentTheme = THEMES.SYSTEM;
        this.observers = [];
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

        this.init();
    }

    init() {
        // Load saved theme or default to system
        const savedTheme = storageService.getItem('theme');
        this.currentTheme = savedTheme || THEMES.SYSTEM;

        // Apply the theme
        this.applyTheme(this.currentTheme);

        // Listen for system theme changes
        this.mediaQuery.addEventListener('change', () => {
            if (this.currentTheme === THEMES.SYSTEM) {
                this.applyTheme(THEMES.SYSTEM);
                this.notify();
            }
        });
    }

    subscribe(callback) {
        this.observers.push(callback);
        return () => {
            this.observers = this.observers.filter(obs => obs !== callback);
        };
    }

    notify() {
        this.observers.forEach(callback => callback({
            currentTheme: this.currentTheme,
            effectiveTheme: this.getEffectiveTheme()
        }));
    }

    getEffectiveTheme() {
        if (this.currentTheme === THEMES.SYSTEM) {
            return this.mediaQuery.matches ? THEMES.LIGHT : THEMES.DARK;
        }
        return this.currentTheme;
    }

    setTheme(theme) {
        if (Object.values(THEMES).includes(theme)) {
            this.currentTheme = theme;
            this.applyTheme(theme);
            this.saveTheme(theme);
            this.notify();
        }
    }

    applyTheme(theme) {
        const html = document.documentElement;
        html.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            const effectiveTheme = this.getEffectiveTheme();
            metaThemeColor.setAttribute('content',
                effectiveTheme === THEMES.LIGHT ? '#ffffff' : '#1a1a1a'
            );
        }
    }

    saveTheme(theme) {
        storageService.setItem('theme', theme);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemeIcon(theme) {
        const icons = {
            [THEMES.DARK]: '🌙',
            [THEMES.LIGHT]: '☀️',
            [THEMES.SYSTEM]: '💻'
        };
        return icons[theme] || icons[THEMES.SYSTEM];
    }

    getThemeLabel(theme) {
        const labels = {
            [THEMES.DARK]: 'Dark',
            [THEMES.LIGHT]: 'Light',
            [THEMES.SYSTEM]: 'System'
        };
        return labels[theme] || labels[THEMES.SYSTEM];
    }
}

export const themeService = new ThemeService();