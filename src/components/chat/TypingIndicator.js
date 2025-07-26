// ===== src/components/chat/TypingIndicator.js =====
export class TypingIndicator {
    constructor() {
        this.element = this.createElement();
    }

    createElement() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
            <span>AI is thinking...</span>
        `;
        return indicator;
    }

    render() {
        return this.element.cloneNode(true);
    }
}