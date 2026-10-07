const https = require('https');
const http = require('http');

const testUrls = [
  // Wikimedia Commons high quality architecture and construction videos
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Interior_design_tour_in_Paris.webm/Interior_design_tour_in_Paris.webm.720p.vp9.webm',
  // Coverr CDN direct videos
  'https://cdn.coverr.co/videos/coverr-building-a-brick-wall-5115/1080p.mp4',
  'https://cdn.coverr.co/videos/coverr-renovating-a-room-5264/1080p.mp4',
  'https://cdn.coverr.co/videos/coverr-a-man-painting-a-wall-with-a-roller-8951/1080p.mp4',
  'https://cdn.coverr.co/videos/coverr-renovation-and-painting-of-walls-8955/1080p.mp4',
  'https://cdn.coverr.co/videos/coverr-worker-installing-tiles-on-a-floor-8949/1080p.mp4',
  'https://cdn.coverr.co/videos/coverr-workers-on-a-construction-site-8950/1080p.mp4'
];

testUrls.forEach(url => {
  const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    console.log(url.split('/').pop(), '-> Code:', res.statusCode, 'Type:', res.headers['content-type'], 'Len:', res.headers['content-length']);
    res.resume();
  });
  req.on('error', err => console.log(url.split('/').pop(), 'Error:', err.message));
});

/* ==========================================================================
   TEXTURE.AI PROPOSAL SECTIONS & MISSING UI SPECIFICATIONS
   Fixing layout, grids, tables, and visual containers for Sections 01 - 13,
   Canva presentation deck, enquiry section, and monograph credits.
   ========================================================================== */

/* Proposal Section Base */
.proposal-section {
  padding: 96px 0;
  position: relative;
  background-color: var(--bg-primary);
}

.proposal-pre-rule {
  width: 44px;
  height: 2px;
  background-color: var(--accent);
  margin-bottom: 24px;
}

.proposal-running-foot {
  margin-top: 56px;
  padding-top: 20px;
  border-top: 1px solid var(--hairline);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  display: block;
}

.lead {
  font-size: 1.18rem;
  line-height: 1.65;
  color: var(--ink-secondary);
  max-width: 800px;
  margin-bottom: 32px;
}

.section-sub {
  font-size: 0.96rem;
  color: var(--muted);
  line-height: 1.6;
  max-width: 680px;
  margin-top: 8px;
}

.fade-in-section {
  opacity: 1;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

/* Section 01: The Opportunity Grid */
.opportunity-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-bottom: 36px;
}

@media (max-width: 860px) {
  .opportunity-grid {
    grid-template-columns: 1fr;
  }
}

.opportunity-col {
  background-color: var(--bg-primary);
  padding: 38px 30px;
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease;
}

.opportunity-col:hover {
  background-color: var(--paper-hover);
}

.opportunity-label {
  font-size: 0.74rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 14px;
  display: block;
}

.opportunity-body {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--ink);
  margin: 0;
}

.editorial-note {
  background-color: var(--paper-callout);
  border-left: 2px solid var(--accent);
  padding: 22px 28px;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--ink-secondary);
  margin-bottom: 24px;
}

.editorial-note strong {
  color: var(--ink);
}

/* Section 02: Sector & Positioning (Data Table) */
.data-table {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-bottom: 36px;
}

.data-row {
  background-color: var(--bg-primary);
  padding: 20px 28px;
  display: grid;
  grid-template-columns: 240px 1fr;
  align-items: baseline;
  gap: 28px;
  transition: background-color 0.2s ease;
}

.data-row:hover {
  background-color: var(--paper-hover);
}

@media (max-width: 768px) {
  .data-row {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 16px 20px;
  }
}

.data-key {
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--accent);
}

.data-val {
  font-size: 0.96rem;
  color: var(--ink);
  line-height: 1.55;
}

/* Section 03: Problems List & Why It Matters */
.problems-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .problems-list {
    grid-template-columns: 1fr;
  }
}

.problem-item {
  background-color: var(--bg-primary);
  padding: 28px 26px;
  display: flex;
  align-items: flex-start;
  gap: 18px;
  transition: background-color 0.2s ease;
}

.problem-item:hover {
  background-color: var(--paper-hover);
}

.problem-index {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.1em;
  width: 24px;
  flex-shrink: 0;
  padding-top: 1px;
}

.problem-text {
  font-size: 0.94rem;
  color: var(--ink);
  line-height: 1.55;
  margin: 0;
}

.why-it-matters-lines {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 22px;
}

.why-it-matters-line {
  font-size: 1.05rem;
  color: var(--ink);
  line-height: 1.5;
}

.serif-emphasis {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--accent);
  font-size: 1.22rem;
  margin-right: 6px;
}

