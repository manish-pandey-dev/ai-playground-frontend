// ===== src/components/settings/SettingsPanel.js =====
import { Modal } from '@components/common/Modal.js';
import { SliderControl } from './SliderControl.js';
import { Button } from '@components/common/Button.js';
import { settingsStore } from '@stores/settingsStore.js';
import { appStore } from '@stores/appStore.js';
import { apiService } from '@services/api.js';
import { APP_CONFIG } from '@utils/constants.js';

export class SettingsPanel extends Modal {
    constructor() {
        super({
            title: '⚙️ Settings',
            content: '',
            onClose: () => this.onClose()
        });

        this.sliders = {};
        this.createContent();
        this.init();
    }

    createContent() {
        const container = document.createElement('div');

        // Create sliders
        this.sliders.tokens = new SliderControl({
            id: 'tokens',
            label: 'Max Tokens per Request',
            description: 'Maximum number of tokens in AI responses (50-2000)',
            min: APP_CONFIG.maxTokens.min,
            max: APP_CONFIG.maxTokens.max,
            step: APP_CONFIG.maxTokens.step,
            value: settingsStore.getSetting('maxTokens'),
            onChange: (value) => this.onSliderChange('maxTokens', value)
        });

        this.sliders.temperature = new SliderControl({
            id: 'temperature',
            label: 'Temperature (Creativity)',
            description: 'Higher values make responses more creative (0.1-2.0)',
            min: 1,
            max: 20,
            step: 1,
            value: Math.round(settingsStore.getSetting('temperature') * 10),
            formatter: (value) => (value / 10).toFixed(1),
            onChange: (value) => this.onSliderChange('temperature', value / 10)
        });

        // Create save button
        this.saveButton = new Button({
            text: '💾 Save Settings',
            variant: 'primary',
            onClick: () => this.saveSettings()
        });

        // Create health check button
        this.healthButton = new Button({
            text: '🚀 Run Health Check',
            variant: 'success',
            onClick: () => this.runHealthCheck()
        });

        // Assemble content
        container.appendChild(this.sliders.tokens.render());
        container.appendChild(this.sliders.temperature.render());
        container.appendChild(this.saveButton.render());

        // Health check section
        const healthSection = document.createElement('div');
        healthSection.style.cssText = 'border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: 16px;';

        const healthLabel = document.createElement('div');
        healthLabel.className = 'setting-label';
        healthLabel.textContent = '🔍 API Health Check';

        const healthDesc = document.createElement('div');
        healthDesc.className = 'setting-description';
        healthDesc.textContent = 'Test all configured AI models and check their status';

        this.healthResults = document.createElement('div');
        this.healthResults.id = 'health-results';
        this.healthResults.style.display = 'none';

        healthSection.appendChild(healthLabel);
        healthSection.appendChild(healthDesc);
        healthSection.appendChild(this.healthButton.render());
        healthSection.appendChild(this.healthResults);

        container.appendChild(healthSection);

        this.setContent(container);
    }

    init() {
        // Subscribe to settings changes
        settingsStore.subscribe(settings => {
            this.sliders.tokens.setValue(settings.maxTokens);
            this.sliders.temperature.setValue(Math.round(settings.temperature * 10));
        });
    }

    onSliderChange(key, value) {
        // Update setting immediately for live preview
        settingsStore.updateSetting(key, value);
    }

    saveSettings() {
        const settings = {
            maxTokens: this.sliders.tokens.getValue(),
            temperature: this.sliders.temperature.getValue()
        };

        settingsStore.updateSettings(settings);
        appStore.showSuccess('Settings saved successfully!', 2000);
        this.close();
    }

    async runHealthCheck() {
        this.healthButton.setText('🔄 Running Health Check...');
        this.healthButton.setDisabled(true);
        this.healthResults.style.display = 'none';

        try {
            const data = await apiService.runHealthCheck();

            if (data.success) {
                this.displayHealthResults(data);
                appStore.showSuccess(`Health check completed: ${data.summary.success_rate}% models operational`);
            } else {
                appStore.showError(`Health check failed: ${data.error}`);
            }
        } catch (error) {
            console.error('Health check failed:', error);
            appStore.showError('Failed to run health check');
        } finally {
            this.healthButton.setText('🚀 Run Health Check');
            this.healthButton.setDisabled(false);
        }
    }

    displayHealthResults(data) {
        const { results, summary } = data;

        this.healthResults.innerHTML = `
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 6px; padding: 12px; margin-top: 16px; font-size: 14px;">
                <strong>📊 Health Check Summary</strong><br>
                ✅ Working: ${summary.successful} | ❌ Failed: ${summary.failed} | 📈 Success Rate: ${summary.success_rate}%<br>
                🕒 Completed: ${new Date(summary.test_completed_at).toLocaleString()}
            </div>
            <div style="background: var(--primary-bg); border: 1px solid var(--border-color); border-radius: 6px; max-height: 300px; overflow-y: auto; margin-top: 12px;">
                ${results.map(result => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid var(--border-color); font-size: 12px;">
                        <div>
                            <div style="font-weight: 600; color: var(--text-primary);">${result.model}</div>
                            <div style="color: var(--text-secondary); font-size: 10px;">${result.response_time_ms}ms</div>
                            ${result.error ? `<div style="color: var(--error-color); font-size: 10px; margin-top: 4px; word-wrap: break-word;">${result.error}</div>` : ''}
                            ${result.response_preview ? `<div style="color: var(--text-secondary); font-size: 10px; margin-top: 2px;">"${result.response_preview}"</div>` : ''}
                        </div>
                        <div style="font-weight: 600; ${this.getStatusColor(result.status)}">${result.status}</div>
                    </div>
                `).join('')}
            </div>
        `;

        this.healthResults.style.display = 'block';
    }

    getStatusColor(status) {
        if (status.includes('SUCCESS')) return 'color: var(--success-color)';
        if (status.includes('RATE_LIMITED')) return 'color: orange';
        if (status.includes('NO_CREDITS')) return 'color: #f59e0b';
        if (status.includes('AUTH_ERROR')) return 'color: #ef4444';
        return 'color: var(--error-color)';
    }

    onClose() {
        // Reset any unsaved changes
        const currentSettings = settingsStore.getSettings();
        this.sliders.tokens.setValue(currentSettings.maxTokens);
        this.sliders.temperature.setValue(Math.round(currentSettings.temperature * 10));
    }
}