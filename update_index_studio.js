const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update Nav Primary Links
if (!html.includes('href="#ai-design-studio" class="nav-link"')) {
  html = html.replace(
    '<li><a href="#services" class="nav-link">Services</a></li>',
    '<li><a href="#services" class="nav-link">Services</a></li>\n          <li><a href="#ai-design-studio" class="nav-link" style="color: #C98838; font-weight: 600;">AI Studio</a></li>'
  );
}

// 2. Update Nav Actions
if (!html.includes('class="nav-ai-studio-btn"')) {
  html = html.replace(
    '<div class="nav-actions">\n          <a href="#enquiry" class="nav-cta">Enquire</a>',
    '<div class="nav-actions">\n          <a href="#ai-design-studio" class="nav-ai-studio-btn"><span class="ai-sparkle">✦</span> AI Studio</a>\n          <a href="#enquiry" class="nav-cta">Enquire</a>'
  );
}

// 3. Update Hero Actions
if (!html.includes('class="btn-editorial ai-highlight-btn"')) {
  html = html.replace(
    '<div class="hero-actions">\n          <a href="#services" class="btn-editorial">Our services</a>',
    '<div class="hero-actions">\n          <a href="#ai-design-studio" class="btn-editorial ai-highlight-btn"><span class="ai-sparkle">✦</span> AI Design Studio &amp; Cost Estimator</a>\n          <a href="#services" class="btn-editorial">Our services</a>'
  );
}

