// ===== src/stores/chatStore.js =====
import { generateId } from '../utils/helpers.js';
import { MESSAGE_TYPES } from '../utils/constants.js';

class ChatStore {
    constructor() {
        this.messages = [];
        this.isLoading = false;
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
            messages: [...this.messages],
            isLoading: this.isLoading
        };
    }

    addMessage(type, content, model = null) {
        const message = {
            id: generateId(),
            type,
            content,
            model,
            timestamp: new Date()
        };

        this.messages.push(message);
        this.notify();
        return message;
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.notify();
    }

    clearMessages() {
        this.messages = [];
        this.notify();
    }

    removeMessage(messageId) {
        this.messages = this.messages.filter(msg => msg.id !== messageId);
        this.notify();
    }

    getMessageById(messageId) {
        return this.messages.find(msg => msg.id === messageId);
    }
}

export const chatStore = new ChatStore();