<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo-container">
          <div class="logo-icon">✓</div>
          <h1 class="app-title">Halal Check</h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <h2 class="welcome-title">Check if your food is Halal</h2>
        <p class="welcome-description">
          Take a photo of the food label or upload an existing image. 
          We'll analyze the ingredients and tell you if it's halal-certified.
        </p>
      </div>

      <!-- Upload Section -->
      <div class="upload-card">
        <!-- Image Preview -->
        <div v-if="selectedImage" class="image-preview-container">
          <img 
            :src="selectedImage" 
            alt="Selected food label" 
            class="preview-image"
          >
          <button 
            @click="clearImage"
            class="remove-image-btn"
          >
            ×
          </button>
        </div>

        <!-- Upload Area -->
        <div 
          v-else
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="handleDrop"
          class="upload-area"
        >
          <div class="upload-content">
            <div class="upload-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 class="upload-title">Upload Food Label</h3>
            <p class="upload-description">Tap to select a photo or drag and drop</p>
          </div>
          
          <!-- Action Buttons -->
          <div class="button-group">
            <button 
              @click.stop="triggerFileInput"
              class="btn btn-primary"
            >
              Choose from Gallery
            </button>
            <button 
              @click.stop="takePhoto"
              class="btn btn-secondary"
            >
              Take Photo
            </button>
          </div>
        </div>

        <!-- Hidden File Inputs -->
        <input 
          ref="fileInput"
          type="file" 
          accept="image/*" 
          @change="handleFileSelect"
          class="hidden-input"
        >
        <input 
          ref="cameraInput"
          type="file" 
          accept="image/*" 
          capture="environment"
          @change="handleFileSelect"
          class="hidden-input"
        >

        <!-- Analyze Button -->
        <button 
          v-if="selectedImage"
          @click="analyzeImage"
          :disabled="isAnalyzing"
          class="btn btn-analyze"
          :class="{ 'btn-loading': isAnalyzing }"
        >
          <span v-if="isAnalyzing" class="loading-content">
            <div class="spinner"></div>
            Analyzing...
          </span>
          <span v-else>Analyze Ingredients</span>
        </button>
      </div>

      <!-- Results Section -->
      <div v-if="analysisResult" class="results-card">
        <div class="results-content">
          <div class="result-icon" :class="{ 'result-halal': analysisResult.isHalal, 'result-not-halal': !analysisResult.isHalal }">
            <span class="result-symbol">{{ analysisResult.isHalal ? '✓' : '✗' }}</span>
          </div>
          <h3 class="result-title" :class="{ 'text-success': analysisResult.isHalal, 'text-error': !analysisResult.isHalal }">
            {{ analysisResult.isHalal ? 'Halal ✓' : 'Not Halal ✗' }}
          </h3>
          <p class="result-message">{{ analysisResult.message }}</p>
          
          <button 
            @click="resetAnalysis"
            class="btn btn-reset"
          >
            Check Another Product
          </button>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-section">
        <h4 class="tips-title">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          Tips for better results
        </h4>
        <ul class="tips-list">
          <li>• Ensure the ingredients list is clearly visible</li>
          <li>• Use good lighting for clear text</li>
          <li>• Take the photo straight-on, not at an angle</li>
          <li>• Make sure the text is not blurry</li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import { createWorker } from 'tesseract.js';