.why-it-matters-closing {
  font-size: 0.9rem;
  color: var(--muted);
  line-height: 1.6;
  border-top: 1px solid var(--hairline);
  padding-top: 18px;
  margin: 0;
}

/* Section 04: Solution (Sweety SiteFlow) */
.solution-intro {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.3rem;
  color: var(--ink-secondary);
  margin-bottom: 36px;
}

.solution-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-top: 36px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .solution-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .solution-cards-grid {
    grid-template-columns: 1fr;
  }
}

.solution-card-icon {
  width: 40px;
  height: 40px;
  color: var(--accent);
  margin-bottom: 20px;
  flex-shrink: 0;
}

.solution-card-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  stroke-width: 1.6;
  fill: none;
}

.solution-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.solution-card-desc {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.55;
  margin: 0;
}

.pull-quote {
  background-color: var(--paper-callout);
  border-left: 2px solid var(--accent);
  padding: 32px 36px;
  margin-top: 40px;
}

.pull-quote-text {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--ink);
}

.pull-quote-accent {
  color: var(--accent);
  font-size: 1.8rem;
  line-height: 1;
  vertical-align: -0.1em;
  margin-right: 4px;
}

/* Section 05: Core Modules Grid */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-top: 36px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
}

.module-icon-wrap {
  width: 40px;
  height: 40px;
  color: var(--accent);
  margin-bottom: 20px;
  flex-shrink: 0;
}

.module-icon-wrap svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  stroke-width: 1.6;
  fill: none;
}

.module-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.module-desc {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.55;
  margin: 0;
}

/* Section 06: Daily Workflow Pipeline & Worked Example */
.workflow-pipeline {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-bottom: 36px;
}

@media (max-width: 992px) {
  .workflow-pipeline {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 600px) {
  .workflow-pipeline {
    grid-template-columns: 1fr;
  }
}

.workflow-step {
  background-color: var(--bg-primary);
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease;
}

.workflow-step:hover {
  background-color: var(--paper-hover);
}

.workflow-num {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.12em;
  margin-bottom: 12px;
  display: block;
}

.workflow-title {
  font-size: 0.94rem;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.45;
}

.worked-example-box {
  background-color: var(--paper-callout);
  border: 1px solid var(--hairline);
  border-left: 2px solid var(--accent);
  padding: 32px 36px;
  margin-top: 36px;
}

.worked-example-label {
  font-size: 0.74rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  display: block;
  margin-bottom: 14px;
}

.worked-example-text {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.18rem;
  color: var(--ink);
  line-height: 1.55;
  margin-bottom: 12px;
}

.worked-example-subtext {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.55;
}

/* Section 07: User Roles & Controls */
.roles-intro {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.15rem;
  color: var(--ink-secondary);
  margin-bottom: 28px;
}

.roles-table {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-bottom: 28px;
}

.role-row {
  background-color: var(--bg-primary);
  padding: 20px 28px;
  display: grid;
  grid-template-columns: 220px 1fr;
  align-items: center;
  gap: 24px;
  transition: background-color 0.2s ease;
}

.role-row:hover {
  background-color: var(--paper-hover);
}

@media (max-width: 768px) {
  .role-row {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 16px 20px;
  }
}

.role-name {
  font-weight: 700;
  font-size: 0.98rem;
  color: var(--ink);
}

.role-desc {
  font-size: 0.9rem;
  color: var(--ink-secondary);
  line-height: 1.5;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.control-tag {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--accent);
  border: 1px solid var(--hairline-accent);
  background-color: var(--accent-light);
  padding: 6px 14px;
  border-radius: 2px;
}

/* Section 08: MVP Roadmap */
.roadmap-phases {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-bottom: 32px;
}

@media (max-width: 800px) {
  .roadmap-phases {
    grid-template-columns: 1fr;
  }
}

.roadmap-phase {
  background-color: var(--bg-primary);
  padding: 36px 28px;
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease;
}

.roadmap-phase:hover {
  background-color: var(--paper-hover);
}

.phase-time {
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 12px;
  display: block;
}

.phase-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 12px;
}

.phase-desc {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
}

.gate-callout {
  background-color: var(--paper-callout);
  border-left: 2px solid var(--accent);
  padding: 20px 24px;
  font-size: 0.92rem;
  color: var(--ink-secondary);
  line-height: 1.55;
  margin-top: 24px;
}

.gate-callout strong {
  color: var(--ink);
}

/* Section 09: Brand Foundation */
.brand-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .brand-grid {
    grid-template-columns: 1fr;
  }
}

.brand-block {
  background-color: var(--bg-primary);
  padding: 38px 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.brand-block h4 {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 4px;
}

.brand-block p {
  font-size: 0.9rem;
  color: var(--ink-secondary);
  line-height: 1.6;
  margin: 0;
}

.brand-block p strong {
  color: var(--ink);
}

.tagline-options, .foundational-checklist {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.tagline-options li, .foundational-checklist li {
  font-size: 0.9rem;
  color: var(--ink-secondary);
  position: relative;
  padding-left: 18px;
  line-height: 1.5;
}

.tagline-options li::before, .foundational-checklist li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--accent);
}

