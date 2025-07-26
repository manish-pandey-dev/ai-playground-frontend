// ===== src/stores/modelsStore.js =====
class ModelsStore {
    constructor() {
        this.models = [];
        this.loading = false;
        this.error = null;
        this.observers = [];
    }

    subscribe(callback) {
        this.observers.push(callback);
        return () => {
            this.observers = this.observers.filter(obs => obs !== callback);
        };
    }

    notify() {
        this.observers.forEach(callback => callback(this.getState()));
    }

    getState() {
        return {
            models: [...this.models],
            loading: this.loading,
            error: this.error
        };
    }

    setLoading(loading) {
        this.loading = loading;
        this.notify();
    }

    setModels(models) {
        this.models = models;
        this.error = null;
        this.notify();
    }

    setError(error) {
        this.error = error;
        this.loading = false;
        this.notify();
    }

    getModels() {
        return [...this.models];
    }

    hasModels() {
        return this.models.length > 0;
    }
}

export const modelsStore = new ModelsStore();
