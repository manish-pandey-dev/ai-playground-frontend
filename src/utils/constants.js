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