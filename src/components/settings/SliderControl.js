// ===== src/components/settings/SliderControl.js =====comment
export class SliderControl {
    constructor(options = {}) {
        this.id = options.id || 'slider';
        this.label = options.label || 'Setting';
        this.description = options.description || '';
        this.min = options.min || 0;
        this.max = options.max || 100;
        this.step = options.step || 1;
        this.value = options.value || this.min;
        this.formatter = options.formatter || ((value) => value);
        this.onChange = options.onChange || (() => {});

        this.element = this.createElement();
        this.slider = this.element.querySelector('.setting-slider');
        this.valueDisplay = this.element.querySelector('.slider-value');

        this.attachEventListeners();
        this.updateDisplay();
    }

    createElement() {
        const container = document.createElement('div');
        container.className = 'setting-group';
        container.innerHTML = `
            <label class="setting-label">${this.label}</label>
            ${this.description ? `<div class="setting-description">${this.description}</div>` : ''}
            <div class="slider-container">
                <input
                    type="range"
                    class="setting-slider"
                    min="${this.min}"
                    max="${this.max}"
                    step="${this.step}"
                    value="${this.value}"
                >
                <div class="slider-labels">
                    <span>${this.formatter(this.min)}</span>
                    <span class="slider-value">${this.formatter(this.value)}</span>
                    <span>${this.formatter(this.max)}</span>
                </div>
            </div>
        `;
        return container;
    }

    attachEventListeners() {
        this.slider.addEventListener('input', (e) => {
            this.value = parseFloat(e.target.value);
            this.updateDisplay();
            this.onChange(this.value);
        });
    }

    updateDisplay() {
        this.valueDisplay.textContent = this.formatter(this.value);
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
        this.slider.value = value;
        this.updateDisplay();
    }

    render() {
        return this.element;
    }
}