/* Section 10: Data & Implementation Plan */
.plan-intro {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.15rem;
  color: var(--ink-secondary);
  margin-bottom: 28px;
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-bottom: 28px;
}

.plan-item {
  background-color: var(--bg-primary);
  padding: 20px 28px;
  display: flex;
  align-items: center;
  gap: 24px;
  transition: background-color 0.2s ease;
}

.plan-item:hover {
  background-color: var(--paper-hover);
}

.plan-index {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.12em;
  width: 32px;
  flex-shrink: 0;
}

.plan-text {
  font-size: 0.92rem;
  color: var(--ink);
  line-height: 1.5;
}

/* Section 11: IP & Patent Strategy */
.ip-body {
  background-color: var(--bg-primary);
  border: 1px solid var(--hairline);
  padding: 44px 38px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.ip-body p {
  font-size: 0.95rem;
  color: var(--ink-secondary);
  line-height: 1.7;
  margin: 0;
}

.ip-disclaimer {
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  border-top: 1px solid var(--hairline);
  padding-top: 16px;
  margin-top: 12px !important;
}

/* Section 12: Pilot Success Metrics */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-bottom: 24px;
}

@media (max-width: 900px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}

.metric-num {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.14em;
  margin-bottom: 12px;
  display: block;
}

.metric-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 8px;
}

.metric-desc {
  font-size: 0.86rem;
  color: var(--muted);
  line-height: 1.55;
  margin: 0;
}

.metric-footer-line {
  font-size: 0.88rem;
  color: var(--muted);
  font-style: italic;
  margin-top: 20px;
  border-left: 2px solid var(--accent);
  padding-left: 16px;
}

/* Section 13: Recommended Next Steps */
.next-steps-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-bottom: 32px;
}

.step-row {
  background-color: var(--bg-primary);
  padding: 22px 28px;
  display: flex;
  align-items: center;
  gap: 24px;
  transition: background-color 0.2s ease;
}

.step-row:hover {
  background-color: var(--paper-hover);
}

.step-num {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.12em;
  width: 28px;
  flex-shrink: 0;
}

.step-text {
  font-size: 0.95rem;
  color: var(--ink);
  line-height: 1.5;
}

/* Proposal Author Credit */
.proposal-author-credit {
  padding: 60px 0 40px;
  background-color: var(--bg-primary);
  text-align: center;
}

.credit-divider {
  width: 50px;
  height: 2px;
  background-color: var(--accent);
  margin: 0 auto 24px;
}

.credit-text {
  font-size: 0.84rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 500;
}

/* Canva AI Interactive Pitch Deck Showcase */
.canva-deck-section {
  padding: 96px 0;
  border-bottom: 1px solid var(--hairline);
  background-color: var(--bg-primary);
}

.split-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 36px;
  gap: 24px;
}

@media (max-width: 800px) {
  .split-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

.canva-action-buttons {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-shrink: 0;
}

.btn-sm {
  min-height: 36px !important;
  padding: 0 18px !important;
  font-size: 0.7rem !important;
}

.btn-outline-sm {
  border: 1px solid var(--ink);
  color: var(--ink);
  padding: 8px 18px;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.btn-outline-sm:hover {
  background-color: var(--ink);
  color: var(--bg-primary);
}

.canva-presentation-frame-wrap {
  border: 1px solid var(--hairline);
  background-color: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 32px;
}

.canva-deck-container {
  min-height: 480px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.canva-slide {
  display: none;
  padding: 56px 44px;
}

.canva-slide.active {
  display: block;
  animation: slideFadeIn 0.3s ease forwards;
}

@keyframes slideFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-content {
  max-width: 860px;
  margin: 0 auto;
}

.slide-badge {
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  display: inline-block;
  margin-bottom: 16px;
  border: 1px solid var(--hairline-accent);
  padding: 4px 10px;
  background-color: var(--accent-light);
}

.slide-title {
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--ink);
}

.slide-sub {
  font-size: 1.05rem;
  color: var(--ink-secondary);
  margin-bottom: 28px;
  max-width: 680px;
}

.slide-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
}

@media (max-width: 700px) {
  .slide-grid-3 {
    grid-template-columns: 1fr;
  }
}

.slide-stat-box {
  background-color: var(--bg-primary);
  border: 1px solid var(--hairline);
  padding: 24px;
}

.slide-num {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent);
  display: block;
  margin-bottom: 6px;
}

