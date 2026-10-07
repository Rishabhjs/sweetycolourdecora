const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Add Hero Cinematic Video Reel right below the hero-actions in Section 1 (Hero)
const heroVideo = `        <div class="hero-actions">
          <a href="#services" class="btn-editorial">Our services</a>
          <a href="#enquiry" class="btn-underline">Enquire</a>
        </div>

        <!-- Hero Cinematic Video Reel -->
        <div class="ambient-video-container hero-visual-reel">
          <div class="video-overlay-badge">
            <span class="video-live-dot"></span>
            <span>Real-World Site &amp; Trade Dynamics</span>
          </div>
          <video autoplay loop muted playsinline preload="auto" poster="https://runway-static-assets.s3.amazonaws.com/site/videos/404_003.jpg">
            <source src="https://runway-static-assets.s3.amazonaws.com/site/videos/404_003.mp4" type="video/mp4">
            <source src="https://runway-static-assets.s3.amazonaws.com/site/videos/404_003.webm" type="video/webm">
          </video>
          <div class="video-caption-bar">
            <div>
              <div class="video-caption-title">Craftsmanship Across Two Decades</div>
              <div class="video-caption-sub">Active Tradecraft &middot; Multi-Site Operations</div>
            </div>
            <div class="video-caption-sub">Sweety Colour Decora</div>
          </div>
        </div>`;

if (!html.includes('hero-visual-reel')) {
  html = html.replace(/<div class="hero-actions">[\s\S]*?<\/div>/, heroVideo);
}

// 2. Add Proposal Transition Cinematic Reel right below the transition-seal in The Hinge
const transitionVideo = `        <div class="transition-seal">
          <span>Sweety SiteFlow Architecture &middot; Operational Control &amp; Patent Opportunity</span>
        </div>

        <!-- Proposal Transition Cinematic Visual Reel -->
        <div class="ambient-video-container transition-video-reel">
          <div class="video-overlay-badge">
            <span class="video-live-dot"></span>
            <span>SiteFlow Digital Operating System</span>
          </div>
          <video autoplay loop muted playsinline preload="auto">
            <source src="https://texture.ai/assets/__/home/lab-grads.mp4?version=11581690171529" type="video/mp4">
          </video>
          <div class="video-caption-bar">
            <div>
              <div class="video-caption-title">Connected Site Architecture &middot; Autonomous Reconciliations</div>
              <div class="video-caption-sub">Patent-Pending Tradecraft Ingestion &amp; Field Coordination</div>
            </div>
            <div class="video-caption-sub">Field OS v1.0</div>
          </div>
        </div>`;

if (!html.includes('transition-video-reel')) {
  html = html.replace(/<div class="transition-seal">[\s\S]*?<\/div>/, transitionVideo);
}

// 3. Add Video Visualization in Section 04 The Solution
const solutionVideo = `        <p class="solution-intro">A mobile-first operating system for finishing contractors.</p>

        <!-- SiteFlow Live Operating Model Visualization -->
        <div class="ambient-video-container solution-video-card">
          <div class="video-overlay-badge">
            <span class="video-live-dot"></span>
            <span>Real-Time Supervisor Field Stream</span>
          </div>
          <video autoplay loop muted playsinline preload="auto">
            <source src="https://texture.ai/assets/__/work/a-solution-for-a-cookieless-world/lab-tabs2.mp4?version=11750520345783" type="video/mp4">
          </video>
          <div class="video-caption-bar">
            <div>
              <div class="video-caption-title">Unified Field Workspace &amp; Offline-First Sync</div>
              <div class="video-caption-sub">Live Site Verification &middot; Instant Supervisor Checkpoints</div>
            </div>
          </div>
        </div>`;

if (!html.includes('solution-video-card')) {
  html = html.replace('<p class="solution-intro">A mobile-first operating system for finishing contractors.</p>', solutionVideo);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully integrated cinematic video visualizations into index.html!');
