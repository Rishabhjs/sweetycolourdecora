const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles.css');
let css = fs.readFileSync(stylesPath, 'utf8');

const coverflowStyles = `

/* ==========================================================================
   COVERFLOW 3D CAROUSEL (PHYSICALLY-BASED EXPONENTIAL RAKE)
   ========================================================================== */

.coverflow-section-wrap {
  margin-top: 70px;
  padding-top: 50px;
  border-top: 1px solid var(--hairline);
}

.coverflow-header {
  text-align: center;
  margin-bottom: 30px;
}

.coverflow-eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  display: block;
  margin-bottom: 10px;
}

.coverflow-heading {
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 10px;
}

.coverflow-sub {
  font-size: 0.92rem;
  color: var(--muted);
  max-width: 580px;
  margin: 0 auto;
}

.coverflow-carousel {
  position: relative;
  width: 100%;
  --cf-card: clamp(180px, 22vw, 280px);
  user-select: none;
  touch-action: pan-y;
}

.cf-stage-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 40px 0;
  perspective: calc(var(--cf-card) * 3.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cf-track {
  position: relative;
  width: 100%;
  height: var(--cf-card);
  transform-style: preserve-3d;
  cursor: grab;
  outline: none;
}

.cf-track:active {
  cursor: grabbing;
}

.cf-card {
  position: absolute;
  top: 0;
  left: 50%;
  width: var(--cf-card);
  height: var(--cf-card);
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
  border: 1px solid var(--hairline);
  will-change: transform, opacity;
  background-color: var(--bg-secondary);
  transition: box-shadow 0.3s ease;
}

.cf-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.cf-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

.cf-card-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 2px;
}

/* Nav Arrows */
.cf-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--paper-translucent);
  border: 1px solid var(--hairline-strong);
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  cursor: pointer;
  z-index: 250;
  transition: all 0.2s ease;
  line-height: 1;
}

.cf-nav-btn:hover {
  background: var(--ink);
  color: var(--bg-primary);
  border-color: var(--ink);
}

.cf-prev {
  left: 16px;
}

.cf-next {
  right: 16px;
}

/* Caption Block */
.cf-caption-wrap {
  text-align: center;
  margin-top: 14px;
  min-height: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cf-caption-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.cf-caption-sub {
  font-size: 0.8rem;
  color: var(--accent);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 6px;
}

.cf-caption-meta {
  font-size: 0.78rem;
  color: var(--muted);
  letter-spacing: 0.05em;
}

/* Pagination Dots */
.cf-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.cf-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--ink);
  opacity: 0.25;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.cf-dot.active {
  opacity: 1;
  background-color: var(--accent);
  transform: scale(1.25);
}
`;

if (!css.includes('coverflow-section-wrap')) {
  css += coverflowStyles;
  fs.writeFileSync(stylesPath, css, 'utf8');
  console.log('Successfully appended Coverflow Carousel styles to styles.css!');
} else {
  console.log('Coverflow styles already exist in styles.css');
}
