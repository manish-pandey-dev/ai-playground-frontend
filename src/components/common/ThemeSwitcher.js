// ===== src/components/common/ThemeSwitcher.js =====
import { themeService, THEMES } from '../../services/themeService.js';

export class ThemeSwitcher {
    constructor() {
        this.isOpen = false;
        this.currentTheme = themeService.getCurrentTheme();

        this.element = this.createElement();
        this.button = this.element.querySelector('.theme-switcher__button');
        this.dropdown = this.element.querySelector('.theme-switcher__dropdown');

        this.attachEventListeners();
        this.updateButton();

        // Subscribe to theme changes
        themeService.subscribe((themeState) => {
            this.currentTheme = themeState.currentTheme;
            this.updateButton();
            this.updateActiveOption();
        });
    }

    createElement() {
        const container = document.createElement('div');
        container.className = 'theme-switcher';

        container.innerHTML = `
            <button class="theme-switcher__button">
                <span class="theme-switcher__icon">${themeService.getThemeIcon(this.currentTheme)}</span>
                <span class="theme-switcher__label">${themeService.getThemeLabel(this.currentTheme)}</span>
                <span class="theme-switcher__arrow">▼</span>
            </button>
            <div class="theme-switcher__dropdown">
                ${Object.values(THEMES).map(theme => `
                    <button class="theme-switcher__option" data-theme="${theme}">
                        <span class="theme-switcher__icon">${themeService.getThemeIcon(theme)}</span>
                        <span>${themeService.getThemeLabel(theme)}</span>
                    </button>
                `).join('')}
            </div>
        `;

        return container;
    }

    attachEventListeners() {
        // Toggle dropdown
        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Handle option selection
        this.dropdown.addEventListener('click', (e) => {
            const option = e.target.closest('.theme-switcher__option');
            if (option) {
                const theme = option.getAttribute('data-theme');
                themeService.setTheme(theme);
                this.close();
            }
        });

        // Close on outside click
        document.addEventListener('click', () => {
            if (this.isOpen) {
                this.close();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    updateButton() {
        const icon = this.button.querySelector('.theme-switcher__icon');
        const label = this.button.querySelector('.theme-switcher__label');

        icon.textContent = themeService.getThemeIcon(this.currentTheme);
        label.textContent = themeService.getThemeLabel(this.currentTheme);
    }

    updateActiveOption() {
        const options = this.dropdown.querySelectorAll('.theme-switcher__option');
        options.forEach(option => {
            const theme = option.getAttribute('data-theme');
            if (theme === this.currentTheme) {
                option.classList.add('is-active');
            } else {
                option.classList.remove('is-active');
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.dropdown.classList.add('is-open');
        this.updateActiveOption();
    }

    close() {
        this.isOpen = false;
        this.dropdown.classList.remove('is-open');
    }

    render() {
        return this.element;
    }
}