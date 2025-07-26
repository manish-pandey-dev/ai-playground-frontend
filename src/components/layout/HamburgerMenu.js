// ===== src/components/layout/HamburgerMenu.js =====
export class HamburgerMenu {
    constructor() {
        this.isOpen = false;

        // Define your apps here - you can add more later
        this.apps = [
            {
                id: 'jigyasa',
                name: 'Jigyasa',
                icon: '🎙️',
                description: 'Audio Q&A Generator',
                url: '/jigyasa',
                active: false
            },
            {
                id: 'ai-playground',
                name: 'AI Playground',
                icon: '🧠',
                description: 'Chat with AI models',
                url: '/',
                active: true // Current app
            }
        ];

        this.element = this.createElement();
        this.attachEventListeners();
    }

    createElement() {
        const container = document.createElement('div');
        container.className = 'hamburger-menu';

        container.innerHTML = `
            <button class="hamburger-toggle" title="Open menu">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>

            <div class="hamburger-overlay"></div>

            <nav class="hamburger-sidebar">
                <div class="hamburger-header">
                    <h2>🚀 Apps</h2>
                    <button class="hamburger-close" title="Close menu">×</button>
                </div>

                <div class="hamburger-content">
                    <ul class="hamburger-apps">
                        ${this.apps.map(app => `
                            <li class="hamburger-app ${app.active ? 'active' : ''}" data-app-id="${app.id}">
                                <a href="${app.url}" class="hamburger-link">
                                    <span class="hamburger-icon">${app.icon}</span>
                                    <div class="hamburger-info">
                                        <span class="hamburger-name">${app.name}</span>
                                        <span class="hamburger-desc">${app.description}</span>
                                    </div>
                                    ${app.active ? '<span class="hamburger-badge">Current</span>' : ''}
                                </a>
                            </li>
                        `).join('')}
                    </ul>

                    <div class="hamburger-footer">
                        <p>Built with ❤️ for learning and innovation</p>
                        <small>Version 3.0</small>
                    </div>
                </div>
            </nav>
        `;

        return container;
    }

    attachEventListeners() {
        const toggle = this.element.querySelector('.hamburger-toggle');
        const overlay = this.element.querySelector('.hamburger-overlay');
        const close = this.element.querySelector('.hamburger-close');
        const links = this.element.querySelectorAll('.hamburger-link');

        // Toggle menu
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Close on overlay click
        overlay.addEventListener('click', () => this.close());

        // Close on close button click
        close.addEventListener('click', () => this.close());

        // Handle app navigation
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const appItem = e.currentTarget.closest('.hamburger-app');
                const appId = appItem.getAttribute('data-app-id');

                // Don't navigate if it's the current app
                if (appItem.classList.contains('active')) {
                    e.preventDefault();
                    this.close();
                    return;
                }

                // Handle navigation based on app
                if (appId === 'jigyasa') {
                    e.preventDefault();
                    this.navigateToJigyasa();
                } else if (appId === 'ai-playground') {
                    e.preventDefault();
                    this.navigateToPlayground();
                }
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.element.contains(e.target)) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.element.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Add focus trap for accessibility
        const firstFocusable = this.element.querySelector('.hamburger-close');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    close() {
        this.isOpen = false;
        this.element.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    }

    navigateToJigyasa() {
        console.log('Navigating to Jigyasa...');
        this.close();

        // We'll implement this navigation in the next step
        // For now, let's just show an alert
        alert('Jigyasa app coming soon! We will implement this in the next step.');

        // TODO: Replace with actual navigation
        // window.location.href = '/jigyasa';
    }

    navigateToPlayground() {
        console.log('Already in AI Playground');
        this.close();
        // We're already in the playground, so just close the menu
    }

    // Method to update active app (useful when navigating)
    setActiveApp(appId) {
        this.apps.forEach(app => {
            app.active = app.id === appId;
        });

        // Update the DOM
        const appItems = this.element.querySelectorAll('.hamburger-app');
        appItems.forEach(item => {
            const itemAppId = item.getAttribute('data-app-id');
            if (itemAppId === appId) {
                item.classList.add('active');
                const badge = item.querySelector('.hamburger-badge');
                if (!badge) {
                    const link = item.querySelector('.hamburger-link');
                    link.insertAdjacentHTML('beforeend', '<span class="hamburger-badge">Current</span>');
                }
            } else {
                item.classList.remove('active');
                const badge = item.querySelector('.hamburger-badge');
                if (badge) {
                    badge.remove();
                }
            }
        });
    }

    // Method to add new apps dynamically
    addApp(app) {
        this.apps.push(app);
        // Regenerate the apps list
        const appsList = this.element.querySelector('.hamburger-apps');
        appsList.innerHTML = this.apps.map(app => `
            <li class="hamburger-app ${app.active ? 'active' : ''}" data-app-id="${app.id}">
                <a href="${app.url}" class="hamburger-link">
                    <span class="hamburger-icon">${app.icon}</span>
                    <div class="hamburger-info">
                        <span class="hamburger-name">${app.name}</span>
                        <span class="hamburger-desc">${app.description}</span>
                    </div>
                    ${app.active ? '<span class="hamburger-badge">Current</span>' : ''}
                </a>
            </li>
        `).join('');
    }

    render() {
        return this.element;
    }

    destroy() {
        // Clean up event listeners and restore body overflow
        document.body.style.overflow = '';
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}