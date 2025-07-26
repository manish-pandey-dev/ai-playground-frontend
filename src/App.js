// ===== src/App.js =====
import { ChatContainer } from '@components/chat/ChatContainer.js';
import { MessageInput } from '@components/chat/MessageInput.js';
import { SettingsPanel } from '@components/settings/SettingsPanel.js';
import { Header } from '@components/layout/Header.js';
import { ModelSelector } from '@components/common/ModelSelector.js';
import { NotificationBanner } from '@components/common/NotificationBanner.js';
import { apiService } from '@services/api.js';
import { chatStore } from '@stores/chatStore.js';
import { settingsStore } from '@stores/settingsStore.js';
import { modelsStore } from '@stores/modelsStore.js';
import { appStore } from '@stores/appStore.js';
import { MESSAGE_TYPES } from '@utils/constants.js';

export class App {
    constructor() {
        this.init();
    }

    async init() {
        this.initializeComponents();
        this.attachEventListeners();
        this.setupNotifications();
        await this.loadInitialData();
    }

    initializeComponents() {
        // Initialize all components
        this.header = new Header();
        this.modelSelector = new ModelSelector();
        this.chatContainer = new ChatContainer(document.getElementById('messages'));
        this.messageInput = new MessageInput({
            onSend: (message) => this.sendMessage(message)
        });
        this.settingsPanel = new SettingsPanel();

        // Replace input area with our component
        const inputArea = document.querySelector('.input-area');
        if (inputArea) {
            inputArea.parentNode.replaceChild(this.messageInput.render(), inputArea);
        }
    }

    attachEventListeners() {
        // Settings button in header
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.settingsPanel.open();
            });
        }
    }

    setupNotifications() {
        this.notifications = new NotificationBanner();

        // Subscribe to app store for notifications
        appStore.subscribe(state => {
            state.notifications.forEach(notification => {
                if (!notification.shown) {
                    this.notifications.show(notification.type, notification.message);
                    notification.shown = true;
                }
            });
        });
    }

    async loadInitialData() {
        try {
            // Load available models
            modelsStore.setLoading(true);
            const modelsData = await apiService.getModels();
            modelsStore.setModels(modelsData.models || []);

            // Load usage stats
            const statsData = await apiService.getStats();
            appStore.updateStats(statsData);
        } catch (error) {
            console.error('Failed to load initial data:', error);
            modelsStore.setError('Failed to load models');
            appStore.showError('Failed to load initial data');
        }
    }

    async sendMessage(message) {
        const settings = settingsStore.getSettings();

        if (!settings.selectedModel) {
            appStore.showError('Please select a model first');
            return;
        }

        // Add user message
        chatStore.addMessage(MESSAGE_TYPES.USER, message);
        chatStore.setLoading(true);

        try {
            const response = await apiService.sendMessage(
                settings.selectedModel,
                message,
                settings.maxTokens,
                settings.temperature
            );

            chatStore.addMessage(MESSAGE_TYPES.AI, response.response, response.model_used);

            // Update stats
            const statsData = await apiService.getStats();
            appStore.updateStats(statsData);

        } catch (error) {
            console.error('Failed to send message:', error);
            chatStore.addMessage(MESSAGE_TYPES.ERROR, error.message);
            appStore.showError('Failed to send message');
        } finally {
            chatStore.setLoading(false);
        }
    }
}