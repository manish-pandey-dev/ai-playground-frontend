// ===== src/components/layout/Header.js (Updated with Hamburger Menu) =====
import { settingsStore } from '../../stores/settingsStore.js';
import { appStore } from '../../stores/appStore.js';
import { ThemeSwitcher } from '../common/ThemeSwitcher.js';
import { HamburgerMenu } from './HamburgerMenu.js';

export class Header {
    constructor() {
        // Get header elements
        this.element = document.querySelector('.header');
        this.requestsEl = document.getElementById('requests-remaining');
        this.dailyUsedEl = document.getElementById('daily-used');
        this.rateLimitEl = document.getElementById('rate-limit');
        this.tokensDisplayEl = document.getElementById('tokens-display');

        // Initialize
        this.init();
        this.addHamburgerMenu();
        this.addThemeSwitcher();
    }

    init() {
        // Subscribe to app store for stats updates
        this.unsubscribeAppStore = appStore.subscribe(state => {
            if (state.stats) {
                this.updateStats(state.stats);
            }
        });

        // Subscribe to settings store for token display updates
        this.unsubscribeSettingsStore = settingsStore.subscribe(settings => {
            if (this.tokensDisplayEl) {
                this.tokensDisplayEl.textContent = settings.maxTokens;
            }
        });

        // Initial token display update
        const currentSettings = settingsStore.getSettings();
        if (this.tokensDisplayEl && currentSettings.maxTokens) {
            this.tokensDisplayEl.textContent = currentSettings.maxTokens;
        }
    }

    addHamburgerMenu() {
        // Find logo section to add hamburger menu before the logo
        const logoSection = this.element?.querySelector('.logo-section');

        if (logoSection) {
            // Create hamburger menu
            this.hamburgerMenu = new HamburgerMenu();

            // Insert hamburger menu at the beginning of logo section
            logoSection.insertBefore(this.hamburgerMenu.render(), logoSection.firstChild);
        } else {
            console.warn('Logo section not found. Hamburger menu not added.');
        }
    }

    addThemeSwitcher() {
        // Find header controls container
        const headerControls = this.element?.querySelector('.header-controls') ||
                              this.element?.querySelector('.header__controls');

        if (headerControls) {
            // Create theme switcher
            this.themeSwitcher = new ThemeSwitcher();

            // Find settings button to insert before it
            const settingsBtn = document.getElementById('settings-btn');

            if (settingsBtn) {
                // Insert theme switcher before settings button
                headerControls.insertBefore(this.themeSwitcher.render(), settingsBtn);
            } else {
                // If no settings button, just append to header controls
                headerControls.appendChild(this.themeSwitcher.render());
            }
        } else {
            console.warn('Header controls container not found. Theme switcher not added.');
        }
    }

    updateStats(stats) {
        try {
            // Update requests remaining
            if (this.requestsEl && stats.daily_requests_remaining !== undefined) {
                const remaining = stats.daily_requests_remaining;
                this.requestsEl.textContent = `${remaining} left`;

                // Optional: Add color coding based on remaining requests
                if (remaining < 10) {
                    this.requestsEl.style.color = 'var(--error-color)';
                } else if (remaining < 50) {
                    this.requestsEl.style.color = 'var(--warning-color)';
                } else {
                    this.requestsEl.style.color = 'var(--success-color)';
                }
            }

            // Update daily used
            if (this.dailyUsedEl && stats.daily_requests_used !== undefined) {
                this.dailyUsedEl.textContent = stats.daily_requests_used;
            }

            // Update rate limit
            if (this.rateLimitEl && stats.rate_limit_per_ip_per_hour !== undefined) {
                this.rateLimitEl.textContent = stats.rate_limit_per_ip_per_hour;
            }

        } catch (error) {
            console.error('Error updating header stats:', error);
        }
    }

    // Cleanup method
    destroy() {
        // Unsubscribe from stores to prevent memory leaks
        if (this.unsubscribeAppStore) {
            this.unsubscribeAppStore();
        }
        if (this.unsubscribeSettingsStore) {
            this.unsubscribeSettingsStore();
        }

        // Cleanup components
        if (this.themeSwitcher && typeof this.themeSwitcher.destroy === 'function') {
            this.themeSwitcher.destroy();
        }
        if (this.hamburgerMenu && typeof this.hamburgerMenu.destroy === 'function') {
            this.hamburgerMenu.destroy();
        }
    }
}