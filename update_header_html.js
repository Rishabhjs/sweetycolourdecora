const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace the <header class="site-nav">...</header> with a clean, luxury, non-wrapping header
const newHeader = `  <header class="site-nav">
    <div class="nav-container">
      <!-- BRAND LOGO & SUBTITLE -->
      <a href="#hero" class="nav-brand" aria-label="Sweety Colour Decora Home">
        <span class="nav-wordmark">SWEETY COLOUR DECORA</span>
        <span class="nav-subline">Finishing &amp; Construction Contractors &middot; Est. 2003</span>
      </a>

      <!-- MOBILE TOGGLE -->
      <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation menu" aria-expanded="false">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <!-- NAVIGATION CLUSTERS -->
      <nav class="nav-clusters" id="navClusters">
        <!-- Part One: Public Company Links -->
        <ul class="nav-group nav-primary">
          <li><a href="#about" class="nav-link">About</a></li>
          <li><a href="#services" class="nav-link">Services</a></li>
          <li><a href="#how-we-work" class="nav-link">How We Work</a></li>
          <li><a href="#why-us" class="nav-link">Why Us</a></li>
        </ul>

        <div class="nav-divider" aria-hidden="true"></div>

        <!-- Part Two: Proposal Dropdown Menu -->
        <div class="nav-dropdown" id="proposalDropdown">
          <button class="nav-dropdown-btn" id="proposalDropBtn" aria-expanded="false" aria-haspopup="true">
            <span class="nav-proposal-tag">Proposal</span>
            <span class="nav-dropdown-label">SiteFlow Monograph</span>
            <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="nav-dropdown-menu" id="proposalDropMenu">
            <div class="dropdown-header">Chapters &middot; Digital Monograph</div>
            <a href="#proposal-opportunity" class="dropdown-item">
              <span class="dropdown-num">01</span>
              <span class="dropdown-text">The Opportunity</span>
            </a>
            <a href="#proposal-positioning" class="dropdown-item">
              <span class="dropdown-num">02</span>
              <span class="dropdown-text">Sector &amp; Positioning</span>
            </a>
            <a href="#proposal-problems" class="dropdown-item">
              <span class="dropdown-num">03</span>
              <span class="dropdown-text">Problems Today</span>
            </a>
            <a href="#proposal-solution" class="dropdown-item">
              <span class="dropdown-num">04</span>
              <span class="dropdown-text">SiteFlow Solution</span>
            </a>
            <a href="#proposal-modules" class="dropdown-item">
              <span class="dropdown-num">05</span>
              <span class="dropdown-text">Core Modules</span>
            </a>
            <a href="#proposal-workflow" class="dropdown-item">
              <span class="dropdown-num">06</span>
              <span class="dropdown-text">Daily Workflow</span>
            </a>
            <a href="#proposal-roles" class="dropdown-item">
              <span class="dropdown-num">07</span>
              <span class="dropdown-text">Roles &amp; Controls</span>
            </a>
            <a href="#proposal-roadmap" class="dropdown-item">
              <span class="dropdown-num">08</span>
              <span class="dropdown-text">Implementation Roadmap</span>
            </a>
            <a href="#proposal-ip" class="dropdown-item">
              <span class="dropdown-num">09</span>
              <span class="dropdown-text">Patent &amp; IP Strategy</span>
            </a>
            <a href="#proposal-commercials" class="dropdown-item">
              <span class="dropdown-num">10</span>
              <span class="dropdown-text">Commercial Structure</span>
            </a>
            <a href="#proposal-risks" class="dropdown-item">
              <span class="dropdown-num">11</span>
              <span class="dropdown-text">Risk Mitigation</span>
            </a>
            <a href="#proposal-metrics" class="dropdown-item">
              <span class="dropdown-num">12</span>
              <span class="dropdown-text">Success Metrics</span>
            </a>
            <a href="#proposal-next" class="dropdown-item">
              <span class="dropdown-num">13</span>
              <span class="dropdown-text">Next Steps</span>
            </a>
          </div>
        </div>

        <!-- Action Items (Deck, Enquire, Theme) -->
        <div class="nav-actions">
          <button id="openCanvaModal" class="canva-nav-btn" aria-label="Open Presentation Deck" title="Open Presentation Deck">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Deck</span>
          </button>
          <a href="#enquiry" class="nav-cta">Enquire</a>
          <button id="themeToggle" class="theme-toggle-btn" aria-label="Toggle Theme" title="Toggle Light/Dark Theme">
            <span class="theme-icon theme-icon-moon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </span>
            <span class="theme-icon theme-icon-sun">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </span>
          </button>
        </div>
      </nav>
    </div>
  </header>`;

html = html.replace(/<header class="site-nav">[\s\S]*?<\/header>/, newHeader);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated navigation header in index.html!');
