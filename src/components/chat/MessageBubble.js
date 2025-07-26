// ===== src/components/chat/MessageBubble.js =====
import { formatTime, copyToClipboard } from '../../utils/helpers.js';
import { MESSAGE_TYPES } from '../../utils/constants.js';

export class MessageBubble {
    constructor(message) {
        this.message = message;
        this.element = this.createElement();
    }

    createElement() {
        const messageEl = document.createElement('div');
        messageEl.className = `message message--${this.message.type}`;
        messageEl.setAttribute('data-message-id', this.message.id);

        const contentEl = document.createElement('div');
        contentEl.className = 'message__content';

        if (this.message.type === MESSAGE_TYPES.AI && this.message.model) {
            const infoEl = document.createElement('div');
            infoEl.className = 'message__info';
            infoEl.innerHTML = `
                <span>🧠 ${this.message.model}</span>
                <span>${formatTime(this.message.timestamp)}</span>
            `;
            contentEl.appendChild(infoEl);
        }

        const textEl = document.createElement('div');
        textEl.className = 'message__text';
        textEl.textContent = this.message.content;
        contentEl.appendChild(textEl);

        if (this.message.type === MESSAGE_TYPES.AI) {
            const copyBtn = this.createCopyButton();
            contentEl.appendChild(copyBtn);
        }

        messageEl.appendChild(contentEl);
        return messageEl;
    }

    createCopyButton() {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'message__copy-btn';
        copyBtn.textContent = '📋 Copy';
        copyBtn.onclick = () => this.copyMessage(copyBtn);
        return copyBtn;
    }

    async copyMessage(button) {
        const success = await copyToClipboard(this.message.content);
        if (success) {
            const originalText = button.textContent;
            button.textContent = '✅ Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 1000);
        }
    }

    render() {
        return this.element;
    }
}