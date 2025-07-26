// ===== src/components/chat/ChatContainer.js =====
import { MessageBubble } from './MessageBubble.js';
import { TypingIndicator } from './TypingIndicator.js';
import { chatStore } from '../../stores/chatStore.js';

export class ChatContainer {
    constructor(container) {
        this.container = container;
        this.typingIndicator = new TypingIndicator();
        this.unsubscribe = null;
        this.init();
    }

    init() {
        this.container.innerHTML = this.getWelcomeHTML();

        this.unsubscribe = chatStore.subscribe(state => {
            this.updateMessages(state.messages);
            this.updateLoadingState(state.isLoading);
        });
    }

    getWelcomeHTML() {
        return `
            <div class="welcome">
                <h1 class="welcome__title">Welcome to AI Playground! 🧠✨</h1>
                <p class="welcome__description">
                    Select a model and start chatting with AI<br>
                    <strong>Built with ❤️ for Devanshi and friends!</strong>
                </p>
            </div>
        `;
    }

    updateMessages(messages) {
        if (messages.length > 0) {
            const welcome = this.container.querySelector('.welcome');
            if (welcome) welcome.remove();
        }

        const existingMessages = this.container.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        messages.forEach(message => {
            const messageBubble = new MessageBubble(message);
            this.container.appendChild(messageBubble.render());
        });

        this.scrollToBottom();
    }

    updateLoadingState(isLoading) {
        const existingIndicator = this.container.querySelector('.typing-indicator');

        if (isLoading && !existingIndicator) {
            this.container.appendChild(this.typingIndicator.render());
            this.scrollToBottom();
        } else if (!isLoading && existingIndicator) {
            existingIndicator.remove();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.container.scrollTop = this.container.scrollHeight;
        }, 50);
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}