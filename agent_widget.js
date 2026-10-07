/**
 * SWEETY COLOUR DECORA — AI AGENT WIDGET & STUDIO BRIDGE
 * Supports Native Decora AI, MindStudio, and MindPal integrations.
 */

(function () {
  'use strict';

  // Local State
  const state = {
    isOpen: false,
    activeMode: 'native', // 'native' | 'mindstudio' | 'mindpal'
    config: {
      mindstudio: { embedUrl: '' },
      mindpal: { agentId: '' }
    },
    messages: [
      {
        role: 'assistant',
        content: `Welcome to **Sweety Colour Decora**. I am your Chief Spatial Architect & Cost Estimator.

I can calculate instant room finishing estimates, compare materials (like Italian marble vs vitrified tiles), guide your design direction, or coordinate an on-site physical laser survey.

How may I assist your space today?`,
        action: null
      }
    ],
    isTyping: false
  };

  // Quick Prompt Starters
  const quickPrompts = [
    { label: 'Living Room 280 sq.ft', query: 'Estimate 280 sq.ft living room in Bengaluru' },
    { label: 'Italian Marble vs Tile', query: 'What is the difference between Italian marble and vitrified tiles?' },
    { label: 'POP Ceiling Rates', query: 'What are the rates and specifications for POP false ceiling?' },
    { label: 'Book Laser Survey', query: 'I want to schedule an on-site physical laser survey' }
  ];

  let el = {};

  function init() {
    loadConfig();
    injectWidgetMarkup();
    cacheElements();
    attachEventListeners();
    renderConversation();
  }

  async function loadConfig() {
    try {
      const res = await fetch('/api/agent/config');
      const data = await res.json();
      if (data.success && data.config) {
        state.activeMode = data.config.activeMode || 'native';
        if (data.config.modes) {
          state.config.mindstudio.embedUrl = data.config.modes.mindstudio?.embedUrl || '';
          state.config.mindpal.agentId = data.config.modes.mindpal?.agentId || '';
        }
      }
    } catch (e) {
      console.warn('Could not load remote agent config, using local state.');
    }
  }

  function injectWidgetMarkup() {
    if (document.getElementById('aiAgentDrawer')) return;

    const widgetHtml = `
      <!-- AI Agent Drawer / Popup -->
      <div id="aiAgentDrawer" class="agent-drawer">
        <!-- Header -->
        <div class="agent-drawer-header">
          <div class="agent-brand-col">
            <div class="agent-avatar-wrap">
              <span class="agent-avatar-spark">✦</span>
            </div>
            <div>
              <div class="agent-title">Decora Spatial Architect</div>
              <div class="agent-sub-status">
                <span class="agent-status-dot"></span>
                <span id="agentActiveModeLabel">Active: Native Cost Engine</span>
              </div>
            </div>
          </div>

          <div class="agent-header-actions">
            <button type="button" id="agentConfigBtn" class="agent-head-btn" title="Agent Settings (MindStudio / MindPal)" aria-label="Settings">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
            <button type="button" id="agentCloseBtn" class="agent-head-btn" title="Minimize" aria-label="Minimize">&minus;</button>
          </div>
        </div>

        <!-- Mode 1: Native Conversation Area -->
        <div id="agentNativeContainer" class="agent-body-container">
          <!-- Messages Scroll View -->
          <div id="agentMessagesWrap" class="agent-messages-wrap">
            <!-- Messages rendered dynamically -->
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="agent-chips-scroll" id="agentChipsScroll">
            ${quickPrompts.map(p => `
              <button type="button" class="agent-suggestion-pill" data-query="${p.query}">${p.label}</button>
            `).join('')}
          </div>

          <!-- Input Footer -->
          <div class="agent-input-bar">
            <input type="text" id="agentInput" class="agent-text-input" placeholder="Ask about room costs, finishes, styles..." autocomplete="off">
            <button type="button" id="agentSendBtn" class="agent-send-btn" aria-label="Send message">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>

        <!-- Mode 2: MindStudio Embed Container -->
        <div id="agentMindStudioContainer" class="agent-embed-container" style="display: none;">
          <iframe id="mindStudioIframe" class="agent-iframe" src="about:blank" title="MindStudio AI Agent"></iframe>
        </div>

        <!-- Mode 3: MindPal Embed Container -->
        <div id="agentMindPalContainer" class="agent-embed-container" style="display: none;">
          <div id="mindpalWidgetTarget" class="mindpal-target-box">
            <p style="font-size: 0.85rem; color: #888; text-align: center; padding: 20px;">MindPal Agent loaded. If prompt does not appear, verify your Agent ID in Settings.</p>
          </div>
        </div>
      </div>

      <!-- Agent Settings Modal -->
      <div class="modal-overlay" id="agentConfigModal" role="dialog" aria-modal="true" aria-labelledby="agentSettingsTitle">
        <div class="modal-content">
          <button type="button" class="modal-close-btn" id="closeAgentConfigModal" aria-label="Close">&times;</button>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="color: #C98838; font-size: 1.1rem;">✦</span>
            <h3 class="modal-title" id="agentSettingsTitle" style="margin-bottom: 0;">AI Agent Engine Configuration</h3>
          </div>
          <p class="modal-subtitle">Choose which AI Agent engine powers your on-site assistant. Switch between the native cost engine, MindStudio, or MindPal.</p>

          <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
            <!-- Option 1: Native -->
            <label class="agent-mode-option" style="cursor: pointer; display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid var(--border); border-radius: 8px;">
              <input type="radio" name="agentModeRadio" value="native" style="margin-top: 4px;">
              <div>
                <strong style="font-size: 0.88rem; color: var(--text-heading);">Decora SiteFlow Native AI (Recommended)</strong>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Fully integrated with Sweety Colour Decora rate matrix, room area slider, Before/After studio, and lead survey booking.</p>
              </div>
            </label>

            <!-- Option 2: MindStudio -->
            <label class="agent-mode-option" style="cursor: pointer; display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid var(--border); border-radius: 8px;">
              <input type="radio" name="agentModeRadio" value="mindstudio" style="margin-top: 4px;">
              <div style="flex: 1;">
                <strong style="font-size: 0.88rem; color: var(--text-heading);">MindStudio Agent (YouAI)</strong>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Embed your published MindStudio application or guest access URL.</p>
                <input type="url" id="cfgMindStudioUrl" class="modal-input" placeholder="https://app.mindstudio.ai/app/your-app-id" style="margin-top: 8px; font-size: 0.8rem;">
              </div>
            </label>

            <!-- Option 3: MindPal -->
            <label class="agent-mode-option" style="cursor: pointer; display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid var(--border); border-radius: 8px;">
              <input type="radio" name="agentModeRadio" value="mindpal" style="margin-top: 4px;">
              <div style="flex: 1;">
                <strong style="font-size: 0.88rem; color: var(--text-heading);">MindPal Agent (mindpal.space)</strong>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Connect your published MindPal chatbot via your unique Agent ID.</p>
                <input type="text" id="cfgMindPalId" class="modal-input" placeholder="Enter your MindPal Agent ID (e.g. agt_xxxxxx)" style="margin-top: 8px; font-size: 0.8rem;">
              </div>
            </label>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.74rem; color: var(--text-muted);">Blueprints located in <code>agent_blueprints/</code></span>
            <button type="button" id="saveAgentConfigBtn" class="btn-editorial" style="background: #C98838; color: #0E1626; border-color: #C98838;">Save &amp; Apply Mode</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHtml);
  }

  function cacheElements() {
    el = {
      launcher: null,
      drawer: document.getElementById('aiAgentDrawer'),
      closeBtn: document.getElementById('agentCloseBtn'),
      configBtn: document.getElementById('agentConfigBtn'),
      activeModeLabel: document.getElementById('agentActiveModeLabel'),

      // Containers
      nativeContainer: document.getElementById('agentNativeContainer'),
      mindStudioContainer: document.getElementById('agentMindStudioContainer'),
      mindStudioIframe: document.getElementById('mindStudioIframe'),
      mindPalContainer: document.getElementById('agentMindPalContainer'),
      mindpalTarget: document.getElementById('mindpalWidgetTarget'),

      // Native Chat
      messagesWrap: document.getElementById('agentMessagesWrap'),
      chipsScroll: document.getElementById('agentChipsScroll'),
      input: document.getElementById('agentInput'),
      sendBtn: document.getElementById('agentSendBtn'),

      // Modal
      configModal: document.getElementById('agentConfigModal'),
      closeConfigModal: document.getElementById('closeAgentConfigModal'),
      saveConfigBtn: document.getElementById('saveAgentConfigBtn'),
      cfgMindStudioUrl: document.getElementById('cfgMindStudioUrl'),
      cfgMindPalId: document.getElementById('cfgMindPalId'),
      radioModes: document.querySelectorAll('input[name="agentModeRadio"]')
    };
  }

  function attachEventListeners() {
    // Toggle drawer
    if (el.launcher) el.launcher.addEventListener('click', toggleDrawer);
    if (el.closeBtn) el.closeBtn.addEventListener('click', toggleDrawer);

    // Settings Modal
    el.configBtn.addEventListener('click', openSettingsModal);
    el.closeConfigModal.addEventListener('click', closeSettingsModal);
    el.saveConfigBtn.addEventListener('click', saveSettingsFromModal);
    if (el.configModal) {
      el.configModal.addEventListener('click', (e) => {
        if (e.target === el.configModal) closeSettingsModal();
      });
    }

    // Native Chat Send
    el.sendBtn.addEventListener('click', handleSendMessage);
    el.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });

    // Quick suggestion chips
    el.chipsScroll.addEventListener('click', (e) => {
      const pill = e.target.closest('.agent-suggestion-pill');
      if (pill) {
        el.input.value = pill.dataset.query;
        handleSendMessage();
      }
    });

    // Delegate message action buttons (Bridge to Studio / Survey)
    el.messagesWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.agent-action-pill-btn');
      if (!btn) return;
      handleActionClick(btn);
    });
  }

  function toggleDrawer() {
    state.isOpen = !state.isOpen;
    if (state.isOpen) {
      el.drawer.classList.add('drawer-open');
      el.launcher.classList.add('launcher-active');
      applyActiveModeView();
      if (state.activeMode === 'native') {
        el.input.focus();
        scrollToBottom();
      }
    } else {
      el.drawer.classList.remove('drawer-open');
      el.launcher.classList.remove('launcher-active');
    }
  }

  function applyActiveModeView() {
    if (state.activeMode === 'mindstudio') {
      el.nativeContainer.style.display = 'none';
      el.mindPalContainer.style.display = 'none';
      el.mindStudioContainer.style.display = 'block';
      el.activeModeLabel.textContent = 'Active: MindStudio Embed';
      const url = state.config.mindstudio.embedUrl || 'https://app.mindstudio.ai';
      if (el.mindStudioIframe.src !== url) {
        el.mindStudioIframe.src = url;
      }
    } else if (state.activeMode === 'mindpal') {
      el.nativeContainer.style.display = 'none';
      el.mindStudioContainer.style.display = 'none';
      el.mindPalContainer.style.display = 'block';
      el.activeModeLabel.textContent = 'Active: MindPal Agent';
      renderMindPalEmbed();
    } else {
      el.mindStudioContainer.style.display = 'none';
      el.mindPalContainer.style.display = 'none';
      el.nativeContainer.style.display = 'flex';
      el.activeModeLabel.textContent = 'Active: Native Cost Engine';
    }
  }

  function renderMindPalEmbed() {
    const agentId = state.config.mindpal.agentId;
    if (!agentId) {
      el.mindpalTarget.innerHTML = `
        <div style="padding: 24px; text-align: center;">
          <strong style="color: #C98838; font-size: 0.92rem; display: block; margin-bottom: 6px;">MindPal Agent ID Required</strong>
          <p style="font-size: 0.78rem; color: #888; margin-bottom: 14px;">Click the Settings icon (⚙️) above and enter your published MindPal Agent ID.</p>
          <button type="button" class="btn-underline" onclick="document.getElementById('agentConfigBtn').click()" style="font-size: 0.76rem; color: #C98838; background:none; border:none; cursor:pointer;">Configure MindPal ID &rarr;</button>
        </div>
      `;
      return;
    }

    el.mindpalTarget.innerHTML = `
      <iframe src="https://mindpal.space/embed/${agentId}" class="agent-iframe" title="MindPal AI Agent"></iframe>
    `;
  }

  // Native Messaging Handling
  async function handleSendMessage() {
    const text = (el.input.value || '').trim();
    if (!text || state.isTyping) return;

    // Append user message
    state.messages.push({ role: 'user', content: text, action: null });
    el.input.value = '';
    renderConversation();
    scrollToBottom();

    // Show typing state
    state.isTyping = true;
    showTypingIndicator();

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: state.messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      removeTypingIndicator();
      state.isTyping = false;

      if (data.success && data.reply) {
        state.messages.push({
          role: 'assistant',
          content: data.reply,
          action: data.action,
          estimate: data.estimate
        });
      } else {
        state.messages.push({
          role: 'assistant',
          content: 'I apologize, but our architectural engine encountered a momentary delay. Please try asking again or schedule an on-site survey.',
          action: null
        });
      }
    } catch (err) {
      removeTypingIndicator();
      state.isTyping = false;
      state.messages.push({
        role: 'assistant',
        content: 'Could not connect to the agent service. Please verify that the local server is running.',
        action: null
      });
    }

    renderConversation();
    scrollToBottom();
  }

  function renderConversation() {
    el.messagesWrap.innerHTML = state.messages.map((m, idx) => {
      const isUser = m.role === 'user';
      const formattedHtml = formatMarkdown(m.content);

      let actionHtml = '';
      if (m.action) {
        actionHtml = `
          <div class="agent-action-box">
            <button type="button" class="agent-action-pill-btn" 
              data-type="${m.action.type}" 
              data-params='${JSON.stringify(m.action.params || {})}'
            >
              <span class="action-spark">✦</span>
              <span>${m.action.label}</span>
              <span class="action-arrow">&rarr;</span>
            </button>
          </div>
        `;
      }

      return `
        <div class="agent-msg-row ${isUser ? 'msg-row-user' : 'msg-row-agent'}">
          <div class="agent-bubble ${isUser ? 'bubble-user' : 'bubble-agent'}">
            <div class="agent-bubble-text">${formattedHtml}</div>
            ${actionHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  function formatMarkdown(text) {
    if (!text) return '';
    // Escape HTML first
    let s = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Bold
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Bullets
    s = s.replace(/^• (.*)$/gm, '<li class="agent-li">$1</li>');
    s = s.replace(/(<li.*<\/li>)/s, '<ul class="agent-ul">$1</ul>');
    // Paragraphs
    s = s.replace(/\n\n/g, '<br><br>');
    return s;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'agentTypingIndicator';
    indicator.className = 'agent-msg-row msg-row-agent';
    indicator.innerHTML = `
      <div class="agent-bubble bubble-agent">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    el.messagesWrap.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('agentTypingIndicator');
    if (indicator) indicator.remove();
  }

  function scrollToBottom() {
    el.messagesWrap.scrollTop = el.messagesWrap.scrollHeight;
  }

  // Action Bridge (Studio, Consultation, Services)
  function handleActionClick(btn) {
    const type = btn.dataset.type;
    let params = {};
    try { params = JSON.parse(btn.dataset.params || '{}'); } catch (e) {}

    if (type === 'APPLY_AND_SCROLL_STUDIO') {
      applyParamsToStudio(params);
      toggleDrawer(); // close drawer so user sees studio
      const studioSec = document.getElementById('ai-design-studio');
      if (studioSec) {
        studioSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (type === 'OPEN_CONSULTATION_MODAL') {
      toggleDrawer();
      const consultBtn = document.getElementById('aiBookConsultationBtn');
      if (consultBtn) consultBtn.click();
    } else if (type === 'SCROLL_SERVICES') {
      toggleDrawer();
      const services = document.getElementById('services');
      if (services) services.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function applyParamsToStudio(p) {
    if (!p) return;
    // 1. Room Type
    if (p.roomType) {
      document.querySelectorAll('.chip-room').forEach(c => {
        if (c.dataset.value.toLowerCase() === p.roomType.toLowerCase()) {
          c.click();
        }
      });
    }

    // 2. Style
    if (p.style) {
      document.querySelectorAll('.chip-style').forEach(c => {
        if (c.dataset.value.toLowerCase().includes(p.style.toLowerCase())) {
          c.click();
        }
      });
    }

    // 3. Area
    if (p.areaSqFt) {
      const slider = document.getElementById('aiAreaSlider');
      const input = document.getElementById('aiAreaInput');
      if (slider) slider.value = p.areaSqFt;
      if (input) {
        input.value = p.areaSqFt;
        input.dispatchEvent(new Event('input'));
      }
    }

    // 4. City
    if (p.city) {
      const citySelect = document.getElementById('aiCitySelect');
      if (citySelect) {
        citySelect.value = p.city;
        citySelect.dispatchEvent(new Event('change'));
      }
    }
  }

  // Settings Modal Handlers
  function openSettingsModal() {
    el.radioModes.forEach(r => {
      r.checked = (r.value === state.activeMode);
    });
    if (el.cfgMindStudioUrl) el.cfgMindStudioUrl.value = state.config.mindstudio.embedUrl || '';
    if (el.cfgMindPalId) el.cfgMindPalId.value = state.config.mindpal.agentId || '';
    el.configModal.style.display = 'flex';
  }

  function closeSettingsModal() {
    el.configModal.style.display = 'none';
  }

  async function saveSettingsFromModal() {
    let selectedMode = 'native';
    el.radioModes.forEach(r => {
      if (r.checked) selectedMode = r.value;
    });

    state.activeMode = selectedMode;
    state.config.mindstudio.embedUrl = (el.cfgMindStudioUrl.value || '').trim();
    state.config.mindpal.agentId = (el.cfgMindPalId.value || '').trim();

    const payload = {
      config: {
        activeMode: state.activeMode,
        modes: {
          native: { enabled: state.activeMode === 'native' },
          mindstudio: { enabled: state.activeMode === 'mindstudio', embedUrl: state.config.mindstudio.embedUrl },
          mindpal: { enabled: state.activeMode === 'mindpal', agentId: state.config.mindpal.agentId }
        }
      }
    };

    try {
      await fetch('/api/agent/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {}

    applyActiveModeView();
    closeSettingsModal();
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
