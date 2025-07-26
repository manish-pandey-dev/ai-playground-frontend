// ===== src/services/storageService.js =====
class StorageService {
    constructor() {
        this.prefix = 'ai-playground-';
    }

    getItem(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Failed to get item from storage:', error);
            return null;
        }
    }

    setItem(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Failed to set item in storage:', error);
            return false;
        }
    }

    removeItem(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Failed to remove item from storage:', error);
            return false;
        }
    }

    clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    }
}

export const storageService = new StorageService();

// ===== src/utils/constants.js =====
export const APP_CONFIG = {
    name: 'AI Playground',
    version: '3.0.0',
    maxTokens: {
        min: 50,
        max: 2000,
        default: 150,
        step: 50
    },
    temperature: {
        min: 0.1,
        max: 2.0,
        default: 0.7,
        step: 0.1
    }
};

export const STORAGE_KEYS = {
    SETTINGS: 'settings',
    CHAT_HISTORY: 'chat-history',
    SELECTED_MODEL: 'selected-model'
};

export const MESSAGE_TYPES = {
    USER: 'user',
    AI: 'ai',
    ERROR: 'error',
    SYSTEM: 'system'
};

export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};