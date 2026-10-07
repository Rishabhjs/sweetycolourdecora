const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

const startMarker = '/* AI Studio Section Container */';
const endMarker = '/* ==========================================================================\n   FLOATING AI AGENT WIDGET & DRAWER';

const startIndex = css.indexOf(startMarker);
const endIndex = css.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found in styles.css! Start:', startIndex, 'End:', endIndex);
  process.exit(1);
}

const darkAestheticCss = `/* AI Studio Section Container — Dark Swiss Modernist / Texture.ai Aesthetic */
.ai-studio-section {
  position: relative;
  background: #080C14;
  background-image: 
    radial-gradient(circle at 85% 15%, rgba(193, 89, 43, 0.10) 0%, transparent 45%),
    radial-gradient(circle at 15% 85%, rgba(201, 136, 56, 0.08) 0%, transparent 45%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 100px 0;
  overflow: hidden;
  color: #FFFFFF;
}

.ai-studio-section .editorial-header .section-eyebrow {
  color: #C1592B !important;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
}

.ai-studio-section .editorial-header .section-title {
  color: #FFFFFF !important;
  font-family: var(--font-serif, 'Fraunces', serif);
  font-size: 2.3rem;
  font-weight: 400;
  letter-spacing: -0.01em;
  margin-top: 6px;
  margin-bottom: 12px;
}

.ai-studio-section .editorial-header p {
  color: #94A3B8 !important;
  font-size: 0.94rem;
  line-height: 1.65;
  max-width: 820px;
}

/* Header & Meta Badges */
.ai-header-tag-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.ai-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #10B981;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 9999px;
}

.status-dot-green {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 8px #10B981;
}

/* Layout Grid */
.ai-studio-grid {
  display: grid;
  grid-template-columns: 1.18fr 0.82fr;
  gap: 36px;
  align-items: start;
  margin-top: 48px;
  position: relative;
  z-index: 1;
}

@media (max-width: 1024px) {
  .ai-studio-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

/* Card Container */
.ai-panel-card {
  background: #0E1626;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
  color: #FFFFFF;
}

/* Image Upload Dropzone */
.ai-dropzone {
  position: relative;
  border: 2px dashed rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.25s ease;
  margin-bottom: 28px;
}

.ai-dropzone:hover,
.ai-dropzone.drag-active {
  border-color: #C1592B;
  background: rgba(193, 89, 43, 0.06);
}

.ai-dropzone-icon {
  width: 44px;
  height: 44px;
  margin: 0 auto 12px;
  color: #C98838;
  stroke-width: 1.6;
}

.ai-dropzone-title {
  font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.98rem;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 4px;
}

.ai-dropzone-hint {
  font-size: 0.78rem;
  color: #8F9BA8;
  margin-bottom: 14px;
}

/* Camera & Action Buttons inside Dropzone */
.ai-upload-actions-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-camera-upload {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  background: #162032;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.76rem;
  font-weight: 500;
  color: #E2E8F0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-camera-upload:hover {
  border-color: #C1592B;
  color: #FFFFFF;
  background: rgba(193, 89, 43, 0.15);
}

/* Sample Room Preset Selector */
.ai-sample-presets-label {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8F9BA8;
  margin-top: 14px;
  margin-bottom: 8px;
}

.sample-rooms-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.sample-room-btn {
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #141E2F;
  font-size: 0.74rem;
  color: #CBD5E1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sample-room-btn:hover {
  border-color: #C1592B;
  color: #FFFFFF;
  background: rgba(193, 89, 43, 0.15);
}

/* Uploaded Image Preview Strip */
.ai-image-preview-area {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #141E2F;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  margin-bottom: 24px;
}

.ai-preview-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
}

.ai-preview-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.ai-preview-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-preview-filename {
  font-size: 0.82rem;
  font-weight: 600;
  color: #F8FAFC;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.ai-preview-filesize {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.7rem;
  color: #8F9BA8;
}

.btn-remove-preview {
  background: none;
  border: none;
  color: #EF4444;
  font-size: 0.74rem;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.btn-remove-preview:hover {
  background: rgba(239, 68, 68, 0.15);
}

/* Questionnaire Fields */
.ai-form-group {
  margin-bottom: 22px;
}

.ai-form-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.84rem;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 10px;
}

.ai-label-sub {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.7rem;
  color: #8F9BA8;
  font-weight: normal;
}

/* Chips and Pill Options */
.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-pill {
  padding: 7px 14px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #141E2F;
  font-size: 0.78rem;
  font-weight: 500;
  color: #CBD5E1;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.chip-pill:hover {
  border-color: #C1592B;
  color: #FFFFFF;
  background: rgba(193, 89, 43, 0.15);
  transform: translateY(-1px);
}

.chip-pill.active {
  background: linear-gradient(135deg, #C1592B 0%, #A6471E 100%);
  border-color: #C1592B;
  color: #FFFFFF !important;
  box-shadow: 0 4px 14px rgba(193, 89, 43, 0.4);
}

/* Area Slider */
.ai-slider-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ai-range-input {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.15);
  outline: none;
}

.ai-range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #C1592B;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(193, 89, 43, 0.6);
  transition: transform 0.15s ease;
}

.ai-range-input::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.ai-number-input-wrap {
  position: relative;
  width: 100px;
}

.ai-number-input {
  width: 100%;
  padding: 6px 28px 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.84rem;
  font-weight: 600;
  background: #141E2F;
  color: #F8FAFC;
}

.ai-number-unit {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.68rem;
  color: #8F9BA8;
  pointer-events: none;
}

/* City Select Dropdown */
.ai-city-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-select {
  flex: 1;
  padding: 9px 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  font-size: 0.84rem;
  background: #141E2F;
  color: #F8FAFC;
  outline: none;
}

.ai-city-multiplier-badge {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.72rem;
  padding: 4px 10px;
  border-radius: 4px;
  background: rgba(193, 89, 43, 0.15);
  border: 1px solid rgba(193, 89, 43, 0.35);
  color: #E5A95B;
  white-space: nowrap;
}

/* Generate Submit Button */
.btn-ai-generate {
  width: 100%;
  padding: 14px 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #C1592B 0%, #A6471E 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.94rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 6px 22px rgba(193, 89, 43, 0.4);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: 28px;
}

.btn-ai-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(193, 89, 43, 0.55);
}

.btn-ai-generate:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Loading Stages Box */
.ai-loading-container {
  display: none;
  background: #0E1626;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 36px 32px;
  text-align: center;
  margin-top: 32px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
}

.ai-loading-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(201, 136, 56, 0.12);
  border: 1px solid rgba(201, 136, 56, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #C98838;
}

.spinner-spin {
  animation: spin 1.8s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.ai-stage-title {
  font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #E5A95B;
  margin-bottom: 6px;
}

.ai-stage-desc {
  font-size: 0.84rem;
  color: #8F9BA8;
  max-width: 480px;
  margin: 0 auto 24px;
  min-height: 2.2em;
}

.ai-progress-track {
  width: 100%;
  max-width: 500px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  margin: 0 auto 12px;
  overflow: hidden;
  position: relative;
}

.ai-progress-bar {
  height: 100%;
  width: 15%;
  background: linear-gradient(90deg, #C1592B, #C98838);
  border-radius: 9999px;
  transition: width 0.35s ease;
}

.ai-progress-percent {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.76rem;
  font-weight: 600;
  color: #8F9BA8;
}

/* ==========================================================================
   RESULTS DASHBOARD & BEFORE / AFTER INTERACTIVE SLIDER
   ========================================================================== */

.ai-results-container {
  display: none;
  margin-top: 48px;
}

.ai-results-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 20px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
}

.ai-concept-title {
  font-family: var(--font-serif, 'Fraunces', serif);
  font-size: 2.1rem;
  font-weight: 400;
  color: #FFFFFF;
  margin-bottom: 4px;
}

.ai-concept-subtitle {
  font-size: 0.88rem;
  color: #8F9BA8;
}

/* Before / After Slider Box */
.ai-comparison-card {
  position: relative;
  background: #0B111E;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.6);
  margin-bottom: 40px;
}

.ai-before-after-container {
  position: relative;
  width: 100%;
  height: 520px;
  user-select: none;
  cursor: ew-resize;
  overflow: hidden;
}

@media (max-width: 768px) {
  .ai-before-after-container {
    height: 320px;
  }
}

.ai-img-before,
.ai-img-after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.ai-after-clip-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
  pointer-events: none;
}

/* Floating Badges on Slider */
.slider-label-badge {
  position: absolute;
  top: 20px;
  padding: 6px 12px;
  border-radius: 6px;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  z-index: 10;
  pointer-events: none;
}

.badge-before {
  left: 20px;
  background: rgba(0, 0, 0, 0.75);
  color: #E2E8F0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(6px);
}

.badge-after {
  right: 20px;
  background: rgba(193, 89, 43, 0.95);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

/* Watermark Badge */
.ai-watermark-badge {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(11, 17, 30, 0.9);
  border: 1px solid rgba(193, 89, 43, 0.5);
  color: #F8FAFC;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 9999px;
  z-index: 12;
  pointer-events: none;
  backdrop-filter: blur(8px);
  white-space: nowrap;
}

/* Center Slider Handle */
.ai-slider-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: #FFFFFF;
  z-index: 15;
  pointer-events: none;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.8);
}

.ai-handle-pill {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 2px solid #C1592B;
  color: #0E1626;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}

/* Concept Narrative Card */
.ai-narrative-card {
  background: #0E1626;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 32px;
}

.ai-narrative-title {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #C1592B;
  margin-bottom: 10px;
  font-weight: 700;
}

.ai-narrative-text {
  font-size: 0.98rem;
  line-height: 1.7;
  color: #E2E8F0;
}

/* Two-column Section for Features & Palette */
.ai-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 36px;
}

@media (max-width: 768px) {
  .ai-details-grid {
    grid-template-columns: 1fr;
  }
}

.ai-info-card {
  background: #0E1626;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 24px;
}

.ai-info-heading {
  font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #FFFFFF;
  margin-bottom: 16px;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.architectural-feature-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.84rem;
  color: #CBD5E1;
  line-height: 1.5;
}

.architectural-feature-item svg {
  color: #10B981;
  flex-shrink: 0;
  margin-top: 3px;
}

.bullet-mono {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  color: #C98838;
  font-weight: 700;
}

/* Color Swatches Grid */
.swatches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
}

.swatch-card {
  background: #141E2F;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.swatch-preview {
  height: 52px;
  width: 100%;
}

.swatch-info {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.swatch-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #FFFFFF;
}

.swatch-hex {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.72rem;
  color: #C98838;
}

.swatch-role {
  font-size: 0.68rem;
  color: #8F9BA8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Recommended Materials Grid */
.materials-section-title {
  font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.94rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #FFFFFF;
  margin-bottom: 16px;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.material-card {
  background: #0E1626;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.material-category-tag {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #C1592B;
  font-weight: 600;
}

.material-name {
  font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.96rem;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0;
}

.material-finish {
  font-size: 0.78rem;
  color: #8F9BA8;
}

.material-purpose {
  font-size: 0.82rem;
  color: #CBD5E1;
  line-height: 1.45;
  margin: 4px 0 8px;
  flex-grow: 1;
}

.material-rate-tag {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.74rem;
  font-weight: 600;
  color: #10B981;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 3px 8px;
  border-radius: 4px;
  align-self: flex-start;
}

/* ==========================================================================
   COST ESTIMATION CARDS & BOQ BREAKDOWN TABLE
   ========================================================================== */

.cost-section-wrap {
  background: #0E1626;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 40px;
}

.cost-kpi-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
}

@media (max-width: 900px) {
  .cost-kpi-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 540px) {
  .cost-kpi-grid {
    grid-template-columns: 1fr;
  }
}

.cost-kpi-card {
  padding: 20px;
  border-radius: 8px;
  background: #141E2F;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.kpi-card-highlight {
  background: linear-gradient(135deg, rgba(193, 89, 43, 0.22) 0%, rgba(201, 136, 56, 0.08) 100%);
  border-color: rgba(193, 89, 43, 0.5);
}

.cost-kpi-label {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8F9BA8;
  margin-bottom: 6px;
}

.cost-kpi-value {
  font-family: var(--font-serif, 'Fraunces', serif);
  font-size: 1.9rem;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 1.1;
}

.cost-kpi-value.val-highlight {
  color: #E5A95B;
  font-size: 2.2rem;
}

.cost-kpi-sub {
  font-size: 0.72rem;
  color: #8F9BA8;
  margin-top: 4px;
}

/* Cost Breakdown Table */
.cost-table-container {
  overflow-x: auto;
  margin-bottom: 24px;
}

.cost-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
}

.cost-table th {
  text-align: left;
  padding: 10px 14px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.15);
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8F9BA8;
}

.cost-table td {
  padding: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.cost-td-trade .trade-title {
  font-size: 0.9rem;
  color: #FFFFFF;
  display: block;
}

.cost-td-trade .trade-sub {
  font-size: 0.76rem;
  color: #8F9BA8;
  margin-top: 2px;
}

.grade-badge {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.68rem;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.grade-badge.standard {
  background: rgba(59, 130, 246, 0.12);
  color: #60A5FA;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.grade-badge.luxury {
  background: rgba(201, 136, 56, 0.18);
  color: #E5A95B;
  border: 1px solid rgba(201, 136, 56, 0.4);
}

.grade-badge.economy {
  background: rgba(148, 163, 184, 0.12);
  color: #94A3B8;
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.cost-td-amount {
  text-align: right;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.94rem;
  color: #F8FAFC;
}

/* Official Contractor Disclaimer */
.cost-disclaimer-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 8px;
  font-size: 0.8rem;
  line-height: 1.55;
  color: #CBD5E1;
}

.cost-disclaimer-box svg {
  color: #F59E0B;
  flex-shrink: 0;
  margin-top: 2px;
}

/* CTA Consultation Row */
.ai-cta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-book-consultation {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 8px;
  background: #141E2F;
  border: 1px solid #C1592B;
  color: #FFFFFF;
  font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  transition: all 0.25s ease;
}

.btn-book-consultation:hover {
  background: #C1592B;
  color: #FFFFFF;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(193, 89, 43, 0.4);
}

/* ==========================================================================
   MODALS (Consultation & Admin Pricing Panel)
   ========================================================================== */

.modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(8, 12, 20, 0.82);
  backdrop-filter: blur(10px);
  z-index: 9999;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background: #0E1626;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  color: #FFFFFF;
}

.modal-content-wide {
  max-width: 820px;
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #8F9BA8;
  cursor: pointer;
  line-height: 1;
}

.modal-close-btn:hover {
  color: #EF4444;
}

.modal-title {
  font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 6px;
}

.modal-subtitle {
  font-size: 0.84rem;
  color: #8F9BA8;
  margin-bottom: 24px;
}

.modal-summary-box {
  padding: 12px 16px;
  background: #141E2F;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 0.82rem;
  margin-bottom: 20px;
  color: #E2E8F0;
}

.modal-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 500px) {
  .modal-form-grid {
    grid-template-columns: 1fr;
  }
}

.modal-input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  font-size: 0.84rem;
  background: #141E2F;
  color: #FFFFFF;
}

.alert-success-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 8px;
  color: #10B981;
  font-size: 0.82rem;
  margin-bottom: 18px;
}

/* Admin Pricing Table Styles */
.admin-rate-input,
.admin-city-input {
  width: 90px;
  padding: 4px 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.8rem;
  background: #141E2F;
  color: #FFFFFF;
}

`;

css = css.slice(0, startIndex) + darkAestheticCss + css.slice(endIndex);
fs.writeFileSync(cssPath, css, 'utf8');
console.log('styles.css successfully updated with Dark Swiss Modernist / Texture.ai aesthetic!');
