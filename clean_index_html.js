const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Remove Niveeta sidebar
const sidebarRegex = /<!-- NIVEETA VERTICAL CONTACT\/INFO SIDEBAR -->[\s\S]*?<\/aside>/;
html = html.replace(sidebarRegex, '');

// Clean up any double whitespace
html = html.replace(/\n\s*\n\s*\n/g, '\n\n');

// Replace footer with Texture.AI style structured footer if not already done
const textureFooter = `  <!-- Texture.AI Minimalist 4-Column Footer -->
  <footer class="c-footer" id="contact">
    <div class="container">
      <div class="footer-inner">
        <div>
          <div class="footer-brand-title">SWEETY COLOUR DECORA.</div>
          <p class="footer-desc">Finishing &amp; construction contractors executing painting, flooring, POP, putty, granite, and marble across residential, commercial, and institutional projects since 2003.</p>
        </div>

        <div>
          <div class="footer-col-title">Contractor Services</div>
          <ul class="footer-links">
            <li><a href="#services">Painting Systems</a></li>
            <li><a href="#services">Flooring &amp; Tiling</a></li>
            <li><a href="#services">POP False Ceiling</a></li>
            <li><a href="#services">Putty Surface Prep</a></li>
            <li><a href="#services">Granite Cladding</a></li>
            <li><a href="#services">Marble Laying</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-title">SiteFlow Platform</div>
          <ul class="footer-links">
            <li><a href="#proposal-opportunity">01 The Opportunity</a></li>
            <li><a href="#proposal-solution">04 SiteFlow Solution</a></li>
            <li><a href="#proposal-modules">05 Core Modules</a></li>
            <li><a href="#proposal-workflow">06 Daily Workflow</a></li>
            <li><a href="#proposal-roadmap">08 Implementation</a></li>
            <li><a href="#proposal-metrics">12 Target Metrics</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-title">Direct Inquiries</div>
          <ul class="footer-links">
            <li><a href="tel:+919800000000">+91 98000 00000</a></li>
            <li><a href="mailto:operations@sweetycolourdecora.com">operations@sweetycolourdecora.com</a></li>
            <li><a href="#enquiry">Request Site Tender</a></li>
            <li><span>GSTIN: 24AAAAA0000A1Z5</span></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom-bar">
        <div>&copy; <span id="currentYear">2026</span> Sweety Colour Decora. All rights reserved. &middot; Digital Transformation &amp; Patent Monograph</div>
        <div>
          <a href="#hero" class="btn-underline" style="color: #878787;">Back to top &uarr;</a>
        </div>
      </div>
    </div>
  </footer>`;

html = html.replace(/<!-- Section 20: Shared Architectural Footer -->[\s\S]*?<\/footer>/, textureFooter);
html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, textureFooter);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully updated index.html with Texture.AI layout and footer!');
