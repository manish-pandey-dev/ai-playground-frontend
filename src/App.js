// ===== src/App.js (Updated for Routing) =====
import { ChatContainer } from './components/chat/ChatContainer.js';
import { MessageInput } from './components/chat/MessageInput.js';
import { SettingsPanel } from './components/settings/SettingsPanel.js';
import { Header } from './components/layout/Header.js';
import { ModelSelector } from './components/common/ModelSelector.js';
import { NotificationBanner } from './components/common/NotificationBanner.js';
import { apiService } from './services/api.js';
import { chatStore } from './stores/chatStore.js';
import { settingsStore } from './stores/settingsStore.js';
import { modelsStore } from './stores/modelsStore.js';
import { appStore } from './stores/appStore.js';
import { MESSAGE_TYPES } from './utils/constants.js';

// This is the AI Playground component (main chat interface)
export class App {
    constructor() {
        this.init();
    }

    render() {
        // Return the existing app structure from index.html
        const container = document.createElement('div');
        container.className = 'app';

        container.innerHTML = `
            <!-- Header -->
            <header class="header">
                <div class="header-row">
                    <div class="logo-section">
                        <div class="logo-icon">🧠</div>
                        <div class="logo-text">AI Playground v3.0</div>
                    </div>
                    <div class="header-controls">
                        <div class="requests-count" id="requests-remaining">996 left</div>
                        <button class="btn btn--secondary btn--icon" id="settings-btn">⚙️</button>
                    </div>
                </div>
                <div class="stats-row">
                    Daily: <span id="daily-used">4</span> •
                    Rate: <span id="rate-limit">100</span>/hr •
                    Tokens: <span id="tokens-display">150</span>
                </div>
            </header>

            <!-- Model Selection -->
            <div class="model-bar">
                <div class="model-container">
                    <span class="model-label">Model:</span>
                    <select id="model-select" class="model-select">
                        <option value="">Loading models...</option>
                    </select>
                </div>
            </div>

            <!-- Chat Container -->
            <div class="chat-container">
                <!-- Messages -->
                <div class="messages" id="messages">
                    <div class="welcome">
                        <h1 class="welcome__title">Welcome to AI Playground! 🧠✨</h1>
                        <p class="welcome__description">
                            Select a model and start chatting with AI<br>
                            <strong>Built with ❤️ for Devanshi and friends!</strong>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Input area will be replaced by MessageInput component -->
            <div class="input-area">
                <div class="input-container">
                    <textarea
                        class="message-input"
                        placeholder="Type your message..."
                        rows="1"
                    ></textarea>
                    <button class="send-button" type="button">➤</button>
                </div>
            </div>
        `;

        return container;
    }

    async init() {
        this.initializeComponents();
        this.attachEventListeners();
        this.setupNotifications();
        await this.loadInitialData();
    }

    initializeComponents() {
        // Initialize header first
        this.header = new Header();

        // Initialize model selector
        this.modelSelector = new ModelSelector();

        // Initialize chat container
        this.chatContainer = new ChatContainer(document.getElementById('messages'));

        // Initialize message input and replace the existing input area
        this.messageInput = new MessageInput({
            onSend: (message) => this.sendMessage(message)
        });

        const inputArea = document.querySelector('.input-area');
        if (inputArea) {
            inputArea.parentNode.replaceChild(this.messageInput.render(), inputArea);
        }

        // Initialize settings panel
        this.settingsPanel = new SettingsPanel();
    }

    attachEventListeners() {
        // Settings button event listener
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.settingsPanel.open();
            });
        }

        // Subscribe to settings changes to update input state
        settingsStore.subscribe(settings => {
            // Update message input disabled state if needed
            if (this.messageInput) {
                const hasModel = settings.selectedModel && settings.selectedModel !== '';
                // You can add logic here to enable/disable input based on model selection
            }
        });

        // Subscribe to chat store for loading state
        chatStore.subscribe(state => {
            if (this.messageInput) {
                this.messageInput.setDisabled(state.isLoading);
            }
        });
    }

    setupNotifications() {
        this.notifications = new NotificationBanner();

        // Subscribe to app store for notifications
        appStore.subscribe(state => {
            if (state.notifications && state.notifications.length > 0) {
                state.notifications.forEach(notification => {
                    if (!notification.shown) {
                        this.notifications.show(notification.type, notification.message);
                        notification.shown = true;
                    }
                });
            }
        });
    }

    async loadInitialData() {
        try {
            // Set loading state
            modelsStore.setLoading(true);

            // Load models
            const modelsData = await apiService.getModels();
            if (modelsData && modelsData.models) {
                modelsStore.setModels(modelsData.models);
            } else {
                throw new Error('No models data received');
            }

            // Load stats
            const statsData = await apiService.getStats();
            if (statsData) {
                appStore.updateStats(statsData);
            }

        } catch (error) {
            console.error('Failed to load initial data:', error);
            modelsStore.setError('Failed to load models');
            appStore.showError('Failed to load initial data. Please refresh the page.');
        } finally {
            modelsStore.setLoading(false);
        }
    }

    async sendMessage(message) {
        // Get current settings
        const settings = settingsStore.getSettings();

        // Validate model selection
        if (!settings.selectedModel || settings.selectedModel === '') {
            appStore.showError('Please select a model first');
            return;
        }

        // Validate message
        if (!message || message.trim() === '') {
            appStore.showError('Please enter a message');
            return;
        }

        // Add user message to chat
        chatStore.addMessage(MESSAGE_TYPES.USER, message);

        // Set loading state
        chatStore.setLoading(true);

        try {
            // Send message to API
            const response = await apiService.sendMessage(
                settings.selectedModel,
                message,
                settings.maxTokens,
                settings.temperature
            );

            // Check if response is valid
            if (response && response.response) {
                // Add AI response to chat
                chatStore.addMessage(
                    MESSAGE_TYPES.AI,
                    response.response,
                    response.model_used || settings.selectedModel
                );

                // Update stats if provided
                if (response.daily_requests_remaining !== undefined) {
                    const statsData = await apiService.getStats();
                    appStore.updateStats(statsData);
                }
            } else {
                throw new Error('Invalid response from AI service');
            }

        } catch (error) {
            console.error('Failed to send message:', error);

            // Determine error message
            let errorMessage = 'Failed to send message';
            if (error.message) {
                if (error.message.includes('rate limit')) {
                    errorMessage = 'Rate limit exceeded. Please try again later.';
                } else if (error.message.includes('quota')) {
                    errorMessage = 'Daily quota exceeded. Please try again tomorrow.';
                } else if (error.message.includes('model')) {
                    errorMessage = 'Model not available. Please select a different model.';
                } else {
                    errorMessage = error.message;
                }
            }

            // Add error message to chat
            chatStore.addMessage(MESSAGE_TYPES.ERROR, errorMessage);

            // Show error notification
            appStore.showError(errorMessage);

        } finally {
            // Always clear loading state
            chatStore.setLoading(false);
        }
    }

    // Method to handle app cleanup if needed
    destroy() {
        if (this.header) {
            this.header.destroy();
        }
        if (this.chatContainer) {
            this.chatContainer.destroy();
        }
        // Add other cleanup as needed
    }
}