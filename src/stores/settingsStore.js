// ===== src/stores/settingsStore.js (Updated to include theme) =====
import { storageService } from '../services/storageService.js';
import { STORAGE_KEYS, APP_CONFIG } from '../utils/constants.js';

class SettingsStore {
    constructor() {
        this.settings = {
            maxTokens: APP_CONFIG.maxTokens.default,
            temperature: APP_CONFIG.temperature.default,
            selectedModel: '',
            theme: 'system' // Add theme to settings
        };
        this.observers = [];
        this.loadSettings();
    }

    subscribe(callback) {
        this.observers.push(callback);
        return () => {
            this.observers = this.observers.filter(obs => obs !== callback);
        };
    }

    notify() {
        this.observers.forEach(callback => callback(this.settings));
    }

    loadSettings() {
        const saved = storageService.getItem(STORAGE_KEYS.SETTINGS);
        if (saved) {
            this.settings = { ...this.settings, ...saved };
            this.notify();
        }
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.notify();
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        this.notify();
    }

    saveSettings() {
        storageService.setItem(STORAGE_KEYS.SETTINGS, this.settings);
    }

    getSettings() {
        return { ...this.settings };
    }

    getSetting(key) {
        return this.settings[key];
    }

    resetSettings() {
        this.settings = {
            maxTokens: APP_CONFIG.maxTokens.default,
            temperature: APP_CONFIG.temperature.default,
            selectedModel: '',
            theme: 'system'
        };
        this.saveSettings();
        this.notify();
    }
}

export const settingsStore = new SettingsStore();