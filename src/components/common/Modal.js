// ===== src/components/common/Modal.js =====
export class Modal {
    constructor(options = {}) {
        this.title = options.title || '';
        this.content = options.content || '';
        this.isOpen = false;
        this.onClose = options.onClose || (() => {});

        this.overlay = this.createOverlay();
        this.modal = this.createModal();

        this.attachEventListeners();
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        return overlay;
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';

        modal.innerHTML = `
            <div class="modal__header">
                <div class="modal__title">${this.title}</div>
                <button class="btn btn--danger btn--icon modal__close">×</button>
            </div>
            <div class="modal__content">
                ${this.content}
            </div>
        `;

        return modal;
    }

    attachEventListeners() {
        this.overlay.addEventListener('click', () => this.close());
        this.modal.querySelector('.modal__close').addEventListener('click', () => this.close());
    }

    open() {
        if (!this.isOpen) {
            document.body.appendChild(this.overlay);
            document.body.appendChild(this.modal);

            // Force reflow before adding classes
            this.overlay.offsetHeight;
            this.modal.offsetHeight;

            this.overlay.classList.add('is-open');
            this.modal.classList.add('is-open');
            this.isOpen = true;
        }
    }

    close() {
        if (this.isOpen) {
            this.overlay.classList.remove('is-open');
            this.modal.classList.remove('is-open');

            setTimeout(() => {
                if (this.overlay.parentNode) {
                    document.body.removeChild(this.overlay);
                }
                if (this.modal.parentNode) {
                    document.body.removeChild(this.modal);
                }
            }, 300);

            this.isOpen = false;
            this.onClose();
        }
    }

    setContent(content) {
        this.content = content;
        const contentEl = this.modal.querySelector('.modal__content');
        if (typeof content === 'string') {
            contentEl.innerHTML = content;
        } else {
            contentEl.innerHTML = '';
            contentEl.appendChild(content);
        }
    }

    setTitle(title) {
        this.title = title;
        this.modal.querySelector('.modal__title').textContent = title;
    }
}