export default {
  name: 'HalalCheck',
  data() {
    return {
      selectedImage: null,
      isAnalyzing: false,
      analysisResult: null,
      message: ''
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    takePhoto() {
      this.$refs.cameraInput.click();
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.processFile(file);
      }
    },
    
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.processFile(file);
      }
    },
    
    processFile(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target.result;
        this.analysisResult = null;
      };
      reader.readAsDataURL(file);
    },
    
    clearImage() {
      this.selectedImage = null;
      this.analysisResult = null;
      this.$refs.fileInput.value = '';
      this.$refs.cameraInput.value = '';
    },
    
    async analyzeImage() {
      this.isAnalyzing = true;
      
      try {
        // Simulate API call - replace with actual OCR + AI analysis
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log(this.selectedImage);

        const worker = await createWorker('kaz');
        const ret = await worker.recognize(this.selectedImage);
        console.log(ret.data.text);
        this.message = ret.data.text;
        await worker.terminate();

        
        // Mock result - replace with actual analysis logic
        this.analysisResult = {
          isHalal: Math.random() > 0.5,
          message: this.message
          
          // Math.random() > 0.5 
          //   ? "All ingredients appear to be halal-certified." 
          //   : "Contains ingredients that may not be halal (pork gelatin detected).",
          // confidence: 85
        };
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        this.isAnalyzing = false;
      }
    },
    
    resetAnalysis() {
      this.selectedImage = null;
      this.analysisResult = null;
      this.$refs.fileInput.value = '';
      this.$refs.cameraInput.value = '';
    }
  }
}
</script>

<style scoped>
/* Reset and base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.header {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #d1fae5;
}

.header-content {
  max-width: 448px;
  margin: 0 auto;
  padding: 16px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.app-title {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
}

/* Main content */
.main-content {
  max-width: 448px;
  margin: 0 auto;
  padding: 24px 16px;
}

/* Welcome section */
.welcome-section {
  text-align: center;
  margin-bottom: 32px;
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.welcome-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

/* Upload card */
.upload-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

/* Image preview */
.image-preview-container {
  position: relative;
  margin-bottom: 16px;
}

.preview-image {
  width: 100%;
  height: 192px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-image-btn:hover {
  background: #dc2626;
}

/* Upload area */
.upload-area {
  border: 2px dashed #10b981;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #059669;
  background: rgba(16, 185, 129, 0.05);
}

.upload-content {
  margin-bottom: 16px;
}

.upload-icon {
  width: 64px;
  height: 64px;
  background: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: #10b981;
}

.upload-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.upload-description {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

/* Buttons */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover {
  background: #059669;
}

.btn-secondary {
  background: #3b82f6;
  color: white;
}

.btn-secondary:hover {
  background: #2563eb;
}

.btn-analyze {
  width: 100%;
  margin-top: 16px;
  background: linear-gradient(135deg, #10b981, #0d9488);
  color: white;
  padding: 16px 24px;
  font-weight: 600;
}

.btn-analyze:hover:not(.btn-loading) {
  background: linear-gradient(135deg, #059669, #0f766e);
}

.btn-analyze:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-reset {
  background: #f3f4f6;
  color: #374151;
  width: 100%;
}

.btn-reset:hover {
  background: #e5e7eb;
}

/* Loading state */
.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Results card */
.results-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.results-content {
  text-align: center;
}

.result-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.result-halal {
  background: #dcfce7;
}

.result-not-halal {
  background: #fee2e2;
}

.result-symbol {
  font-size: 24px;
}

.result-halal .result-symbol {
  color: #16a34a;
}

.result-not-halal .result-symbol {
  color: #dc2626;
}

.result-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.text-success {
  color: #16a34a;
}

.text-error {
  color: #dc2626;
}

.result-message {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

/* Tips section */
.tips-section {
  background: #dbeafe;
  border-radius: 12px;
  padding: 16px;
  margin-top: 32px;
}

.tips-title {
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tips-list {
  color: #1d4ed8;
  font-size: 14px;
  list-style: none;
}

.tips-list li {
  margin-bottom: 4px;
}

/* Hidden input */
.hidden-input {
  display: none;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .main-content {
    padding: 16px;
  }
  
  .upload-card {
    padding: 20px;
  }
  
  .upload-area {
    padding: 24px 16px;
  }
  
  .button-group {
    gap: 8px;
  }
}

/* Smooth transitions */
.btn, .upload-area, .remove-image-btn {
  transition: all 0.2s ease;
}
</style>