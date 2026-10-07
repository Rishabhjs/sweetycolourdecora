/**
 * SWEETY COLOUR DECORA — AI DESIGN STUDIO & COST ESTIMATOR
 * Client-side Controller for Room Analysis, Before/After Slider,
 * Real-time Cost Estimation, Consultation Leads, and Admin Pricing.
 */

(function () {
  'use strict';

  // State
  const state = {
    uploadedImageBase64: null,
    uploadedImageFile: null,
    selectedRoom: 'Living Room',
    selectedStyle: 'Warm Minimalist',
    areaSqFt: 280,
    budgetRange: 'Mid-Range',
    selectedCity: 'Bengaluru',
    selectedTrades: ['Flooring Systems', 'Painting & Surface Coating', 'POP & False Ceiling', 'Architectural Lighting', 'Modular Kitchen & Joinery'],
    isAnalyzing: false,
    currentResult: null,
    activeSliderPos: 50 // 0 to 100%
  };

  // Sample rooms for 1-click testing with exact perspective-matched architectural pairs
  const sampleRooms = [
    {
      id: 'living-sample',
      name: 'Modern Living Room',
      roomType: 'Living Room',
      style: 'Warm Minimalist',
      area: 280,
      beforeImage: 'images/living_before.jpg',
      afterImage: 'images/living_after.jpg'
    },
    {
      id: 'bed-sample',
      name: 'Master Bedroom',
      roomType: 'Master Bedroom',
      style: 'Japandi / Zen',
      area: 220,
      beforeImage: 'images/bedroom_before.jpg',
      afterImage: 'images/bedroom_after.jpg'
    },
    {
      id: 'kitchen-sample',
      name: 'Contemporary Kitchen',
      roomType: 'Kitchen',
      style: 'Modern Contemporary',
      area: 160,
      beforeImage: 'images/kitchen_before.jpg',
      afterImage: 'images/kitchen_after.jpg'
    }
  ];

  // Stage progress steps for loading experience
  const analysisStages = [
    { title: 'ANALYZING YOUR SPACE', desc: 'Evaluating geometry, spatial volume, natural apertures, and substrate surfaces...' },
    { title: 'IDENTIFYING ARCHITECTURAL FEATURES', desc: 'Detecting ceiling clearance, structural load boundaries, and lighting angles...' },
    { title: 'BUILDING YOUR DESIGN DIRECTION', desc: 'Synthesizing selected architectural style palette, textures, and bespoke joinery...' },
    { title: 'SELECTING MATERIALS', desc: 'Matching Italian marble, vitrified tiles, acoustic plaster, and LED profile channels...' },
    { title: 'CALCULATING INDICATIVE COST', desc: 'Querying Sweety Colour Decora rate matrix with regional city multipliers...' },
    { title: 'GENERATING ARCHITECTURAL CONCEPT', desc: 'Rendering side-by-side high-resolution visualization and itemized BOQ...' }
  ];

  // DOM Elements cache
  let el = {};

  function initElements() {
    el = {
      section: document.getElementById('ai-design-studio'),
      dropzone: document.getElementById('aiDropzone'),
      fileInput: document.getElementById('aiFileInput'),
      cameraInput: document.getElementById('aiCameraInput'),
      previewArea: document.getElementById('aiImagePreviewArea'),
      previewImg: document.getElementById('aiPreviewThumb'),
      previewName: document.getElementById('aiPreviewName'),
      previewSize: document.getElementById('aiPreviewSize'),
      removeImgBtn: document.getElementById('aiRemoveImgBtn'),
      sampleBtnRow: document.getElementById('aiSampleButtons'),

      // Inputs
      roomChips: document.querySelectorAll('.chip-room, [data-group="space"]'),
      styleChips: document.querySelectorAll('.chip-style, [data-group="style"]'),
      budgetChips: document.querySelectorAll('.chip-budget, [data-group="budget"]'),
      tradeChips: document.querySelectorAll('.chip-trade, #tagRow .tag'),
      areaSlider: document.getElementById('areaSlider') || document.getElementById('aiAreaSlider'),
      areaInput: document.getElementById('aiAreaInput'),
      areaVal: document.getElementById('areaVal'),
      citySelect: document.getElementById('aiCitySelect') || document.querySelector('.loc-row select'),
      cityBadge: document.getElementById('aiCityMultiplierBadge') || document.querySelector('.index-badge'),
      submitBtn: document.getElementById('aiSubmitBtn') || document.querySelector('.submit'),
      submitBtnText: document.getElementById('aiSubmitBtnText'),

      // Loading stage
      loadingContainer: document.getElementById('aiLoadingContainer'),
      loadingStageTitle: document.getElementById('aiStageTitle'),
      loadingStageDesc: document.getElementById('aiStageDesc'),
      progressBar: document.getElementById('aiProgressBar'),
      progressPercent: document.getElementById('aiProgressPercent'),

      // Results container
      resultsContainer: document.getElementById('aiResultsContainer'),
      conceptTitle: document.getElementById('aiConceptTitle'),
      conceptSubtitle: document.getElementById('aiConceptSubtitle'),
      watermarkBadge: document.getElementById('aiWatermarkBadge'),

      // Before / After Slider
      sliderContainer: document.getElementById('aiBeforeAfterContainer'),
      imgBefore: document.getElementById('aiImgBefore'),
      imgAfter: document.getElementById('aiImgAfter'),
      sliderHandle: document.getElementById('aiSliderHandle'),
      afterClipWrap: document.getElementById('aiAfterClipWrap'),

      // Analysis & Materials
      visibleFeaturesList: document.getElementById('aiVisibleFeaturesList'),
      conditionText: document.getElementById('aiConditionText'),
      opportunitiesList: document.getElementById('aiOpportunitiesList'),
      colorPaletteWrap: document.getElementById('aiColorPaletteWrap'),
      materialsGrid: document.getElementById('aiMaterialsGrid'),
      designConceptNarrative: document.getElementById('aiDesignNarrative'),

      // Cost Breakdown
      costExpected: document.getElementById('aiCostExpected'),
      costRange: document.getElementById('aiCostRange'),
      costSubtotal: document.getElementById('aiCostSubtotal'),
      costContingency: document.getElementById('aiCostContingency'),
      costTableBody: document.getElementById('aiCostTableBody'),
      costDisclaimer: document.getElementById('aiCostDisclaimer'),

      // Modals
      btnBookConsultation: document.getElementById('aiBookConsultationBtn'),
      consultationModal: document.getElementById('consultationModal'),
      consultationForm: document.getElementById('consultationForm'),
      closeConsultationModal: document.getElementById('closeConsultationModal'),
      consultationSummary: document.getElementById('consultationSummary'),
      consultationNotice: document.getElementById('consultationNotice'),

      // Admin Modal
      openAdminBtn: document.getElementById('openAdminPricingBtn'),
      adminModal: document.getElementById('adminPricingModal'),
      closeAdminBtn: document.getElementById('closeAdminPricingBtn'),
      adminRatesTable: document.getElementById('adminRatesTableBody'),
      adminCitiesTable: document.getElementById('adminCitiesTableBody'),
      saveAdminPricingBtn: document.getElementById('saveAdminPricingBtn'),

      // Visibility triggers
      heroToggleBtn: document.getElementById('heroToggleStudioBtn'),
      navStudioBtn: document.getElementById('navStudioBtn'),
      closeStudioBtn: document.getElementById('closeStudioBtn')
    };
  }

  function init() {
    initElements();
    if (!el.section) return;

    setupStudioVisibility();
    setupDropzone();
    setupQuestionnaire();
    setupBeforeAfterSlider();
    setupConsultationModal();
    setupAdminModal();
    updateCityMultiplierBadge();
  }

  function setupStudioVisibility() {
    const openStudio = (e) => {
      if (e) e.preventDefault();
      if (el.section) {
        el.section.style.display = 'block';
        el.section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (el.heroToggleBtn) el.heroToggleBtn.addEventListener('click', openStudio);
    if (el.navStudioBtn) el.navStudioBtn.addEventListener('click', openStudio);

    if (el.closeStudioBtn && el.section) {
      el.closeStudioBtn.addEventListener('click', (e) => {
        e.preventDefault();
        el.section.style.display = 'none';
        const hero = document.getElementById('hero');
        if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    if (window.location.hash === '#ai-design-studio' && el.section) {
      el.section.style.display = 'block';
    }
  }

  // Dropzone & File Handling
  function setupDropzone() {
    if (!el.dropzone || !el.fileInput) return;

    // Click to upload
    el.dropzone.addEventListener('click', (e) => {
      if (e.target.closest('#aiSampleButtons') || e.target.closest('#aiCameraBtn')) return;
      el.fileInput.click();
    });

    // Camera button
    const cameraBtn = document.getElementById('aiCameraBtn');
    if (cameraBtn && el.cameraInput) {
      cameraBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        el.cameraInput.click();
      });
    }

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(name => {
      el.dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.dropzone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      el.dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.dropzone.classList.remove('drag-active');
      });
    });

    el.dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    el.fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
      }
    });

    if (el.cameraInput) {
      el.cameraInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFileSelect(e.target.files[0]);
        }
      });
    }

    // Remove photo
    if (el.removeImgBtn) {
      el.removeImgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetUploadedImage();
      });
    }

    // Sample Room buttons
    if (el.sampleBtnRow) {
      el.sampleBtnRow.addEventListener('click', (e) => {
        const btn = e.target.closest('.sample-room-btn');
        if (!btn) return;
        const sampleId = btn.dataset.sample;
        const sample = sampleRooms.find(s => s.id === sampleId);
        if (sample) {
          applySampleRoom(sample);
        }
      });
    }

    // Global & Dropzone Clipboard Paste (Ctrl+V)
    window.addEventListener('paste', (e) => {
      // Don't intercept if typing inside an active text/number input
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        if (activeEl.type === 'text' || activeEl.type === 'email' || activeEl.type === 'number') {
          return;
        }
      }

      if (e.clipboardData && e.clipboardData.items) {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
              e.preventDefault();
              // Auto-open AI Studio section if it is currently hidden on the page
              if (el.section && el.section.style.display === 'none') {
                el.section.style.display = 'block';
                el.section.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
              handleFileSelect(file);
              break;
            }
          }
        }
      }
    });

  }

  function handleFileSelect(file) {
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
      alert('Please upload a JPG, JPEG, PNG, or WebP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please choose a smaller image.');
      return;
    }

    state.uploadedImageFile = file;
    state.isSamplePreset = false;
    state.sampleAfterImage = null;

    const reader = new FileReader();
    reader.onload = (e) => {
      state.uploadedImageBase64 = e.target.result;
      showImagePreview(file.name, (file.size / (1024 * 1024)).toFixed(2) + ' MB', state.uploadedImageBase64);
    };
    reader.readAsDataURL(file);
  }

  function applySampleRoom(sample) {
    state.uploadedImageBase64 = sample.beforeImage;
    state.sampleAfterImage = sample.afterImage;
    state.isSamplePreset = true;
    state.uploadedImageFile = null;
    state.selectedRoom = sample.roomType;
    state.selectedStyle = sample.style;
    state.areaSqFt = sample.area;

    // Sync UI chips
    syncChips(el.roomChips, sample.roomType);
    syncChips(el.styleChips, sample.style);
    if (el.areaSlider) {
      el.areaSlider.value = sample.area;
      if (el.areaVal) el.areaVal.textContent = sample.area;
    }
    if (el.areaInput) el.areaInput.value = sample.area;

    showImagePreview(sample.name + ' (Survey Preset)', 'Matched Architectural Pair', sample.beforeImage);
  }

  function showImagePreview(name, sizeStr, src) {
    if (!el.previewArea) return;
    el.previewImg.src = src;
    el.previewName.textContent = name;
    el.previewSize.textContent = sizeStr;
    el.previewArea.style.display = 'flex';
    el.dropzone.classList.add('has-preview');
  }

  function resetUploadedImage() {
    state.uploadedImageBase64 = null;
    state.uploadedImageFile = null;
    state.isSamplePreset = false;
    state.sampleAfterImage = null;
    if (el.fileInput) el.fileInput.value = '';
    if (el.cameraInput) el.cameraInput.value = '';
    if (el.previewArea) el.previewArea.style.display = 'none';
    if (el.dropzone) el.dropzone.classList.remove('has-preview');
  }

  // Questionnaire Setup
  function setupQuestionnaire() {
    // Room chips
    setupChipGroup(el.roomChips, (val) => {
      state.selectedRoom = val;
      // Auto-set standard area based on room type
      const defaultAreas = {
        'Living Room': 280,
        'Master Bedroom': 220,
        'Kitchen': 150,
        'Dining Area': 180,
        'Bathroom / Powder': 80,
        'Home Office / Studio': 160
      };
      if (defaultAreas[val]) {
        state.areaSqFt = defaultAreas[val];
        if (el.areaSlider) el.areaSlider.value = state.areaSqFt;
        if (el.areaInput) el.areaInput.value = state.areaSqFt;
      }
    });

    // Style chips
    setupChipGroup(el.styleChips, (val) => {
      state.selectedStyle = val;
    });

    // Budget chips
    setupChipGroup(el.budgetChips, (val) => {
      state.budgetRange = val;
    });

    // Multi-select trade chips
    if (el.tradeChips) {
      el.tradeChips.forEach(chip => {
        chip.addEventListener('click', () => {
          chip.classList.toggle('active');
          const val = chip.dataset.value || chip.textContent.trim();
          if (chip.classList.contains('active')) {
            if (!state.selectedTrades.includes(val)) state.selectedTrades.push(val);
          } else {
            state.selectedTrades = state.selectedTrades.filter(t => t !== val);
          }
        });
      });
    }

    // Area slider & number input sync
    if (el.areaSlider) {
      el.areaSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        state.areaSqFt = val;
        if (el.areaVal) el.areaVal.textContent = val;
        if (el.areaInput) el.areaInput.value = val;
      });
    }

    if (el.areaInput) {
      el.areaInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 100;
        if (val < 50) val = 50;
        if (val > 2500) val = 2500;
        state.areaSqFt = val;
        if (el.areaSlider) el.areaSlider.value = val;
        if (el.areaVal) el.areaVal.textContent = val;
      });
    }

    const skipBtn = document.getElementById('aiSkipAreaBtn') || document.getElementById('aiDontKnowAreaBtn');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        state.areaSqFt = 280;
        if (el.areaSlider) el.areaSlider.value = 280;
        if (el.areaVal) el.areaVal.textContent = 280;
        if (el.areaInput) el.areaInput.value = 280;
      });
    }

    // "I don't know" area helper button
    const dontKnowBtn = document.getElementById('aiDontKnowAreaBtn');
    if (dontKnowBtn) {
      dontKnowBtn.addEventListener('click', () => {
        const defaultAreas = {
          'Living Room': 280,
          'Master Bedroom': 240,
          'Bedroom': 180,
          'Kitchen': 120,
          'Dining Area': 180,
          'Bathroom / Powder': 70,
          'Home Office / Studio': 160,
          'Balcony / Outdoor': 90,
          'Full Apartment': 1200
        };
        const defaultArea = defaultAreas[state.selectedRoom] || 250;
        state.areaSqFt = defaultArea;
        if (el.areaSlider) el.areaSlider.value = defaultArea;
        if (el.areaInput) el.areaInput.value = defaultArea;
      });
    }

    // City select
    if (el.citySelect) {
      el.citySelect.addEventListener('change', (e) => {
        state.selectedCity = e.target.value;
        updateCityMultiplierBadge();
      });
    }

    // Submit button
    if (el.submitBtn) {
      el.submitBtn.addEventListener('click', handleGenerateDesign);
    }
  }

  function setupChipGroup(chips, onSelect) {
    if (!chips) return;
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const val = chip.dataset.value || chip.querySelector('span')?.textContent.trim() || chip.textContent.trim();
        onSelect(val);
      });
    });
  }

  function syncChips(chips, value) {
    if (!chips) return;
    chips.forEach(c => {
      const v = c.dataset.value || c.querySelector('span')?.textContent.trim() || c.textContent.trim();
      if (v && value && (v.toLowerCase() === value.toLowerCase() || v.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(v.toLowerCase()))) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
  }

  function updateCityMultiplierBadge() {
    if (!el.cityBadge || !el.citySelect) return;
    const city = el.citySelect.value;
    const multipliers = {
      'Bengaluru': '1.05x Metro Index',
      'Mumbai': '1.20x Premium Metro',
      'Delhi NCR': '1.08x Capital Index',
      'Hyderabad': '1.00x Base Benchmark',
      'Chennai': '1.02x Coastal Metro',
      'Pune': '1.04x Regional Metro',
      'Ahmedabad': '0.96x Regional Index',
      'Kolkata': '0.94x Regional Index'
    };
    el.cityBadge.textContent = multipliers[city] || 'Standard Regional Rate';
  }

  // Generate Design Action & Progress Simulation
  async function handleGenerateDesign() {
    if (state.isAnalyzing) return;
    state.isAnalyzing = true;

    // Show loading state
    el.loadingContainer.style.display = 'block';
    el.resultsContainer.style.display = 'none';
    el.submitBtn.disabled = true;
    el.submitBtn.classList.add('loading');
    el.submitBtnText.textContent = 'Analyzing Space & Estimating...';

    // Scroll smoothly to loading container
    el.loadingContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Progress animation simulation
    let currentStageIdx = 0;
    const updateStage = (idx, pct) => {
      if (analysisStages[idx]) {
        el.loadingStageTitle.textContent = analysisStages[idx].title;
        el.loadingStageDesc.textContent = analysisStages[idx].desc;
      }
      el.progressBar.style.width = pct + '%';
      el.progressPercent.textContent = pct + '%';
    };

    updateStage(0, 15);

    const progressTimer = setInterval(() => {
      currentStageIdx = Math.min(currentStageIdx + 1, analysisStages.length - 1);
      const pct = Math.min(25 + currentStageIdx * 14, 92);
      updateStage(currentStageIdx, pct);
    }, 700);

    const payload = {
      image: state.uploadedImageBase64,
      beforeImage: state.uploadedImageBase64,
      afterImage: state.isSamplePreset ? state.sampleAfterImage : null,
      isPreset: state.isSamplePreset,
      roomType: state.selectedRoom,
      style: state.selectedStyle,
      areaSqFt: state.areaSqFt,
      budgetRange: state.budgetRange,
      city: state.selectedCity,
      changeScope: state.selectedTrades
    };

    try {
      const res = await fetch('/api/ai-design/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      clearInterval(progressTimer);
      updateStage(analysisStages.length - 1, 100);

      setTimeout(() => {
        el.loadingContainer.style.display = 'none';
        el.submitBtn.disabled = false;
        el.submitBtn.classList.remove('loading');
        el.submitBtnText.textContent = 'Generate AI Design & Cost Estimate';
        state.isAnalyzing = false;

        if (data && data.success) {
          state.currentResult = data;
          renderResults(data);
        } else {
          alert(data?.error || 'Unable to analyze image. Please try another photo.');
        }
      }, 500);

    } catch (err) {
      clearInterval(progressTimer);
      console.error('AI Analysis failed:', err);
      el.loadingContainer.style.display = 'none';
      el.submitBtn.disabled = false;
      el.submitBtn.classList.remove('loading');
      el.submitBtnText.textContent = 'Generate AI Design & Cost Estimate';
      state.isAnalyzing = false;
      alert('Could not connect to the AI design service. Please ensure the server is active.');
    }
  }

  // Render Analysis Results & BOQ
  function renderResults(data) {
    el.resultsContainer.style.display = 'block';

    // Title & Concept Header
    el.conceptTitle.textContent = `${data.designStyle} ${data.roomType}`;
    if (el.conceptSubtitle) {
      el.conceptSubtitle.innerHTML = `Architectural Transformation & Preliminary Contractor BOQ &middot; ${data.city} Market Calibration`;
    }

    // Before & After Images
    if (data.beforeImage) el.imgBefore.src = data.beforeImage;
    if (data.afterImage) el.imgAfter.src = data.afterImage;

    // Reset slider to center
    setSliderPosition(50);

    // 1. Three-Block Analysis Distinction (Part 5)
    const facts = data.room_analysis?.visible_facts || data.analysis?.visible_facts || data.analysis?.visible_features || [];
    const elFacts = document.getElementById('aiVisibleFactsList');
    if (elFacts && facts.length) {
      elFacts.innerHTML = facts.map(f => `
        <li class="architectural-feature-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>${f}</span>
        </li>
      `).join('');
    }

    const ests = data.room_analysis?.estimations || data.analysis?.estimations || [];
    const elEsts = document.getElementById('aiEstimationsList');
    if (elEsts && ests.length) {
      elEsts.innerHTML = ests.map(e => `
        <li class="architectural-feature-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C98838" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          <span>${e}</span>
        </li>
      `).join('');
    }

    const unks = data.room_analysis?.unknown_information || data.analysis?.unknown_information || [
      'Exact millimeter dimensions require physical laser survey audit.',
      'Substrate moisture content must be verified with on-site moisture meter.',
      'Concealed plumbing and electrical conduit layouts require structural inspection.'
    ];
    const elUnks = document.getElementById('aiUnknownsList');
    if (elUnks && unks.length) {
      elUnks.innerHTML = unks.map(u => `
        <li class="architectural-feature-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>${u}</span>
        </li>
      `).join('');
    }

    // 2. Specifications (Part 6)
    const des = data.design || {};
    if (document.getElementById('specFlooring')) document.getElementById('specFlooring').textContent = des.flooring || 'Large-format Vitrified / Italian Marble';
    if (document.getElementById('specWalls')) document.getElementById('specWalls').textContent = des.walls || 'Level-5 Skim Coat Putty with Luxury Emulsion';
    if (document.getElementById('specCeiling')) document.getElementById('specCeiling').textContent = des.ceiling || 'Gypsum False Ceiling with Cove Lighting';
    if (document.getElementById('specLighting')) document.getElementById('specLighting').textContent = des.lighting || '3000K Warm-White COB Spotlights & Indirect Strips';
    if (document.getElementById('specKitchen')) document.getElementById('specKitchen').textContent = des.kitchen || 'BWP Marine Plywood with Quartz Surface';
    if (document.getElementById('specWardrobes')) document.getElementById('specWardrobes').textContent = des.wardrobes || 'Floor-to-Ceiling Joinery with Soft-Close Hardware';

    // 3. Materials Table (Part 8)
    const mats = des.materials || des.recommended_materials || [];
    const matTable = document.getElementById('aiMaterialsTableBody');
    if (matTable && mats.length) {
      matTable.innerHTML = mats.map(m => `
        <tr>
          <td style="font-weight:600; color:#FFFFFF;">${m.material || m.name || 'Finish Spec'}</td>
          <td><span class="grade-badge standard">${m.quality || m.grade || 'First Quality'}</span></td>
          <td style="color:#C98838; font-weight:600;">${m.est_rate || m.rate || 'Contractor Standard'}</td>
          <td style="color:#94A3B8; font-size:0.82rem;">${m.reason || m.purpose || 'High-performance finish'}</td>
        </tr>
      `).join('');
    }

    // Visible Features Legacy Fallback
    if (el.visibleFeaturesList && data.analysis?.visible_features) {
      el.visibleFeaturesList.innerHTML = data.analysis.visible_features.map(f => `
        <li class="architectural-feature-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>${f}</span>
        </li>
      `).join('');
    }

    // Condition Assessment
    if (el.conditionText && data.analysis?.estimated_condition) {
      el.conditionText.textContent = data.analysis.estimated_condition;
    }

    // Design Opportunities
    if (el.opportunitiesList && data.analysis?.design_opportunities) {
      el.opportunitiesList.innerHTML = data.analysis.design_opportunities.map(o => `
        <li class="architectural-feature-item">
          <span class="bullet-mono">&bull;</span>
          <span>${o}</span>
        </li>
      `).join('');
    }

    // Design Narrative
    if (el.designConceptNarrative && data.design?.design_concept) {
      el.designConceptNarrative.textContent = data.design.design_concept;
    }

    // Color Palette Swatches
    if (el.colorPaletteWrap && data.design?.color_palette) {
      el.colorPaletteWrap.innerHTML = data.design.color_palette.map(color => {
        const hex = (typeof color === 'string' ? color : color?.hex) || '#C98838';
        const name = (typeof color === 'object' && color?.name) ? color.name : 'Architectural Tone';
        const role = (typeof color === 'object' && color?.role) ? color.role : 'Surface Accent';
        return `
          <div class="swatch-card">
            <div class="swatch-preview" style="background-color: ${hex}; border: 1px solid rgba(255,255,255,0.15);"></div>
            <div class="swatch-info">
              <span class="swatch-name">${name}</span>
              <span class="swatch-hex">${hex}</span>
              <span class="swatch-role">${role}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // Materials Grid
    if (el.materialsGrid && (data.design?.recommended_materials || data.design?.materials)) {
      const mats = data.design.recommended_materials || data.design.materials;
      el.materialsGrid.innerHTML = mats.map(mat => {
        const cat = mat.category || 'Architectural Specification';
        const name = mat.material || (typeof mat === 'string' ? mat : 'Standard Finish');
        const finish = mat.finish || 'Contractor Standard';
        const purpose = mat.purpose || 'High-performance architectural finishing';
        const rate = mat.est_rate || 'Inclusive of Labor & Materials';
        return `
          <div class="material-card">
            <div class="material-category-tag">${cat}</div>
            <h4 class="material-name">${name}</h4>
            <div class="material-finish">Finish: <strong>${finish}</strong></div>
            <p class="material-purpose">${purpose}</p>
            <div class="material-rate-tag">${rate}</div>
          </div>
        `;
      }).join('');
    }

    // Cost Breakdown Summary Cards
    const est = data.costEstimate;
    if (est) {
      const sum = est.summary || {};
      if (el.costExpected) el.costExpected.textContent = sum.expectedFormatted || est.expectedFormatted || '—';
      if (el.costRange) el.costRange.textContent = sum.rangeFormatted || est.rangeFormatted || '—';
      if (el.costSubtotal) el.costSubtotal.textContent = sum.lowFormatted ? `${sum.lowFormatted} – ${sum.highFormatted}` : (est.subtotalFormatted || '—');
      if (el.costContingency) el.costContingency.textContent = est.contingencyFormatted ? `${est.contingencyFormatted} (${est.contingencyPercent}%)` : '10% Contingency';

      // Notice banner for Customer: Explicit Approx AI Estimation
      const noticeBox = document.getElementById('aiApproximateNoticeBox');
      const noticeText = document.getElementById('aiApproximateNoticeText');
      if (noticeBox) noticeBox.style.display = 'flex';
      if (noticeText && (est.approximate_notice || est.disclaimer)) {
        noticeText.textContent = est.approximate_notice || est.disclaimer;
      }

      // RAG Grounding Reference Strip
      const refList = document.getElementById('ragReferenceProjectsList');
      if (refList && est.reference_projects && est.reference_projects.length) {
        refList.innerHTML = est.reference_projects.map(r => `
          <span style="font-size: 0.74rem; background: rgba(201, 136, 56, 0.12); border: 1px solid rgba(201, 136, 56, 0.35); border-radius: 4px; padding: 4px 10px; color: #DDA15E; display: inline-flex; align-items: center; gap: 4px;">
            <strong>${r.project_name}</strong> (${r.city}) &middot; ₹${Number(r.final_cost_inr).toLocaleString('en-IN')}
          </span>
        `).join('');
      }

      const confBadge = document.getElementById('ragConfidenceBadge');
      if (confBadge && est.confidence) {
        confBadge.textContent = `${est.confidence.toUpperCase()} CONFIDENCE`;
        if (est.confidence === 'high') {
          confBadge.style.borderColor = '#10B981';
          confBadge.style.color = '#10B981';
          confBadge.style.background = 'rgba(16, 185, 129, 0.15)';
        } else if (est.confidence === 'medium') {
          confBadge.style.borderColor = '#F59E0B';
          confBadge.style.color = '#F59E0B';
          confBadge.style.background = 'rgba(245, 158, 11, 0.15)';
        } else {
          confBadge.style.borderColor = '#EF4444';
          confBadge.style.color = '#EF4444';
          confBadge.style.background = 'rgba(239, 68, 68, 0.15)';
        }
      }

      const confNote = document.getElementById('ragConfidenceNote');
      if (confNote && est.confidence_note) {
        confNote.textContent = est.confidence_note;
      }

      const timelineText = document.getElementById('ragTimelineText');
      if (timelineText && est.estimated_timeline_weeks_min) {
        timelineText.textContent = `⏱ Estimated Execution Window: ${est.estimated_timeline_weeks_min} – ${est.estimated_timeline_weeks_max} Weeks`;
      }

      // Cost Table with Traceable RAG Basis
      const items = est.itemizedBreakdown || est.breakdown || [];
      if (el.costTableBody && items.length) {
        el.costTableBody.innerHTML = items.map(item => `
          <tr class="cost-table-row">
            <td class="cost-td-trade">
              <strong class="trade-title">${item.item || item.name || item.trade || 'Finishing Trade'}</strong>
              <div class="trade-sub">${item.description || item.scope || ''}</div>
              ${item.basis ? `<div class="rag-basis-line" style="font-size: 0.74rem; color: #DDA15E; font-style: italic; margin-top: 4px;">📌 ${item.basis}</div>` : ''}
            </td>
            <td class="cost-td-grade">
              <span class="grade-badge ${item.grade || 'standard'}">${(item.grade || 'Standard').toUpperCase()}</span>
            </td>
            <td class="cost-td-amount" style="text-align: right;">
              <strong>${item.costFormatted || (item.cost_min ? '₹' + Number(item.cost_min).toLocaleString('en-IN') + ' – ₹' + Number(item.cost_max).toLocaleString('en-IN') : '₹' + Number(item.cost || 0).toLocaleString('en-IN'))}</strong>
            </td>
          </tr>
        `).join('');
      }

      // Disclaimer
      if (el.costDisclaimer && est.disclaimer) {
        el.costDisclaimer.textContent = est.disclaimer;
      }
    }

    // Scroll to results
    el.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Interactive Before/After Split Slider
  function setupBeforeAfterSlider() {
    if (!el.sliderContainer || !el.sliderHandle || !el.afterClipWrap) return;

    let isDragging = false;

    const onStart = (e) => {
      isDragging = true;
      e.preventDefault();
      updateSliderFromEvent(e);
    };

    const onMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      updateSliderFromEvent(e);
    };

    const onEnd = () => {
      isDragging = false;
    };

    // Mouse Events
    el.sliderContainer.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    // Touch Events
    el.sliderContainer.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  }

  function updateSliderFromEvent(e) {
    const rect = el.sliderContainer.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let offset = clientX - rect.left;
    let pct = (offset / rect.width) * 100;
    if (pct < 2) pct = 2;
    if (pct > 98) pct = 98;
    setSliderPosition(pct);
  }

  function setSliderPosition(pct) {
    state.activeSliderPos = pct;
    if (el.afterClipWrap) {
      el.afterClipWrap.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;
    }
    if (el.sliderHandle) {
      el.sliderHandle.style.left = `${pct}%`;
    }
  }

  // Consultation Modal
  function setupConsultationModal() {
    if (el.btnBookConsultation && el.consultationModal) {
      el.btnBookConsultation.addEventListener('click', () => {
        if (!state.currentResult) {
          alert('Please run an AI design estimate first.');
          return;
        }
        const est = state.currentResult.costEstimate;
        const sum = est?.summary || {};
        const expected = sum.expectedFormatted || est?.expectedFormatted || 'Indicative';
        const range = sum.rangeFormatted || est?.rangeFormatted || 'Calculated';
        el.consultationSummary.innerHTML = `
          <strong>${state.selectedStyle} ${state.selectedRoom}</strong> &middot; ${state.selectedCity}<br>
          Estimated Budget: <span style="color: #c98838; font-weight: 700;">${expected}</span> (${range})
        `;
        el.consultationModal.style.display = 'flex';
      });
    }

    if (el.closeConsultationModal) {
      el.closeConsultationModal.addEventListener('click', () => {
        el.consultationModal.style.display = 'none';
      });
    }

    if (el.consultationModal) {
      el.consultationModal.addEventListener('click', (e) => {
        if (e.target === el.consultationModal) {
          el.consultationModal.style.display = 'none';
        }
      });
    }

    if (el.consultationForm) {
      el.consultationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = el.consultationForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering Site Consultation...';

        const payload = {
          name: document.getElementById('consultName').value,
          phone: document.getElementById('consultPhone').value,
          email: document.getElementById('consultEmail')?.value || '',
          city: document.getElementById('consultCity')?.value || state.selectedCity || 'Bengaluru',
          projectType: document.getElementById('consultProjectType')?.value || 'Interior',
          address: document.getElementById('consultAddress').value,
          preferredDate: document.getElementById('consultDate')?.value || '',
          notes: document.getElementById('consultNotes')?.value || '',
          aiDesignData: {
            roomType: state.selectedRoom,
            style: state.selectedStyle,
            areaSqFt: state.areaSqFt,
            city: state.selectedCity,
            estimateExpected: state.currentResult?.costEstimate?.summary?.expectedFormatted || state.currentResult?.costEstimate?.expectedFormatted,
            estimateRange: state.currentResult?.costEstimate?.summary?.rangeFormatted || state.currentResult?.costEstimate?.rangeFormatted
          }
        };

        try {
          const res = await fetch('/api/consultation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const resData = await res.json();
          if (resData.success) {
            el.consultationNotice.innerHTML = `
              <div class="alert-success-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <div>
                  <strong>Site Consultation Confirmed!</strong>
                  <p>Our senior site engineer will contact you at ${payload.phone} to coordinate physical laser measurement and final contractor BOQ.</p>
                </div>
              </div>
            `;
            el.consultationForm.reset();
            setTimeout(() => {
              el.consultationModal.style.display = 'none';
              el.consultationNotice.innerHTML = '';
              submitBtn.disabled = false;
              submitBtn.textContent = 'Confirm Site Measurement Visit';
            }, 3500);
          } else {
            alert(resData.error || 'Failed to submit consultation request.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirm Site Measurement Visit';
          }
        } catch (err) {
          alert('Network error submitting request. Please call our office directly.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Confirm Site Measurement Visit';
        }
      });
    }
  }

  // Admin Pricing Modal
  function setupAdminModal() {
    if (el.openAdminBtn && el.adminModal) {
      el.openAdminBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loadAndDisplayAdminPricing();
        el.adminModal.style.display = 'flex';
      });
    }

    if (el.closeAdminBtn) {
      el.closeAdminBtn.addEventListener('click', () => {
        el.adminModal.style.display = 'none';
      });
    }

    if (el.adminModal) {
      el.adminModal.addEventListener('click', (e) => {
        if (e.target === el.adminModal) {
          el.adminModal.style.display = 'none';
        }
      });
    }

    if (el.saveAdminPricingBtn) {
      el.saveAdminPricingBtn.addEventListener('click', saveAdminPricing);
    }
  }

  let activeAdminDb = null;

  async function loadAndDisplayAdminPricing() {
    try {
      const res = await fetch('/api/admin/pricing');
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      activeAdminDb = data.database;

      // Render Rates Table
      if (el.adminRatesTable && activeAdminDb.rates) {
        el.adminRatesTable.innerHTML = Object.keys(activeAdminDb.rates).map(key => {
          const r = activeAdminDb.rates[key];
          return `
            <tr>
              <td><strong>${r.name}</strong><br><small style="color:#888;">${r.unit}</small></td>
              <td><input type="number" class="admin-rate-input" data-key="${key}" data-grade="economy" value="${r.economy}"></td>
              <td><input type="number" class="admin-rate-input" data-key="${key}" data-grade="standard" value="${r.standard}"></td>
              <td><input type="number" class="admin-rate-input" data-key="${key}" data-grade="luxury" value="${r.luxury}"></td>
            </tr>
          `;
        }).join('');
      }

      // Render Cities Table
      if (el.adminCitiesTable && activeAdminDb.cities) {
        el.adminCitiesTable.innerHTML = Object.keys(activeAdminDb.cities).map(city => {
          const mult = activeAdminDb.cities[city];
          return `
            <tr>
              <td><strong>${city}</strong></td>
              <td><input type="number" step="0.01" class="admin-city-input" data-city="${city}" value="${mult}"></td>
            </tr>
          `;
        }).join('');
      }
    } catch (err) {
      alert('Failed to load admin pricing database: ' + err.message);
    }
  }

  async function saveAdminPricing() {
    if (!activeAdminDb) return;
    el.saveAdminPricingBtn.disabled = true;
    el.saveAdminPricingBtn.textContent = 'Saving Matrix...';

    // Collect updated rates
    document.querySelectorAll('.admin-rate-input').forEach(input => {
      const key = input.dataset.key;
      const grade = input.dataset.grade;
      const val = parseFloat(input.value);
      if (activeAdminDb.rates[key] && !isNaN(val)) {
        activeAdminDb.rates[key][grade] = val;
      }
    });

    // Collect updated cities
    document.querySelectorAll('.admin-city-input').forEach(input => {
      const city = input.dataset.city;
      const val = parseFloat(input.value);
      if (!isNaN(val)) {
        activeAdminDb.cities[city] = val;
      }
    });

    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ database: activeAdminDb })
      });
      const data = await res.json();
      if (data.success) {
        alert('Pricing database updated successfully!');
        el.adminModal.style.display = 'none';
      } else {
        alert('Error saving rates: ' + data.error);
      }
    } catch (err) {
      alert('Network error saving rates: ' + err.message);
    } finally {
      el.saveAdminPricingBtn.disabled = false;
      el.saveAdminPricingBtn.textContent = 'Save Pricing Database';
    }
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
