// ===== src/stores/appStore.js =====
import { NOTIFICATION_TYPES } from '../utils/constants.js';
import { generateId } from '../utils/helpers.js';

class AppStore {
    constructor() {
        this.notifications = [];
        this.stats = null;
        this.observers = [];
    }

    subscribe(callback) {
        this.observers.push(callback);
        return () => {
            this.observers = this.observers.filter(obs => obs !== callback);
        };
    }

    notify() {
        this.observers.forEach(callback => callback(this.getState()));
    }

    getState() {
        return {
            notifications: [...this.notifications],
            stats: this.stats
        };
    }

    addNotification(type, message, duration = 5000) {
        const notification = {
            id: generateId(),
            type,
            message,
            timestamp: Date.now()
        };

        this.notifications.push(notification);
        this.notify();

        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, duration);
        }

        return notification;
    }

    removeNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.notify();
    }

    clearNotifications() {
        this.notifications = [];
        this.notify();
    }

    updateStats(stats) {
        this.stats = stats;
        this.notify();
    }

    showSuccess(message, duration) {
        return this.addNotification(NOTIFICATION_TYPES.SUCCESS, message, duration);
    }

    showError(message, duration) {
        return this.addNotification(NOTIFICATION_TYPES.ERROR, message, duration);
    }

    showWarning(message, duration) {
        return this.addNotification(NOTIFICATION_TYPES.WARNING, message, duration);
    }

    showInfo(message, duration) {
        return this.addNotification(NOTIFICATION_TYPES.INFO, message, duration);
    }
}

export const appStore = new AppStore();