.slide-label {
  font-size: 0.74rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.slide-body-quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.25rem;
  color: var(--ink);
  border-left: 2px solid var(--accent);
  padding-left: 20px;
  margin: 24px 0;
}

.slide-services-grid, .slide-modules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;
}

@media (max-width: 700px) {
  .slide-services-grid, .slide-modules-grid {
    grid-template-columns: 1fr;
  }
}

.slide-chip, .slide-mod-item {
  background-color: var(--bg-primary);
  border: 1px solid var(--hairline);
  padding: 14px 18px;
  font-size: 0.85rem;
  color: var(--ink);
  font-weight: 500;
}

.slide-flow-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 20px;
}

@media (max-width: 700px) {
  .slide-flow-steps {
    grid-template-columns: 1fr;
  }
}

.slide-step {
  background-color: var(--bg-primary);
  border: 1px solid var(--hairline);
  padding: 16px;
  font-size: 0.86rem;
  color: var(--ink-secondary);
}

.slide-patent-box {
  background-color: var(--bg-primary);
  border: 1px solid var(--hairline);
  border-left: 3px solid var(--accent);
  padding: 26px;
  margin-top: 20px;
}

.slide-patent-claim {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.15rem;
  color: var(--ink);
  margin-bottom: 10px;
}

.slide-highlight-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--hairline);
  padding: 20px;
  margin-top: 14px;
}

.slide-contact-bar {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--hairline);
  font-size: 0.85rem;
  color: var(--ink-secondary);
}

.canva-deck-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 28px;
  background-color: var(--bg-primary);
  border-top: 1px solid var(--hairline);
}

.deck-arrow-btn {
  background: transparent;
  border: 1px solid var(--hairline);
  color: var(--ink);
  padding: 8px 18px;
  font-size: 0.74rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.deck-arrow-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.deck-indicators {
  display: flex;
  gap: 8px;
  align-items: center;
}

.deck-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--muted);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.deck-dot.active {
  background-color: var(--accent);
  transform: scale(1.3);
}

.canva-integration-panel {
  background-color: var(--paper-callout);
  border: 1px solid var(--hairline);
  padding: 32px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  margin-top: 36px;
}

@media (max-width: 800px) {
  .canva-integration-panel {
    flex-direction: column;
    align-items: flex-start;
  }
}

.canva-tag {
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 8px;
}

.canva-panel-heading {
  font-size: 1.22rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 8px;
}

.canva-panel-p {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.55;
  max-width: 600px;
}

.canva-panel-actions {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-shrink: 0;
}

/* Enquiry Section */
.enquiry-section {
  padding: 96px 0;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--hairline);
}

.enquiry-layout {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 60px;
  align-items: flex-start;
}

@media (max-width: 900px) {
  .enquiry-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.enquiry-intro h2 {
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 700;
  margin: 12px 0 16px;
  color: var(--ink);
}

.enquiry-intro p {
  font-size: 0.95rem;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 32px;
}

.contact-meta-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid var(--hairline);
  padding-top: 24px;
}

.contact-meta-item {
  font-size: 0.88rem;
  color: var(--ink-secondary);
  display: flex;
  gap: 12px;
}

.contact-meta-item strong {
  color: var(--ink);
  width: 110px;
  flex-shrink: 0;
  text-transform: uppercase;
  font-size: 0.74rem;
  letter-spacing: 0.1em;
}

.form-select {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--hairline-strong);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1rem;
  padding: 10px 0;
  outline: none;
  width: 100%;
  border-radius: 0;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.form-select:focus {
  border-bottom-color: var(--accent);
}

.form-select option {
  background-color: var(--bg-secondary);
  color: var(--ink);
}

.form-submit-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
}

.form-status-msg {
  font-size: 0.85rem;
  color: var(--accent);
  font-weight: 500;
}

.service-icon-wrap {
  width: 44px;
  height: 44px;
  margin-bottom: 24px;
  color: var(--accent);
}

.service-icon-wrap svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  stroke-width: 1.5;
  fill: none;
}

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--grid-gap);
}

   ========================================================================== */

.int_main_wrapper {
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  position: relative;
  background-color: var(--paper);
}

.int_infosidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background-color: var(--bg-primary);
  border-right: 1px solid var(--hairline);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.int_infosidebar_inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
}

.int_side_brand {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  color: var(--accent);
  padding: 8px 0;
  writing-mode: horizontal-tb;
}

.int_side_rotated_text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}

.int_side_rotated_text a {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.int_side_rotated_text a:hover {
  color: var(--accent);
}

.int_side_dot {
  color: var(--hairline-strong);
  font-size: 0.8rem;
}

.int_side_socials {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.int_social_link {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.int_social_link:hover {
  color: var(--accent);
}
`;

fs.appendFileSync(filePath, proposalAndMissingCss, 'utf8');
console.log('Successfully appended proposal and missing classes CSS to styles.css!');
