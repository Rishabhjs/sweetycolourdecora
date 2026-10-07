const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// The 3D coverflow carousel HTML markup representing the 6 finishing trades
const coverflowHtml = `
        <!-- 3D COVERFLOW PROJECT SHOWCASE -->
        <div class="coverflow-section-wrap">
          <div class="coverflow-header">
            <span class="coverflow-eyebrow">Interactive Portfolio</span>
            <h3 class="coverflow-heading">Site Execution Gallery</h3>
            <p class="coverflow-sub">Drag or use arrow controls to explore finishes across active residential and commercial sites.</p>
          </div>

          <div class="coverflow-carousel" id="coverflowCarousel" role="region" aria-label="Finishing Trades Coverflow Carousel">
            <div class="cf-stage-wrap">
              <button type="button" class="cf-nav-btn cf-prev" id="cfPrevBtn" aria-label="Previous finish">&lsaquo;</button>
              
              <div class="cf-track" id="cfTrack" tabindex="0">
                <!-- Slide 1: Painting -->
                <div class="cf-card" data-index="0" data-title="Architectural Wall &amp; Texture Coatings" data-subtitle="Painting Systems" data-meta="Premium Acrylic Emulsion &middot; 45,000 sq.ft &middot; Ahmedabad">
                  <div class="cf-card-inner">
                    <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=640&h=640&fit=crop&q=75&auto=format" alt="Architectural wall painting and texture coating" draggable="false">
                    <div class="cf-card-badge">Painting</div>
                  </div>
                </div>

                <!-- Slide 2: Flooring -->
                <div class="cf-card" data-index="1" data-title="Vitrified Tile &amp; Industrial Screed" data-subtitle="Flooring Systems" data-meta="Large Format Italian Grouting &middot; 32,000 sq.ft &middot; Vadodara">
                  <div class="cf-card-inner">
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640&h=640&fit=crop&q=75&auto=format" alt="Precision tiling and flooring" draggable="false">
                    <div class="cf-card-badge">Flooring</div>
                  </div>
                </div>

                <!-- Slide 3: POP False Ceiling -->
                <div class="cf-card" data-index="2" data-title="Gypsum Suspended Ceilings &amp; Coves" data-subtitle="POP Systems" data-meta="Concealed Profile Lighting &middot; High-Precision Grid &middot; Surat">
                  <div class="cf-card-inner">
                    <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=640&h=640&fit=crop&q=75&auto=format" alt="POP false ceiling and architectural cove lighting" draggable="false">
                    <div class="cf-card-badge">POP False Ceiling</div>
                  </div>
                </div>

                <!-- Slide 4: Putty & Surface Prep -->
                <div class="cf-card" data-index="3" data-title="Skim Coating &amp; Level 5 Surface Prep" data-subtitle="Surface Leveling" data-meta="Polymer-Modified Bonding &middot; Machine Sanded &middot; Gandhinagar">
                  <div class="cf-card-inner">
                    <img src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=640&h=640&fit=crop&q=75&auto=format" alt="Putty surface preparation and skim coating" draggable="false">
                    <div class="cf-card-badge">Putty Prep</div>
                  </div>
                </div>

                <!-- Slide 5: Granite Cladding -->
                <div class="cf-card" data-index="4" data-title="Flamed &amp; Honed Granite Cladding" data-subtitle="Granite Works" data-meta="Dry Cladding &middot; Precision CNC Mitering &middot; Rajkot">
                  <div class="cf-card-inner">
                    <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=640&h=640&fit=crop&q=75&auto=format" alt="Granite wall cladding and stair treads" draggable="false">
                    <div class="cf-card-badge">Granite</div>
                  </div>
                </div>

                <!-- Slide 6: Italian Marble -->
                <div class="cf-card" data-index="5" data-title="Book-Matched Italian Marble Laying" data-subtitle="Marble Systems" data-meta="Diamond Mirror Polish &middot; Zero-Lippage System &middot; Ahmedabad">
                  <div class="cf-card-inner">
                    <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=640&h=640&fit=crop&q=75&auto=format" alt="Italian marble laying and mirror polish" draggable="false">
                    <div class="cf-card-badge">Marble</div>
                  </div>
                </div>
              </div>

              <button type="button" class="cf-nav-btn cf-next" id="cfNextBtn" aria-label="Next finish">&rsaquo;</button>
            </div>

            <!-- Dynamic Caption Bar -->
            <div class="cf-caption-wrap" id="cfCaptionWrap">
              <h4 class="cf-caption-title" id="cfCaptionTitle">Architectural Wall &amp; Texture Coatings</h4>
              <p class="cf-caption-sub" id="cfCaptionSub">Painting Systems</p>
              <div class="cf-caption-meta" id="cfCaptionMeta">Premium Acrylic Emulsion &middot; 45,000 sq.ft &middot; Ahmedabad</div>
            </div>

            <!-- Pagination Dots -->
            <div class="cf-pagination" id="cfPagination">
              <button class="cf-dot active" data-index="0" aria-label="Slide 1"></button>
              <button class="cf-dot" data-index="1" aria-label="Slide 2"></button>
              <button class="cf-dot" data-index="2" aria-label="Slide 3"></button>
              <button class="cf-dot" data-index="3" aria-label="Slide 4"></button>
              <button class="cf-dot" data-index="4" aria-label="Slide 5"></button>
              <button class="cf-dot" data-index="5" aria-label="Slide 6"></button>
            </div>
          </div>
        </div>
`;

if (!html.includes('coverflow-section-wrap')) {
  // Inject right after the services-grid closing div
  html = html.replace('        </div>\n      </div>\n    </section>\n\n    <!-- Section 4: How We Work -->', '        </div>\n' + coverflowHtml + '      </div>\n    </section>\n\n    <!-- Section 4: How We Work -->');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Successfully added Coverflow Carousel markup to index.html!');
} else {
  console.log('Coverflow Carousel markup already present in index.html.');
}
