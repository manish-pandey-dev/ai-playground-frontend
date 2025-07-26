// ===== src/pages/JigyasaPage.js =====
import { Header } from '../components/layout/Header.js';

export class JigyasaPage {
    constructor() {
        this.selectedFile = null;
        this.isProcessing = false;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'app jigyasa-app';

        container.innerHTML = `
            <!-- Header (same as AI Playground) -->
            <header class="header">
                <div class="header-row">
                    <div class="logo-section">
                        <div class="logo-icon">🎙️</div>
                        <div class="logo-text">Jigyasa - Audio Q&A</div>
                    </div>
                    <div class="header-controls">
                        <div class="app-status">Ready to process audio</div>
                    </div>
                </div>
                <div class="stats-row">
                    Audio Q&A Generator • Upload → Process → Get Questions
                </div>
            </header>

            <!-- Main Content -->
            <div class="jigyasa-container">
                <div class="jigyasa-content">
                    <!-- Welcome Section -->
                    <div class="jigyasa-welcome" id="welcome-section">
                        <h1 class="jigyasa-title">🎙️ Welcome to Jigyasa</h1>
                        <p class="jigyasa-subtitle">
                            Upload your audio recording and get intelligent questions generated automatically
                        </p>
                        <div class="jigyasa-features">
                            <div class="feature-item">
                                <span class="feature-icon">🎵</span>
                                <span class="feature-text">Support for MP3, WAV, M4A audio files</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">🤖</span>
                                <span class="feature-text">AI-powered question generation</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">❓</span>
                                <span class="feature-text">5 multiple-choice questions with answers</span>
                            </div>
                        </div>
                    </div>

                    <!-- Upload Section -->
                    <div class="upload-section" id="upload-section">
                        <div class="upload-area" id="upload-area">
                            <div class="upload-icon">📁</div>
                            <div class="upload-text">
                                <h3>Drop your audio file here</h3>
                                <p>or <button class="upload-browse-btn" id="browse-btn">browse files</button></p>
                            </div>
                            <input type="file" id="file-input" accept="audio/*" style="display: none;">
                        </div>

                        <!-- File Info -->
                        <div class="file-info" id="file-info" style="display: none;">
                            <div class="file-details">
                                <div class="file-icon">🎵</div>
                                <div class="file-meta">
                                    <div class="file-name" id="file-name"></div>
                                    <div class="file-size" id="file-size"></div>
                                </div>
                                <button class="file-remove" id="remove-file">×</button>
                            </div>
                            <button class="process-btn" id="process-btn">
                                🚀 Generate Questions
                            </button>
                        </div>
                    </div>

                    <!-- Processing Section -->
                    <div class="processing-section" id="processing-section" style="display: none;">
                        <div class="processing-indicator">
                            <div class="processing-spinner"></div>
                            <h3>Processing your audio...</h3>
                            <p>Our AI is analyzing the content and generating questions</p>
                            <div class="processing-steps">
                                <div class="step active" id="step-1">
                                    <span class="step-icon">🎧</span>
                                    <span class="step-text">Analyzing audio</span>
                                </div>
                                <div class="step" id="step-2">
                                    <span class="step-icon">📝</span>
                                    <span class="step-text">Extracting content</span>
                                </div>
                                <div class="step" id="step-3">
                                    <span class="step-icon">❓</span>
                                    <span class="step-text">Generating questions</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Results Section -->
                    <div class="results-section" id="results-section" style="display: none;">
                        <div class="results-header">
                            <h2>📋 Generated Questions</h2>
                            <div class="results-actions">
                                <button class="btn btn--secondary" id="download-btn">📥 Download</button>
                                <button class="btn btn--primary" id="new-upload-btn">🔄 Upload New Audio</button>
                            </div>
                        </div>
                        <div class="questions-container" id="questions-container">
                            <!-- Questions will be dynamically inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    init() {
        // Initialize header with hamburger menu
        this.header = new Header();
        // Update hamburger menu to show Jigyasa as active
        if (this.header.hamburgerMenu) {
            this.header.hamburgerMenu.setActiveApp('jigyasa');
        }

        this.attachEventListeners();
    }

    attachEventListeners() {
        // File input elements
        const fileInput = document.getElementById('file-input');
        const browseBtn = document.getElementById('browse-btn');
        const uploadArea = document.getElementById('upload-area');
        const removeFileBtn = document.getElementById('remove-file');
        const processBtn = document.getElementById('process-btn');
        const newUploadBtn = document.getElementById('new-upload-btn');

        // Browse button click
        browseBtn?.addEventListener('click', () => {
            fileInput?.click();
        });

        // File input change
        fileInput?.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // Drag and drop
        uploadArea?.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea?.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });

        uploadArea?.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });

        // Remove file
        removeFileBtn?.addEventListener('click', () => {
            this.clearFile();
        });

        // Process button
        processBtn?.addEventListener('click', () => {
            this.processAudio();
        });

        // New upload button
        newUploadBtn?.addEventListener('click', () => {
            this.resetToUpload();
        });
    }

    handleFileSelect(file) {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('audio/')) {
            alert('Please select an audio file (MP3, WAV, M4A, etc.)');
            return;
        }

        // Validate file size (50MB limit)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            alert('File size too large. Please select a file smaller than 50MB.');
            return;
        }

        this.selectedFile = file;
        this.showFileInfo(file);
    }

    showFileInfo(file) {
        const fileInfo = document.getElementById('file-info');
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        const uploadSection = document.getElementById('upload-section');

        // Update file details
        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);

        // Show file info, hide upload area
        fileInfo.style.display = 'block';
        uploadSection.querySelector('.upload-area').style.display = 'none';
    }

    clearFile() {
        this.selectedFile = null;
        const fileInfo = document.getElementById('file-info');
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');

        fileInfo.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
    }

    async processAudio() {
        if (!this.selectedFile) return;

        this.isProcessing = true;
        this.showProcessingView();

        try {
            // Simulate processing steps for now
            await this.simulateProcessing();

            // For now, show mock results
            // In the next step, we'll implement actual API call
            this.showMockResults();

        } catch (error) {
            console.error('Processing error:', error);
            alert('Failed to process audio. Please try again.');
            this.resetToUpload();
        } finally {
            this.isProcessing = false;
        }
    }

    showProcessingView() {
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('processing-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';
    }

    async simulateProcessing() {
        const steps = ['step-1', 'step-2', 'step-3'];

        for (let i = 0; i < steps.length; i++) {
            // Activate current step
            document.getElementById(steps[i])?.classList.add('active');

            // Wait for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Complete current step
            document.getElementById(steps[i])?.classList.add('completed');
        }
    }

    showMockResults() {
        // Hide processing, show results
        document.getElementById('processing-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'block';

        // Mock questions data
        const mockQuestions = [
            {
                question: "What was the main topic discussed in this audio session?",
                options: [
                    "Project Management",
                    "Technical Implementation",
                    "Budget Planning",
                    "Team Communication"
                ],
                correctAnswer: 1
            },
            {
                question: "Which technology was mentioned as the primary choice?",
                options: [
                    "React",
                    "Vue.js",
                    "Angular",
                    "Vanilla JavaScript"
                ],
                correctAnswer: 0
            },
            // Add 3 more mock questions...
        ];

        this.displayQuestions(mockQuestions);
    }

    displayQuestions(questions) {
        const container = document.getElementById('questions-container');
        container.innerHTML = '';

        questions.forEach((q, index) => {
            const questionEl = document.createElement('div');
            questionEl.className = 'question-card';
            questionEl.innerHTML = `
                <div class="question-header">
                    <span class="question-number">Q${index + 1}</span>
                    <h3 class="question-text">${q.question}</h3>
                </div>
                <div class="question-options">
                    ${q.options.map((option, optIndex) => `
                        <div class="option ${optIndex === q.correctAnswer ? 'correct' : ''}">
                            <span class="option-letter">${String.fromCharCode(65 + optIndex)}</span>
                            <span class="option-text">${option}</span>
                            ${optIndex === q.correctAnswer ? '<span class="correct-indicator">✓</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(questionEl);
        });
    }

    resetToUpload() {
        this.clearFile();
        document.getElementById('upload-section').style.display = 'block';
        document.getElementById('processing-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'none';
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    destroy() {
        // Cleanup if needed
        if (this.header) {
            this.header.destroy();
        }
    }
}