// ===== src/components/common/ModelSelector.js =====
import { modelsStore } from '@stores/modelsStore.js';
import { settingsStore } from '@stores/settingsStore.js';

export class ModelSelector {
    constructor() {
        this.selectElement = document.getElementById('model-select');
        this.init();
    }

    init() {
        // Subscribe to models store
        modelsStore.subscribe(state => {
            this.updateModels(state.models);
            if (state.error) {
                console.error('Models error:', state.error);
            }
        });

        // Handle model selection
        this.selectElement.addEventListener('change', (e) => {
            settingsStore.updateSetting('selectedModel', e.target.value);
        });

        // Subscribe to settings store to maintain selected model
        settingsStore.subscribe(settings => {
            if (settings.selectedModel && this.selectElement.value !== settings.selectedModel) {
                this.selectElement.value = settings.selectedModel;
            }
        });
    }

    updateModels(models) {
        this.selectElement.innerHTML = '';

        if (models.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Loading models...';
            this.selectElement.appendChild(option);
            return;
        }

        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            this.selectElement.appendChild(option);
        });

        // Set first model as default if none selected
        const currentSettings = settingsStore.getSettings();
        if (!currentSettings.selectedModel && models.length > 0) {
            settingsStore.updateSetting('selectedModel', models[0]);
        }
    }
}
