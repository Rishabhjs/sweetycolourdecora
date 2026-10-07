const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Add Niveeta vertical sidebar if not already present
if (!html.includes('int_infosidebar')) {
  const sidebarHtml = `
  <!-- NIVEETA VERTICAL CONTACT/INFO SIDEBAR -->
  <aside class="int_infosidebar" aria-label="Direct Contact Rail">
    <div class="int_infosidebar_inner">
      <div class="int_side_brand">SCD</div>
      <div class="int_side_rotated_text">
        <span class="int_side_phone"><a href="tel:+919800000000">+91 98000 00000</a></span>
        <span class="int_side_dot">&bull;</span>
        <span class="int_side_email"><a href="mailto:operations@sweetycolourdecora.com">operations@sweetycolourdecora.com</a></span>
      </div>
      <div class="int_side_socials">
        <a href="#" aria-label="LinkedIn" class="int_social_link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
        <a href="#" aria-label="WhatsApp" class="int_social_link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </a>
      </div>
    </div>
  </aside>
`;
  html = html.replace('<body>', '<body>' + sidebarHtml);
}

// 2. Wrap content with int_main_wrapper
if (!html.includes('class="int_main_wrapper"')) {
  html = html.replace('<header class="site-nav">', '<div class="int_main_wrapper">\n  <header class="site-nav">');
  html = html.replace('</footer>', '</footer>\n  </div>');
}

// 3. Add theme toggle in nav
if (!html.includes('id="themeToggle"')) {
  const themeToggleHtml = `
          <li>
            <button id="themeToggle" class="theme-toggle-btn" aria-label="Toggle Light/Dark Theme" title="Toggle Dark / Plaster Mode">
              <span class="theme-icon theme-icon-moon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              </span>
              <span class="theme-icon theme-icon-sun">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              </span>
              <span class="theme-label">Theme</span>
            </button>
          </li>`;
  html = html.replace('<li><a href="#enquiry" class="nav-cta">Enquire</a></li>', '<li><a href="#enquiry" class="nav-cta">Enquire</a></li>' + themeToggleHtml);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully updated index.html with Niveeta elements!');
