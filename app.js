/*
  Minimal placeholder entry for Felt Scene.
  Sets up a responsive canvas and lightweight input handlers so the UI feels alive.
  Real SDF drawing and scene logic will be added later.
*/

const canvas = document.getElementById('scene');
const overlay = document.getElementById('overlay');
const newBtn = document.getElementById('new-btn');
const ctx = canvas.getContext('2d');

let dpr = Math.max(1, window.devicePixelRatio || 1);

function resize() {
  const w = Math.min(window.innerWidth, 1280);
  const h = Math.min(window.innerHeight, 800);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawPlaceholder();
}
window.addEventListener('resize', resize, { passive: true });

function drawPlaceholder() {
  // soft felt background
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#fbfbfb');
  g.addColorStop(1, '#f6f4f2');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // subtle stitched grid to hint at SDF grid
  ctx.strokeStyle = 'rgba(0,0,0,0.04)';
  ctx.lineWidth = 1;
  const step = 40;
  for (let x = step; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x + Math.sin(x * 0.01) * 2, 0);
    ctx.lineTo(x + Math.cos(x * 0.01) * 2, h);
    ctx.stroke();
  }
  for (let y = step; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.cos(y * 0.01) * 2);
    ctx.lineTo(w, y + Math.sin(y * 0.01) * 2);
    ctx.stroke();
  }

  // friendly central hint
  ctx.fillStyle = 'rgba(40,40,40,0.8)';
  ctx.font = '600 18px system-ui, -apple-system, "Segoe UI", Roboto';
  ctx.textAlign = 'center';
  ctx.fillText('Felt Scene — placeholder canvas', w / 2, h / 2 - 6);
  ctx.font = '14px system-ui, -apple-system, "Segoe UI", Roboto';
  ctx.fillStyle = 'rgba(40,40,40,0.6)';
  ctx.fillText('Interactive SDF drawing coming soon', w / 2, h / 2 + 18);
}

let drawing = false;
let last = null;
const strokes = [];

function toLocal(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = (e.touches && e.touches[0]) || e;
  return {
    x: (touch.clientX - rect.left),
    y: (touch.clientY - rect.top)
  };
}

function pointerDown(e) {
  e.preventDefault();
  drawing = true;
  last = toLocal(e);
  strokes.push([last]);
  drawDot(last);
}
function pointerMove(e) {
  if (!drawing) return;
  const p = toLocal(e);
  const s = strokes[strokes.length - 1];
  s.push(p);
  drawLine(last, p);
  last = p;
}
function pointerUp(e) {
  if (!drawing) return;
  drawing = false;
  last = null;
}

canvas.addEventListener('pointerdown', pointerDown, { passive: false });
canvas.addEventListener('pointermove', pointerMove, { passive: false });
window.addEventListener('pointerup', pointerUp, { passive: false });

// simple drawing helpers to give immediate tactile feedback
function drawDot(p) {
  ctx.fillStyle = '#e65a7a';
  ctx.beginPath();
  ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
  ctx.fill();
}
function drawLine(a, b) {
  ctx.strokeStyle = '#e65a7a';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

// New scene clears strokes and redraws placeholder
newBtn.addEventListener('click', () => {
  strokes.length = 0;
  drawPlaceholder();
  // subtle overlay pulse
  overlay.animate([{ opacity: 0.0001 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
});

// Initialize
resize();