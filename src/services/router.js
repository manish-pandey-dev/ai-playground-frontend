// ===== src/services/router.js =====
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.container = null;

        // Bind methods
        this.handlePopState = this.handlePopState.bind(this);

        // Listen for browser back/forward buttons
        window.addEventListener('popstate', this.handlePopState);

        // Listen for page load
        window.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }

    init() {
        // Set the main container where pages will be rendered
        this.container = document.getElementById('app');

        // Load the current route
        this.loadRoute();
    }

    // Register a route
    addRoute(path, component, title = '') {
        this.routes.set(path, { component, title });
    }

    // Navigate to a route
    navigate(path, pushState = true) {
        console.log(`Navigating to: ${path}`);

        if (pushState) {
            // Add to browser history
            window.history.pushState({ path }, '', path);
        }

        this.loadRoute();
    }

    // Load the current route
    loadRoute() {
        const path = window.location.pathname;
        console.log(`Loading route: ${path}`);

        // Find matching route
        const route = this.routes.get(path) || this.routes.get('/'); // fallback to home

        if (route) {
            this.currentRoute = path;

            // Update page title
            if (route.title) {
                document.title = route.title;
            }

            // Clear container and render new component
            this.container.innerHTML = '';

            // Create and render the component
            const componentInstance = new route.component();
            const element = componentInstance.render();
            this.container.appendChild(element);

            // Call init if the component has it
            if (typeof componentInstance.init === 'function') {
                componentInstance.init();
            }

            // Store component instance for cleanup
            this.currentComponent = componentInstance;
        } else {
            console.error(`Route not found: ${path}`);
            this.navigate('/', false); // fallback to home
        }
    }

    // Handle browser back/forward
    handlePopState(event) {
        this.loadRoute();
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }

    // Cleanup current component if needed
    cleanup() {
        if (this.currentComponent && typeof this.currentComponent.destroy === 'function') {
            this.currentComponent.destroy();
        }
    }
}

// Create singleton instance
export const router = new Router();