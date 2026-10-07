const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'styles.css');

const css = `/* ==========================================================================
   SWEETY COLOUR DECORA — TEXTURE.AI MINIMALIST EDITORIAL DESIGN SYSTEM
   Inspired by Texture.AI (texture.ai):
   - Stark High-Contrast Swiss Modernism
   - Monochromatic Palette (#000000 Pitch Black, #FFFFFF Pure White, #161616 / #F4F4F4)
   - Burnt Terracotta / Rust Accent (#C1592B)
   - Uppercase Tracked Buttons with Hover Arrow Movement (.c-btn)
   - Clean Full-Bleed Section Blocking (u-bg-white, u-bg-grey, u-bg-black)
   - High Typographic Density & Razor-Sharp Hairlines
   ========================================================================== */

:root, [data-theme="dark"] {
  --bg-primary: #000000;
  --bg-secondary: #111111;
  --bg-tertiary: #181818;
  --bg-alt: #141414;
  --paper: #000000;
  --paper-translucent: rgba(0, 0, 0, 0.92);
  --paper-hover: rgba(255, 255, 255, 0.04);
  --paper-callout: rgba(255, 255, 255, 0.05);
  --ink: #FFFFFF;
  --ink-secondary: #B0B0B0;
  --accent: #C1592B;
  --accent-hover: #D96835;
  --accent-light: rgba(193, 89, 43, 0.18);
  --muted: #878787;
  --hairline: rgba(255, 255, 255, 0.12);
  --hairline-strong: rgba(255, 255, 255, 0.28);
  --hairline-accent: rgba(193, 89, 43, 0.7);

  --font-display: -apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', Arial, sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', Arial, sans-serif;
  --font-serif: 'Fraunces', Georgia, serif;

  --max-width: 1320px;
  --nav-height: 72px;
  --grid-gap: 28px;
}

[data-theme="light"] {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F4F4F4;
  --bg-tertiary: #EAEAEA;
  --bg-alt: #F8F8F8;
  --paper: #FFFFFF;
  --paper-translucent: rgba(255, 255, 255, 0.94);
  --paper-hover: rgba(0, 0, 0, 0.03);
  --paper-callout: rgba(0, 0, 0, 0.045);
  --ink: #000000;
  --ink-secondary: #4A4A4A;
  --accent: #C1592B;
  --accent-hover: #A6471E;
  --accent-light: rgba(193, 89, 43, 0.1);
  --muted: #777777;
  --hairline: rgba(0, 0, 0, 0.12);
  --hairline-strong: rgba(0, 0, 0, 0.3);
  --hairline-accent: rgba(193, 89, 43, 0.6);
}

/* Base Reset & Core Setup */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  background-color: var(--bg-primary);
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
  scroll-padding-top: var(--nav-height);
}

body {
  background-color: var(--bg-primary);
  color: var(--ink);
  line-height: 1.6;
  font-size: 0.95rem;
  overflow-x: hidden;
  font-weight: 300;
}

::selection {
  background-color: var(--accent);
  color: #FFFFFF;
}

/* Layout Containers */
.int_main_wrapper {
  min-height: 100vh;
  position: relative;
  background-color: var(--bg-primary);
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 40px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }
}

/* Section Geometry & Hairlines */
.section {
  padding: 96px 0;
  position: relative;
  border-bottom: 1px solid var(--hairline);
}

.section-tight {
  padding: 72px 0;
}

.hairline-top {
  border-top: 1px solid var(--hairline);
}

/* Texture.AI Minimalist Sticky Header */
.site-nav {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--nav-height);
  background-color: var(--paper-translucent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--hairline);
  z-index: 900;
  display: flex;
  align-items: center;
}

.nav-container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  text-decoration: none;
  display: flex;
  flex-direction: column;
}

.nav-wordmark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.12em;
  color: var(--ink);
  text-transform: uppercase;
}

.nav-subline {
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 400;
}

.nav-clusters {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-group {
  display: flex;
  align-items: center;
  list-style: none;
  gap: 16px;
}

.nav-link {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.76rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
  position: relative;
  padding: 6px 0;
  transition: color 0.2s ease;
}

.nav-link:hover, .nav-link.active {
  color: var(--ink);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 1px;
  background-color: var(--accent);
  transition: width 0.2s ease;
}

.nav-link:hover::after, .nav-link.active::after {
  width: 100%;
}

.nav-divider {
  width: 1px;
  height: 20px;
  background-color: var(--hairline);
}

.nav-proposal-tag {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 2px 7px;
  border-radius: 2px;
  font-weight: 600;
}

/* Texture.AI Buttons (.c-btn) */
.c-btn, .btn-editorial, .nav-cta {
  position: relative;
  min-height: 42px;
  font-size: 0.74rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-family: var(--font-body);
  font-weight: 500;
  padding: 0 28px;
  cursor: pointer;
  text-decoration: none !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ink);
  background: transparent;
  color: var(--ink) !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.c-btn:hover, .btn-editorial:hover, .nav-cta:hover {
  background: var(--ink);
  color: var(--bg-primary) !important;
}

.btn-underline {
  font-size: 0.76rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--ink);
  text-decoration: none;
  position: relative;
  padding-bottom: 4px;
}

.btn-underline::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--ink);
  transition: transform 0.25s ease;
}

.btn-underline:hover::after {
  transform: scaleX(0.7);
  background-color: var(--accent);
}

/* Canva Deck Nav Button & Theme Toggle */
.canva-nav-btn, .theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--hairline);
  color: var(--ink);
  cursor: pointer;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.canva-nav-btn:hover, .theme-toggle-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

[data-theme="dark"] .theme-icon-moon { display: none; }
[data-theme="dark"] .theme-icon-sun { display: inline-flex; color: #F5A623; }
[data-theme="light"] .theme-icon-sun { display: none; }
[data-theme="light"] .theme-icon-moon { display: inline-flex; color: #000000; }

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--ink);
  cursor: pointer;
}

/* Texture.AI Hero Section */
.hero {
  padding: 130px 0 100px;
  border-bottom: 1px solid var(--hairline);
  background: radial-gradient(circle at 80% 20%, var(--paper-callout) 0%, transparent 60%);
}

.hero-wordmark-tag {
  font-size: 0.75rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 20px;
  font-weight: 600;
}

.hero-company-name {
  font-size: clamp(2.4rem, 5vw, 4.2rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
  max-width: 960px;
}

.hero-headline {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.6rem, 3.2vw, 2.4rem);
  color: var(--ink-secondary);
  margin-bottom: 24px;
  font-weight: 400;
}

.hero-supporting {
  font-size: 1.05rem;
  color: var(--muted);
  max-width: 680px;
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* Editorial Headers & Eyebrows */
.editorial-header {
  margin-bottom: 50px;
}

.section-eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
}

.section-title {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

/* About / Stats Grid */
.about-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  margin-bottom: 40px;
  border: 1px solid var(--hairline);
}

@media (max-width: 768px) {
  .about-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-item {
  background-color: var(--bg-primary);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.editorial-statement {
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--ink-secondary);
  border-left: 2px solid var(--accent);
  padding-left: 24px;
  margin-top: 30px;
}

/* Services Grid (6 Trades) */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
}

@media (max-width: 900px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}

.service-card {
  background-color: var(--bg-primary);
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 240px;
  transition: background-color 0.2s ease;
}

.service-card:hover {
  background-color: var(--paper-hover);
}

.service-con-wrap {
  width: 44px;
  height: 44px;
  margin-bottom: 24px;
  color: var(--accent);
}

.service-con-wrap svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  stroke-width: 1.5;
  fill: none;
}

.service-name {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.service-desc {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.55;
}

/* Process Flow (How We Work) */
.process-flow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
}

@media (max-width: 800px) {
  .process-flow {
    grid-template-columns: 1fr;
  }
}

.process-step {
  background-color: var(--bg-primary);
  padding: 40px 28px;
}

.process-num {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 16px;
}

.process-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.process-detail {
  font-size: 0.86rem;
  color: var(--muted);
  line-height: 1.6;
}

/* Trust Factors List */
.trust-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
}

@media (max-width: 768px) {
  .trust-list {
    grid-template-columns: 1fr;
  }
}

.trust-item {
  background-color: var(--bg-primary);
  padding: 44px 36px;
}

.trust-index {
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 14px;
  display: block;
}

.trust-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.trust-desc {
  font-size: 0.9rem;
  color: var(--muted);
  line-height: 1.6;
}

/* ==========================================================================
   PART TWO: THE PROPOSAL HINGE & CHAPTERS
   ========================================================================== */

.transition-divider {
  background-color: #000000 !important;
  color: #FFFFFF !important;
  padding: 120px 0;
  border-top: 2px solid var(--accent);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.transition-accent-rule {
  width: 48px;
  height: 2px;
  background-color: var(--accent);
  margin-bottom: 30px;
}

.transition-eyebrow {
  font-size: 0.78rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
  display: block;
  margin-bottom: 16px;
  font-weight: 600;
}

.transition-headline {
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin-bottom: 20px;
  color: #FFFFFF !important;
}

.transition-line {
  font-size: 1.2rem;
  color: #A0A0A0 !important;
  max-width: 780px;
  line-height: 1.65;
  margin-bottom: 32px;
}

.transition-seal {
  display: inline-block;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 6px 14px;
}

/* Proposal Section Standards */
.proposal-header {
  margin-bottom: 48px;
}

.proposal-num {
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  display: block;
  margin-bottom: 10px;
}

.proposal-title {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.proposal-lead {
  font-size: 1.15rem;
  color: var(--ink-secondary);
  line-height: 1.65;
  margin-top: 14px;
  max-width: 860px;
}

.proposal-foot {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--hairline);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  display: flex;
  justify-content: space-between;
}

/* Section 03: Problems & Why It Matters */
.problems-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
  margin-bottom: 50px;
}

@media (max-width: 768px) {
  .problems-grid {
    grid-template-columns: 1fr;
  }
}

.problem-item {
  background-color: var(--bg-primary);
  padding: 32px 28px;
}

.problem-code {
  font-size: 0.74rem;
  letter-spacing: 0.12em;
  color: var(--accent);
  font-weight: 700;
  display: block;
  margin-bottom: 8px;
}

.problem-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.problem-desc {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.55;
}

/* "Why It Matters" Sub-Block (Delta 3) */
.why-it-matters-block {
  margin-top: 48px;
  padding: 40px;
  border: 1px solid var(--hairline);
  background-color: var(--paper-callout);
}

.why-label {
  font-size: 0.74rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  display: block;
  margin-bottom: 24px;
}

.matters-line {
  font-size: 1.15rem;
  margin-bottom: 16px;
  line-height: 1.6;
}

.matters-serif {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.35rem;
  color: var(--ink);
  font-weight: 400;
}

.matters-conclusion {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--hairline);
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.04em;
}

/* Section 04 & 05: Solution & Modules Cards (Delta 4) */
.solution-cards-grid, .module-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
}

@media (max-width: 900px) {
  .solution-cards-grid, .module-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .solution-cards-grid, .module-grid {
    grid-template-columns: 1fr;
  }
}

.solution-card, .module-card {
  background-color: var(--bg-primary);
  padding: 36px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 250px;
  transition: background-color 0.2s ease;
}

.solution-card:hover, .module-card:hover {
  background-color: var(--paper-hover);
}

.card-num {
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 14px;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.card-desc {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.6;
}

.solution-quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.25rem;
  color: var(--ink);
  margin-top: 40px;
  padding: 24px 30px;
  border-left: 2px solid var(--accent);
  background-color: var(--paper-callout);
  line-height: 1.6;
}

/* Section 06: Workflow Steps (Delta 5) */
.steps-pipeline {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
}

.step-row {
  background-color: var(--bg-primary);
  padding: 24px 32px;
  display: grid;
  grid-template-columns: 80px 180px 1fr 1fr;
  align-items: center;
  gap: 24px;
}

@media (max-width: 800px) {
  .step-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.step-code {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.1em;
}

.step-name {
  font-weight: 600;
  font-size: 1rem;
}

.step-action {
  font-size: 0.9rem;
  color: var(--ink-secondary);
}

.step-impact {
  font-size: 0.86rem;
  color: var(--muted);
}

.workflow-reconciliation-line {
  margin-top: 30px;
  font-size: 1.05rem;
  color: var(--accent);
  font-weight: 600;
  padding: 16px 20px;
  border: 1px solid var(--hairline-accent);
  background-color: var(--accent-light);
}

/* Section 07: User Roles Table (Delta 6) */
.roles-table {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
}

.role-row {
  background-color: var(--bg-primary);
  padding: 24px 32px;
  display: grid;
  grid-template-columns: 180px 1fr 1.2fr;
  align-items: center;
  gap: 24px;
}

@media (max-width: 800px) {
  .role-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.role-title {
  font-weight: 700;
  font-size: 1.05rem;
}

.role-access {
  font-size: 0.9rem;
  color: var(--ink-secondary);
}

.role-control {
  font-size: 0.86rem;
  color: var(--muted);
}

/* Section 08: Implementation Roadmap */
.roadmap-timeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
}

@media (max-width: 800px) {
  .roadmap-timeline {
    grid-template-columns: 1fr;
  }
}

.timeline-phase {
  background-color: var(--bg-primary);
  padding: 36px 28px;
}

.phase-tag {
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 12px;
  display: block;
}

.phase-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.phase-points {
  list-style: none;
  font-size: 0.86rem;
  color: var(--muted);
  line-height: 1.6;
}

.phase-points li {
  margin-bottom: 8px;
  position: relative;
  padding-left: 14px;
}

.phase-points li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-size: 1.2rem;
  line-height: 1;
}

/* Section 12: Metrics Cards */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background-color: var(--hairline);
  border: 1px solid var(--hairline);
}

@media (max-width: 800px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.metric-card {
  background-color: var(--bg-primary);
  padding: 36px 24px;
}

.metric-target {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.metric-label {
  font-size: 0.76rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}

.metric-detail {
  font-size: 0.86rem;
  color: var(--ink-secondary);
  line-height: 1.5;
}

/* Group 9 Author Credit (Delta 7) */
.author-credit-box {
  margin: 60px 0;
  padding: 40px;
  border: 1px solid var(--hairline);
  background-color: var(--paper-callout);
  text-align: center;
}

.author-title {
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 12px;
}

.author-statement {
  font-size: 1.05rem;
  color: var(--ink-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Enquiry Form (Texture.AI Underline Style) */
.enquiry-container {
  max-width: 800px;
  margin: 0 auto;
}

.enquiry-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.74rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
  font-weight: 600;
}

.form-input, .form-textarea {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--hairline-strong);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1rem;
  padding: 10px 0;
  outline: none;
  transition: border-color 0.2s ease;
  border-radius: 0;
}

.form-input:focus, .form-textarea:focus {
  border-bottom-color: var(--accent);
}

.form-textarea {
  resize: vertical;
  min-height: 90px;
}

/* Texture.AI Style 4-Column Footer */
.c-footer {
  background-color: #000000 !important;
  color: #FFFFFF !important;
  padding: 90px 0 50px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

.footer-brand-title {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 12px;
  color: #FFFFFF !important;
}

.footer-desc {
  font-size: 0.88rem;
  color: #878787 !important;
  max-width: 360px;
  line-height: 1.6;
}

.footer-col-title {
  font-size: 0.74rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
  font-weight: 700;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  color: #A0A0A0 !important;
  text-decoration: none;
  font-size: 0.84rem;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #FFFFFF !important;
}

.footer-bottom-bar {
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  color: #777777 !important;
}

@media (max-width: 600px) {
  .footer-bottom-bar {
    flex-direction: column;
    gap: 14px;
    text-align: center;
  }
}

/* Canva Presentation Modal */
.canva-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.canva-modal-overlay.is-open {
  display: flex;
}

.canva-modal-box {
  background-color: var(--bg-primary);
  border: 1px solid var(--hairline-strong);
  width: 100%;
  max-width: 960px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px;
  position: relative;
  color: var(--ink);
}

.canva-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: var(--ink);
  font-size: 1.5rem;
  cursor: pointer;
}
`;

fs.writeFileSync(filePath, css, 'utf8');
console.log('Successfully wrote Texture.AI design system to styles.css!');
