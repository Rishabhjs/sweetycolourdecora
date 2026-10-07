const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'app.js');
let js = fs.readFileSync(appJsPath, 'utf8');

const coverflowJs = `
  // ==========================================================================
  // 3D COVERFLOW CAROUSEL CONTROLLER (Physically-derived exponential rake)
  // ==========================================================================
  const cfTrack = document.getElementById('cfTrack');
  if (cfTrack) {
    const cards = Array.from(cfTrack.querySelectorAll('.cf-card'));
    const prevBtn = document.getElementById('cfPrevBtn');
    const nextBtn = document.getElementById('cfNextBtn');
    const captionTitle = document.getElementById('cfCaptionTitle');
    const captionSub = document.getElementById('cfCaptionSub');
    const captionMeta = document.getElementById('cfCaptionMeta');
    const dots = Array.from(document.querySelectorAll('.cf-dot'));

    const count = cards.length;
    let pos = 0;
    let target = 0;
    let raf = null;
    let width = 0;
    let drag = null;

    const gap = 0.05;
    const rotate = 44;
    const depth = 0.6;
    const falloff = 0.56;
    const fade = 0.1;
    const loop = true;

    function measure() {
      if (cards[0]) {
        width = cards[0].offsetWidth;
        paint();
      }
    }

    function indexAt(p) {
      return ((Math.round(p) % count) + count) % count;
    }

    function updateCaption(index) {
      const activeCard = cards[index];
      if (!activeCard) return;
      if (captionTitle) captionTitle.textContent = activeCard.getAttribute('data-title') || '';
      if (captionSub) captionSub.textContent = activeCard.getAttribute('data-subtitle') || '';
      if (captionMeta) captionMeta.innerHTML = activeCard.getAttribute('data-meta') || '';

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    function paint() {
      if (!width) return;
      const pitch = width * (1 + gap);

      cards.forEach((card, index) => {
        let offset = index - pos;
        if (loop) {
          offset = ((offset % count) + count) % count;
          if (offset > count / 2) offset -= count;
        }

        const distance = Math.abs(offset);
        const ramp = Math.pow(distance, falloff);
        const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

        card.style.transform =
          'translateX(calc(-50% + ' + (offset * pitch) + 'px)) ' +
          'translateZ(' + (-depth * width * ramp) + 'px) rotateY(' + (-tilt) + 'deg)';

        const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
        card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
        card.style.zIndex = String(100 - Math.round(distance));
      });
    }

    function clamp(p) {
      return loop ? p : Math.max(0, Math.min(count - 1, p));
    }

    function settle(newTarget) {
      if (raf !== null) cancelAnimationFrame(raf);
      target = newTarget;
      updateCaption(indexAt(target));

      function step() {
        const remaining = target - pos;
        if (Math.abs(remaining) < 0.0004) {
          pos = target;
          paint();
          raf = null;
          return;
        }
        pos += remaining * 0.16;
        paint();
        raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }

    function goTo(index) {
      const t = loop
        ? index + Math.round((target - index) / count) * count
        : index;
      settle(clamp(t));
    }

    function nudge(by) {
      settle(clamp(Math.round(target) + by));
    }

    // Pointer Events (Mouse / Touch Drag)
    cfTrack.addEventListener('pointerdown', (e) => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      cfTrack.setPointerCapture(e.pointerId);
      target = pos;
      drag = {
        id: e.pointerId,
        x: e.clientX,
        pos: pos,
        v: 0,
        t: performance.now()
      };
    });

    cfTrack.addEventListener('pointermove', (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const pitch = width * (1 + gap);
      if (!pitch) return;

      const now = performance.now();
      const prevPos = pos;
      pos = clamp(drag.pos - (e.clientX - drag.x) / pitch);
      drag.v = ((pos - prevPos) / Math.max(now - drag.t, 1)) * 1000;
      drag.t = now;

      updateCaption(indexAt(pos));
      paint();
    });

    function endDrag(e) {
      if (!drag || drag.id !== e.pointerId) return;
      drag = null;
      const carried = Math.max(-2, Math.min(2, (drag ? drag.v : 0) * 0.18));
      settle(clamp(Math.round(pos + carried)));
    }

    cfTrack.addEventListener('pointerup', endDrag);
    cfTrack.addEventListener('pointercancel', endDrag);

    // Keyboard navigation
    cfTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nudge(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nudge(1);
      }
    });

    // Arrow Buttons
    if (prevBtn) prevBtn.addEventListener('click', () => nudge(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => nudge(1));

    // Dots
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
        goTo(idx);
      });
    });

    // Initial measurement
    measure();
    window.addEventListener('resize', measure);
    updateCaption(0);
  }
`;

if (!js.includes('COVERFLOW CAROUSEL CONTROLLER')) {
  js = js.replace('  // Transition Divider Special Entrance', coverflowJs + '\n  // Transition Divider Special Entrance');
  fs.writeFileSync(appJsPath, js, 'utf8');
  console.log('Successfully added Coverflow controller to app.js!');
} else {
  console.log('Coverflow controller already exists in app.js');
}
