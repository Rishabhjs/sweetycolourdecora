const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles.css');
let css = fs.readFileSync(stylesPath, 'utf8');

// Replace sticky header & nav cluster CSS with sleek, non-wrapping layout
const navCssPattern = /\/\* Texture\.AI Minimalist Sticky Header \*\/[\s\S]*?\/\* Texture\.AI Buttons \(\.c-btn\) \*\//;

const newNavCss = `/* Texture.AI Minimalist Sticky Header — High-End Non-Wrapping Layout */
.site-nav {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 68px;
  background-color: var(--paper-translucent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--hairline);
  z-index: 950;
  display: flex;
  align-items: center;
}

.nav-container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 36px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.nav-brand {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  white-space: nowrap;
}

.nav-wordmark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.96rem;
  letter-spacing: 0.14em;
  color: var(--ink);
  text-transform: uppercase;
  line-height: 1.2;
}

.nav-subline {
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 400;
  margin-top: 2px;
}

.nav-clusters {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-shrink: 0;
}

.nav-group {
  display: flex;
  align-items: center;
  list-style: none;
  gap: 18px;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

.nav-link {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.74rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
  position: relative;
  padding: 6px 0;
  white-space: nowrap;
  transition: color 0.2s ease;
  display: inline-block;
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
  height: 18px;
  background-color: var(--hairline-strong);
  flex-shrink: 0;
}

/* Proposal Dropdown */
.nav-dropdown {
  position: relative;
  display: inline-block;
}

.nav-dropdown-btn {
  background: transparent;
  border: 1px solid var(--hairline);
  padding: 5px 12px;
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.nav-dropdown-btn:hover, .nav-dropdown.is-open .nav-dropdown-btn {
  border-color: var(--accent);
  background-color: var(--paper-hover);
}

.nav-proposal-tag {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--accent);
  background-color: var(--accent-light);
  border: 1px solid var(--accent);
  padding: 1px 6px;
  border-radius: 2px;
  font-weight: 700;
}

.nav-dropdown-label {
  font-weight: 500;
}

.dropdown-chevron {
  transition: transform 0.25s ease;
  color: var(--muted);
}

.nav-dropdown.is-open .dropdown-chevron {
  transform: rotate(180deg);
  color: var(--accent);
}

.nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 260px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--hairline-strong);
  border-radius: 4px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  padding: 8px 0;
  display: none;
  z-index: 1000;
  max-height: 480px;
  overflow-y: auto;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav-dropdown.is-open .nav-dropdown-menu {
  display: block;
  animation: dropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes dropdownIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-header {
  padding: 8px 16px 6px;
  font-size: 0.64rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  border-bottom: 1px solid var(--hairline);
  margin-bottom: 4px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  color: var(--ink-secondary);
  text-decoration: none;
  font-size: 0.78rem;
  transition: all 0.18s ease;
}

.dropdown-item:hover {
  background-color: var(--paper-hover);
  color: var(--ink);
  padding-left: 20px;
}

.dropdown-num {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.1em;
  width: 20px;
}

.dropdown-text {
  font-weight: 500;
}

/* Nav Action Items */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}

.canva-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: transparent;
  border: 1px solid var(--hairline);
  border-radius: 3px;
  color: var(--ink);
  cursor: pointer;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.canva-nav-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.nav-cta {
  padding: 6px 18px !important;
  min-height: 32px !important;
  font-size: 0.7rem !important;
  letter-spacing: 0.12em !important;
  border-radius: 3px;
  white-space: nowrap !important;
}

.theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: 1px solid var(--hairline);
  border-radius: 3px;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.theme-toggle-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Mobile Navigation Drawer */
@media (max-width: 960px) {
  .mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
  }

  .nav-clusters {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    width: 100%;
    height: calc(100vh - var(--nav-height));
    background-color: var(--bg-primary);
    flex-direction: column;
    align-items: flex-start;
    padding: 30px 24px;
    gap: 24px;
    display: none;
    overflow-y: auto;
    border-top: 1px solid var(--hairline);
  }

  .nav-clusters.is-open {
    display: flex;
  }

  .nav-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    width: 100%;
  }

  .nav-divider {
    width: 100%;
    height: 1px;
  }

  .nav-dropdown-menu {
    position: static;
    width: 100%;
    box-shadow: none;
    border: none;
    background: transparent;
  }

  .nav-actions {
    width: 100%;
    justify-content: flex-start;
    gap: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--hairline);
  }
}

/* Texture.AI Buttons (.c-btn) */`;

css = css.replace(navCssPattern, newNavCss);

fs.writeFileSync(stylesPath, css, 'utf8');
console.log('Successfully updated navigation styling in styles.css!');