// 4. AI Design Studio Section Markup
const aiStudioSectionHtml = `
    <!-- AI DESIGN STUDIO & COST ESTIMATOR -->
    <section class="section ai-studio-section fade-in-section" id="ai-design-studio">
      <div class="container">
        <!-- Header -->
        <div class="editorial-header">
          <div class="ai-header-tag-row">
            <span class="section-eyebrow" style="margin-bottom:0;">Intelligent Spatial Architecture</span>
            <div class="ai-status-badge">
              <span class="status-dot-green"></span>
              <span>Vision Engine Active</span>
            </div>
          </div>
          <h2 class="section-title">AI Design Studio &amp; Instant Estimation</h2>
          <p>Upload a room photograph or select an architectural preset. Our spatial AI analyzes room geometry, aperture orientation, and substrate condition, rendering a photo-realistic redesign concept alongside a deterministic trade-by-trade contractor estimate.</p>
        </div>

        <!-- Studio Grid Layout -->
        <div class="ai-studio-grid">
          <!-- Left Column: Image Upload & Spatial Questionnaire -->
          <div class="ai-panel-card">
            <!-- Hidden inputs -->
            <input type="file" id="aiFileInput" accept="image/jpeg,image/png,image/webp" style="display: none;">
            <input type="file" id="aiCameraInput" accept="image/*" capture="environment" style="display: none;">

            <!-- Dropzone -->
            <div class="ai-dropzone" id="aiDropzone">
              <svg class="ai-dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <div class="ai-dropzone-title">Upload Room Photograph</div>
              <p class="ai-dropzone-hint">Drag &amp; drop high-res JPG or PNG (up to 10MB) or click to browse</p>
              
              <div class="ai-upload-actions-bar">
                <button type="button" class="btn-camera-upload" id="aiCameraBtn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <span>Use Camera</span>
                </button>
              </div>

              <div class="ai-sample-presets-label">Or test with an architectural preset:</div>
              <div class="sample-rooms-row" id="aiSampleButtons">
                <button type="button" class="sample-room-btn" data-sample="living-sample">Modern Living Room</button>
                <button type="button" class="sample-room-btn" data-sample="bed-sample">Master Bedroom</button>
                <button type="button" class="sample-room-btn" data-sample="kitchen-sample">Contemporary Kitchen</button>
              </div>
            </div>

            <!-- Uploaded Image Preview Strip -->
            <div class="ai-image-preview-area" id="aiImagePreviewArea">
              <div class="ai-preview-meta">
                <img id="aiPreviewThumb" src="" alt="Room Preview" class="ai-preview-thumb">
                <div class="ai-preview-info">
                  <span id="aiPreviewName" class="ai-preview-filename">room_photo.jpg</span>
                  <span id="aiPreviewSize" class="ai-preview-filesize">2.4 MB</span>
                </div>
              </div>
              <button type="button" id="aiRemoveImgBtn" class="btn-remove-preview">Remove &times;</button>
            </div>

            <!-- Spatial Questionnaire -->
            <!-- 1. Room Type -->
            <div class="ai-form-group">
              <label class="ai-form-label">
                <span>01 &middot; Room Classification</span>
                <span class="ai-label-sub">Structural Archetype</span>
              </label>
              <div class="chip-group">
                <button type="button" class="chip-pill chip-room active" data-value="Living Room">Living Room</button>
                <button type="button" class="chip-pill chip-room" data-value="Master Bedroom">Master Bedroom</button>
                <button type="button" class="chip-pill chip-room" data-value="Kitchen">Kitchen</button>
                <button type="button" class="chip-pill chip-room" data-value="Dining Area">Dining Area</button>
                <button type="button" class="chip-pill chip-room" data-value="Bathroom / Powder">Bathroom</button>
                <button type="button" class="chip-pill chip-room" data-value="Home Office / Studio">Home Office</button>
              </div>
            </div>

            <!-- 2. Interior Design Style -->
            <div class="ai-form-group">
              <label class="ai-form-label">
                <span>02 &middot; Architectural Style</span>
                <span class="ai-label-sub">Materiality &amp; Mood</span>
              </label>
              <div class="chip-group">
                <button type="button" class="chip-pill chip-style active" data-value="Warm Minimalist">Warm Minimalist</button>
                <button type="button" class="chip-pill chip-style" data-value="Japandi / Zen">Japandi / Zen</button>
                <button type="button" class="chip-pill chip-style" data-value="Modern Contemporary">Modern Contemporary</button>
                <button type="button" class="chip-pill chip-style" data-value="Luxury Italian Neo-Classical">Italian Neo-Classical</button>
                <button type="button" class="chip-pill chip-style" data-value="Industrial Loft">Industrial Loft</button>
                <button type="button" class="chip-pill chip-style" data-value="Scandinavian Calm">Scandinavian Calm</button>
              </div>
            </div>

            <!-- 3. Approximate Floor Area -->
            <div class="ai-form-group">
              <label class="ai-form-label" for="aiAreaSlider">
                <span>03 &middot; Floor Area</span>
                <span class="ai-label-sub">Carpet Area Dimension</span>
              </label>
              <div class="ai-slider-container">
                <input type="range" id="aiAreaSlider" class="ai-range-input" min="50" max="1500" step="10" value="280">
                <div class="ai-number-input-wrap">
                  <input type="number" id="aiAreaInput" class="ai-number-input" min="50" max="2500" value="280">
                  <span class="ai-number-unit">sq.ft</span>
                </div>
              </div>
            </div>

            <!-- 4. Budget Grade -->
            <div class="ai-form-group">
              <label class="ai-form-label">
                <span>04 &middot; Finishing Specification Grade</span>
                <span class="ai-label-sub">Material Standard</span>
              </label>
              <div class="chip-group">
                <button type="button" class="chip-pill chip-budget" data-value="Economy">Economy &middot; Refresh</button>
                <button type="button" class="chip-pill chip-budget active" data-value="Mid-Range">Standard &middot; Mid-Range</button>
                <button type="button" class="chip-pill chip-budget" data-value="Luxury">Luxury &middot; Premium</button>
              </div>
            </div>

            <!-- 5. Change Scope (Multi-Select) -->
            <div class="ai-form-group">
              <label class="ai-form-label">
                <span>05 &middot; Scope of Contractor Trades</span>
                <span class="ai-label-sub">Select All Required</span>
              </label>
              <div class="chip-group">
                <button type="button" class="chip-pill chip-trade active" data-value="Flooring Systems">Flooring Systems</button>
                <button type="button" class="chip-pill chip-trade active" data-value="Painting &amp; Surface Coating">Wall Painting &amp; Texture</button>
                <button type="button" class="chip-pill chip-trade active" data-value="POP &amp; False Ceiling">POP False Ceiling</button>
                <button type="button" class="chip-pill chip-trade active" data-value="Architectural Lighting">Lighting Channels</button>
                <button type="button" class="chip-pill chip-trade active" data-value="Modular Kitchen &amp; Joinery">Modular Joinery</button>
                <button type="button" class="chip-pill chip-trade" data-value="Electrical &amp; Switchgear">Electrical &amp; Switches</button>
                <button type="button" class="chip-pill chip-trade" data-value="Custom Architectural Furniture">Custom Furniture</button>
                <button type="button" class="chip-pill chip-trade" data-value="Plumbing &amp; Sanitary">Sanitary &amp; Bath</button>
              </div>
            </div>

            <!-- 6. Regional City -->
            <div class="ai-form-group">
              <label class="ai-form-label" for="aiCitySelect">
                <span>06 &middot; Project Location</span>
                <span class="ai-label-sub">Regional Rate Matrix</span>
              </label>
              <div class="ai-city-row">
                <select id="aiCitySelect" class="ai-select">
                  <option value="Bengaluru" selected>Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Pune">Pune</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
                <span class="ai-city-multiplier-badge" id="aiCityMultiplierBadge">1.05x Metro Index</span>
              </div>
            </div>

            <!-- Action Button -->
            <button type="button" id="aiSubmitBtn" class="btn-ai-generate">
              <span class="ai-sparkle">✦</span>
              <span id="aiSubmitBtnText">Generate AI Design &amp; Cost Estimate</span>
            </button>
          </div>

          <!-- Right Column: Live Feature Explainer & Contractor Assurance -->
          <div class="ai-panel-card" style="background: linear-gradient(180deg, rgba(20,29,46,0.03) 0%, rgba(20,29,46,0.08) 100%);">
            <div class="editorial-header" style="margin-bottom: 24px;">
              <span class="section-eyebrow">The Decora Advantage</span>
              <h3 style="font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif); font-size: 1.25rem; font-weight: 700; color: var(--text-heading, #111827); margin-bottom: 8px;">Deterministic Accuracy Over AI Hallucination</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted, #6B7280); line-height: 1.6;">Unlike generic image generators, Sweety Colour Decora couples multimodal vision analysis directly with our audited trade rate database. Every square foot is cross-referenced against authentic Indian contractor labor and material rates.</p>
            </div>

            <div class="features-list">
              <div class="architectural-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C98838" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                <div>
                  <strong style="font-size: 0.86rem; color: var(--text-heading, #111827); display: block;">Real Contractor Unit Rates</strong>
                  <span style="font-size: 0.78rem; color: var(--text-muted, #6B7280);">Granular rates for vitrified tiles, gypsum framing, Asian Paints Royale, and Blum hardware.</span>
                </div>
              </div>

              <div class="architectural-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C98838" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                <div>
                  <strong style="font-size: 0.86rem; color: var(--text-heading, #111827); display: block;">Regional Cost Calibration</strong>
                  <span style="font-size: 0.78rem; color: var(--text-muted, #6B7280);">Automatic index adjustments reflecting localized supply chain and skilled labor logistics.</span>
                </div>
              </div>

              <div class="architectural-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C98838" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                <div>
                  <strong style="font-size: 0.86rem; color: var(--text-heading, #111827); display: block;">Direct Contractor Accountability</strong>
                  <span style="font-size: 0.78rem; color: var(--text-muted, #6B7280);">Convert preliminary AI concepts into a binding laser-measured Bill of Quantities (BOQ).</span>
                </div>
              </div>
            </div>

            <div style="margin-top: 32px; padding: 18px; border-radius: 8px; background: rgba(201,136,56,0.08); border: 1px solid rgba(201,136,56,0.25);">
              <div style="font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 0.72rem; color: #C98838; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Contractor Admin Control</div>
              <p style="font-size: 0.78rem; color: var(--text-muted, #6B7280); margin-bottom: 10px;">Contractors and estimators can update unit rates, trade margins, and city multipliers dynamically.</p>
              <button type="button" id="openAdminPricingBtn" class="btn-underline" style="font-size: 0.76rem; color: #C98838; cursor: pointer; background: none; border: none; padding: 0;">Open Rate Matrix Configurator &rarr;</button>
            </div>
          </div>
        </div>

        <!-- Animated Progress Stage (Visible During Analysis) -->
        <div class="ai-loading-container" id="aiLoadingContainer">
          <div class="ai-loading-icon-wrap">
            <svg class="spinner-spin" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </div>
          <div class="ai-stage-title" id="aiStageTitle">ANALYZING YOUR SPACE</div>
          <div class="ai-stage-desc" id="aiStageDesc">Evaluating geometry, spatial volume, natural apertures, and substrate surfaces...</div>
          <div class="ai-progress-track">
            <div class="ai-progress-bar" id="aiProgressBar"></div>
          </div>
          <div class="ai-progress-percent" id="aiProgressPercent">15%</div>
        </div>

        <!-- RESULTS DASHBOARD -->
        <div class="ai-results-container" id="aiResultsContainer">
          <!-- Results Header -->
          <div class="ai-results-header">
            <div>
              <h3 class="ai-concept-title" id="aiConceptTitle">Warm Minimalist Living Room</h3>
              <div class="ai-concept-subtitle" id="aiConceptSubtitle">Architectural Transformation &amp; Preliminary Contractor BOQ &middot; Bengaluru Market Calibration</div>
            </div>
            <button type="button" id="aiBookConsultationBtn" class="btn-book-consultation">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Book Site Laser Survey</span>
            </button>
          </div>

          <!-- Interactive Before / After Split Comparison Slider -->
          <div class="ai-comparison-card">
            <div class="ai-before-after-container" id="aiBeforeAfterContainer">
              <!-- Original Image (Bottom Layer) -->
              <img id="aiImgBefore" class="ai-img-before" src="" alt="Original Space" draggable="false">
              <div class="slider-label-badge badge-before">Original Space</div>

              <!-- AI Redesign Image (Clipped Top Layer) -->
              <div class="ai-after-clip-wrap" id="aiAfterClipWrap">
                <img id="aiImgAfter" class="ai-img-after" src="" alt="AI Redesign Concept" draggable="false">
                <div class="slider-label-badge badge-after">AI Redesign Concept</div>
              </div>

              <!-- Center Interactive Divider Handle -->
              <div class="ai-slider-handle" id="aiSliderHandle">
                <div class="ai-handle-pill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="8 7 3 12 8 17"/><polyline points="16 7 21 12 16 17"/></svg>
                </div>
              </div>

              <!-- Mandatory Watermark Badge -->
              <div class="ai-watermark-badge" id="aiWatermarkBadge">AI CONCEPT — FOR DESIGN VISUALIZATION ONLY</div>
            </div>
          </div>

          <!-- Design Narrative & Concept Description -->
          <div class="ai-narrative-card">
            <div class="ai-narrative-title">Architectural Design Direction</div>
            <p class="ai-narrative-text" id="aiDesignNarrative">A calibrated design synthesis balancing refined textures, low-glare perimeter illumination, and continuous spatial lines.</p>
          </div>

          <!-- 2-Column: Spatial Analysis & Material Palette -->
          <div class="ai-details-grid">
            <!-- Left: Spatial Analysis -->
            <div class="ai-info-card">
              <div class="ai-info-heading">Substrate &amp; Structural Analysis</div>
              <p id="aiConditionText" style="font-size: 0.82rem; color: var(--text-muted, #6B7280); line-height: 1.5; margin-bottom: 16px;">Sound substrate geometry with optimal candidate profile for architectural resurfacing.</p>
              <div style="font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 0.72rem; color: #C98838; text-transform: uppercase; margin-bottom: 10px; font-weight: 700;">Visible Architectural Features</div>
              <ul class="features-list" id="aiVisibleFeaturesList">
                <li class="architectural-feature-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Natural aperture fenestration providing balanced ambient illumination</span>
                </li>
              </ul>
              <div style="font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 0.72rem; color: #C98838; text-transform: uppercase; margin-top: 20px; margin-bottom: 10px; font-weight: 700;">Design Opportunities</div>
              <ul class="features-list" id="aiOpportunitiesList">
                <li class="architectural-feature-item">
                  <span class="bullet-mono">&bull;</span>
                  <span>Concealed ambient LED perimeter illumination</span>
                </li>
              </ul>
            </div>

            <!-- Right: Color Palette & Swatches -->
            <div class="ai-info-card">
              <div class="ai-info-heading">Curated Color Palette &amp; Finishes</div>
              <div class="swatches-grid" id="aiColorPaletteWrap">
                <!-- Dynamic Swatches -->
              </div>
            </div>
          </div>

          <!-- Recommended Materials -->
          <div class="materials-section-title">Recommended Architectural Specifications</div>
          <div class="materials-grid" id="aiMaterialsGrid">
            <!-- Dynamic Materials -->
          </div>

          <!-- Contractor Cost Breakdown & BOQ Summary -->
          <div class="cost-section-wrap">
            <div class="editorial-header" style="margin-bottom: 24px;">
              <span class="section-eyebrow">Preliminary Contractor BOQ</span>
              <h3 style="font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif); font-size: 1.3rem; font-weight: 700; color: var(--text-heading, #111827); margin-bottom: 6px;">Indicative Cost Estimation</h3>
              <p style="font-size: 0.84rem; color: var(--text-muted, #6B7280);">Calculated deterministically from the Sweety Colour Decora schedule of rates, incorporating regional city indexes and trade contingencies.</p>
            </div>

            <!-- KPI Cards Grid -->
            <div class="cost-kpi-grid">
              <div class="cost-kpi-card kpi-card-highlight">
                <div class="cost-kpi-label">Expected Project Estimate</div>
                <div class="cost-kpi-value val-highlight" id="aiCostExpected">₹9.91L</div>
                <div class="cost-kpi-sub">Standard Specification &middot; Inclusive of Trade Materials &amp; Labor</div>
              </div>

              <div class="cost-kpi-card">
                <div class="cost-kpi-label">Estimated Range</div>
                <div class="cost-kpi-value" id="aiCostRange">₹8.42L – ₹11.39L</div>
                <div class="cost-kpi-sub">&plusmn;15% Variance Based on Final Site Selection</div>
              </div>

              <div class="cost-kpi-card">
                <div class="cost-kpi-label">Base Trades Subtotal</div>
                <div class="cost-kpi-value" id="aiCostSubtotal">₹9.01L</div>
                <div class="cost-kpi-sub">Direct Construction &amp; Finishing Labor</div>
              </div>

              <div class="cost-kpi-card">
                <div class="cost-kpi-label">Contingency Reserve</div>
                <div class="cost-kpi-value" id="aiCostContingency">₹90,063 (10%)</div>
                <div class="cost-kpi-sub">Substrate Prep &amp; Site Variance Buffer</div>
              </div>
            </div>

            <!-- Itemized Trade Table -->
            <div class="cost-table-container">
              <table class="cost-table">
                <thead>
                  <tr>
                    <th>Trade Category &amp; Scope</th>
                    <th>Material Grade</th>
                    <th style="text-align: right;">Estimated Cost</th>
                  </tr>
                </thead>
                <tbody id="aiCostTableBody">
                  <!-- Dynamic Trade Rows -->
                </tbody>
              </table>
            </div>

            <!-- Legal & Contractor Disclaimer Callout -->
            <div class="cost-disclaimer-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div id="aiCostDisclaimer">This is an AI-generated preliminary estimate based on the information provided and visible conditions. Final pricing depends on site measurements, material selection, design development, structural requirements, local labor rates, and actual site conditions.</div>
            </div>

            <!-- Call to Action Row -->
            <div class="ai-cta-row" style="margin-top: 28px;">
              <div>
                <strong style="font-size: 0.94rem; color: var(--text-heading, #111827); display: block;">Ready to turn this concept into reality?</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted, #6B7280);">Request an on-site physical laser survey. Our senior site engineers will verify substrate conditions and deliver a binding BOQ within 48 hours.</span>
              </div>
              <button type="button" class="btn-editorial" onclick="document.getElementById('aiBookConsultationBtn').click()">Book Site Laser Survey &rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </section>
`;

