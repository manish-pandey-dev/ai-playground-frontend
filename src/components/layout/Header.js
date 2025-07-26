// ===== src/components/layout/Header.js (Updated to include theme switcher) =====
import { settingsStore } from '../../stores/settingsStore.js';
import { appStore } from '../../stores/appStore.js';
import { ThemeSwitcher } from '../common/ThemeSwitcher.js';

export class Header {
    constructor() {
        this.element = document.querySelector('.header');
        this.requestsEl = document.getElementById('requests-remaining');
        this.dailyUsedEl = document.getElementById('daily-used');
        this.rateLimitEl = document.getElementById('rate-limit');
        this.tokensDisplayEl = document.getElementById('tokens-display');

        this.init();
        this.addThemeSwitcher();
    }

    init() {
        appStore.subscribe(state => {
            if (state.stats) {
                this.updateStats(state.stats);
            }
        });

        settingsStore.subscribe(settings => {
            if (this.tokensDisplayEl) {
                this.tokensDisplayEl.textContent = settings.maxTokens;
            }
        });
    }

    addThemeSwitcher() {
        // Add theme switcher to header controls
        const headerControls = this.element.querySelector('.header__controls');
        if (headerControls) {
            this.themeSwitcher = new ThemeSwitcher();

            // Insert before the settings button
            const settingsBtn = document.getElementById('settings-btn');
            if (settingsBtn) {
                headerControls.insertBefore(this.themeSwitcher.render(), settingsBtn);
            } else {
                headerControls.appendChild(this.themeSwitcher.render());
            }
        }
    }

    updateStats(stats) {
        if (this.requestsEl) {
            const remaining = stats.daily_requests_remaining || 996;
            this.requestsEl.textContent = `${remaining} left`;
        }

        if (this.dailyUsedEl) {
            this.dailyUsedEl.textContent = stats.daily_requests_used || 4;
        }

        if (this.rateLimitEl) {
            this.rateLimitEl.textContent = stats.rate_limit_per_ip_per_hour || 100;
        }
    }
}