// ===== src/components/common/NotificationBanner.js =====
export class NotificationBanner {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-width: 400px;
        `;

        document.body.appendChild(this.container);
    }

    show(type, message, duration = 5000) {
        const banner = document.createElement('div');
        banner.className = `banner banner--${type} is-visible`;
        banner.style.cssText = `
            display: block;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        `;

        banner.innerHTML = `
            <span>${this.getIcon(type)} ${message}</span>
            <button style="background: none; border: none; color: inherit; margin-left: 12px; cursor: pointer;">×</button>
        `;

        const closeBtn = banner.querySelector('button');
        closeBtn.addEventListener('click', () => this.hide(banner));

        this.container.appendChild(banner);

        setTimeout(() => {
            banner.style.transform = 'translateX(0)';
        }, 10);

        if (duration > 0) {
            setTimeout(() => {
                this.hide(banner);
            }, duration);
        }

        return banner;
    }

    hide(banner) {
        banner.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (banner.parentNode) {
                banner.parentNode.removeChild(banner);
            }
        }, 300);
    }

    getIcon(type) {
        const icons = {
            success: '✅',
            error: '⚠️',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }
}