if (!html.includes('id="ai-design-studio"')) {
  html = html.replace(
    '</section>\n\n    <!-- Section 2: About / Credibility -->',
    '</section>\n' + aiStudioSectionHtml + '\n    <!-- Section 2: About / Credibility -->'
  );
}

// 5. Update Footer with Admin Pricing Matrix link
if (!html.includes('Rate Matrix (Admin)')) {
  html = html.replace(
    '<li><a href="#services">Marble Laying</a></li>',
    '<li><a href="#services">Marble Laying</a></li>\n            <li><a href="#ai-design-studio">AI Design Studio</a></li>\n            <li><a href="#" onclick="document.getElementById(\'openAdminPricingBtn\').click(); return false;">Rate Matrix (Admin)</a></li>'
  );
}

// 6. Modals & Script Tag
const modalsAndScriptHtml = `
  <!-- CONSULTATION & SITE SURVEY MODAL -->
  <div class="modal-overlay" id="consultationModal" role="dialog" aria-modal="true" aria-labelledby="consultModalTitle">
    <div class="modal-content">
      <button type="button" class="modal-close-btn" id="closeConsultationModal" aria-label="Close modal">&times;</button>
      <h3 class="modal-title" id="consultModalTitle">Schedule Physical Site Laser Survey</h3>
      <p class="modal-subtitle">Our senior site engineer will inspect substrates, measure actual laser dimensions, and prepare a binding contractor BOQ.</p>

      <div class="modal-summary-box" id="consultationSummary">
        <!-- Pre-filled design summary -->
      </div>

      <div id="consultationNotice"></div>

      <form id="consultationForm">
        <div class="modal-form-grid" style="margin-bottom: 14px;">
          <div>
            <label class="ai-form-label" for="consultName">Your Name *</label>
            <input type="text" id="consultName" class="modal-input" required placeholder="e.g. Rajesh Shah">
          </div>
          <div>
            <label class="ai-form-label" for="consultPhone">Contact Number *</label>
            <input type="tel" id="consultPhone" class="modal-input" required placeholder="+91 98765 43210">
          </div>
        </div>

        <div class="modal-form-grid" style="margin-bottom: 14px;">
          <div>
            <label class="ai-form-label" for="consultEmail">Email Address</label>
            <input type="email" id="consultEmail" class="modal-input" placeholder="name@company.com">
          </div>
          <div>
            <label class="ai-form-label" for="consultDate">Preferred Survey Date</label>
            <input type="date" id="consultDate" class="modal-input">
          </div>
        </div>

        <div style="margin-bottom: 14px;">
          <label class="ai-form-label" for="consultAddress">Site Location / Address *</label>
          <input type="text" id="consultAddress" class="modal-input" required placeholder="e.g. Apt 402, Indiranagar, Bengaluru">
        </div>

        <div style="margin-bottom: 20px;">
          <label class="ai-form-label" for="consultNotes">Specific Requirements or Scope Notes</label>
          <textarea id="consultNotes" class="modal-input" rows="3" placeholder="Mention any specific brands, timelines, or structural modifications needed..."></textarea>
        </div>

        <button type="submit" class="btn-ai-generate" style="margin-top: 0;">Confirm Site Measurement Visit</button>
      </form>
    </div>
  </div>

  <!-- CONTRACTOR ADMIN PRICING DATABASE MODAL -->
  <div class="modal-overlay" id="adminPricingModal" role="dialog" aria-modal="true" aria-labelledby="adminModalTitle">
    <div class="modal-content modal-content-wide">
      <button type="button" class="modal-close-btn" id="closeAdminPricingBtn" aria-label="Close modal">&times;</button>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <h3 class="modal-title" id="adminModalTitle" style="margin-bottom: 0;">Contractor Rate Matrix Configuration</h3>
        <span class="ai-status-badge">Admin Panel</span>
      </div>
      <p class="modal-subtitle">Adjust trade unit rates and regional city index multipliers directly. All preliminary AI estimates reflect these numbers in real time.</p>

      <h4 style="font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif); font-size: 0.94rem; margin-bottom: 12px; color: var(--text-heading, #111827);">Trade Rates Matrix (₹ INR)</h4>
      <div style="max-height: 240px; overflow-y: auto; margin-bottom: 24px; border: 1px solid var(--border, #E5E7EB); border-radius: 6px;">
        <table class="cost-table" style="margin-bottom: 0;">
          <thead>
            <tr>
              <th>Trade &amp; Unit</th>
              <th>Economy (₹)</th>
              <th>Standard (₹)</th>
              <th>Luxury (₹)</th>
            </tr>
          </thead>
          <tbody id="adminRatesTableBody">
            <!-- Dynamic Admin Rows -->
          </tbody>
        </table>
      </div>

      <h4 style="font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif); font-size: 0.94rem; margin-bottom: 12px; color: var(--text-heading, #111827);">Regional City Multipliers</h4>
      <div style="max-height: 180px; overflow-y: auto; margin-bottom: 24px; border: 1px solid var(--border, #E5E7EB); border-radius: 6px;">
        <table class="cost-table" style="margin-bottom: 0;">
          <thead>
            <tr>
              <th>City</th>
              <th>Multiplier Index</th>
            </tr>
          </thead>
          <tbody id="adminCitiesTableBody">
            <!-- Dynamic Cities Rows -->
          </tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <button type="button" class="btn-underline" onclick="document.getElementById('closeAdminPricingBtn').click()">Cancel</button>
        <button type="button" id="saveAdminPricingBtn" class="btn-editorial" style="background: #C98838; color: #0E1626; border-color: #C98838;">Save Pricing Database</button>
      </div>
    </div>
  </div>

  <script src="app.js"></script>
  <script src="ai_studio.js"></script>
</body>
</html>
`;

if (!html.includes('src="ai_studio.js"')) {
  html = html.replace(
    '  <script src="app.js"></script>\n</body>\n</html>',
    modalsAndScriptHtml.trim()
  );
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('index.html successfully updated with AI Studio components and scripts!');
