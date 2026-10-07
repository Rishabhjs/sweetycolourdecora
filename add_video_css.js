const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles.css');
let css = fs.readFileSync(stylesPath, 'utf8');

const videoStyles = `

/* ==========================================================================
   CINEMATIC VIDEO VISUALIZATIONS (RUNWAY / AI AMBIENT REEL)
   ========================================================================== */

.ambient-video-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
  background-color: #000000;
  border: 1px solid var(--hairline);
}

.ambient-video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(1.1) brightness(0.9);
  transition: transform 0.6s ease, filter 0.6s ease;
}

.ambient-video-container:hover video {
  transform: scale(1.02);
  filter: saturate(1.2) brightness(1);
}

.video-overlay-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 4px 10px;
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #FFFFFF;
  border-radius: 2px;
  z-index: 10;
}

.video-live-dot {
  width: 6px;
  height: 6px;
  background-color: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent);
  animation: pulseDot 2s infinite ease-in-out;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.video-caption-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
  color: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 10;
}

.video-caption-title {
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #FFFFFF;
}

.video-caption-sub {
  font-size: 0.74rem;
  color: #B0B0B0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Hero Cinematic Video Reel Block */
.hero-visual-reel {
  margin-top: 50px;
  height: 480px;
  position: relative;
}

@media (max-width: 768px) {
  .hero-visual-reel {
    height: 280px;
  }
}

/* Proposal Transition Video Reel Block */
.transition-video-reel {
  margin-top: 40px;
  height: 380px;
}

@media (max-width: 768px) {
  .transition-video-reel {
    height: 240px;
  }
}

/* Solution Video Grid */
.solution-video-card {
  height: 260px;
  margin-top: 24px;
}
`;

if (!css.includes('ambient-video-container')) {
  css += videoStyles;
  fs.writeFileSync(stylesPath, css, 'utf8');
  console.log('Successfully appended video visualization styles to styles.css!');
} else {
  console.log('Video visualization styles already exist in styles.css');
}
