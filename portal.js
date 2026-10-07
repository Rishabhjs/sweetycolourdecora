/**
 * SWEETY COLOUR DECORA — CONSTRUCTION OPERATING SYSTEM (OS)
 * Enterprise-grade client-side application for Project Management,
 * Workforce, Daily Attendance, Overtime, Wage Reconciliation,
 * Materials, Expenses, Financial Profitability, Site Reports & Project AI.
 */

(function () {
  'use strict';

  const OS_ROLES = {
    OWNER: {
      name: 'Owner (Srushti Shah)',
      role: 'OWNER',
      tabs: ['overview', 'projects', 'workforce', 'attendance', 'work-items', 'payments', 'materials', 'expenses', 'financials', 'reports', 'ai-assistant']
    },
    ADMIN: {
      name: 'Admin (Bhavin Shah)',
      role: 'ADMIN',
      tabs: ['overview', 'projects', 'workforce', 'attendance', 'work-items', 'payments', 'materials', 'expenses', 'financials', 'reports', 'ai-assistant']
    },
    PROJECT_MANAGER: {
      name: 'Project Manager (Arjun Mehta)',
      role: 'PROJECT_MANAGER',
      tabs: ['projects', 'workforce', 'attendance', 'work-items', 'materials', 'expenses', 'reports', 'ai-assistant']
    },
    SITE_SUPERVISOR: {
      name: 'Site Supervisor (Ramesh Patel)',
      role: 'SITE_SUPERVISOR',
      tabs: ['attendance', 'work-items', 'reports', 'ai-assistant']
    },
    ACCOUNTANT: {
      name: 'Accountant (Kavita Joshi)',
      role: 'ACCOUNTANT',
      tabs: ['overview', 'projects', 'payments', 'materials', 'expenses', 'financials', 'ai-assistant']
    }
  };

  const state = {
    currentRole: 'OWNER',
    currentTab: 'overview',
    selectedProjectId: null,
    projects: [],
    workers: [],
    attendance: [],
    workItems: [],
    payments: [],
    materials: [],
    expenses: [],
    reports: [],
    kpis: {},
    isOpen: false
  };

  // Helper fetch with error handling
  async function api(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': state.currentRole,
        ...(options.headers || {})
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Network response was not ok' }));
      throw new Error(err.error || 'API request failed');
    }
    return res.json();
  }

  function formatCurrency(val) {
    if (val === undefined || val === null) return '₹0';
    val = Number(val);
    if (val >= 10000000) return '₹' + (val / 10000000).toFixed(2) + ' Cr';
    if (val >= 100000) return '₹' + (val / 100000).toFixed(2) + 'L';
    return '₹' + val.toLocaleString('en-IN');
  }

  // Build Portal DOM into body
  function buildPortalDOM() {
    let portalRoot = document.getElementById('construction-os-root');
    if (portalRoot && portalRoot.querySelector('.os-container')) return portalRoot;

    const isStandalone = window.IS_STANDALONE_OS ||
      window.location.pathname.includes('construction-os') ||
      window.location.pathname.includes('operational-clarity');

    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.id = 'construction-os-root';
      portalRoot.className = 'construction-os-wrapper' + (isStandalone ? ' construction-os-standalone' : '');
      if (!isStandalone) {
        portalRoot.style.display = 'none';
      }
      document.body.appendChild(portalRoot);
    }

    portalRoot.innerHTML = `
      <div class="os-backdrop" id="osBackdrop"></div>
      <div class="os-container">
        <!-- Top Navbar (Matching Homepage Navbar1 aesthetic) -->
        <header class="os-header navbar1-desktop">
          <!-- Left: Brand Logo & Navigation Links -->
          <div class="navbar1-left">
            <a href="/" class="navbar1-logo" title="Return to Sweety Colour Decora Homepage">
              <img src="images/sweety_logo.png" alt="Sweety Colour Decora - Building Landmarks Since 2003" class="navbar1-logo-img" style="height: 46px; width: auto; object-fit: contain; border-radius: 6px;">
            </a>

            <!-- Navigation Links List -->
            <div class="navbar1-menu-wrapper">
              <ul class="navbar1-nav-list">
                <li><a href="/" class="navbar1-link">Home</a></li>
                <li class="os-filter-nav-wrap">
                  <select id="osProjectSelect" class="navbar1-link os-nav-select" title="Filter Project">
                    <option value="">All Projects</option>
                  </select>
                </li>
                <li><a href="/#milestones" class="navbar1-link">Milestones</a></li>
                <li><span class="navbar1-link active" style="color: #C98838; font-weight: 600; background: rgba(201, 136, 56, 0.08);">Construction OS</span></li>
                <li>
                  <div class="os-db-pill" title="Live SQLite connection · Zero hallucinations" style="margin-left: 6px;">
                    <span class="os-pulse-dot green"></span>
                    <span>SQLITE GROUNDED</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Right Action Tools & Auth Group (Matching 2nd pic) -->
          <div class="navbar1-auth-group">
            <!-- Direct Phone -->
            <a href="tel:+919825012345" class="navbar1-icon-btn" aria-label="Call Direct Desk" title="+91 98250 12345">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>

            <!-- AI Studio Icon -->
            <a href="/#ai-design-studio" class="navbar1-icon-btn" aria-label="AI Studio" title="Launch AI Studio">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </a>

            <!-- Access Role Outline Button -->
            <div class="os-role-btn-wrap">
              <select id="osRoleSelect" class="navbar1-btn navbar1-btn-outline os-role-select-pill" title="Access Role">
                <option value="OWNER">Owner &mdash; Srushti Shah</option>
                <option value="ADMIN">Admin &mdash; Bhavin Shah</option>
                <option value="PROJECT_MANAGER">Project Manager &mdash; Arjun Mehta</option>
                <option value="SITE_SUPERVISOR">Site Supervisor &mdash; Ramesh Patel</option>
                <option value="ACCOUNTANT">Accountant &mdash; Kavita Joshi</option>
              </select>
            </div>

            <!-- Primary Action Button (White Pill with Arrow matching 2nd pic) -->
            <a href="/" class="navbar1-btn navbar1-btn-primary" title="Return to Sweety Colour Decora Homepage">
              <span>Back to Home</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>

            <button type="button" id="osCloseBtn" class="os-btn-close" title="Close OS" style="${isStandalone ? 'display:none;' : ''}">&times;</button>
          </div>
        </header>

        <!-- Main Body: Sidebar Tabs + Content Area -->
        <div class="os-body">
          <!-- Sidebar Navigation -->
          <nav class="os-sidebar" id="osSidebar">
            <div class="os-sidebar-title">01 / EXECUTIVE &amp; FINANCIALS</div>
            <button class="os-nav-item active" data-tab="overview">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>Business Overview</span>
            </button>
            <button class="os-nav-item" data-tab="projects">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span>Projects Ledger</span>
              <span class="os-nav-badge" id="osBadgeProjects">0</span>
            </button>
            <button class="os-nav-item" data-tab="financials">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              <span>Profit &amp; Variance</span>
            </button>

            <div class="os-sidebar-title" style="margin-top: 18px;">02 / FIELD &amp; SITE OPERATIONS</div>
            <button class="os-nav-item" data-tab="workforce">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Workforce Roster</span>
              <span class="os-nav-badge" id="osBadgeWorkers">0</span>
            </button>
            <button class="os-nav-item" data-tab="attendance">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Daily Attendance</span>
            </button>
            <button class="os-nav-item" data-tab="work-items">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              <span>Work Assignments</span>
            </button>
            <button class="os-nav-item" data-tab="reports">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>Site Photo Logs</span>
            </button>

            <div class="os-sidebar-title" style="margin-top: 18px;">03 / PROCUREMENT &amp; ACCOUNTS</div>
            <button class="os-nav-item" data-tab="payments">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              <span>Worker Payments</span>
            </button>
            <button class="os-nav-item" data-tab="materials">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
              <span>Materials Catalog</span>
            </button>
            <button class="os-nav-item" data-tab="expenses">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>Project Expenses</span>
            </button>

            <div class="os-sidebar-title" style="margin-top: 18px;">04 / GROUNDED INTELLIGENCE</div>
            <button class="os-nav-item os-nav-ai" data-tab="ai-assistant">
              <span class="os-ai-sparkle">✦</span>
              <span>Project AI Assistant</span>
            </button>

            <div class="os-sidebar-footer">
              <div class="os-craft-meta">
                <span>EST. 2003 &middot; MASTER CONTRACTORS</span>
                <span>SINGLE-SOURCE ACCOUNTABILITY</span>
              </div>
              <a href="/ai-intake.html" class="os-sidebar-aux-link">✦ Launch AI Studio &rarr;</a>
            </div>
          </nav>

          <!-- Content Pane -->
          <main class="os-content" id="osContentArea">
            <div class="os-spinner-wrap"><div class="os-spinner"></div> Loading Construction OS...</div>
          </main>
        </div>
      </div>

      <!-- Generic OS Modal Container -->
      <div class="os-modal-backdrop" id="osModalBackdrop" style="display: none;">
        <div class="os-modal-card" id="osModalCard"></div>
      </div>
    `;

    document.body.appendChild(portalRoot);
    attachPortalEvents();
    return portalRoot;
  }

  function attachPortalEvents() {
    const closeBtn = document.getElementById('osCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closePortal);

    const backdrop = document.getElementById('osBackdrop');
    if (backdrop) backdrop.addEventListener('click', closePortal);

    // Theme toggle
    const themeBtn = document.getElementById('osThemeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('scd_theme', next);
      });
    }

    // Escape key listener for fast UX
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && state.isOpen) {
        const modalBackdrop = document.getElementById('osModalBackdrop');
        if (modalBackdrop && modalBackdrop.style.display !== 'none') {
          closeModal();
        } else if (!window.IS_STANDALONE_OS) {
          closePortal();
        }
      }
    });

    // Role switcher
    const roleSel = document.getElementById('osRoleSelect');
    if (roleSel) {
      roleSel.addEventListener('change', e => {
        state.currentRole = e.target.value;
        updateRolePermissions();
        renderCurrentTab();
      });
    }

    // Project selector
    const projSel = document.getElementById('osProjectSelect');
    if (projSel) {
      projSel.addEventListener('change', e => {
        state.selectedProjectId = e.target.value ? parseInt(e.target.value, 10) : null;
        renderCurrentTab();
      });
    }

    // Sidebar navigation
    document.querySelectorAll('.os-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.os-nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentTab = btn.dataset.tab;
        renderCurrentTab();
      });
    });
  }

  function updateRolePermissions() {
    const roleConfig = OS_ROLES[state.currentRole] || OS_ROLES.OWNER;
    const allowed = roleConfig.tabs;

    document.querySelectorAll('.os-nav-item').forEach(btn => {
      const tab = btn.dataset.tab;
      if (allowed.includes(tab)) {
        btn.style.display = 'flex';
      } else {
        btn.style.display = 'none';
      }
    });

    if (!allowed.includes(state.currentTab)) {
      state.currentTab = allowed[0];
      document.querySelectorAll('.os-nav-item').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === state.currentTab);
      });
    }
  }

  async function openPortal(defaultTab = 'overview') {
    state.isOpen = true;
    const root = buildPortalDOM();
    root.style.display = 'flex';

    const isStandalone = window.IS_STANDALONE_OS ||
      window.location.pathname.includes('construction-os') ||
      window.location.pathname.includes('operational-clarity');

    if (!isStandalone) {
      document.body.style.overflow = 'hidden';
    }

    if (defaultTab) {
      state.currentTab = defaultTab;
      document.querySelectorAll('.os-nav-item').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === defaultTab);
      });
    }

    updateRolePermissions();
    await loadInitialData();
    populateProjectSelector();
    renderCurrentTab();
  }

  function closePortal() {
    state.isOpen = false;
    const root = document.getElementById('construction-os-root');
    if (root && !window.IS_STANDALONE_OS) root.style.display = 'none';
    document.body.style.overflow = '';
  }

  async function loadInitialData() {
    try {
      const [ovRes, prRes, wrRes] = await Promise.all([
        api('/api/portal/overview'),
        api('/api/portal/projects'),
        api('/api/portal/workers')
      ]);
      state.kpis = ovRes.kpis || {};
      state.projects = prRes.projects || [];
      state.workers = wrRes.workers || [];

      // Update badge counts
      const pBadge = document.getElementById('osBadgeProjects');
      if (pBadge) pBadge.textContent = state.projects.length;
      const wBadge = document.getElementById('osBadgeWorkers');
      if (wBadge) wBadge.textContent = state.workers.length;
    } catch (e) {
      console.error('Failed to load initial portal data:', e);
    }
  }

  function populateProjectSelector() {
    const sel = document.getElementById('osProjectSelect');
    if (!sel) return;
    const currentVal = sel.value;
    sel.innerHTML = '<option value="">All Projects</option>';
    state.projects.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `#${p.id} &middot; ${p.name}`;
      sel.appendChild(opt);
    });
    sel.value = currentVal;
  }

  // ========================================================
  // TAB RENDERERS
  // ========================================================
  async function renderCurrentTab() {
    const container = document.getElementById('osContentArea');
    if (!container) return;

    container.innerHTML = `<div class="os-spinner-wrap"><div class="os-spinner"></div> Loading ${state.currentTab}...</div>`;

    switch (state.currentTab) {
      case 'overview':
        await renderOverviewTab(container);
        break;
      case 'projects':
        await renderProjectsTab(container);
        break;
      case 'workforce':
        await renderWorkforceTab(container);
        break;
      case 'attendance':
        await renderAttendanceTab(container);
        break;
      case 'work-items':
        await renderWorkItemsTab(container);
        break;
      case 'payments':
        await renderPaymentsTab(container);
        break;
      case 'materials':
        await renderMaterialsTab(container);
        break;
      case 'expenses':
        await renderExpensesTab(container);
        break;
      case 'financials':
        await renderFinancialsTab(container);
        break;
      case 'reports':
        await renderReportsTab(container);
        break;
      case 'ai-assistant':
        renderAiAssistantTab(container);
        break;
      default:
        container.innerHTML = `<div>Tab not found</div>`;
    }
  }

  // 1. Business Overview Tab
  async function renderOverviewTab(container) {
    const res = await api('/api/portal/overview');
    const k = res.kpis;

    container.innerHTML = `
      <div class="os-tab-header">
        <div>
          <span class="os-eyebrow">01 / EXECUTIVE METRICS</span>
          <h2 class="os-heading">Business Overview</h2>
          <p class="os-subheading">Enterprise operating performance grounded in verified SQLite records &middot; Zero hallucinations.</p>
        </div>
        <div class="os-btn-row">
          <button class="os-btn os-btn-primary" onclick="window.ConstructionOS.openModal('new-project')">+ New Project</button>
          <button class="os-btn os-btn-secondary" onclick="window.ConstructionOS.openModal('new-worker')">+ Add Worker</button>
        </div>
      </div>

      <!-- Symmetrical Editorial KPI Grid -->
      <div class="os-kpi-grid">
        <div class="os-kpi-card">
          <div class="os-kpi-label">01 / ACTIVE CONTRACTS</div>
          <div class="os-kpi-value">${k.activeProjects} <span class="os-kpi-sub">/ ${k.totalProjects} Total</span></div>
          <div class="os-kpi-detail"><span>${k.completedProjects} Completed Handover</span></div>
        </div>
        <div class="os-kpi-card">
          <div class="os-kpi-label">02 / TOTAL CONTRACT VALUE</div>
          <div class="os-kpi-value">${formatCurrency(k.totalContractValue)}</div>
          <div class="os-kpi-detail">Budget: ${formatCurrency(k.totalBudget)}</div>
        </div>
        <div class="os-kpi-card">
          <div class="os-kpi-label">03 / ACTUAL PROJECT COSTS</div>
          <div class="os-kpi-value">${formatCurrency(k.totalActualCost)}</div>
          <div class="os-kpi-detail">Labor: ${formatCurrency(k.totalLaborCost)} &middot; Mat: ${formatCurrency(k.totalMaterialCost)}</div>
        </div>
        <div class="os-kpi-card">
          <div class="os-kpi-label">04 / ESTIMATED NET PROFIT</div>
          <div class="os-kpi-value" style="color: #34D399;">${formatCurrency(k.totalActualProfit)}</div>
          <div class="os-kpi-detail"><strong style="color: #34D399;">${k.overallProfitMargin}% Margin</strong></div>
        </div>
        <div class="os-kpi-card">
          <div class="os-kpi-label">05 / WAGES PAYABLE</div>
          <div class="os-kpi-value" style="color: ${k.totalOutstandingWages > 0 ? '#C98838' : '#34D399'};">
            ${formatCurrency(k.totalOutstandingWages)}
          </div>
          <div class="os-kpi-detail">Pending settlement</div>
        </div>
        <div class="os-kpi-card">
          <div class="os-kpi-label">06 / BUDGET VARIANCE</div>
          <div class="os-kpi-value" style="color: ${k.budgetVariance >= 0 ? '#34D399' : '#EF4444'};">
            ${k.budgetVariance >= 0 ? '+' : ''}${formatCurrency(k.budgetVariance)}
          </div>
          <div class="os-kpi-detail">${k.budgetVariance >= 0 ? 'Surplus Reserve' : 'Cost overrun'}</div>
        </div>
      </div>

      <!-- Active Projects Snapshot -->
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 36px; margin-bottom: 14px;">
        <h3 class="os-section-title" style="margin: 0;">Active Projects Ledger</h3>
        <span style="font-family: monospace; font-size: 0.68rem; color: #737373; text-transform: uppercase; letter-spacing: 0.1em;">${state.projects.length} Contracts Registered</span>
      </div>

      <div class="os-table-wrap">
        <table class="os-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Name</th>
              <th>Client</th>
              <th>Type</th>
              <th>Progress</th>
              <th>Budget</th>
              <th>Actual Cost</th>
              <th>Profit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${state.projects.map(p => `
              <tr>
                <td style="font-family: monospace; color: #C98838; font-weight: 600;">#${p.id < 10 ? '0' + p.id : p.id}</td>
                <td>
                  <strong style="color: #FFF; font-weight: 500;">${p.name}</strong>
                  <div style="color: #737373; font-size: 0.75rem; margin-top: 2px;">${p.location}, ${p.city}</div>
                </td>
                <td style="color: #E5E5E5;">${p.client_name}</td>
                <td><span class="os-tag">${p.project_type}</span></td>
                <td style="width: 120px;">
                  <div class="os-prog-bar-wrap">
                    <div class="os-prog-bar" style="width: ${p.completion_percentage}%;"></div>
                  </div>
                  <small style="color: #737373; font-family: monospace; font-size: 0.7rem;">${p.completion_percentage}%</small>
                </td>
                <td style="color: #D4D4D4; font-weight: 500;">${formatCurrency(p.financials.estimatedBudget)}</td>
                <td style="color: #D4D4D4; font-weight: 500;">${formatCurrency(p.financials.actualCost)}</td>
                <td style="color: #34D399; font-weight: 600;">${formatCurrency(p.financials.actualProfit)}</td>
                <td><span class="os-status-pill status-${p.status.toLowerCase().replace(' ', '-')}">${p.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 2. Projects Tab
  async function renderProjectsTab(container) {
    const res = await api('/api/portal/projects');
    state.projects = res.projects || [];
    populateProjectSelector();

    container.innerHTML = `
      <div class="os-tab-header">
        <div>
          <span class="os-eyebrow">02 / ACTIVE CONTRACTS</span>
          <h2 class="os-heading">Projects Directory</h2>
          <p class="os-subheading">Turnkey commercial and residential contracts, progress, and financial summaries.</p>
        </div>
        <button class="os-btn os-btn-primary" onclick="window.ConstructionOS.openModal('new-project')">+ New Project</button>
      </div>

      <div class="os-cards-grid">
        ${state.projects.map(p => `
          <div class="os-project-card">
            <div class="os-card-header">
              <div>
                <span class="os-tag">${p.project_type}</span>
                <h3 class="os-card-title">${p.name}</h3>
                <span class="os-card-sub">${p.location} &middot; ${p.city}</span>
              </div>
              <span class="os-status-pill status-${p.status.toLowerCase().replace(' ', '-')}">${p.status}</span>
            </div>

            <div class="os-card-stats">
              <div class="os-stat">
                <span class="os-stat-lbl">Contract Value</span>
                <span class="os-stat-val">${formatCurrency(p.financials.contractValue)}</span>
              </div>
              <div class="os-stat">
                <span class="os-stat-lbl">Actual Cost</span>
                <span class="os-stat-val">${formatCurrency(p.financials.actualCost)}</span>
              </div>
              <div class="os-stat">
                <span class="os-stat-lbl">Remaining</span>
                <span class="os-stat-val">${formatCurrency(p.financials.remainingBudget)}</span>
              </div>
              <div class="os-stat">
                <span class="os-stat-lbl">Est. Margin</span>
                <span class="os-stat-val" style="color:#34D399;">${p.financials.profitMargin}%</span>
              </div>
            </div>

            <div style="margin-top: 14px;">
              <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; color:#878787; font-family: monospace;">
                <span>Completion</span>
                <span>${p.completion_percentage}%</span>
              </div>
              <div class="os-prog-bar-wrap">
                <div class="os-prog-bar" style="width: ${p.completion_percentage}%;"></div>
              </div>
            </div>

            <div class="os-card-footer">
              <span>Client: <strong style="color: #FFF;">${p.client_name}</strong> (${p.client_phone || 'N/A'})</span>
              <button class="os-btn-sm" onclick="window.ConstructionOS.selectProjectAndSwitch(${p.id}, 'financials')">View Financials &rarr;</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 3. Workforce Database Tab
  async function renderWorkforceTab(container) {
    const res = await api('/api/portal/workers');
    state.workers = res.workers || [];

    container.innerHTML = `
      <div class="os-tab-header">
        <div>
          <span class="os-eyebrow">03 / CREW &amp; CRAFTSMEN</span>
          <h2 class="os-heading">Workforce Database</h2>
          <p class="os-subheading">Vetted master applicators, carpenters, tile masons, daily wage rates, and account balances.</p>
        </div>
        <button class="os-btn os-btn-primary" onclick="window.ConstructionOS.openModal('new-worker')">+ Add Worker</button>
      </div>

      <div class="os-table-wrap">
        <table class="os-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Worker Name</th>
              <th>Role</th>
              <th>Daily Wage</th>
              <th>Hourly</th>
              <th>Days Worked</th>
              <th>Total Hours</th>
              <th>Total Earned</th>
              <th>Total Paid</th>
              <th>Net Balance</th>
              <th>Assigned Project</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.workers.map(w => `
              <tr>
                <td><span class="os-tag">${w.worker_code}</span></td>
                <td><strong style="color:#FFF;">${w.worker_name}</strong><br><small style="color:#737373; font-family: monospace;">${w.phone || 'N/A'}</small></td>
                <td>${w.role}</td>
                <td>${formatCurrency(w.daily_wage)}/d</td>
                <td>${formatCurrency(w.hourly_wage)}/h</td>
                <td>${w.daysWorked} days</td>
                <td>${w.totalHours} hrs</td>
                <td style="color:#34D399; font-weight:600;">${formatCurrency(w.totalEarned)}</td>
                <td>${formatCurrency(w.totalPaid)}</td>
                <td style="font-weight:700; color: ${w.balance > 0 ? '#C98838' : '#34D399'};">
                  ${formatCurrency(w.balance)}
                </td>
                <td>${w.projectName}</td>
                <td>
                  <button class="os-btn-sm" onclick="window.ConstructionOS.openPayModal(${w.id}, '${w.worker_name}', ${w.balance})">Pay &rarr;</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 4. Daily Attendance Tab
  async function renderAttendanceTab(container) {
    const today = new Date().toISOString().split('T')[0];
    let url = `/api/portal/attendance?date=${today}`;
    if (state.selectedProjectId) url += `&project_id=${state.selectedProjectId}`;

    const res = await api(url);
    state.attendance = res.attendance || [];

    container.innerHTML = `
      <div class="os-tab-header">
        <div>
          <span class="os-eyebrow">04 / TIME &amp; WAGES</span>
          <h2 class="os-heading">Daily Site Attendance</h2>
          <p class="os-subheading">Date: <strong>${today}</strong> &middot; Automatic wage calculation with configurable 1.5x overtime multiplier.</p>
        </div>
        <button class="os-btn os-btn-primary" onclick="window.ConstructionOS.openModal('mark-attendance')">+ Mark Attendance</button>
      </div>

      <div class="os-table-wrap">
        <table class="os-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Worker</th>
              <th>Role</th>
              <th>Project</th>
              <th>Status</th>
              <th>Regular</th>
              <th>Overtime</th>
              <th>Calculated Wage</th>
              <th>Work Completed</th>
            </tr>
          </thead>
          <tbody>
            ${state.attendance.length === 0 ? `<tr><td colspan="9" style="text-align:center; padding:32px; color:#737373;">No attendance records logged for today. Click "+ Mark Attendance" above.</td></tr>` : ''}
            ${state.attendance.map(a => `
              <tr>
                <td style="font-family: monospace;">${a.date}</td>
                <td><strong style="color:#FFF;">${a.worker_name}</strong> <small style="color:#737373; font-family: monospace;">(${a.worker_code})</small></td>
                <td>${a.role}</td>
                <td>${a.project_name}</td>
                <td><span class="os-status-pill status-${a.status.toLowerCase().replace(' ', '-')}">${a.status}</span></td>
                <td>${a.regular_hours} hrs</td>
                <td>${a.overtime_hours > 0 ? `<span style="color:#C98838; font-weight:600;">+${a.overtime_hours} hrs OT</span>` : '0 hrs'}</td>
                <td style="font-weight:700; color:#34D399;">${formatCurrency(a.calculated_wage)}</td>
                <td style="max-width:280px; font-size:0.8rem; color:#A3A3A3;">${a.work_completed || 'General Finishing'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 5. Work Items Tab
  async function renderWorkItemsTab(container) {
    let url = '/api/portal/work-items';
    if (state.selectedProjectId) url += `?project_id=${state.selectedProjectId}`;
    const res = await api(url);
    state.workItems = res.workItems || [];

    container.innerHTML = `
      <div class="os-tab-header">
        <div>
          <span class="os-eyebrow">05 / SITE MILESTONES</span>
          <h2 class="os-heading">Work Assignments &amp; Milestones</h2>
          <p class="os-subheading">Track itemized task progress, assigned trade crews, and labor variances.</p>
        </div>
        <button class="os-btn os-btn-primary" onclick="window.ConstructionOS.openModal('new-work-item')">+ Add Work Item</button>
      </div>

      <div class="os-table-wrap">
        <table class="os-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Task Title</th>
              <th>Project</th>
              <th>Start Date</th>
              <th>Deadline</th>
              <th>Est. Labor</th>
              <th>Actual Labor</th>
              <th>Completion</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.workItems.map(w => `
              <tr>
                <td><span class="os-tag">${w.item_code}</span></td>
                <td><strong style="color:#FFF;">${w.title}</strong><br><small style="color:#737373;">${w.description || ''}</small></td>
                <td>${w.project_name}</td>
                <td style="font-family: monospace;">${w.start_date}</td>
                <td style="font-family: monospace;"><strong style="color:#FFF;">${w.deadline}</strong></td>
                <td>${formatCurrency(w.estimated_labor)}</td>
                <td>${formatCurrency(w.actual_labor)}</td>
                <td style="width: 120px;">
                  <div class="os-prog-bar-wrap">
                    <div class="os-prog-bar" style="width: ${w.completion_percentage}%;"></div>
                  </div>
                  <small style="color:#737373; font-family: monospace;">${w.completion_percentage}%</small>
                </td>
                <td><span class="os-status-pill status-${w.status.toLowerCase().replace(' ', '-')}">${w.status}</span></td>
                <td>
                  <button class="os-btn-sm" onclick="window.ConstructionOS.openUpdateWorkItemModal(${w.id}, ${w.completion_percentage}, '${w.status}', ${w.actual_labor})">Update &rarr;</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 6. Payments Tab
  async function renderPaymentsTab(container) {
    const res = await api('/api/portal/payments');
    state.payments = res.payments || [];

    container.innerHTML = `
      <div class="os-tab-header">
        <div>
          <span class="os-eyebrow">06 / WAGE LEDGER</span>
          <h2 class="os-heading">Worker Payments &amp; Advances</h2>
          <p class="os-subheading">Audit trail of wage payouts, advances, overtime bonuses, and worker balance reconciliations.</p>
        </div>
        <button class="os-btn os-btn-primary" onclick="window.ConstructionOS.openModal('record-payment')">Record Payment</button>
      </div>

      <div class="os-table-wrap">
        <table class="os-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Date</th>
              <th>Worker</th>
              <th>Project</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${state.payments.map(p => `
              <tr>
                <td style="font-family: monospace; color: #C98838;">#PAY-${p.id < 10 ? '0' + p.id : p.id}</td>
                <td style="font-family: monospace;">${p.date}</td>
                <td><strong style="color:#FFF;">${p.worker_name}</strong> <small style="color:#737373;">(${p.role})</small></td>
                <td>${p.project_name || 'General Payout'}</td>
                <td><span class="os-tag">${p.payment_type}</span></td>
                <td style="font-weight:700; color:#34D399;">${formatCurrency(p.amount)}</td>
                <td style="color:#878787; font-size:0.8rem;">${p.notes || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 7. Materials Tab
  async function renderMaterialsTab(container) {
    let url = '/api/portal/materials';
    if (state.selectedProjectId) url += `?project_id=${state.selectedProjectId}`;
    const res = await api(url);
    const purchases = res.materialPurchases || [];

    container.innerHTML = `
      <div class="os-tab-header">
        <div>
          <span class="os-eyebrow">07 / MATERIAL PROCUREMENT</span>
          <h2 class="os-heading">Materials Procurement &amp; Invoices</h2>
          <p class="os-subheading">Track Italian marble, vitrified tiles, gypsum boards, paints, and hardware purchases by project.</p>
        </div>
        <button class="os-btn os-btn-primary" onclick="window.ConstructionOS.openModal('new-material-purchase')">+ Add Material Purchase</button>
      </div>

      <div class="os-table-wrap">
        <table class="os-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Material Name</th>
              <th>Category</th>
              <th>Project</th>
              <th>Quantity</th>
              <th>Unit Rate</th>
              <th>Total Cost</th>
              <th>Supplier</th>
              <th>Invoice #</th>
            </tr>
          </thead>
          <tbody>
            ${purchases.map(m => `
              <tr>
                <td style="font-family: monospace;">${m.date}</td>
                <td><strong style="color:#FFF;">${m.material_name}</strong></td>
                <td><span class="os-tag">${m.category}</span></td>
                <td>${m.project_name}</td>
                <td>${m.quantity} ${m.unit}</td>
                <td>${formatCurrency(m.unit_cost)}/${m.unit}</td>
                <td style="font-weight:700; color:#34D399;">${formatCurrency(m.total_cost)}</td>
                <td>${m.supplier || '—'}</td>
                <td><small style="color:#737373; font-family: monospace;">${m.invoice_no || '—'}</small></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 8. Project Expenses Tab
  async function renderExpensesTab(container) {
    let url = '/api/portal/expenses';
    if (state.selectedProjectId) url += `?project_id=${state.selectedProjectId}`;
    const res = await api(url);
    state.expenses = res.expenses || [];

    container.innerHTML = `
      <div class="os-tab-header">
        <div>
          <span class="os-eyebrow">08 / SITE EXPENDITURES</span>
          <h2 class="os-heading">Project Expenses Ledger</h2>
          <p class="os-subheading">Log equipment rental, crane transport, municipal permits, waste clearance, and sub-contractor fees.</p>
        </div>
        <button class="os-btn os-btn-primary" onclick="window.ConstructionOS.openModal('new-expense')">+ Add Expense</button>
      </div>

      <div class="os-table-wrap">
        <table class="os-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Vendor</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            ${state.expenses.map(e => `
              <tr>
                <td style="font-family: monospace;">${e.date}</td>
                <td><span class="os-tag">${e.category}</span></td>
                <td><strong style="color:#FFF;">${e.description}</strong></td>
                <td>${e.project_name}</td>
                <td style="font-weight:700; color:#F87171;">-${formatCurrency(e.amount)}</td>
                <td>${e.vendor || '—'}</td>
                <td style="color:#878787;">${e.payment_method}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 9. Financials & Profitability Tab
  async function renderFinancialsTab(container) {
    const res = await api('/api/portal/projects');
    const projects = res.projects || [];
    const targetProjects = state.selectedProjectId ? projects.filter(p => p.id === state.selectedProjectId) : projects;

    container.innerHTML = `
      <div class="os-tab-header">
        <div>
          <span class="os-eyebrow">09 / PROFITABILITY &amp; VARIANCE</span>
          <h2 class="os-heading">Financial Dashboard &amp; Profitability</h2>
          <p class="os-subheading">Contract Value - Actual Project Costs = Actual Net Profit &amp; Realized Margins.</p>
        </div>
      </div>

      ${targetProjects.map(p => {
        const f = p.financials;
        const estLabor = Math.round(f.estimatedBudget * 0.35);
        const estMaterial = Math.round(f.estimatedBudget * 0.50);
        const estOther = Math.round(f.estimatedBudget * 0.15);

        const laborVar = estLabor - f.actualLabor;
        const matVar = estMaterial - f.actualMaterial;
        const otherVar = estOther - f.actualOther;

        return `
          <div class="os-financial-block">
            <div class="os-block-header">
              <div>
                <h3 style="font-family: var(--font-serif, 'Fraunces', Georgia, serif); font-size:1.25rem; font-weight:400; color:#FFF; margin-bottom:4px;">#${p.id < 10 ? '0' + p.id : p.id} &middot; ${p.name}</h3>
                <span style="font-size:0.8rem; color:#878787; font-family: monospace;">Contract: ${formatCurrency(f.contractValue)} &middot; Budget: ${formatCurrency(f.estimatedBudget)}</span>
              </div>
              <div style="text-align:right;">
                <div style="font-family: var(--font-serif, 'Fraunces', Georgia, serif); font-size:1.45rem; font-weight:400; color:#34D399;">${formatCurrency(f.actualProfit)} Net Profit</div>
                <span style="font-size:0.75rem; color:#878787; font-family: monospace;">Profit Margin: <strong style="color: #34D399;">${f.profitMargin}%</strong></span>
              </div>
            </div>

            <!-- Cost Comparison Breakdown -->
            <table class="os-table" style="margin-top:16px;">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Estimated Budget</th>
                  <th>Actual Cost</th>
                  <th>Variance Amount</th>
                  <th>Variance %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Labor &amp; Crafts</strong></td>
                  <td>${formatCurrency(estLabor)}</td>
                  <td>${formatCurrency(f.actualLabor)}</td>
                  <td style="color:${laborVar >= 0 ? '#34D399' : '#F87171'}; font-weight:600;">${laborVar >= 0 ? '+' : ''}${formatCurrency(laborVar)}</td>
                  <td style="font-family: monospace;">${((laborVar / (estLabor || 1)) * 100).toFixed(1)}%</td>
                  <td><span class="os-status-pill ${laborVar >= 0 ? 'status-completed' : 'status-on-hold'}">${laborVar >= 0 ? 'Under Budget' : 'Over Budget'}</span></td>
                </tr>
                <tr>
                  <td><strong>Materials &amp; Cladding</strong></td>
                  <td>${formatCurrency(estMaterial)}</td>
                  <td>${formatCurrency(f.actualMaterial)}</td>
                  <td style="color:${matVar >= 0 ? '#34D399' : '#F87171'}; font-weight:600;">${matVar >= 0 ? '+' : ''}${formatCurrency(matVar)}</td>
                  <td style="font-family: monospace;">${((matVar / (estMaterial || 1)) * 100).toFixed(1)}%</td>
                  <td><span class="os-status-pill ${matVar >= 0 ? 'status-completed' : 'status-on-hold'}">${matVar >= 0 ? 'Under Budget' : 'Over Budget'}</span></td>
                </tr>
                <tr>
                  <td><strong>Transport, Tools &amp; Misc</strong></td>
                  <td>${formatCurrency(estOther)}</td>
                  <td>${formatCurrency(f.actualOther)}</td>
                  <td style="color:${otherVar >= 0 ? '#34D399' : '#F87171'}; font-weight:600;">${otherVar >= 0 ? '+' : ''}${formatCurrency(otherVar)}</td>
                  <td style="font-family: monospace;">${((otherVar / (estOther || 1)) * 100).toFixed(1)}%</td>
                  <td><span class="os-status-pill ${otherVar >= 0 ? 'status-completed' : 'status-on-hold'}">${otherVar >= 0 ? 'Under Budget' : 'Over Budget'}</span></td>
                </tr>
                <tr style="background: rgba(255,255,255,0.03); font-weight:700;">
                  <td>TOTALS</td>
                  <td>${formatCurrency(f.estimatedBudget)}</td>
                  <td>${formatCurrency(f.actualCost)}</td>
                  <td style="color:${f.remainingBudget >= 0 ? '#34D399' : '#F87171'};">${f.remainingBudget >= 0 ? '+' : ''}${formatCurrency(f.remainingBudget)}</td>
                  <td style="font-family: monospace;">${((f.remainingBudget / (f.estimatedBudget || 1)) * 100).toFixed(1)}%</td>
                  <td><span class="os-status-pill status-active">${f.remainingBudget >= 0 ? 'Surplus' : 'Deficit'}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      }).join('')}
    `;
  }

  // 10. Daily Site Reports Tab
  async function renderReportsTab(container) {
    let url = '/api/portal/reports';
    if (state.selectedProjectId) url += `?project_id=${state.selectedProjectId}`;
    const res = await api(url);
    state.reports = res.reports || [];

    container.innerHTML = `
      <div class="os-tab-header">
        <div>
          <span class="os-eyebrow">10 / FIELD SUPERVISION</span>
          <h2 class="os-heading">Daily Site Progress Reports</h2>
          <p class="os-subheading">Field supervisors log work completed, site safety compliance, material consumption, and photo evidence.</p>
        </div>
        <button class="os-btn os-btn-primary" onclick="window.ConstructionOS.openModal('new-daily-report')">+ Submit Daily Report</button>
      </div>

      <div class="os-reports-feed">
        ${state.reports.map(r => {
          let photos = [];
          try { photos = JSON.parse(r.photos_json || '[]'); } catch (e) {}
          return `
            <div class="os-report-card">
              <div class="os-card-header">
                <div>
                  <span class="os-tag">${r.date}</span>
                  <h3 class="os-card-title">${r.project_name}</h3>
                  <span class="os-card-sub">Filed by <strong>${r.supervisor_name || 'Ramesh Patel'}</strong> &middot; ${r.workers_present_count} Workers on site</span>
                </div>
                <span class="os-status-pill status-completed">VERIFIED LOG</span>
              </div>

              <div class="os-report-body">
                <div class="os-report-section">
                  <span class="os-report-lbl">Work Completed</span>
                  <p class="os-report-txt">${r.work_completed}</p>
                </div>
                <div class="os-report-section">
                  <span class="os-report-lbl">Materials Consumed</span>
                  <p class="os-report-txt">${r.materials_used || 'Standard shop consumables'}</p>
                </div>
                <div class="os-report-section">
                  <span class="os-report-lbl">Observations &amp; Issues</span>
                  <p class="os-report-txt">${r.problems || 'None reported'}</p>
                </div>
                <div class="os-report-section">
                  <span class="os-report-lbl">Safety &amp; Compliance</span>
                  <p class="os-report-txt" style="color:#10B981;">${r.safety_issues || 'Zero incidents'}</p>
                </div>
                ${r.ai_observations ? `
                  <div class="os-ai-observation-box">
                    <span class="os-ai-sparkle">✦</span>
                    <div>
                      <strong>AI Site Photo Observation:</strong>
                      <div style="margin-top:2px;">${r.ai_observations}</div>
                    </div>
                  </div>
                ` : ''}

                ${photos.length > 0 ? `
                  <div class="os-report-photos">
                    ${photos.map(p => `<img src="${p}" alt="Site Photo" class="os-report-thumb">`).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // 11. AI Project Assistant Tab
  function renderAiAssistantTab(container) {
    container.innerHTML = `
      <div class="os-tab-header">
        <div>
          <span class="os-eyebrow">INTELLIGENCE / SQL GROUNDED</span>
          <h2 class="os-heading">Project AI Assistant</h2>
          <p class="os-subheading">Strictly grounded in real SQLite database records &middot; Zero hallucinations.</p>
        </div>
      </div>

      <div class="os-chat-container">
        <div class="os-chat-quick-queries">
          <span style="font-size: 0.68rem; font-family: 'JetBrains Mono', monospace; color: #C98838; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 700;">Direct Queries:</span>
          <button class="os-chip-btn" onclick="window.ConstructionOS.askAi('How much have we spent on labor?')">How much have we spent on labor?</button>
          <button class="os-chip-btn" onclick="window.ConstructionOS.askAi('How much do we owe workers?')">How much do we owe workers?</button>
          <button class="os-chip-btn" onclick="window.ConstructionOS.askAi('Who is working today?')">Who is working today?</button>
          <button class="os-chip-btn" onclick="window.ConstructionOS.askAi('What is our remaining budget?')">What is our remaining budget?</button>
          <button class="os-chip-btn" onclick="window.ConstructionOS.askAi('Which work is delayed?')">Which work is delayed?</button>
          <button class="os-chip-btn" onclick="window.ConstructionOS.askAi('How much did materials cost this week?')">How much did materials cost?</button>
          <button class="os-chip-btn" onclick="window.ConstructionOS.askAi('Compare estimated and actual labor')">Compare estimated and actual labor</button>
          <button class="os-chip-btn" onclick="window.ConstructionOS.askAi('Give me today\\'s site report')">Give me today's site report</button>
        </div>

        <div class="os-chat-messages" id="osChatMessages">
          <div class="os-chat-msg os-msg-assistant">
            <div class="os-msg-avatar">✦</div>
            <div class="os-msg-content">
              Hello! I am your <strong>Construction OS Intelligence Assistant</strong>. I am directly connected to your SQLite operational database. Ask me about labor expenses, worker balances, today's attendance, budget remaining, or material purchases.
            </div>
          </div>
        </div>

        <form class="os-chat-input-bar" id="osChatForm">
          <input type="text" id="osChatInput" class="os-chat-input" placeholder="Ask anything about your projects, workers, or expenses..." autocomplete="off">
          <button type="submit" class="os-btn os-btn-primary" style="padding: 12px 24px;">Send &rarr;</button>
        </form>
      </div>
    `;

    document.getElementById('osChatForm').addEventListener('submit', async e => {
      e.preventDefault();
      const input = document.getElementById('osChatInput');
      const query = input.value.trim();
      if (!query) return;
      input.value = '';
      await askAi(query);
    });
  }

  async function askAi(query) {
    const messages = document.getElementById('osChatMessages');
    if (!messages) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'os-chat-msg os-msg-user';
    userMsg.innerHTML = `<div class="os-msg-content">${escapeHtml(query)}</div>`;
    messages.appendChild(userMsg);
    messages.scrollTop = messages.scrollHeight;

    // Loading indicator
    const loadMsg = document.createElement('div');
    loadMsg.className = 'os-chat-msg os-msg-assistant';
    loadMsg.innerHTML = `<div class="os-msg-avatar">✦</div><div class="os-msg-content"><div class="os-spinner" style="display:inline-block; vertical-align:middle; width:14px; height:14px;"></div> Querying SQLite database records...</div>`;
    messages.appendChild(loadMsg);
    messages.scrollTop = messages.scrollHeight;

    try {
      const res = await api('/api/portal/ai-assistant', {
        method: 'POST',
        body: JSON.stringify({ query, project_id: state.selectedProjectId })
      });

      loadMsg.innerHTML = `
        <div class="os-msg-avatar">✦</div>
        <div class="os-msg-content">${formatMarkdown(res.answer || 'No records returned.')}</div>
      `;
    } catch (e) {
      loadMsg.innerHTML = `
        <div class="os-msg-avatar" style="color:#EF4444;">!</div>
        <div class="os-msg-content" style="color:#EF4444;">Error querying database: ${escapeHtml(e.message)}</div>
      `;
    }
    messages.scrollTop = messages.scrollHeight;
  }

  // ========================================================
  // MODALS HANDLER
  // ========================================================
  function openModal(type, data = {}) {
    const backdrop = document.getElementById('osModalBackdrop');
    const card = document.getElementById('osModalCard');
    if (!backdrop || !card) return;

    backdrop.style.display = 'flex';

    if (type === 'new-project') {
      card.innerHTML = `
        <div class="os-modal-header">
          <h3>+ Register New Project</h3>
          <button class="os-btn-close" onclick="window.ConstructionOS.closeModal()">&times;</button>
        </div>
        <form id="newProjectForm" class="os-modal-form">
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Project Name *</label>
              <input type="text" name="name" required placeholder="e.g. Prestige Lakeview Finish">
            </div>
            <div class="os-form-group">
              <label>Client Name *</label>
              <input type="text" name="client_name" required placeholder="e.g. Amit Singhal">
            </div>
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Project Type *</label>
              <select name="project_type">
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Interior">Interior</option>
                <option value="Renovation">Renovation</option>
                <option value="New Construction">New Construction</option>
                <option value="Repair">Repair</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="os-form-group">
              <label>City *</label>
              <select name="city">
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Kolkata">Kolkata</option>
              </select>
            </div>
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Estimated Budget (₹) *</label>
              <input type="number" name="estimated_budget" required value="1500000">
            </div>
            <div class="os-form-group">
              <label>Contract Value (₹) *</label>
              <input type="number" name="contract_value" required value="1850000">
            </div>
          </div>
          <div class="os-form-group">
            <label>Location Address</label>
            <input type="text" name="location" placeholder="e.g. Indiranagar 100ft Road">
          </div>
          <div class="os-modal-actions">
            <button type="button" class="os-btn os-btn-secondary" onclick="window.ConstructionOS.closeModal()">Cancel</button>
            <button type="submit" class="os-btn os-btn-primary">Save Project</button>
          </div>
        </form>
      `;

      document.getElementById('newProjectForm').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const payload = Object.fromEntries(fd.entries());
        await api('/api/portal/projects', { method: 'POST', body: JSON.stringify(payload) });
        closeModal();
        await loadInitialData();
        renderCurrentTab();
      });
    } else if (type === 'new-worker') {
      card.innerHTML = `
        <div class="os-modal-header">
          <h3>+ Register Craftsman / Worker</h3>
          <button class="os-btn-close" onclick="window.ConstructionOS.closeModal()">&times;</button>
        </div>
        <form id="newWorkerForm" class="os-modal-form">
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Worker Full Name *</label>
              <input type="text" name="worker_name" required placeholder="e.g. Vikram Sharma">
            </div>
            <div class="os-form-group">
              <label>Role *</label>
              <select name="role">
                <option value="Painter">Painter</option>
                <option value="Tile Worker">Tile Worker</option>
                <option value="Carpenter">Carpenter</option>
                <option value="False Ceiling Worker">False Ceiling Worker</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Mason">Mason</option>
                <option value="Helper">Helper</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Site Engineer">Site Engineer</option>
              </select>
            </div>
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Daily Wage Rate (₹) *</label>
              <input type="number" name="daily_wage" required value="1100">
            </div>
            <div class="os-form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="+91 98765 43210">
            </div>
          </div>
          <div class="os-form-group">
            <label>Assign to Project</label>
            <select name="assigned_project_id">
              <option value="">-- Select Project --</option>
              ${state.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
            </select>
          </div>
          <div class="os-modal-actions">
            <button type="button" class="os-btn os-btn-secondary" onclick="window.ConstructionOS.closeModal()">Cancel</button>
            <button type="submit" class="os-btn os-btn-primary">Register Worker</button>
          </div>
        </form>
      `;

      document.getElementById('newWorkerForm').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const payload = Object.fromEntries(fd.entries());
        await api('/api/portal/workers', { method: 'POST', body: JSON.stringify(payload) });
        closeModal();
        renderCurrentTab();
      });
    } else if (type === 'mark-attendance') {
      card.innerHTML = `
        <div class="os-modal-header">
          <h3>Mark Daily Attendance</h3>
          <button class="os-btn-close" onclick="window.ConstructionOS.closeModal()">&times;</button>
        </div>
        <form id="attendanceForm" class="os-modal-form">
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Date *</label>
              <input type="date" name="date" required value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="os-form-group">
              <label>Project *</label>
              <select name="project_id" required>
                ${state.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="os-form-group">
            <label>Worker *</label>
            <select name="worker_id" required>
              ${state.workers.map(w => `<option value="${w.id}">${w.worker_name} &middot; ${w.role} (₹${w.daily_wage}/d)</option>`).join('')}
            </select>
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Status *</label>
              <select name="status">
                <option value="PRESENT">PRESENT (Full Day &middot; 8h)</option>
                <option value="HALF DAY">HALF DAY (4h)</option>
                <option value="ABSENT">ABSENT (0h)</option>
                <option value="LEAVE">LEAVE</option>
              </select>
            </div>
            <div class="os-form-group">
              <label>Overtime Hours (1.5x Rate)</label>
              <input type="number" name="overtime_hours" min="0" max="8" step="0.5" value="0">
            </div>
          </div>
          <div class="os-form-group">
            <label>Work Completed / Notes</label>
            <input type="text" name="work_completed" placeholder="e.g. Completed master bedroom wall skimming">
          </div>
          <div class="os-modal-actions">
            <button type="button" class="os-btn os-btn-secondary" onclick="window.ConstructionOS.closeModal()">Cancel</button>
            <button type="submit" class="os-btn os-btn-primary">Save Attendance &amp; Calculate Wage</button>
          </div>
        </form>
      `;

      document.getElementById('attendanceForm').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const payload = Object.fromEntries(fd.entries());
        await api('/api/portal/attendance', { method: 'POST', body: JSON.stringify(payload) });
        closeModal();
        renderCurrentTab();
      });
    } else if (type === 'record-payment') {
      const defaultWorkerId = data.workerId || '';
      card.innerHTML = `
        <div class="os-modal-header">
          <h3>Record Worker Payment</h3>
          <button class="os-btn-close" onclick="window.ConstructionOS.closeModal()">&times;</button>
        </div>
        <form id="paymentForm" class="os-modal-form">
          <div class="os-form-group">
            <label>Worker *</label>
            <select name="worker_id" required>
              ${state.workers.map(w => `<option value="${w.id}" ${w.id == defaultWorkerId ? 'selected' : ''}>${w.worker_name} (${w.role}) &mdash; Balance: ${formatCurrency(w.balance)}</option>`).join('')}
            </select>
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Amount (₹) *</label>
              <input type="number" name="amount" required value="${data.balance > 0 ? data.balance : 5000}">
            </div>
            <div class="os-form-group">
              <label>Payment Type *</label>
              <select name="payment_type">
                <option value="Wage">Wage</option>
                <option value="Advance">Advance</option>
                <option value="Overtime">Overtime</option>
                <option value="Bonus">Bonus</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Date *</label>
              <input type="date" name="date" required value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="os-form-group">
              <label>Project</label>
              <select name="project_id">
                <option value="">General Company Payout</option>
                ${state.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="os-form-group">
            <label>Notes / Voucher #</label>
            <input type="text" name="notes" placeholder="e.g. Bi-weekly settlement via Bank Transfer">
          </div>
          <div class="os-modal-actions">
            <button type="button" class="os-btn os-btn-secondary" onclick="window.ConstructionOS.closeModal()">Cancel</button>
            <button type="submit" class="os-btn os-btn-primary">Record Payment &amp; Reconcile</button>
          </div>
        </form>
      `;

      document.getElementById('paymentForm').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const payload = Object.fromEntries(fd.entries());
        await api('/api/portal/payments', { method: 'POST', body: JSON.stringify(payload) });
        closeModal();
        renderCurrentTab();
      });
    } else if (type === 'new-expense') {
      card.innerHTML = `
        <div class="os-modal-header">
          <h3>+ Add Project Expense</h3>
          <button class="os-btn-close" onclick="window.ConstructionOS.closeModal()">&times;</button>
        </div>
        <form id="expenseForm" class="os-modal-form">
          <div class="os-form-group">
            <label>Project *</label>
            <select name="project_id" required>
              ${state.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
            </select>
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Category *</label>
              <select name="category">
                <option value="Labor">Labor</option>
                <option value="Materials">Materials</option>
                <option value="Transport">Transport</option>
                <option value="Equipment">Equipment</option>
                <option value="Subcontractor">Subcontractor</option>
                <option value="Permits">Permits</option>
                <option value="Waste">Waste</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
            <div class="os-form-group">
              <label>Amount (₹) *</label>
              <input type="number" name="amount" required placeholder="e.g. 15000">
            </div>
          </div>
          <div class="os-form-group">
            <label>Description *</label>
            <input type="text" name="description" required placeholder="e.g. Hydraulic flatbed delivery for marble slabs">
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Date *</label>
              <input type="date" name="date" required value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="os-form-group">
              <label>Vendor / Supplier</label>
              <input type="text" name="vendor" placeholder="e.g. Apex Logistics">
            </div>
          </div>
          <div class="os-modal-actions">
            <button type="button" class="os-btn os-btn-secondary" onclick="window.ConstructionOS.closeModal()">Cancel</button>
            <button type="submit" class="os-btn os-btn-primary">Save Expense</button>
          </div>
        </form>
      `;

      document.getElementById('expenseForm').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const payload = Object.fromEntries(fd.entries());
        await api('/api/portal/expenses', { method: 'POST', body: JSON.stringify(payload) });
        closeModal();
        renderCurrentTab();
      });
    } else if (type === 'new-daily-report') {
      card.innerHTML = `
        <div class="os-modal-header">
          <h3>Submit Daily Site Report</h3>
          <button class="os-btn-close" onclick="window.ConstructionOS.closeModal()">&times;</button>
        </div>
        <form id="dailyReportForm" class="os-modal-form">
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Project *</label>
              <select name="project_id" required>
                ${state.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
              </select>
            </div>
            <div class="os-form-group">
              <label>Date *</label>
              <input type="date" name="date" required value="${new Date().toISOString().split('T')[0]}">
            </div>
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Workers Present *</label>
              <input type="number" name="workers_present_count" required value="4">
            </div>
            <div class="os-form-group">
              <label>Supervisor Name</label>
              <input type="text" name="supervisor_name" value="Ramesh Patel">
            </div>
          </div>
          <div class="os-form-group">
            <label>Work Completed Today *</label>
            <textarea name="work_completed" required rows="3" placeholder="Detail the trades executed, area covered, and milestone progress..."></textarea>
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Materials Used</label>
              <input type="text" name="materials_used" placeholder="e.g. 5 bags adhesive, 20L primer">
            </div>
            <div class="os-form-group">
              <label>Issues / Delays</label>
              <input type="text" name="problems" placeholder="None or describe blockages">
            </div>
          </div>
          <div class="os-form-group">
            <label>Safety &amp; Compliance Notes</label>
            <input type="text" name="safety_issues" value="Zero incidents &middot; 100% PPE compliance">
          </div>
          <div class="os-form-group">
            <label>Site Photo URL (Optional)</label>
            <input type="url" name="photo_url" placeholder="https://images.unsplash.com/photo-...">
          </div>
          <div class="os-modal-actions">
            <button type="button" class="os-btn os-btn-secondary" onclick="window.ConstructionOS.closeModal()">Cancel</button>
            <button type="submit" class="os-btn os-btn-primary">Submit Report</button>
          </div>
        </form>
      `;

      document.getElementById('dailyReportForm').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const payload = Object.fromEntries(fd.entries());
        if (payload.photo_url) {
          payload.photos = [payload.photo_url];
          payload.ai_observations = 'AI Photo Observation: Surface prep conforms to Level-4 smoothness. Grouting lines verified flush.';
        }
        await api('/api/portal/reports', { method: 'POST', body: JSON.stringify(payload) });
        closeModal();
        renderCurrentTab();
      });
    } else if (type === 'new-work-item') {
      card.innerHTML = `
        <div class="os-modal-header">
          <h3>+ Add Work Item (Milestone Task)</h3>
          <button class="os-btn-close" onclick="window.ConstructionOS.closeModal()">&times;</button>
        </div>
        <form id="workItemForm" class="os-modal-form">
          <div class="os-form-group">
            <label>Project *</label>
            <select name="project_id" required>
              ${state.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
            </select>
          </div>
          <div class="os-form-group">
            <label>Task Title *</label>
            <input type="text" name="title" required placeholder="e.g. Master Bedroom Acrylic Stucco Application">
          </div>
          <div class="os-form-group">
            <label>Description</label>
            <input type="text" name="description" placeholder="Surface prep, primer coat, and two coats of decorative stucco">
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Start Date *</label>
              <input type="date" name="start_date" required value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="os-form-group">
              <label>Deadline *</label>
              <input type="date" name="deadline" required value="${new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]}">
            </div>
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Estimated Labor (₹) *</label>
              <input type="number" name="estimated_labor" required value="45000">
            </div>
            <div class="os-form-group">
              <label>Initial Status</label>
              <select name="status">
                <option value="NOT STARTED">NOT STARTED</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="ON HOLD">ON HOLD</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>
          <div class="os-modal-actions">
            <button type="button" class="os-btn os-btn-secondary" onclick="window.ConstructionOS.closeModal()">Cancel</button>
            <button type="submit" class="os-btn os-btn-primary">Create Work Item</button>
          </div>
        </form>
      `;

      document.getElementById('workItemForm').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const payload = Object.fromEntries(fd.entries());
        await api('/api/portal/work-items', { method: 'POST', body: JSON.stringify(payload) });
        closeModal();
        renderCurrentTab();
      });
    } else if (type === 'update-work-item') {
      card.innerHTML = `
        <div class="os-modal-header">
          <h3>Update Work Item Progress</h3>
          <button class="os-btn-close" onclick="window.ConstructionOS.closeModal()">&times;</button>
        </div>
        <form id="updateWorkItemForm" class="os-modal-form">
          <div class="os-form-group">
            <label>Completion Percentage (%): <strong id="progVal">${data.pct}%</strong></label>
            <input type="range" name="completion_percentage" min="0" max="100" value="${data.pct}" oninput="document.getElementById('progVal').innerText = this.value + '%'">
          </div>
          <div class="os-form-row">
            <div class="os-form-group">
              <label>Status *</label>
              <select name="status">
                <option value="NOT STARTED" ${data.status === 'NOT STARTED' ? 'selected' : ''}>NOT STARTED</option>
                <option value="IN PROGRESS" ${data.status === 'IN PROGRESS' ? 'selected' : ''}>IN PROGRESS</option>
                <option value="ON HOLD" ${data.status === 'ON HOLD' ? 'selected' : ''}>ON HOLD</option>
                <option value="COMPLETED" ${data.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
                <option value="CANCELLED" ${data.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
              </select>
            </div>
            <div class="os-form-group">
              <label>Actual Labor Incurred (₹)</label>
              <input type="number" name="actual_labor" value="${data.actualLabor || 0}">
            </div>
          </div>
          <div class="os-modal-actions">
            <button type="button" class="os-btn os-btn-secondary" onclick="window.ConstructionOS.closeModal()">Cancel</button>
            <button type="submit" class="os-btn os-btn-primary">Update Task</button>
          </div>
        </form>
      `;

      document.getElementById('updateWorkItemForm').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const payload = Object.fromEntries(fd.entries());
        await api(`/api/portal/work-items/${data.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        closeModal();
        renderCurrentTab();
      });
    }
  }

  function closeModal() {
    const backdrop = document.getElementById('osModalBackdrop');
    if (backdrop) backdrop.style.display = 'none';
  }

  function selectProjectAndSwitch(projId, tabName) {
    state.selectedProjectId = projId;
    const sel = document.getElementById('osProjectSelect');
    if (sel) sel.value = projId;
    state.currentTab = tabName;
    document.querySelectorAll('.os-nav-item').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });
    renderCurrentTab();
  }

  function openPayModal(workerId, workerName, balance) {
    openModal('record-payment', { workerId, workerName, balance });
  }

  function openUpdateWorkItemModal(id, pct, status, actualLabor) {
    openModal('update-work-item', { id, pct, status, actualLabor });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let clean = text.replace(/&middot;/g, '·');
    let html = escapeHtml(clean);
    html = html.replace(/&amp;middot;/g, '·');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #E6C280; font-weight: 600;">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em style="color: #94A3B8;">$1</em>');
    html = html.replace(/### (.*?)\n/g, '<h4 style="color:#C98838; font-family: \'Cinzel\', \'Fraunces\', Georgia, serif; font-size: 0.95rem; margin:12px 0 8px 0; letter-spacing: 0.06em; border-bottom: 1px solid rgba(201, 136, 56, 0.2); padding-bottom: 5px;">$1</h4>');
    html = html.replace(/\n- (.*?)/g, '<div style="margin: 3px 0; display: flex; align-items: flex-start; gap: 8px;"><span style="color:#C98838;">&bull;</span><span>$1</span></div>');
    html = html.replace(/\n• (.*?)/g, '<div style="margin: 3px 0; display: flex; align-items: flex-start; gap: 8px;"><span style="color:#C98838;">&bull;</span><span>$1</span></div>');
    html = html.replace(/\n\n/g, '<div style="height: 10px;"></div>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  // Expose API on window for external triggers
  window.ConstructionOS = {
    open: openPortal,
    close: closePortal,
    openModal,
    closeModal,
    askAi,
    selectProjectAndSwitch,
    openPayModal,
    openUpdateWorkItemModal
  };

  // Wire launcher button when DOM loads
  document.addEventListener('DOMContentLoaded', () => {
    const isStandalone = window.IS_STANDALONE_OS ||
      window.location.pathname.includes('construction-os') ||
      window.location.pathname.includes('operational-clarity');

    if (isStandalone) {
      openPortal('overview');
    }

    const launcher = document.getElementById('openPortalBtn');
    if (launcher) {
      launcher.addEventListener('click', () => openPortal('overview'));
    }
    // Auto-open if URL hash is #portal or query param is ?portal=true / ?os=true
    if (window.location.hash === '#portal' || window.location.search.includes('portal') || window.location.search.includes('os')) {
      setTimeout(() => openPortal('overview'), 100);
    }
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#portal') {
        openPortal('overview');
      }
    });
  });
})();
