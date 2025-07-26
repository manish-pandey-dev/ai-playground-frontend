// ===== src/components/common/Button.js =====
export class Button {
    constructor(options = {}) {
        this.text = options.text || '';
        this.type = options.type || 'button';
        this.variant = options.variant || 'primary';
        this.size = options.size || 'medium';
        this.disabled = options.disabled || false;
        this.onClick = options.onClick || (() => {});
        this.className = options.className || '';
        this.icon = options.icon || '';

        this.element = this.createElement();
    }

    createElement() {
        const button = document.createElement('button');
        button.type = this.type;
        button.className = `btn btn--${this.variant} btn--${this.size} ${this.className}`.trim();
        button.disabled = this.disabled;

        if (this.icon && this.text) {
            button.innerHTML = `${this.icon} ${this.text}`;
        } else if (this.icon) {
            button.innerHTML = this.icon;
            button.classList.add('btn--icon');
        } else {
            button.textContent = this.text;
        }

        button.addEventListener('click', this.onClick);

        return button;
    }

    setText(text) {
        this.text = text;
        if (!this.icon) {
            this.element.textContent = text;
        } else {
            this.element.innerHTML = `${this.icon} ${text}`;
        }
    }

    setDisabled(disabled) {
        this.disabled = disabled;
        this.element.disabled = disabled;
    }

    render() {
        return this.element;
    }
}