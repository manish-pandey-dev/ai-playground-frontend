// ===== src/components/chat/MessageInput.js =====
import { debounce } from '@utils/helpers.js';

export class MessageInput {
    constructor(options = {}) {
        this.onSend = options.onSend || (() => {});
        this.placeholder = options.placeholder || 'Type your message...';
        this.disabled = false;

        this.container = this.createElement();
        this.textarea = this.container.querySelector('.message-input');
        this.sendButton = this.container.querySelector('.send-button');

        this.attachEventListeners();
    }

    createElement() {
        const container = document.createElement('div');
        container.className = 'input-area';
        container.innerHTML = `
            <div class="input-container">
                <textarea
                    class="message-input"
                    placeholder="${this.placeholder}"
                    rows="1"
                ></textarea>
                <button class="send-button" type="button">➤</button>
            </div>
        `;
        return container;
    }

    attachEventListeners() {
        // Auto-resize textarea
        this.textarea.addEventListener('input', () => {
            this.autoResize();
        });

        // Send on Enter (but not Shift+Enter)
        this.textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Send button click
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
    }

    autoResize() {
        this.textarea.style.height = 'auto';
        this.textarea.style.height = Math.min(this.textarea.scrollHeight, 80) + 'px';
    }

    sendMessage() {
        const message = this.textarea.value.trim();
        if (message && !this.disabled) {
            this.onSend(message);
            this.clear();
        }
    }

    clear() {
        this.textarea.value = '';
        this.textarea.style.height = 'auto';
    }

    setDisabled(disabled) {
        this.disabled = disabled;
        this.textarea.disabled = disabled;
        this.sendButton.disabled = disabled;
    }

    focus() {
        this.textarea.focus();
    }

    render() {
        return this.container;
    }
}